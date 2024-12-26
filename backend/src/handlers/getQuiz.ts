import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { WithId } from 'mongodb';
import {
  ActorAggregated,
  MovieAggregated,
  QuizActorsRound,
  QuizRound,
} from '@movie-nerd/shared';
import { connectToDatabase } from '../utils/mongoose.util';
import { createRoundData } from '../utils/createRoundData.util';
import { StrictAPIGatewayProxyResult } from '../types';

export const handler: APIGatewayProxyHandlerV2 = async (
  event
): Promise<StrictAPIGatewayProxyResult> => {
  const locale = event.queryStringParameters?.['lang'] ?? 'us';
  try {
    const db = await connectToDatabase();
    const movies = await db
      .collection('movies')
      .aggregate<WithId<MovieAggregated<WithId<ActorAggregated>>>>([
        { $sample: { size: 4 } },
        {
          $addFields: {
            translation: {
              $arrayElemAt: [
                {
                  $map: {
                    input: {
                      $filter: {
                        input: '$translations',
                        as: 'translation',
                        cond: {
                          $eq: ['$$translation.locale', locale.toUpperCase()],
                        },
                      },
                    },
                    as: 'translation',
                    in: {
                      title: '$$translation.title',
                      description: '$$translation.description',
                    },
                  },
                },
                0,
              ],
            },
            defaultTranslation: {
              $arrayElemAt: [
                {
                  $map: {
                    input: {
                      $filter: {
                        input: '$translations',
                        as: 'translation',
                        cond: {
                          $eq: ['$$translation.locale', 'US'],
                        },
                      },
                    },
                    as: 'translation',
                    in: {
                      title: '$$translation.title',
                      description: '$$translation.description',
                    },
                  },
                },
                0,
              ],
            },
          },
        },
        {
          $addFields: {
            translation: {
              $ifNull: ['$translation', '$defaultTranslation'],
            },
          },
        },
        {
          $lookup: {
            from: 'people',
            localField: 'actors',
            foreignField: '_id',
            as: 'actorDetails',
            pipeline: [{ $project: { name: 1, profile_path: 1 } }],
          },
        },
        {
          $project: {
            title: 1,
            images: 1,
            _id: 1,
            translation: 1,
            actors: '$actorDetails',
          },
        },
      ])
      .toArray();

    const roundData = createRoundData(movies);
    const result = await db.collection('rounds').insertOne(roundData);
    const apiPath = event.rawPath;
    switch (apiPath) {
      case '/actors-quiz':
        const actorsRoundResponse: QuizActorsRound = {
          roundId: result.insertedId.toString(),
          actors: roundData.actors,
          variants: roundData.variants,
        };
        return {
          statusCode: 200,
          body: JSON.stringify(actorsRoundResponse),
        };
      default:
        const roundResponse: QuizRound = {
          roundId: result.insertedId.toString(),
          imageUrl: roundData.imageUrl,
          variants: roundData.variants,
        };
        return {
          statusCode: 200,
          body: JSON.stringify(roundResponse),
        };
    }
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

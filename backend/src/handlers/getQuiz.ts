import { APIGatewayProxyHandler } from 'aws-lambda';
import { WithId } from 'mongodb';
import { MovieAggregated, QuizRound } from '@movie-nerd/shared';
import { connectToDatabase } from '../utils/mongoose.util';
import { createRoundData } from '../utils/createRoundData.util';

export const handler: APIGatewayProxyHandler = async event => {
  const locale = event.queryStringParameters?.['lang'] ?? 'en';
  try {
    const db = await connectToDatabase();
    const movies = await db
      .collection('movies')
      .aggregate<WithId<MovieAggregated>>([
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
                    in: { title: '$$translation.title' },
                  },
                },
                0,
              ],
            },
          },
        },
        {
          $project: {
            title: 1,
            images: 1,
            _id: 1,
            translation: 1,
          },
        },
      ])
      .toArray();

    const roundData = createRoundData(movies);
    const result = await db.collection('rounds').insertOne(roundData);
    const roundResponse: QuizRound = {
      roundId: result.insertedId.toString(),
      imageUrl: roundData.imageUrl,
      variants: roundData.variants,
    };
    return {
      statusCode: 200,
      body: JSON.stringify(roundResponse),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

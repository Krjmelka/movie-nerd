import { APIGatewayProxyHandlerV2 } from 'aws-lambda';
import { ObjectId } from 'mongodb';
import {
  QuizRoundAnswer,
  Round,
  QuizRoundResult,
  MovieResultAggregated,
} from '@movie-nerd/shared';
import { connectToDatabase } from '../utils/mongoose.util';

export const handler: APIGatewayProxyHandlerV2 = async event => {
  const locale = event.queryStringParameters?.['lang'] ?? 'en';
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missed body' }),
    };
  }
  try {
    const requestBody = JSON.parse(event.body) as QuizRoundAnswer;
    const roundObjectId = new ObjectId(requestBody.roundId);
    const db = await connectToDatabase();
    const round = await db
      .collection('rounds')
      .findOne<Round>({ _id: roundObjectId });
    if (!round) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'no such round' }),
      };
    }
    await db.collection('rounds').deleteOne({ _id: roundObjectId });
    const movieObjectId = new ObjectId(round.answerId);
    const [movieResult] = await db
      .collection('movies')
      .aggregate<MovieResultAggregated>([
        { $match: { _id: movieObjectId } },
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
            poster_path: 1,
            translation: 1,
            imdb_id: 1,
          },
        },
      ])
      .toArray();
    if (!movieResult) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Missed movie' }),
      };
    }
    const quizResult: QuizRoundResult = {
      isCorrect: round.answerId === requestBody.variantId,
      poster: movieResult.poster_path,
      title: movieResult.translation?.title ?? movieResult.title,
      roundId: requestBody.roundId,
      imdbUrl: `https://www.imdb.com/title/${movieResult.imdb_id}`,
    };
    return {
      statusCode: 200,
      body: JSON.stringify(quizResult),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

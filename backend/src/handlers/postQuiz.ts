import { APIGatewayProxyHandler } from 'aws-lambda';
import { connectToDatabase } from '../utils/mongoose.util';
import {
  Movie,
  QuizRoundAnswer,
  Round,
  QuizRoundResult,
} from '@movie-nerd/shared';
import { ObjectId } from 'mongodb';

export const handler: APIGatewayProxyHandler = async event => {
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
    const movieObjectId = new ObjectId(round.answerId);
    const correctMovie = await db
      .collection('movies')
      .findOne<Movie>({ _id: movieObjectId });
    if (!correctMovie) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Missed movie' }),
      };
    }
    const quizResult: QuizRoundResult = {
      isCorrect: round.answerId === requestBody.variantId,
      poster: correctMovie.poster_path,
      title: correctMovie.title,
      roundId: requestBody.roundId,
    };
    console.log(quizResult);
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

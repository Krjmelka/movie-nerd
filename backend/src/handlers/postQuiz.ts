import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {connectToDatabase} from "../utils/mongoose.util";
import {createRoundData} from "../utils/createRoundData.util";
import {
  Movie,
  QuizRound,
  QuizRoundAnswer,
  Round,
  QuizRoundResult,
} from "@movie-nerd/shared";
import {WithId, ObjectId} from "mongodb";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({message: "Missed body"}),
    };
  }
  const requestBody = JSON.parse(event.body) as QuizRoundAnswer;
  const roundObjectId = new ObjectId(requestBody.roundId);
  const db = await connectToDatabase();
  const round = await db
    .collection("rounds")
    .findOne<Round>({_id: roundObjectId});
  if (!round) {
    return {
      statusCode: 400,
      body: JSON.stringify({message: "Missed round"}),
    };
  }
  const movieObjectId = new ObjectId(round.answerId);
  const correctMovie = await db
    .collection("movies")
    .findOne<Movie>({_id: movieObjectId});
  if (!correctMovie) {
    return {
      statusCode: 500,
      body: JSON.stringify({message: "Missed movie"}),
    };
  }
  console.log(round)
  const quizResult: QuizRoundResult = {
    bestScore: 1,
    currentScore: 1,
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
};

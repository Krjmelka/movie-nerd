import {APIGatewayProxyEvent, APIGatewayProxyResult} from "aws-lambda";
import {connectToDatabase} from "../utils/mongoose.util";
import {createRoundData} from '../utils/createRoundData.util';
import { Movie, QuizRound } from '@movie-nerd/shared';
import { WithId } from "mongodb";

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const db = await connectToDatabase();
  const movies = await db
    .collection("movies")
    .aggregate<WithId<Movie>>([
      {$sample: {size: 4}},
      {$project: {
        title: 1,
        images: 1,
        _id: 1,
      }},
    ])
    .toArray();
    const roundData = createRoundData(movies)
    const result = await db.collection('rounds').insertOne(roundData)
    const roundResponse: QuizRound = {
      roundId: result.insertedId.toString(),
      imageUrl: roundData.imageUrl,
      variants: roundData.variants,
    }
    console.log(roundResponse)
  return {
    statusCode: 200,
    body: JSON.stringify(roundResponse),
  };
};

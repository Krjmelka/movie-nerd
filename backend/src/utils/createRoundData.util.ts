import { ActorAggregated, MovieAggregated, Round } from '@movie-nerd/shared';
import { WithId } from 'mongodb';

const getRandomNumber = (max: number): number => {
  return Math.floor(Math.random() * (max + 1));
};

export const createRoundData = (
  movies: WithId<MovieAggregated<WithId<ActorAggregated>>>[]
): Round => {
  const correctMovie = movies[getRandomNumber(movies.length - 1)];

  return {
    imageUrl:
      correctMovie.images[getRandomNumber(correctMovie.images.length - 1)],
    actors: correctMovie.actors.map(actor => ({
      id: actor._id.toString(),
      name: actor.name,
      profile_path: actor.profile_path,
    })),
    description: correctMovie.translation.description,
    answerId: correctMovie._id.toString(),
    variants: movies.map(movie => ({
      id: movie._id.toString(),
      title: movie.translation?.title ?? movie.title,
    })),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
  };
};

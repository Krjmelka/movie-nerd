import { Movie, Round } from '@movie-nerd/shared';
import { WithId } from 'mongodb';

const getRandomNumber = (max: number): number => {
  return Math.floor(Math.random() * (max + 1))
}

export const createRoundData = (movies: WithId<Movie>[]): Round => {
  const correctMovie = movies[getRandomNumber(movies.length - 1)]

  return {
    imageUrl: correctMovie.images[getRandomNumber(correctMovie.images.length - 1)],
    answerId: correctMovie._id.toString(),
    variants: movies.map(movie => ({ id: movie._id.toString(), title: movie.title })),
    expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
  }
}
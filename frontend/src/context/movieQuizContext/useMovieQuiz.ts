import { useContext } from 'react';
import MovieQuizContext from './MovieQuizProvider';

export const useMovieQuiz = () => {
  const context = useContext(MovieQuizContext);
  if (context === undefined) {
    throw new Error('useMovieQuiz must be used within a MovieProvider');
  }
  return context;
};

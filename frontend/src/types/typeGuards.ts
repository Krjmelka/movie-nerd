import { QuizActorsRound, QuizRound } from '@movie-nerd/shared';
import { GameMode, GameModeMap, QuizData } from './';

export const isMovieQuizData = (
  _data: QuizData,
  mode: GameMode
): _data is QuizRound => mode === GameModeMap.MOVIE;

export const isActorsQuizData = (
  _data: QuizData,
  mode: GameMode
): _data is QuizActorsRound => mode === GameModeMap.ACTORS;

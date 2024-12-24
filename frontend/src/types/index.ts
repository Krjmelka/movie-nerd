import { QuizActorsRound, QuizRound } from '@movie-nerd/shared';

export const GameModeMap = {
  MOVIE: 'MOVIE',
  ACTORS: 'ACTORS',
  DESCRIPTION: 'DESCRIPTION',
} as const;

export type GameMode = (typeof GameModeMap)[keyof typeof GameModeMap];

export type QuizData = QuizRound | QuizActorsRound;

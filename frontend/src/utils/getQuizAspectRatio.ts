import { ASPECT_RATIO_MAP } from '../constants';
import { GameMode, QuizData } from '../types';
import { isActorsQuizData } from '../types/typeGuards';

export const getQuizAspectRatio = (
  quizData: QuizData,
  mode: GameMode
): string => {
  const aspectRatio = ASPECT_RATIO_MAP[mode];
  if (isActorsQuizData(quizData, mode)) {
    return `${aspectRatio.w * quizData.actors.length} / ${aspectRatio.h}`;
  }
  return `${aspectRatio.w} / ${aspectRatio.h}`;
};

import { QuizActorsRound, QuizRound } from '@movie-nerd/shared';
import axios from 'axios';
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  IMAGE_URL_PATH,
  MOVIE_FRAGMENT_IMAGE_SIZE,
  MOVIE_POSTER_IMAGE_SIZE,
} from '../../constants';
import { GameModeMap, QuizData } from '../../types';
import { useTranslation } from 'react-i18next';
import { useGameMode } from '../gameModeContext/useGameMode';
import { loadImage } from '../../utils/loadImage';

// const fetchFakeData = () =>
//   new Promise<QuizRound>(res => {
//     setTimeout(() => {
//       res({
//         roundId: '676164a0cda78235c9b442f5',
//         imageUrl: '/xZ2we4gdiwQmg6D1w9qHlAm5yIf.jpg',
//         variants: [
//           {
//             id: '62f49d0a02d4a44c01944378',
//             title: 'La La Land',
//           },
//           {
//             id: '62f3fe83cce61f2115ec095d',
//             title: 'Orphan',
//           },
//           {
//             id: '62f49bb602d4a44c0194276b',
//             title: 'Shrek Forever After',
//           },
//           {
//             id: '62f3f79fcce61f2115eba731',
//             title: 'Snowpiercer',
//           },
//         ],
//       });
//     }, 4000);
//   });

type MovieQuizContextType = {
  isLoading: boolean;
  quizData: QuizData | null;
  fetchQuizData: () => void;
};

const MovieQuizContext = createContext<MovieQuizContextType | undefined>(
  undefined
);

export const MovieQuizProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | undefined>();
  const { gameMode } = useGameMode();
  const { i18n } = useTranslation();

  if (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('Something went wrong!');
    }
  }

  const fetchQuizData = useCallback(async () => {
    setIsLoading(true);
    try {
      // const response = await fetchFakeData();
      // const img = new Image();
      // img.src = `${IMAGE_URL_PATH}${MOVIE_FRAGMENT_IMAGE_SIZE.w780}${response.imageUrl}`;
      // img.onload = () => {
      //   setQuizData(response);
      //   setIsLoading(false);
      // };
      switch (gameMode) {
        case GameModeMap.ACTORS: {
          const { data } = await axios.get<QuizActorsRound>(
            `${import.meta.env.VITE_API_URL}/actors-quiz?lang=${i18n.language}`
          );
          const imagesLoadPromises: Promise<unknown>[] = [];

          data.actors.forEach(actor => {
            imagesLoadPromises.push(
              loadImage(
                `${IMAGE_URL_PATH}${MOVIE_POSTER_IMAGE_SIZE.w185}${actor.profile_path}`
              )
            );
          });
          await Promise.all(imagesLoadPromises);
          setQuizData(data);
          setIsLoading(false);
          break;
        }
        case GameModeMap.MOVIE: {
          const { data } = await axios.get<QuizRound>(
            `${import.meta.env.VITE_API_URL}/quiz?lang=${i18n.language}`
          );

          await loadImage(
            `${IMAGE_URL_PATH}${MOVIE_FRAGMENT_IMAGE_SIZE.w780}${data.imageUrl}`
          );
          setQuizData(data);
          setIsLoading(false);
          break;
        }
        default: {
          throw new Error('missed game mode');
        }
      }
    } catch (err) {
      setError(err);
    }
  }, [i18n.language, gameMode]);

  useEffect(() => {
    if (gameMode) {
      fetchQuizData();
    }
  }, [gameMode, fetchQuizData]);

  return (
    <MovieQuizContext.Provider value={{ quizData, isLoading, fetchQuizData }}>
      {children}
    </MovieQuizContext.Provider>
  );
};

export default MovieQuizContext;

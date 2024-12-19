import { QuizRound } from '@movie-nerd/shared';
import axios from 'axios';
import { createContext, FC, ReactNode, useCallback, useState } from 'react';
import { IMAGE_URL_PATH, MOVIE_FRAGMENT_IMAGE_SIZE } from '../../constants';
import { useTranslation } from 'react-i18next';

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
  quizData: QuizRound | null;
  fetchQuizData: () => void;
};

const MovieQuizContext = createContext<MovieQuizContextType | undefined>(
  undefined
);

export const MovieQuizProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [quizData, setQuizData] = useState<QuizRound | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown | undefined>();
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
      const { data } = await axios.get<QuizRound>(
        `${import.meta.env.VITE_API_URL}/quiz?lang=${i18n.language}`
      );
      const img = new Image();
      img.src = `${IMAGE_URL_PATH}${MOVIE_FRAGMENT_IMAGE_SIZE.w780}${data.imageUrl}`;
      img.onload = () => {
        setQuizData(data);
        setIsLoading(false);
      };
    } catch (err) {
      setError(err);
    }
  }, [i18n.language]);

  return (
    <MovieQuizContext.Provider value={{ quizData, isLoading, fetchQuizData }}>
      {children}
    </MovieQuizContext.Provider>
  );
};

export default MovieQuizContext;

import { QuizRoundResult, QuizRoundAnswer } from '@movie-nerd/shared';
import axios, { AxiosResponse } from 'axios';
import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import { IMAGE_URL_PATH, MOVIE_POSTER_IMAGE_SIZE } from '../../constants';

// const fetchFakeData = (id: string | undefined) =>
//   new Promise<QuizRoundResult>(res => {
//     setTimeout(() => {
//       res({
//         isCorrect: id === '62f49bb602d4a44c0194276b',
//         poster: '/faRzuUxkZYzSc8UlAZGQ4tqE1Pi.jpg',
//         title: 'Shrek Forever After',
//         roundId: '676164a0cda78235c9b442f5',
//         imdbUrl: 'https://www.imdb.com/title/tt0111161',
//       });
//     }, 4000);
//   });

type ResultContextType = {
  isLoading: boolean;
  resultData: QuizRoundResult | null;
  resetResultData: () => void;
  sendResultData: (data: QuizRoundAnswer) => void;
};

const ResultContext = createContext<ResultContextType | undefined>(undefined);

export const ResultProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [resultData, setResultData] = useState<QuizRoundResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendResultData = useCallback(
    async ({ roundId, variantId }: QuizRoundAnswer) => {
      setIsLoading(true);
      try {
        const { data } = await axios.post<
          QuizRoundResult,
          AxiosResponse<QuizRoundResult>,
          QuizRoundAnswer
        >(`${import.meta.env.VITE_API_URL}/quiz`, {
          roundId,
          variantId,
        });
        const img = new Image();
        img.src = `${IMAGE_URL_PATH}${MOVIE_POSTER_IMAGE_SIZE.w500}${data.poster}`;
        img.onload = () => {
          setResultData(data);
          setIsLoading(false);
        };

        // const response = await fetchFakeData(variantId);
        // const img = new Image();
        // img.src = `${IMAGE_URL_PATH}${MOVIE_POSTER_IMAGE_SIZE.w500}${response.poster}`;
        // img.onload = () => {
        //   setResultData(response);
        //   setIsLoading(false);
        // };
      } catch (err) {
        console.error(err);
      }
    },
    []
  );

  const resetResultData = useCallback(() => {
    setResultData(null);
    setIsLoading(false);
  }, []);

  return (
    <ResultContext.Provider
      value={{ resultData, isLoading, sendResultData, resetResultData }}
    >
      {children}
    </ResultContext.Provider>
  );
};

export const useQuizResult = () => {
  const context = useContext(ResultContext);
  if (context === undefined) {
    throw new Error('useQuizResult must be used within a MovieProvider');
  }
  return context;
};

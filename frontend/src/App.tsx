import { useState, useEffect } from 'react';
import axios from 'axios';
import { QuizRound } from '@movie-nerd/shared';
import './app.scss';

const fetchFakeData = () =>
  new Promise<QuizRound>(res => {
    setTimeout(() => {
      res({
        roundId: '675b35f3357513ea400dca36',
        imageUrl: '/frwHYd7LmSYrmO9aiX0DLqQQlF0.jpg',
        variants: [
          {
            id: '62f4a36e02d4a44c0194b074',
            title: 'The Jungle Book',
          },
          {
            id: '62f3fee2cce61f2115ec1311',
            title: 'Planet Terror',
          },
          {
            id: '62f3efc8cce61f2115eac971',
            title: 'Parasite',
          },
          {
            id: '62f3f211cce61f2115eb1091',
            title: 'Downfall',
          },
        ],
      });
    }, 4000);
  });

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [quizData, setQuizData] = useState<QuizRound | null>(null);
  const fetchData = async () => {
    try {
      // const response = await axios.get<QuizRound>(`${import.meta.env.VITE_API_URL}/quiz`)
      const response = await fetchFakeData();
      setQuizData(response);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setError(err);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  if (error) {
    return <div>Error</div>;
  }
  return isLoading || !quizData ? (
    <div>Loading...</div>
  ) : (
    <div className="container">
      <img
        src={`https://image.tmdb.org/t/p/w780${quizData.imageUrl}`}
        alt="movie"
      />
      {quizData.variants.map(variant => (
        <div key={variant.id}>{variant.title}</div>
      ))}
      {quizData.variants.map(variant => (
        <div key={variant.id}>{variant.title}</div>
      ))}
      {quizData.variants.map(variant => (
        <div key={variant.id}>{variant.title}</div>
      ))}
    </div>
  );
}

export default App;

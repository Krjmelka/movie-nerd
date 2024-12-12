import { useState, useEffect } from 'react';
import axios from 'axios';
import { QuizRound } from '@movie-nerd/shared';
import './app.scss'

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);
  const [quizData, setQuizData] = useState<QuizRound | null>(null);
  const fetchData = async () => {
    try {
      const response = await axios.get<QuizRound>(`${import.meta.env.VITE_API_URL}/quiz`)
      setQuizData(response.data)
      setIsLoading(false)
    } catch (err) {
      console.error(err)
      setError(err)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  if(error) {
    return <div>Error</div>
  }
  return isLoading || !quizData ? (<div>Loading...</div>) : (
    <div className='container'>
      <img src={`https://image.tmdb.org/t/p/w500${quizData.imageUrl}`} alt="movie" />
      {quizData.variants.map((variant) => (<div key={variant.id}>{variant.title}</div>))}
    </div>
  )
}

export default App

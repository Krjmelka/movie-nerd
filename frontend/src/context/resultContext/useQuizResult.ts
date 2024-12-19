import { useContext } from 'react';
import ResultContext from './ResultProvider';

export const useQuizResult = () => {
  const context = useContext(ResultContext);
  if (context === undefined) {
    throw new Error('useQuizResult must be used within a MovieProvider');
  }
  return context;
};

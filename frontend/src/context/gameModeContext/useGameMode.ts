import { useContext } from 'react';
import GameModeContext from './GameModeProvider';

export const useGameMode = () => {
  const context = useContext(GameModeContext);
  if (context === undefined) {
    throw new Error('useGameMode must be used within a MovieProvider');
  }
  return context;
};

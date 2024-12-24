import { createContext, FC, ReactNode, useMemo, useState } from 'react';
import { GameMode } from '../../types';

type GameModeContextType = {
  isGameStarted: boolean;
  gameMode: GameMode | null;
  setGameMode: (gamemode: GameMode | null) => void;
};

const GameModeContext = createContext<GameModeContextType | undefined>(
  undefined
);

export const GameModeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);

  const isGameStarted = useMemo(() => !!gameMode, [gameMode]);

  return (
    <GameModeContext.Provider value={{ gameMode, setGameMode, isGameStarted }}>
      {children}
    </GameModeContext.Provider>
  );
};

export default GameModeContext;

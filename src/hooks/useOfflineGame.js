import { useState, useCallback } from 'react';
import { useOfflineSetup } from './game/useOfflineSetup';
import { useOfflineGameplay } from './game/useOfflineGameplay';

export const useOfflineGame = (setScreen) => {
  // Setup Logic
  const setup = useOfflineSetup();

  // Gameplay Logic (passing empty customLists since Mafia doesn't use word lists)
  const gameplay = useOfflineGameplay(setScreen, setup, {});

  // UI State (kept here as it's view-specific glue)
  const [rolesExpanded, setRolesExpanded] = useState(false);
  const [playersExpanded, setPlayersExpanded] = useState(true);
  const [namesExpanded, setNamesExpanded] = useState(false);
  const [turnOrderExpanded, setTurnOrderExpanded] = useState(true);
  const [allPlayersExpanded, setAllPlayersExpanded] = useState(false);
  const [rulesExpanded, setRulesExpanded] = useState(false);

  const resetGame = useCallback(() => {
    gameplay.resetGame();
    // Reset UI toggles
    setRolesExpanded(false);
    setNamesExpanded(false);
    setPlayersExpanded(true);
    setTurnOrderExpanded(true);
    setAllPlayersExpanded(false);
    setRulesExpanded(false);
  }, [gameplay]);

  return {
    ...setup,
    ...gameplay,
    resetGame, // Override resetGame to include UI reset

    // UI State
    rolesExpanded, setRolesExpanded,
    playersExpanded, setPlayersExpanded,
    namesExpanded, setNamesExpanded,
    turnOrderExpanded, setTurnOrderExpanded,
    allPlayersExpanded, setAllPlayersExpanded,
    rulesExpanded, setRulesExpanded,
  };
};

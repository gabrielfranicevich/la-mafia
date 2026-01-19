import { useCallback } from 'react';
import { useLocalStorage } from '../useLocalStorage';
import { SUSTANTIVOS, ADJETIVOS } from '../../data/names';

export const useOfflineSetup = () => {
  // State - now for Mafia game (roles instead of themes/monos)
  const [selectedRoles, setSelectedRoles] = useLocalStorage('mafia_setup_roles', {});
  const [numPlayers, setNumPlayers] = useLocalStorage('mafia_setup_players', 4);
  const [playerNames, setPlayerNames] = useLocalStorage('mafia_setup_names', ['', '', '', '']);

  // Actions
  const toggleRole = useCallback((roleId, count) => {
    setSelectedRoles(prev => ({
      ...prev,
      [roleId]: count
    }));
  }, [setSelectedRoles]);

  const updatePlayerName = useCallback((index, name) => {
    setPlayerNames(prev => {
      const newNames = [...prev];
      newNames[index] = name;
      return newNames;
    });
  }, [setPlayerNames]);

  const getRandomName = useCallback(() => {
    const sustantivo = SUSTANTIVOS[Math.floor(Math.random() * SUSTANTIVOS.length)];
    const adjetivo = ADJETIVOS[Math.floor(Math.random() * ADJETIVOS.length)];
    return `${sustantivo} ${adjetivo}`;
  }, []);

  const generateRandomName = useCallback((index) => {
    const name = getRandomName();
    updatePlayerName(index, name);
  }, [updatePlayerName, getRandomName]);

  const addPlayer = useCallback(() => {
    const newNumPlayers = numPlayers + 1;
    setNumPlayers(newNumPlayers);
    setPlayerNames(prev => [...prev, '']);
  }, [numPlayers, setNumPlayers, setPlayerNames]);

  const removePlayer = useCallback(() => {
    if (numPlayers > 4) { // Minimum 4 players for Mafia
      const newNumPlayers = numPlayers - 1;
      setNumPlayers(newNumPlayers);
      setPlayerNames(prev => prev.slice(0, -1));
    }
  }, [numPlayers, setNumPlayers, setPlayerNames]);

  return {
    selectedRoles,
    numPlayers,
    playerNames,
    toggleRole,
    updatePlayerName,
    generateRandomName,
    addPlayer,
    removePlayer,
    getRandomName
  };
};

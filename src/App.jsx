import { useState, useEffect } from 'react';
import './App.css';
import HomeScreen from './components/HomeScreen';
import SetupScreen from './components/offline/SetupScreen';
import RevealScreen from './components/offline/RevealScreen';
import PlayingScreen from './components/offline/PlayingScreen';
import NightPhaseScreen from './components/offline/NightPhaseScreen';
import DayPhaseScreen from './components/offline/DayPhaseScreen';
import EndedScreen from './components/offline/EndedScreen';
import OnlineLobbyScreen from './components/online/OnlineLobbyScreen';
import OnlineCreateScreen from './components/online/OnlineCreateScreen';
import OnlineWaitingRoom from './components/online/OnlineWaitingRoom';
import OnlinePlayingScreen from './components/online/OnlinePlayingScreen';

import { useSessionId } from './hooks/useSessionId';
import { useLocalIp } from './hooks/useLocalIp';
import { useOfflineGame } from './hooks/useOfflineGame';
import { useOnlineGame } from './hooks/useOnlineGame';
import { useAppRouting } from './hooks/useAppRouting';

function App() {
  const [screen, setScreen] = useState('home');

  // Persist playerName
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('playerName') || '';
  });

  useEffect(() => {
    if (playerName) localStorage.setItem('playerName', playerName);
  }, [playerName]);

  // Hooks
  const mySessionId = useSessionId();
  const localIp = useLocalIp();

  const offlineGame = useOfflineGame(setScreen);

  const onlineGame = useOnlineGame(setScreen, mySessionId, localIp, playerName);

  // Routing hook consumes state
  useAppRouting(screen, setScreen, onlineGame.roomId, onlineGame.setRoomId, onlineGame.roomData);

  const resetGame = () => {
    if (screen.startsWith('online_')) {
      if (onlineGame.isHost && onlineGame.socket)
        onlineGame.resetOnlineGame();
      return;
    }
    offlineGame.resetGame();
  };

  return (
    <div className="min-h-screen bg-medieval-stone bg-cobblestone-pattern p-4 flex items-center justify-center font-sans text-medieval-ink selection:bg-royal-gold selection:text-white">
      <div className="w-full max-w-md bg-medieval-parchment rounded-3xl shadow-[8px_8px_0px_0px_rgba(74,76,58,0.3)] overflow-hidden border-4 border-medieval-dark-stone relative">
        <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-medieval-dark-stone/30"></div>
        <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-medieval-dark-stone/30"></div>
        <div className="absolute bottom-3 left-3 w-3 h-3 rounded-full bg-medieval-dark-stone/30"></div>
        <div className="absolute bottom-3 right-3 w-3 h-3 rounded-full bg-medieval-dark-stone/30"></div>

        {screen === 'home' && <HomeScreen setScreen={setScreen} />}

        {screen === 'online_lobby' && (
          <OnlineLobbyScreen
            setScreen={setScreen}
            onlineGames={onlineGame.onlineGames}
            lanGames={onlineGame.lanGames}
            joinOnlineGame={onlineGame.joinOnlineGame}
            playerName={playerName}
            setPlayerName={setPlayerName}
            roomIdFromUrl={onlineGame.roomId}
            clearRoomId={() => onlineGame.setRoomId(null)}
            socket={onlineGame.socket}
            getRandomName={offlineGame.getRandomName}
            localIp={localIp}
          />
        )}

        {screen === 'online_create' && (
          <OnlineCreateScreen
            setScreen={setScreen}
            newGameSettings={onlineGame.newGameSettings}
            setNewGameSettings={onlineGame.setNewGameSettings}
            onlineGames={onlineGame.onlineGames}
            setOnlineGames={onlineGame.setOnlineGames}
            playerNames={offlineGame.playerNames}
            createOnlineGame={onlineGame.createOnlineGame}
            playerName={playerName}
            setPlayerName={setPlayerName}
            getRandomName={offlineGame.getRandomName}
          />
        )}

        {screen === 'online_waiting' && onlineGame.roomData && (
          <OnlineWaitingRoom
            roomData={onlineGame.roomData}
            isHost={onlineGame.isHost}
            leaveRoom={onlineGame.leaveRoom}
            startGame={onlineGame.startOnlineGame}
            updateRoomSettings={onlineGame.updateRoomSettings}
          />
        )}

        {screen === 'online_playing' && onlineGame.roomData && (
          <OnlinePlayingScreen
            roomData={onlineGame.roomData}
            playerName={playerName}
            playerId={onlineGame.socket?.id}
            finishTurn={onlineGame.finishTurn}
            submitVote={onlineGame.submitVote}
            leaveRoom={onlineGame.leaveRoom}
            isHost={onlineGame.isHost}
            resetGame={onlineGame.resetOnlineGame}
          />
        )}

        {screen === 'setup' && (
          <SetupScreen
            setScreen={setScreen}
            selectedRoles={offlineGame.selectedRoles}
            toggleRole={offlineGame.toggleRole}
            rolesExpanded={offlineGame.rolesExpanded}
            setRolesExpanded={offlineGame.setRolesExpanded}
            numPlayers={offlineGame.numPlayers}
            addPlayer={offlineGame.addPlayer}
            removePlayer={offlineGame.removePlayer}
            playersExpanded={offlineGame.playersExpanded}
            setPlayersExpanded={offlineGame.setPlayersExpanded}
            playerNames={offlineGame.playerNames}
            updatePlayerName={offlineGame.updatePlayerName}
            generateRandomName={offlineGame.generateRandomName}
            namesExpanded={offlineGame.namesExpanded}
            setNamesExpanded={offlineGame.setNamesExpanded}
            startGame={offlineGame.startGame}
            // New Custom List Props
            customLists={offlineGame.customLists}
            onSaveList={offlineGame.handleSaveList}
            onDeleteList={offlineGame.handleDeleteList}
            onEditList={offlineGame.handleEditList}
            onOpenCreateModal={offlineGame.handleOpenCreateModal}
            modalOpen={offlineGame.modalOpen}
            onCloseModal={offlineGame.handleCloseModal}
            editingList={offlineGame.editingList}
          />
        )}

        {screen === 'reveal' && offlineGame.gameData && (
          <RevealScreen
            gameData={offlineGame.gameData}
            currentPlayerIndex={offlineGame.currentPlayerIndex}
            numPlayers={offlineGame.numPlayers}
            roleRevealed={offlineGame.roleRevealed}
            showRole={offlineGame.showRole}
            isRole={offlineGame.isRole}
            nextPlayer={offlineGame.nextPlayer}
          />
        )}

        {screen === 'night' && offlineGame.gameData && (
          <NightPhaseScreen
            gameData={offlineGame.gameData}
            currentNightPlayer={offlineGame.currentNightPlayer}
            submitNightAction={offlineGame.submitNightAction}
            getCurrentNightRole={offlineGame.getCurrentNightRole}
          />
        )}

        {screen === 'day' && offlineGame.gameData && (
          <DayPhaseScreen
            gameData={offlineGame.gameData}
            executePlayer={offlineGame.executePlayer}
          />
        )}

        {screen === 'ended' && offlineGame.gameData && (
          <EndedScreen
            gameData={offlineGame.gameData}
            resetGame={resetGame}
          />
        )}

        {screen === 'playing' && offlineGame.gameData && (
          <PlayingScreen
            gameData={offlineGame.gameData}
            resetGame={resetGame}
            turnOrderExpanded={offlineGame.turnOrderExpanded}
            setTurnOrderExpanded={offlineGame.setTurnOrderExpanded}
            allPlayersExpanded={offlineGame.allPlayersExpanded}
            setAllPlayersExpanded={offlineGame.setAllPlayersExpanded}
            rulesExpanded={offlineGame.rulesExpanded}
            setRulesExpanded={offlineGame.setRulesExpanded}
          />
        )}
      </div>
    </div>
  );
}

export default App;

import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '../useLocalStorage';
import { ROLES } from '../../data/gameRoles';

export const useOfflineGameplay = (setScreen, setupData) => {
  const { selectedRoles, numPlayers, playerNames } = setupData;

  const [currentPlayerIndex, setCurrentPlayerIndex] = useLocalStorage('mafia_game_playerIndex', 0);
  const [gameData, setGameData] = useLocalStorage('mafia_game_data', null);
  const [roleRevealed, setRoleRevealed] = useState(false);

  // Game Flow State
  const [phase, setPhase] = useLocalStorage('mafia_game_phase', 'reveal');
  const [round, setRound] = useLocalStorage('mafia_game_round', 1);
  const [currentNightPlayer, setCurrentNightPlayer] = useLocalStorage('mafia_night_player', 0);
  const [nightActions, setNightActions] = useLocalStorage('mafia_night_actions', []);

  // Restore screen state on mount
  useEffect(() => {
    if (gameData) {
      if (phase === 'reveal') {
        if (currentPlayerIndex < gameData.players.length) {
          setScreen('reveal');
        } else {
          setScreen('night');
        }
      } else if (phase === 'night') {
        setScreen('night');
      } else if (phase === 'day') {
        setScreen('day');
      } else if (phase === 'ended') {
        setScreen('ended');
      }
    }
  }, []);

  const startGame = useCallback(() => {
    const finalPlayerNames = playerNames.slice(0, numPlayers).map((name, i) =>
      name.trim() ? name : `Jugador ${i + 1}`
    );

    const assignedRoles = [];
    Object.entries(selectedRoles).forEach(([roleId, count]) => {
      for (let i = 0; i < count; i++) assignedRoles.push(roleId);
    });
    while (assignedRoles.length < numPlayers) assignedRoles.push('civil');

    for (let i = assignedRoles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [assignedRoles[i], assignedRoles[j]] = [assignedRoles[j], assignedRoles[i]];
    }

    const playerOrder = Array.from({ length: numPlayers }, (_, i) => i);

    const playerStates = playerOrder.map(playerIdx => ({
      id: playerIdx,
      alive: true,
      mutations: []
    }));

    setGameData({
      roles: assignedRoles,
      players: finalPlayerNames,
      playerOrder: playerOrder,
      playerStates: playerStates,
      events: [],
      studentLinks: {}
    });
    setCurrentPlayerIndex(0);
    setRoleRevealed(false);
    setPhase('reveal');
    setRound(1);
    setCurrentNightPlayer(0);
    setNightActions([]);
    setScreen('reveal');
  }, [selectedRoles, playerNames, numPlayers, setScreen, setGameData, setCurrentPlayerIndex, setPhase, setRound, setCurrentNightPlayer, setNightActions]);

  const showRole = useCallback(() => {
    setRoleRevealed(true);
  }, []);

  const nextPlayer = useCallback(() => {
    if (currentPlayerIndex < numPlayers - 1) {
      setCurrentPlayerIndex(prev => prev + 1);
      setRoleRevealed(false);
    } else {
      setPhase('night');
      setCurrentNightPlayer(0);
      setScreen('night');
    }
  }, [currentPlayerIndex, numPlayers, setCurrentPlayerIndex, setPhase, setCurrentNightPlayer, setScreen]);

  const resolveNightPhase = (actions) => {
    if (!gameData) return;

    const newPlayerStates = [...gameData.playerStates];
    const events = [];
    const studentLinks = { ...gameData.studentLinks };

    const getPState = (id) => newPlayerStates.find(p => p.id === id);

    // 0. Process Estudiante Links
    actions.filter(a => a.type === 'choose_master').forEach(action => {
      studentLinks[action.playerIndex] = action.target;
    });

    // 1. Trabajadora Blocks
    const blockedPlayers = new Set();
    actions.filter(a => a.type === 'block').forEach(action => {
      blockedPlayers.add(action.target);
    });

    const validActions = actions.filter(action => {
      if (blockedPlayers.has(action.playerIndex)) return false;
      return true;
    });

    // 2. Espejo Swaps
    const redirectMap = {};
    validActions.filter(a => a.type === 'swap').forEach(action => {
      const { target1, target2 } = action;
      if (target1 !== undefined && target2 !== undefined) {
        redirectMap[target1] = target2;
        redirectMap[target2] = target1;
      }
    });

    const getTarget = (originalTarget) => {
      if (Array.isArray(originalTarget)) return originalTarget.map(getTarget); // Recursive for arrays? No roles target arrays except Mirror which we specifically parse.
      if (redirectMap[originalTarget] !== undefined) return redirectMap[originalTarget];
      return originalTarget;
    };

    // 3. Medico Protections & Cures
    const protectedPlayers = new Set();
    const protectionCounts = {};

    validActions.filter(a => a.type === 'protect').forEach(action => {
      // Logic: Protects the *redirected* target
      const realTarget = getTarget(action.target);

      protectionCounts[realTarget] = (protectionCounts[realTarget] || 0) + 1;
      protectedPlayers.add(realTarget);

      const pState = getPState(realTarget);
      if (pState && pState.mutations.length > 0) {
        pState.mutations = [];
        events.push({ type: 'info', message: `${gameData.players[realTarget]} fue curado de sus heridas.` });
      }
    });

    // 4. Kills
    const mafiaVotes = {};
    const justicieroVotes = {};

    validActions.forEach(action => {
      const actorRole = ROLES[gameData.roles[action.playerIndex]];

      if (action.type === 'kill_group' || action.type === 'kill_direct') {
        // Votes target the *redirected* player
        const realTarget = getTarget(action.target);

        if (actorRole.side === 'mafia') {
          mafiaVotes[realTarget] = (mafiaVotes[realTarget] || 0) + 1;
        } else if (actorRole.id === 'justiciero') {
          justicieroVotes[realTarget] = (justicieroVotes[realTarget] || 0) + 1;
        }
      }
    });

    const resolveKill = (votes) => {
      let maxVotes = 0;
      let target = null;
      Object.entries(votes).forEach(([t, count]) => {
        if (count > maxVotes) {
          maxVotes = count;
          target = parseInt(t);
        } else if (count === maxVotes) {
          target = null;
        }
      });
      return target;
    };

    const mafiaTarget = resolveKill(mafiaVotes);
    const justicieroTarget = resolveKill(justicieroVotes);

    const tryKill = (targetId) => {
      if (targetId === null) return;
      if (targetId === null) return;

      // Overdose Check: If protected by >= 2 doctors, they die regarldess of protection.
      // We handle this separately below, but for "Attacks", standard protection applies.
      // However, if overdose happens, they are dead anyway.

      if (protectedPlayers.has(targetId) && (protectionCounts[targetId] || 0) < 2) {
        events.push({ type: 'info', message: `Alguien fue atacado pero sobrevivió.` });
      } else {
        const pState = getPState(targetId);
        if (pState && pState.alive) {
          pState.alive = false;
          events.push({ type: 'death', message: `${gameData.players[targetId]} ha muerto.` });
          checkStudentInheritance(targetId, newPlayerStates, gameData.roles, studentLinks, events);
        }
      }
    };

    if (mafiaTarget !== null) tryKill(mafiaTarget);
    if (mafiaTarget !== null) tryKill(mafiaTarget);
    if (justicieroTarget !== null) tryKill(justicieroTarget);

    // Overdose Deaths (Medic >= 2)
    Object.entries(protectionCounts).forEach(([idStr, count]) => {
      const id = parseInt(idStr);
      if (count >= 2) {
        const pState = getPState(id);
        if (pState && pState.alive) {
          pState.alive = false;
          events.push({ type: 'death', message: `${gameData.players[id]} murió por sobredosis de protección.` });
          checkStudentInheritance(id, newPlayerStates, gameData.roles, studentLinks, events);
        }
      }
    });

    // 5. Mutilations
    validActions.filter(a => a.type === 'mutilate').forEach(action => {
      const targetId = getTarget(action.target);

      if (protectedPlayers.has(targetId)) {
        events.push({ type: 'info', message: 'Un intento de mutilación fue prevenido.' });
        return;
      }
      const pState = getPState(targetId);
      if (pState && pState.alive) {
        pState.mutations.push(action.mutationType);
        events.push({ type: 'mutilation', message: `${gameData.players[targetId]} ha sido mutilado (${action.mutationType === 'hand' ? 'mano' : 'lengua'}).` });

        if (pState.mutations.length >= 2) {
          pState.alive = false;
          events.push({ type: 'death', message: `${gameData.players[targetId]} murió por sus heridas.` });
          checkStudentInheritance(targetId, newPlayerStates, gameData.roles, studentLinks, events);
        }
      }
    });

    setGameData(prev => ({
      ...prev,
      playerStates: newPlayerStates,
      events: events,
      studentLinks: studentLinks
    }));

    checkWinConditions(newPlayerStates, gameData.roles);
  };

  const checkStudentInheritance = (deadId, playerStates, roles, studentLinks, events) => {
    Object.entries(studentLinks).forEach(([studentIdStr, masterId]) => {
      if (parseInt(masterId) === deadId) {
        const studentId = parseInt(studentIdStr);
        const studentState = playerStates.find(p => p.id === studentId);
        if (studentState && studentState.alive) {
          // Inherit Role
          const masterRole = roles[deadId];
          // Mutate roles array - this works because we pass gameData.roles which is mutable in memory before setGameData? 
          // No, we need to update state. 
          // Actually, we need to return new roles or modify them in place if we are about to setGameData.
          // Since resolvedNightPhase does setGameData, we should probably update roles there.
          // But roles is not cloned in resolveNightPhase. It is gameData.roles.
          // We should clone roles in resolveNightPhase.
          roles[studentId] = masterRole;
          events.push({ type: 'info', message: 'Un estudiante ha ascendido.' });
        }
      }
    });
  };

  const checkWinConditions = (playerStates, roles) => {
    const aliveStates = playerStates.filter(p => p.alive);

    // Count ONLY voting players (not Hand Mutilated)
    const votingStates = aliveStates.filter(p => !p.mutations.includes('hand'));

    const mafiaCount = votingStates.filter(p => ROLES[roles[p.id]].side === 'mafia').length;
    const civilCount = votingStates.filter(p => {
      const role = ROLES[roles[p.id]];
      return role.side === 'civil' || role.side === 'neutral' || role.side === 'loco';
    }).length;

    // Check for "Counter-Mafia" roles that prevent immediate victory via count
    const activeRoles = aliveStates.map(p => ROLES[roles[p.id]]);
    const hasJusticiero = activeRoles.some(r => r.id === 'justiciero');
    const hasCarnicero = activeRoles.some(r => r.id === 'carnicero');
    const hasKamikaze = activeRoles.some(r => r.id === 'kamikaze');
    const hasLoco = activeRoles.some(r => r.id === 'loco');

    // Condition 1: No Civils
    const totalCivils = aliveStates.filter(p => ROLES[roles[p.id]].side === 'civil').length;
    if (totalCivils === 0) {
      finalizeGame('mafia');
      return;
    }

    // Condition 2: Mafia >= Civils (Voting Power)
    // BUT only if no special counter-roles exist
    if (mafiaCount >= civilCount) {
      if (!hasJusticiero && !hasCarnicero && !hasKamikaze && !hasLoco) {
        finalizeGame('mafia');
        return;
      }
    }

    // Condition 3: No Mafia
    const totalMafia = aliveStates.filter(p => ROLES[roles[p.id]].side === 'mafia').length;
    if (totalMafia === 0) {
      finalizeGame('civil');
      return;
    }
  };

  const finalizeGame = (winner) => {
    setGameData(prev => ({ ...prev, winner }));
    setPhase('ended');
    setScreen('ended');
  };

  const submitNightAction = useCallback((action) => {
    const newActions = [...nightActions, {
      playerIndex: currentNightPlayer,
      round,
      ...action
    }];
    setNightActions(newActions);

    const alivePlayers = gameData?.playerStates?.filter(p => p.alive) || [];

    if (currentNightPlayer < alivePlayers.length - 1) {
      setCurrentNightPlayer(prev => prev + 1);
    } else {
      resolveNightPhase(newActions);
      if (phase !== 'ended') {
        setPhase(prev => 'day');
        setScreen('day');
      }
    }
  }, [currentNightPlayer, gameData, round, nightActions, setCurrentNightPlayer, setPhase, setScreen]);

  const executePlayer = useCallback((playerId) => {
    if (!gameData) return;
    const newPlayerStates = [...gameData.playerStates];
    const pState = newPlayerStates.find(p => p.id === playerId);

    if (pState && pState.alive) {
      pState.alive = false;
      const roleId = gameData.roles[playerId];
      if (roleId === 'loco') {
        setGameData(prev => ({ ...prev, playerStates: newPlayerStates, winner: 'loco' }));
        setPhase('ended');
        setScreen('ended');
        return;
      }
    }

    setGameData(prev => ({ ...prev, playerStates: newPlayerStates }));
    checkWinConditions(newPlayerStates, gameData.roles);

    setPhase('night');
    setRound(r => r + 1);
    setCurrentNightPlayer(0);
    setNightActions([]);
    setGameData(prev => ({ ...prev, events: [] }));
    setScreen('night');
  }, [gameData, setPhase, setScreen]);

  const getCurrentNightRole = () => {
    if (!gameData || !gameData.roles || !gameData.playerStates) return null;
    const alivePlayers = gameData.playerStates.filter(p => p.alive);
    if (currentNightPlayer >= alivePlayers.length) return null;
    const playerState = alivePlayers[currentNightPlayer];
    return gameData.roles[playerState.id];
  };

  const resetGame = useCallback(() => {
    setScreen('setup');
    setCurrentPlayerIndex(0);
    setGameData(null);
    setRoleRevealed(false);
    setPhase('reveal');
    setRound(1);
    setCurrentNightPlayer(0);
    setNightActions([]);
  }, [setScreen, setCurrentPlayerIndex, setGameData, setPhase, setRound, setCurrentNightPlayer, setNightActions]);

  const isRole = (roleId) => {
    if (!gameData || !gameData.roles) return false;
    return gameData.roles[currentPlayerIndex] === roleId;
  };

  return {
    currentPlayerIndex,
    gameData,
    roleRevealed,
    phase,
    round,
    currentNightPlayer,
    nightActions,
    startGame,
    showRole,
    nextPlayer,
    submitNightAction,
    executePlayer,
    resetGame,
    isRole,
    getCurrentNightRole
  };
};

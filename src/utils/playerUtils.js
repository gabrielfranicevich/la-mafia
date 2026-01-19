/**
 * Utilidades para trabajar con jugadores
 */

import { MUTATION_TYPES } from '../data/gameRoles.js';

/**
 * Obtiene los jugadores vivos
 */
export function getAlivePlayers(players) {
  return players.filter(p => p.alive);
}

/**
 * Obtiene los jugadores que pueden votar
 * (vivos y sin mutilación de mano)
 */
export function getPlayersWithVote(players) {
  return players.filter(p =>
    p.alive &&
    !p.mutations?.includes(MUTATION_TYPES.hand)
  );
}

/**
 * Obtiene los jugadores que pueden hablar
 * (vivos y sin mutilación de lengua)
 */
export function getPlayersWhoCanSpeak(players) {
  return players.filter(p =>
    p.alive &&
    !p.mutations?.includes(MUTATION_TYPES.tongue)
  );
}

/**
 * Obtiene jugadores por bando
 */
export function getPlayersBySide(players, side) {
  return players.filter(p => p.side === side && p.alive);
}

/**
 * Obtiene jugadores por rol específico
 */
export function getPlayersByRole(players, roleId) {
  return players.filter(p => p.role === roleId && p.alive);
}

/**
 * Obtiene las mutilaciones de un jugador
 */
export function getPlayerMutations(player) {
  return player.mutations || [];
}

/**
 * Verifica si un jugador puede votar
 */
export function canPlayerVote(player) {
  return player.alive && !player.mutations?.includes(MUTATION_TYPES.hand);
}

/**
 * Verifica si un jugador puede hablar
 */
export function canPlayerSpeak(player) {
  return player.alive && !player.mutations?.includes(MUTATION_TYPES.tongue);
}

/**
 * Verifica si un jugador tiene cierta mutilación
 */
export function hasMutation(player, mutationType) {
  return player.mutations?.includes(mutationType) || false;
}

/**
 * Cuenta jugadores vivos por bando
 */
export function countPlayersBySide(players, side) {
  return getPlayersBySide(players, side).length;
}

/**
 * Cuenta jugadores con voto por bando
 */
export function countPlayersWithVoteBySide(players, side) {
  return players.filter(p =>
    p.alive &&
    p.side === side &&
    !p.mutations?.includes(MUTATION_TYPES.hand)
  ).length;
}

/**
 * Encuentra un jugador por ID
 */
export function findPlayerById(players, playerId) {
  return players.find(p => p.id === playerId);
}

/**
 * Verifica si un jugador está vivo
 */
export function isPlayerAlive(players, playerId) {
  const player = findPlayerById(players, playerId);
  return player?.alive || false;
}

/**
 * Verifica si un jugad está bloqueado
 */
export function isPlayerBlocked(player) {
  return player.blockedThisNight === true;
}

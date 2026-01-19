/**
 * Utilidades para trabajar con roles
 */

import { ROLES } from '../data/gameRoles.js';

/**
 * Obtiene el nombre legible de un rol
 */
export function getRoleName(roleId) {
  return ROLES[roleId]?.name || 'Desconocido';
}

/**
 * Obtiene la descripción de un rol
 */
export function getRoleDescription(roleId) {
  return ROLES[roleId]?.description || '';
}

/**
 * Obtiene el icono/emoji de un rol
 */
export function getRoleIcon(roleId) {
  return ROLES[roleId]?.emoji || '❓';
}

/**
 * Obtiene el bando de un rol
 */
export function getRoleSide(roleId) {
  return ROLES[roleId]?.side || 'civil';
}

/**
 * Verifica si un rol tiene acción nocturna
 */
export function hasNightAction(roleId) {
  return ROLES[roleId]?.nightAction !== null;
}

/**
 * Verifica si un rol es detectado como malo por el policía
 */
export function isDetectedAsBad(roleId) {
  return ROLES[roleId]?.detectsAsBad === true;
}

/**
 * Obtiene el tipo de acción nocturna de un rol
 */
export function getNightActionType(roleId) {
  return ROLES[roleId]?.nightAction;
}

/**
 * Verifica si un rol puede votar de día (por defecto)
 */
export function canRoleVote(roleId) {
  return ROLES[roleId]?.canVoteDay !== false;
}

/**
 * Obtiene todos los roles de un bando específico
 */
export function getRolesBySide(side) {
  return Object.values(ROLES).filter(role => role.side === side);
}

/**
 * Verifica si un rol pertenece a un bando
 */
export function isRoleInSide(roleId, side) {
  return getRoleSide(roleId) === side;
}

/**
 * Obtiene el objeto completo de un rol
 */
export function getRole(roleId) {
  return ROLES[roleId];
}

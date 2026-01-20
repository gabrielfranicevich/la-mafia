/**
 * Constantes del juego La Mafia
 */

// Configuración de jugadores
export const PLAYER_CONFIG = {
  MIN_PLAYERS: 4
  // Sin límite máximo de jugadores
};

// Fases del juego
export const GAME_PHASES = {
  SETUP: 'setup',
  NIGHT: 'night',
  DAY: 'day',
  VOTING: 'voting',
  RESULTS: 'results'
};

// Estados del juego
export const GAME_STATES = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  FINISHED: 'finished'
};

// Orden de resolución nocturna
export const NIGHT_RESOLUTION_ORDER = [
  'choose_master', // 1. Estudiante elige maestro (solo primera ronda)
  'block',         // 2. Trabajadora nocturna bloquea habilidad
  'protect',       // 3. Médico protege (previene asesinatos Y mutilaciones + cura mutilaciones viejas)
  'investigate',   // 4. Policía investiga
  'kill_group',    // 5. Mafia/Justiciero mata
  'mutilate',      // 6. Carnicero mutila
  'swap'           // 7. Espejo intercambia efectos
];

// Temporizadores (en segundos)
export const TIMERS = {
  // Modo online - tiempos máximos
  ONLINE: {
    NIGHT_ACTION: 60,      // 1 minuto para acción nocturna
    DAY_DISCUSSION: 120,   // 2 minutos para debate
    VOTING: 30,            // 30 segundos para votar
    KAMIKAZE_CHOICE: 20    // 20 segundos para Kamikaze elegir víctima
  },
  // Modo offline - tiempos mínimos (ocultar identidad)
  OFFLINE: {
    MIN_TURN_DELAY: 3,     // 3 segundos mínimo por turno
    REVEAL_DELAY: 2        // 2 segundos para revelar información
  }
};

// Ganadores posibles
export const WINNERS = {
  CIVIL: 'civil',
  MAFIA: 'mafia',
  LOCO: 'loco',
  NONE: null
};

// Temas visuales
export const VISUAL_THEMES = {
  DAY: 'day',    // Ciudad antigua de día (tema claro)
  NIGHT: 'night' // Ciudad antigua de noche (tema oscuro)
};

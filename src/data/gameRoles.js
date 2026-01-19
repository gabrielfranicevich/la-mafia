/**
 * Definición de todos los roles del juego La Mafia
 * 
 * Estructura de cada rol:
 * - id: Identificador único
 * - name: Nombre del rol
 * - side: 'civil', 'mafia', o 'loco'
 * - description: Descripción de las habilidades
 * - nightAction: Tipo de acción nocturna (null si no tiene)
 * - detectsAsBad: Si el policía lo detecta como "malo"
 * - canVoteDay: Si puede votar de día (por defecto)
 * - emoji: Icono representativo
 */

export const ROLES = {
  // BANDO: CIVILES
  civil: {
    id: 'civil',
    name: 'Civil',
    side: 'civil',
    description: 'Solo debate y vota de día. No tiene habilidades especiales.',
    nightAction: null,
    detectsAsBad: false,
    canVoteDay: true,
    emoji: '👤'
  },

  policia: {
    id: 'policia',
    name: 'Policía',
    side: 'civil',
    description: 'Por noche, consulta si un jugador es Mafia (recibe respuesta sí/no).',
    nightAction: 'investigate',
    detectsAsBad: false,
    canVoteDay: true,
    emoji: '👮'
  },

  medico: {
    id: 'medico',
    name: 'Médico',
    side: 'civil',
    description: 'Por noche, elige a un jugador para protegerlo de la muerte y curar sus mutilaciones. Si dos médicos protegen al mismo jugador, este muere por sobredosis.',
    nightAction: 'protect',
    detectsAsBad: false,
    canVoteDay: true,
    emoji: '⚕️'
  },

  trabajadora: {
    id: 'trabajadora',
    name: 'Trabajadora Nocturna',
    side: 'civil',
    description: 'Por noche, bloquea a un jugador impidiendo que use su habilidad nocturna esa ronda.',
    nightAction: 'block',
    detectsAsBad: false,
    canVoteDay: true,
    emoji: '💋'
  },

  carnicero: {
    id: 'carnicero',
    name: 'Carnicero',
    side: 'civil',
    description: 'Por noche, mutila a un jugador (mano = no vota, lengua = no habla). Segunda mutilación sin cura = muerte. Aparece como "malo" ante el Policía.',
    nightAction: 'mutilate',
    detectsAsBad: true,
    canVoteDay: true,
    emoji: '🔪'
  },

  kamikaze: {
    id: 'kamikaze',
    name: 'Kamikaze',
    side: 'civil',
    description: 'Al morir por votación diurna, puede matar a otro jugador.',
    nightAction: null,
    detectsAsBad: false,
    canVoteDay: true,
    emoji: '💣'
  },

  justiciero: {
    id: 'justiciero',
    name: 'Justiciero',
    side: 'civil',
    description: 'Similar a la Mafia pero del lado Civiles: mata por noche mediante votación grupal con otros justicieros.',
    nightAction: 'kill_group',
    detectsAsBad: false,
    canVoteDay: true,
    emoji: '⚖️'
  },

  espejo: {
    id: 'espejo',
    name: 'Espejo',
    side: 'civil',
    description: 'Por noche, elige a dos jugadores e intercambia los efectos nocturnos entre ellos (dura solo esa noche).',
    nightAction: 'swap',
    detectsAsBad: false,
    canVoteDay: true,
    emoji: '🪞'
  },

  estudiante: {
    id: 'estudiante',
    name: 'Estudiante',
    side: 'civil',
    description: 'Comienza sin poderes. En la primera noche, elige un "maestro". Si ese maestro es eliminado, el Estudiante hereda su rol y poderes.',
    nightAction: 'choose_master',
    detectsAsBad: false,
    canVoteDay: true,
    emoji: '📚'
  },

  // BANDO: MAFIA
  mafia: {
    id: 'mafia',
    name: 'Mafia',
    side: 'mafia',
    description: 'Por noche, votan grupalmente para matar a un jugador. Se conocen entre sí.',
    nightAction: 'kill_group',
    detectsAsBad: true,
    canVoteDay: true,
    emoji: '🕴️'
  },

  // BANDO: LOCO (Neutral)
  loco: {
    id: 'loco',
    name: 'Loco',
    side: 'loco',
    description: 'Intenta ser ejecutado por votación diurna. Si lo ejecutan, gana automáticamente (todos los demás pierden).',
    nightAction: null,
    detectsAsBad: false,
    canVoteDay: true,
    emoji: '🤪'
  }
};

// Array de todos los roles para iteración
export const ALL_ROLES = Object.values(ROLES);

// Roles agrupados por bando
export const ROLES_BY_SIDE = {
  civil: ALL_ROLES.filter(r => r.side === 'civil'),
  mafia: ALL_ROLES.filter(r => r.side === 'mafia'),
  loco: ALL_ROLES.filter(r => r.side === 'loco')
};

// Tipos de mutilación
export const MUTATION_TYPES = {
  hand: 'hand', // No puede votar
  tongue: 'tongue' // No puede hablar
};

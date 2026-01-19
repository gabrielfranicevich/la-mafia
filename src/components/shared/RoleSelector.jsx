import { memo } from 'react';
import { Users, ChevronUp, ChevronDown, Plus, Minus } from '../Icons';
import { ROLES } from '../../data/gameRoles';

/**
 * Selector de roles para el juego de La Mafia
 * Permite al host seleccionar cuántos de cada rol habrá en la partida
 */
const RoleSelector = ({
  selectedRoles = {}, // { roleId: count }
  onUpdateRole,
  totalPlayers,
  expanded,
  setExpanded,
  isHost = true
}) => {
  // Calcular roles asignados
  const assignedRoles = Object.values(selectedRoles).reduce((sum, count) => sum + count, 0);
  const civilsNeeded = Math.max(0, totalPlayers - assignedRoles);

  // Validación: Mafias con voto < Civiles con voto
  const mafiaCount = selectedRoles['mafia'] || 0;
  const civilCount = Object.entries(selectedRoles)
    .filter(([roleId]) => ROLES[roleId]?.side === 'civil')
    .reduce((sum, [_, count]) => sum + count, 0) + civilsNeeded;

  const isValid = mafiaCount < civilCount;

  return (
    <div className="mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 border-b border-noir-gold/20 hover:bg-white/5 transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="text-noir-gold group-hover:scale-110 transition-transform duration-300">
            <Users size={20} />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-serif font-bold text-noir-gold leading-tight tracking-widest">ROLES</h2>
            <span className="text-xs text-noir-smoke font-bold uppercase tracking-wide">
              {assignedRoles}/{totalPlayers} ASSIGNED
              {civilsNeeded > 0 && ` (+${civilsNeeded} CIVS)`}
            </span>
          </div>
        </div>
        {expanded ? <ChevronUp size={20} className="text-noir-gold/50" /> : <ChevronDown size={20} className="text-noir-gold/50" />}
      </button>

      {expanded && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300 py-4">
          {/* Validación */}
          {!isValid && (
            <div className="mb-4 p-3 border border-red-500/50 bg-red-900/20 rounded-sm text-red-200 text-xs font-bold tracking-wider">
              ⚠️ MORE CIVILIANS THAN MAFIA REQUIRED
            </div>
          )}

          {/* Civiles automáticos */}
          {civilsNeeded > 0 && (
            <div className="mb-4 p-3 border border-noir-gold/30 bg-noir-gold/5 rounded-sm">
              <div className="text-xs font-bold text-noir-gold tracking-wider">
                👤 AUTO-ADDED: {civilsNeeded} CIVILIAN{civilsNeeded > 1 ? 'S' : ''}
              </div>
            </div>
          )}

          {/* Roles List */}
          <div className="space-y-3 mt-4">
            {Object.values(ROLES)
              .filter(r => r.id !== 'civil')
              .sort((a, b) => {
                const sideOrder = { mafia: 1, civil: 2, loco: 3 };
                return sideOrder[a.side] - sideOrder[b.side];
              })
              .map(role => (
                <RoleItem
                  key={role.id}
                  role={role}
                  count={selectedRoles[role.id] || 0}
                  onIncrement={() => onUpdateRole(role.id, (selectedRoles[role.id] || 0) + 1)}
                  onDecrement={() => onUpdateRole(role.id, Math.max(0, (selectedRoles[role.id] || 0) - 1))}
                  disabled={!isHost}
                  isMaxReached={assignedRoles >= totalPlayers}
                  canDecrement={(selectedRoles[role.id] || 0) > 0}
                />
              ))}
          </div>

          {!isHost && (
            <div className="text-center text-xs text-noir-smoke/40 font-bold mt-4 italic tracking-widest">
              WAITING FOR HOST CONFIGURATION...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Item individual de un rol
 */
const RoleItem = ({ role, count, onIncrement, onDecrement, disabled, isMaxReached, canDecrement }) => {
  return (
    <div className="flex items-center gap-3 p-3 border border-noir-gold/10 hover:border-noir-gold/30 transition-colors bg-black/20">
      <div className="text-2xl filter grayscale opacity-80">{role.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="font-serif font-bold text-noir-gold text-sm tracking-wider">{role.name}</div>
        <div className="text-xs text-noir-smoke/60 truncate font-sans">{role.description}</div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onDecrement}
          disabled={!canDecrement || disabled}
          className="w-8 h-8 flex items-center justify-center border border-noir-gold/30 text-noir-gold hover:bg-noir-gold hover:text-black transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <Minus size={14} />
        </button>
        <div className="w-8 text-center font-bold text-noir-gold text-lg font-serif">{count}</div>
        <button
          onClick={onIncrement}
          disabled={disabled || isMaxReached}
          className="w-8 h-8 flex items-center justify-center border border-noir-gold/30 text-noir-gold hover:bg-noir-gold hover:text-black transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
};

export default memo(RoleSelector);

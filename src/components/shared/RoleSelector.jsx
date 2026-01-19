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
        className="w-full flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-brand-beige/20 transition-all border-2 border-brand-wood shadow-[4px_4px_0px_0px_rgba(93,64,55,1)] active:translate-y-1 active:shadow-[2px_2px_0px_0px_rgba(93,64,55,1)]"
      >
        <div className="flex items-center gap-3">
          <div className="bg-brand-pastel-mint p-2 rounded-lg text-brand-wood">
            <Users size={20} />
          </div>
          <div className="text-left">
            <h2 className="text-lg font-bold text-brand-wood leading-tight">Roles</h2>
            <span className="text-xs text-brand-wood/70 font-bold uppercase tracking-wide">
              {assignedRoles}/{totalPlayers} asignados
              {civilsNeeded > 0 && ` (+${civilsNeeded} civiles)`}
            </span>
          </div>
        </div>
        {expanded ? <ChevronUp size={24} className="text-brand-wood" /> : <ChevronDown size={24} className="text-brand-wood" />}
      </button>

      {expanded && (
        <div className="mt-4 p-4 bg-brand-wood/5 rounded-2xl border-2 border-brand-wood/10 border-dashed">
          {/* Validación */}
          {!isValid && (
            <div className="mb-4 p-3 bg-red-100 border-2 border-red-500 rounded-xl text-red-800 text-sm font-bold">
              ⚠️ Debe haber más civiles que mafias con capacidad de voto
            </div>
          )}

          {/* Civiles automáticos */}
          {civilsNeeded > 0 && (
            <div className="mb-4 p-3 bg-blue-100 border-2 border-blue-300 rounded-xl">
              <div className="text-sm font-bold text-blue-800">
                👤 Se añadirá{civilsNeeded > 1 ? 'n' : ''}: {civilsNeeded} Civil{civilsNeeded > 1 ? 'es' : ''} normal{civilsNeeded > 1 ? 'es' : ''}
              </div>
            </div>
          )}

          {/* Roles List */}
          <div className="space-y-2 mt-4">
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
            <div className="text-center text-xs text-brand-wood/60 font-bold mt-3 italic">
              Solo el anfitrión puede configurar los roles
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
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-brand-wood/20">
      <div className="text-2xl">{role.emoji}</div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-brand-wood text-sm">{role.name}</div>
        <div className="text-xs text-brand-wood/60 truncate">{role.description}</div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onDecrement}
          disabled={!canDecrement || disabled}
          className="w-8 h-8 rounded-lg bg-brand-pastel-peach border-2 border-brand-wood text-brand-wood font-bold hover:brightness-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(93,64,55,1)] active:translate-y-0.5 active:shadow-none flex items-center justify-center"
        >
          <Minus size={16} />
        </button>
        <div className="w-8 text-center font-bold text-brand-wood">{count}</div>
        <button
          onClick={onIncrement}
          disabled={disabled || isMaxReached}
          className="w-8 h-8 rounded-lg bg-brand-pastel-mint border-2 border-brand-wood text-brand-wood font-bold hover:brightness-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[2px_2px_0px_0px_rgba(93,64,55,1)] active:translate-y-0.5 active:shadow-none flex items-center justify-center"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

export default memo(RoleSelector);

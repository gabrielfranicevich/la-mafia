import { memo, useState } from 'react';
import { Users, ChevronUp, ChevronDown, Plus, Minus, X } from '../Icons';
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
  const [activeRoleInfo, setActiveRoleInfo] = useState(null);

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
    <div className="mb-6 relative">
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
              {assignedRoles}/{totalPlayers} ASIGNADOS
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
              ⚠️ DEMASIADAS MAFIAS
            </div>
          )}

          {/* Civiles automáticos */}
          {civilsNeeded > 0 && (
            <div className="mb-4 p-3 border border-noir-gold/30 bg-noir-gold/5 rounded-sm">
              <div className="text-xs font-bold text-noir-gold tracking-wider">
                👤 SE AGREGA{civilsNeeded > 1 ? 'N' : ''}: {civilsNeeded} CIVIL{civilsNeeded > 1 ? 'ES' : ''}
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
                  onDecrement={() => onUpdateRole(role.id, Math.max(role.id === 'mafia' ? 1 : 0, (selectedRoles[role.id] || 0) - 1))}
                  disabled={!isHost}
                  isMaxReached={assignedRoles >= totalPlayers}
                  canDecrement={role.id === 'mafia' ? (selectedRoles[role.id] || 0) > 1 : (selectedRoles[role.id] || 0) > 0}
                  onShowInfo={() => setActiveRoleInfo(role)}
                />
              ))}
          </div>

          {!isHost && (
            <div className="text-center text-xs text-noir-smoke/40 font-bold mt-4 italic tracking-widest">
              ESPERANDO CONFIGURACIÓN...
            </div>
          )}
        </div>
      )}

      {/* Role Info Modal */}
      {activeRoleInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-medieval-parchment max-w-sm w-full rounded-xl border-2 border-noir-gold shadow-[0_0_30px_rgba(212,175,55,0.2)] p-6 relative">
            <button
              onClick={() => setActiveRoleInfo(null)}
              className="absolute top-4 right-4 text-noir-deep/50 hover:text-noir-deep transition-colors"
            >
              <X size={24} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="text-6xl mb-4 animate-bounce-slow">
                {activeRoleInfo.emoji}
              </div>
              <h3 className="text-2xl font-serif font-bold text-noir-deep mb-2 uppercase tracking-widest">
                {activeRoleInfo.name}
              </h3>
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 ${activeRoleInfo.side === 'mafia' ? 'bg-red-900/20 text-red-700' :
                activeRoleInfo.side === 'loco' ? 'bg-purple-900/20 text-purple-700' :
                  'bg-blue-900/20 text-blue-700'
                }`}>
                {activeRoleInfo.side}
              </div>
              <p className="text-noir-deep/80 font-medium leading-relaxed">
                {activeRoleInfo.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Item individual de un rol
 */
const RoleItem = ({ role, count, onIncrement, onDecrement, disabled, isMaxReached, canDecrement, onShowInfo }) => {
  return (
    <div className="flex items-center gap-3 p-3 border border-noir-gold/10 hover:border-noir-gold/30 transition-colors bg-black/20 group">
      <div
        onClick={onShowInfo}
        className="cursor-pointer flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
      >
        <div className="text-2xl filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
          {role.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-serif font-bold text-noir-gold text-sm tracking-wider flex items-center gap-2">
            {role.name}
            <span className="text-[10px] text-noir-gold/40 border border-noir-gold/20 px-1 rounded hover:bg-noir-gold/10">
              ?
            </span>
          </div>
        </div>
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

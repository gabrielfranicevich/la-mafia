import { useState } from 'react';
import RoleSelector from '../../shared/RoleSelector';

/**
 * Sección de configuración del juego en la sala de espera
 * Permite al host seleccionar los roles que estarán en el juego
 */
const GameSettingsSection = ({
  isHost,
  selectedRoles = {}, // { roleId: count }
  onUpdateRole,
  totalPlayers
}) => {
  const [rolesExpanded, setRolesExpanded] = useState(true); // Expandido por defecto

  return (
    <div className="mb-6">
      <RoleSelector
        selectedRoles={selectedRoles}
        onUpdateRole={onUpdateRole}
        totalPlayers={totalPlayers}
        expanded={rolesExpanded}
        setExpanded={setRolesExpanded}
        isHost={isHost}
      />
    </div>
  );
};

export default GameSettingsSection;

# Especificación de La Mafia

## Resumen del Juego
Simulación del juego de cartas "La Mafia" con roles variados y mecánicas específicas.  
Existen dos bandos principales: **Mafia** y **Civiles**, que compiten para eliminar al equipo contrario.

## Estructura Básica
- **Jugadores**: 4-15 participantes (1 narrador/app + jugadores activos)
- **Roles disponibles**: Se asignan desde la UI. Si hay menos roles que jugadores, se completan con "Civil normal"
- **Fases del juego**:
  - **Noche**: Roles especiales realizan acciones
  - **Día**: Todos debaten y votan para ejecutar a un jugador

## Sistema de Roles

### Bando: Civiles (no se conocen entre sí)
1. **Civil normal** - Solo debate y vota de día
2. **Policía** - Por noche, consulta si un jugador es Mafia (recibe respuesta sí/no)
3. **Médico** - por la noche, elige a un jugador:
   - **Protege**: si un jugador es eliminado, puede curarlo
   - **Cura mutilaciones**: si un jugador es mutilado, puede curarlo 
   - **Notas**:
     - Siempre que tenga alguno de estos efectos se curan todos (no solo uno de ellos) 
     - La cura puede aplicarse en la misma noche de la mutilación o en noches posteriores
   - **Regla especial**: Si dos médicos protegen al mismo jugador, este muere por "sobredosis"
4. **Trabajadora nocturna** 
   - Duración: El bloqueo afecta solo la noche actual
   - Mecánica: El jugador bloqueado no puede usar su habilidad nocturna esa ronda
   - Efecto en roles específicos:
      - Mafia/Justiciero: No pueden votar para matar
      - Médico: No puede proteger/curar
      - Policia: No puede investigar
      - Carnicero: No puede mutilar
      - Espejo: No puede intercambiar efectos
5. **Carnicero** - por la noche, corta una parte del cuerpo de un jugador (mano=no vota, lengua=no habla)
   - **Mutilación progresiva**:
      - Primera mutilación: Pierde función (voto o habla)
      - Segunda mutilación (sin cura médica): Muerte instantánea
   - **Cura**: El médico puede curar mutilaciones en cualquier momento
   - **Aliado**: Gana con los Civiles
   - **Detección**: Aparece como "malo" ante el Policía
   - **Regla especial**: Si un jugador es mutilado por segunda vez, muere (de no haber sido curado por el médico)
6. **Kamikaze** - Al morir por votación diurna, puede matar a otro jugador
7. **Justiciero** - Similar a la Mafia pero del lado Civiles (mata por noche, votación grupal)
8. **Espejo** - por la noche, elige a dos jugadores e intercambia los efectos nocturnos entre ellos (si a una persona la protegen, el efecto recae en la otra persona) (dura solo esa noche)
   - Funcionamiento clarificado:
     - El Espejo selecciona dos jugadores A y B
     - Cualquier efecto nocturno dirigido a A afecta a B, y viceversa
9. **Estudiante** - Comienza el juego sin poderes activos, pero elige un "maestro" (elige a un jugador en la primera noche). Si ese maestro es eliminado, el Estudiante asume sus funciones y hereda el rol de esa persona.
   - Primera noche: Elige un "maestro" (selecciona un jugador)
   - Si el maestro es eliminado: El Estudiante hereda su rol y poderes
   - Si el maestro sobrevive: El Estudiante permanece como Civil normal

### Bando: Mafia (se conocen entre sí)
1. **Mafia** - Por noche, votan grupalmente para matar a un jugador

### Bando: Neutral
1. **Loco** - Intenta ser ejecutado por votación diurna (todos los otros pierden automáticamente)
   - **Victoria individual**: Gana si es ejecutado de día
   - **Detección**: No aparece como "malo" ante el Policía

## Mecánicas

### Condiciones de Victoria
- **Mafia gana**: 
   - 1. Cuando no quedan civiles.
   - 2. Superioridad Numérica Directa
      - Cuando el número de mafias con capacidad de votar es mayor o igual al número de civiles con capacidad de votar.
      - Razón: Los civiles no pueden eliminar a la mafia durante la noche, y de día la votación sería empate o favorable a la mafia, eventualmente se cumpliría la condición 1. 
      - Excepciones que evitan esta victoria:
         - Justicieros: Pueden matar 1 mafia por noche.
         - Carniceros: Puede mutilar (quitar voto) o matar (doble mutilación) a mafias. 
         - Kamikaze: Si #kamikazes ≥ #mafias, podrían eliminar a todas las mafias al morir.
         - Loco: Si es ejecutado de día, gana él, no la mafia.
   - 3. Victoria Inminente (Post-Día)
      - La Mafia gana al finalizar el día (después de la votación) si se cumplen todas estas condiciones:
         - Queda exactamente 1 civil con capacidad de voto más que mafias con capacidad de voto.
         - No hay ningún rol activo que pueda prevenir que se cumpla la condición 2 después de la noche, estos roles son los de la condición 2 y los siguientes:
            - Médico: Puede proteger a alguien de morir
            - Trabajadora nocturna: Solo es relevante si hay #trabajadoras >= #mafias
               - Explicación: cada una puede bloquear a una mafia
      - Razón: se cumplira inminentemente la condición 2.

- **Civiles ganan**: Cuando eliminan a toda la Mafia
- **Estudiante gana**: Cuando gana el rol que tiene al final de la partida (si su maestro muere, el estudiante gana con las condiciones de su maestro, si no muere, gana con las condiciones de civil normal)
- **Loco gana**: Gana cuando es eliminado en la votación diurna

### Sistema de Asignación
1. App/Narrador asigna roles aleatoreos según especificaciones de la partida
2. Si cantidad de roles seleccionados < cantidad de jugadores: rellenar con Civiles normales
3. La Mafia conoce identidades de sus compañeros; Civiles no

### Resolución Nocturna
- Acciones simultáneas que se resuelven en orden lógico:
  1. Prostituta bloquea habilidad
  2. Médico protege
  3. Policía investiga
  4. Mafia/Justiciero mata
  5. Carnicero mutila
  6. Espejo intercambia efectos

## Turnos
- tienen un tiempo maximo para que el jugador pueda hacer su accion, las acciones no realizadas no se cuentan
- en modo online: todos los sucesos nocturnos son simultaneos, terminan cuando todos hayan terminado, o cuando se acabe el tiempo máximo
- en modo offline: los sucesos nocturnos se hacen en el orden de los jugadores, tienen un tiempo minimo para que no sea obvio quienes no hacen nada
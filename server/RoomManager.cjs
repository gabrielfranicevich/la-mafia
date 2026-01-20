/**
 * RoomManager - Centralizes room state management and broadcasting
 */
const { generateRoomCode, sanitizeName } = require('./utils.cjs');

class RoomManager {
  constructor(io) {
    this.io = io;
    this.rooms = {};
  }

  getRoom(roomId) {
    return this.rooms[roomId];
  }

  getAllRooms() {
    return Object.values(this.rooms);
  }

  getRoomsList() {
    return Object.values(this.rooms)
      .filter(r => !r.isPrivate)
      .map(r => ({
        id: r.id,
        name: r.roomName || r.players[0].name,
        players: r.players.length,
        maxPlayers: r.settings.players,
        type: r.settings.type,
        status: r.status
      }));
  }

  // Helper to safely serialize room data for clients
  getPublicRoomData(room) {
    if (!room) return null;
    return {
      id: room.id,
      hostId: room.hostId,
      hostPlayerId: room.hostPlayerId,
      players: room.players,
      roomName: room.roomName,
      gameData: room.gameData,
      status: room.status,
      creatorPublicIp: room.creatorPublicIp,
      creatorLocalIp: room.creatorLocalIp,
      isPrivate: room.isPrivate,
      settings: room.settings
    };
  }

  broadcastRoomList() {
    this.io.emit('roomList', this.getRoomsList());
  }

  broadcastRoomUpdate(roomId) {
    const room = this.rooms[roomId];
    if (room) this.io.to(roomId).emit('roomUpdated', this.getPublicRoomData(room));
  }

  emitToRoom(roomId, event, data) {
    this.io.to(roomId).emit(event, data);
  }

  // --- Room Lifecycle ---

  createRoom({ socket, playerName, playerId, roomName, settings, clientIp, localIp }) {
    const safeName = sanitizeName(playerName);
    const roomId = generateRoomCode();

    this.rooms[roomId] = {
      id: roomId,
      hostId: socket.id,
      hostPlayerId: playerId,
      players: [{ id: socket.id, playerId, name: safeName, score: 0 }],
      roomName: roomName || safeName,
      gameData: null,
      status: 'waiting',
      creatorPublicIp: clientIp,
      creatorLocalIp: localIp || null,
      contributedThemes: [],
      isPrivate: settings?.isPrivate || false,
      settings: {
        players: settings?.players !== undefined ? Number(settings.players) : 4,
        type: settings?.type || 'in_person',
        roles: settings?.roles || 'standard',
        turn_time: Number(settings?.turn_time) || 10,
        selectedThemes: ['básico']
      }
    };

    socket.join(roomId);
    socket.emit('roomCreated', this.getPublicRoomData(this.rooms[roomId]));
    this.broadcastRoomList();
    console.log(`Room ${roomId} created by ${socket.id} (${safeName})`);

    return this.rooms[roomId];
  }

  deleteRoom(roomId, reason = 'Room deleted') {
    if (this.rooms[roomId]) {
      delete this.rooms[roomId];
      console.log(`${reason}: ${roomId}`);
      this.broadcastRoomList();
    }
  }

  // --- Player Management ---

  joinRoom(socket, { roomId, playerName, playerId }) {
    const room = this.rooms[roomId.toUpperCase()];
    if (!room) {
      socket.emit('error', 'Room not found');
      return;
    }

    const existingPlayer = room.players.find(p => p.playerId === playerId);

    if (existingPlayer) {
      existingPlayer.id = socket.id;
      existingPlayer.connected = true;
      socket.join(room.id);
      socket.emit('roomJoined', this.getPublicRoomData(room));
      this.broadcastRoomUpdate(room.id);
      return;
    }

    if (room.settings.players !== 0 && room.players.length >= room.settings.players) {
      socket.emit('error', 'Room is full');
      return;
    }

    const safeName = sanitizeName(playerName);
    room.players.push({ id: socket.id, playerId, name: safeName, score: 0 });
    socket.join(room.id);

    socket.emit('roomJoined', room);
    this.broadcastRoomUpdate(room.id);
    this.broadcastRoomList();
    console.log(`${safeName} joined room ${roomId}`);
  }

  leaveRoom(socket, roomId, playerId) {
    const room = this.getRoom(roomId);
    if (!room) return;

    const playerIndex = room.players.findIndex(p => p.playerId === playerId || p.id === socket.id);
    if (playerIndex !== -1) {
      const player = room.players[playerIndex];
      const isHost = room.hostPlayerId === player.playerId || room.hostId === socket.id;

      if (isHost) {
        this.emitToRoom(roomId, 'roomClosed', { message: 'El anfitrión ha salido. La sala se ha cerrado.' });
        this.deleteRoom(roomId, 'Room deleted (host left)');
      } else {
        room.players.splice(playerIndex, 1);
        if (room.players.length === 0) {
          this.deleteRoom(roomId, 'Room deleted (empty)');
        } else {
          this.broadcastRoomUpdate(roomId);
        }
      }
      socket.leave(roomId);
      this.broadcastRoomList();
    }
  }
}

module.exports = RoomManager;

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { io, Socket as ClientSocket } from 'socket.io-client';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/shared/prisma/prisma.service';
import { RoomListResponse, RoomUpdateEvent } from '../src/modules/gateway/interfaces/room.interface';
import { RoomUpdateTypeEnum } from '../src/common/enums';
import { AddressInfo } from 'net';

/**
 * Socket.IO 事件等待輔助函式
 */
function waitForEvent<T>(socket: ClientSocket, event: string, timeout = 5000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for event "${event}"`));
    }, timeout);

    socket.once(event, (data: T) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

describe('Gateway & Room Management (e2e)', () => {
  let app: INestApplication;
  let port: number;
  let clientA: ClientSocket;
  let clientB: ClientSocket;

  const mockPrisma = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(0);

    const address = app.getHttpServer().address() as AddressInfo;
    port = address.port;
  });

  afterAll(async () => {
    if (clientA && clientA.connected) {
      clientA.disconnect();
    }
    if (clientB && clientB.connected) {
      clientB.disconnect();
    }
    await app.close();
  });

  beforeEach((done) => {
    let connectedCount = 0;
    const checkDone = () => {
      connectedCount += 1;
      if (connectedCount === 2) {
        done();
      }
    };

    clientA = io(`http://localhost:${port}`, {
      transports: ['websocket'],
      forceNew: true,
    });
    clientA.on('connect', checkDone);

    clientB = io(`http://localhost:${port}`, {
      transports: ['websocket'],
      forceNew: true,
    });
    clientB.on('connect', checkDone);
  });

  afterEach(() => {
    if (clientA && clientA.connected) {
      clientA.disconnect();
    }
    if (clientB && clientB.connected) {
      clientB.disconnect();
    }
  });

  it('1. should return empty rooms list initially via room:list', async () => {
    const responsePromise = waitForEvent<RoomListResponse>(clientA, 'room:list:response');
    clientA.emit('room:list');

    const res = await responsePromise;
    expect(res).toBeDefined();
    expect(res.rooms).toEqual([]);
  });

  it('2. should broadcast room-created when clientA joins a new room', async () => {
    const updatePromiseA = waitForEvent<RoomUpdateEvent>(clientA, 'room:update');
    const updatePromiseB = waitForEvent<RoomUpdateEvent>(clientB, 'room:update');

    clientA.emit('room:join', { roomId: 'room-alpha' });

    const [updateA, updateB] = await Promise.all([updatePromiseA, updatePromiseB]);

    expect(updateA.type).toBe(RoomUpdateTypeEnum.ROOM_CREATED);
    expect(updateA.room.roomId).toBe('room-alpha');
    expect(updateA.room.memberCount).toBe(1);

    expect(updateB.type).toBe(RoomUpdateTypeEnum.ROOM_CREATED);
    expect(updateB.room.roomId).toBe('room-alpha');
    expect(updateB.room.memberCount).toBe(1);
  });

  it('3. should broadcast room-updated when clientB joins the same room', async () => {
    // clientA joins first; both clients consume the initial room-created broadcast
    const initA = waitForEvent<RoomUpdateEvent>(clientA, 'room:update');
    const initB = waitForEvent<RoomUpdateEvent>(clientB, 'room:update');
    clientA.emit('room:join', { roomId: 'room-beta' });
    await Promise.all([initA, initB]);

    // clientB joins; both clients should now receive room-updated (memberCount = 2)
    const updatePromiseA = waitForEvent<RoomUpdateEvent>(clientA, 'room:update');
    const updatePromiseB = waitForEvent<RoomUpdateEvent>(clientB, 'room:update');

    clientB.emit('room:join', { roomId: 'room-beta' });

    const [updateA, updateB] = await Promise.all([updatePromiseA, updatePromiseB]);

    expect(updateA.type).toBe(RoomUpdateTypeEnum.ROOM_UPDATED);
    expect(updateA.room.roomId).toBe('room-beta');
    expect(updateA.room.memberCount).toBe(2);

    expect(updateB.type).toBe(RoomUpdateTypeEnum.ROOM_UPDATED);
    expect(updateB.room.roomId).toBe('room-beta');
    expect(updateB.room.memberCount).toBe(2);
  });

  it('4. should forward webrtc-signaling to peer in the same room', async () => {
    // Both join room-gamma
    const initA1 = waitForEvent<RoomUpdateEvent>(clientA, 'room:update');
    const initB1 = waitForEvent<RoomUpdateEvent>(clientB, 'room:update');
    clientA.emit('room:join', { roomId: 'room-gamma' });
    await Promise.all([initA1, initB1]);

    const initA2 = waitForEvent<RoomUpdateEvent>(clientA, 'room:update');
    const initB2 = waitForEvent<RoomUpdateEvent>(clientB, 'room:update');
    clientB.emit('room:join', { roomId: 'room-gamma' });
    await Promise.all([initA2, initB2]);

    // clientA sends signaling
    const signalPromiseB = waitForEvent<any>(clientB, 'webrtc-signaling');
    const signalPayload = {
      roomId: 'room-gamma',
      senderId: clientA.id,
      type: 'offer',
      payload: { sdp: 'fake-sdp-data' },
    };

    clientA.emit('webrtc-signaling', signalPayload);

    const receivedSignal = await signalPromiseB;
    expect(receivedSignal).toEqual(signalPayload);
  });

  it('5. should broadcast room-updated when a member leaves and room is not empty', async () => {
    // Both join room-delta
    const initA1 = waitForEvent<RoomUpdateEvent>(clientA, 'room:update');
    const initB1 = waitForEvent<RoomUpdateEvent>(clientB, 'room:update');
    clientA.emit('room:join', { roomId: 'room-delta' });
    await Promise.all([initA1, initB1]);

    const initA2 = waitForEvent<RoomUpdateEvent>(clientA, 'room:update');
    const initB2 = waitForEvent<RoomUpdateEvent>(clientB, 'room:update');
    clientB.emit('room:join', { roomId: 'room-delta' });
    await Promise.all([initA2, initB2]);

    // clientB leaves
    const leavePromiseA = waitForEvent<RoomUpdateEvent>(clientA, 'room:update');
    const leavePromiseB = waitForEvent<RoomUpdateEvent>(clientB, 'room:update');

    clientB.emit('room:leave', { roomId: 'room-delta' });

    const [leaveA, leaveB] = await Promise.all([leavePromiseA, leavePromiseB]);

    expect(leaveA.type).toBe(RoomUpdateTypeEnum.ROOM_UPDATED);
    expect(leaveA.room.roomId).toBe('room-delta');
    expect(leaveA.room.memberCount).toBe(1);

    expect(leaveB.type).toBe(RoomUpdateTypeEnum.ROOM_UPDATED);
    expect(leaveB.room.memberCount).toBe(1);
  });

  it('6. should broadcast room-removed when last member leaves', async () => {
    // clientA joins room-epsilon
    const initA = waitForEvent<RoomUpdateEvent>(clientA, 'room:update');
    const initB = waitForEvent<RoomUpdateEvent>(clientB, 'room:update');
    clientA.emit('room:join', { roomId: 'room-epsilon' });
    await Promise.all([initA, initB]);

    // clientA leaves
    const removePromiseB = waitForEvent<RoomUpdateEvent>(clientB, 'room:update');
    clientA.emit('room:leave', { roomId: 'room-epsilon' });

    const removeEvent = await removePromiseB;
    expect(removeEvent.type).toBe(RoomUpdateTypeEnum.ROOM_REMOVED);
    expect(removeEvent.room.roomId).toBe('room-epsilon');
    expect(removeEvent.room.memberCount).toBe(0);

    // Verify room:list no longer includes room-epsilon
    const listPromise = waitForEvent<RoomListResponse>(clientB, 'room:list:response');
    clientB.emit('room:list');
    const listRes = await listPromise;
    expect(listRes.rooms.some((r) => r.roomId === 'room-epsilon')).toBe(false);
  });
});

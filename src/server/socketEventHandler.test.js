const io = require('socket.io-client');

describe('socketEventHandler', () => {

  let socket;

  beforeAll((done) => {
    socket = io.connect('http://localhost:3001');
    socket.on('connect', function() {
      done();
    });
  });

  afterAll((done) => {
    if (socket.connected) {
      socket.disconnect();
    }
    done();
  });

  it('login', (done) => {
    socket.emit('login', 'user');
    socket.on('login', data => {
      expect(data).toBeTruthy();
      done();
    });
  });

  it('getRooms', (done) => {
    socket.emit('getRooms');
    socket.on('getRooms', (data) => {
      expect(data).toEqual(['수성', '금성', '지구']);
      done();
    });
  });

  it('joinRoom', (done) => {
    socket.emit('joinRoom', 'room');
    socket.on('joinSuccess', (data) => {
      expect(data).toBeUndefined();
      done();
    });
  });

  it('chat', (done) => {
    socket.emit('chat', {content: 'some words'});
    socket.on('chat', (data) => {
      expect(data.content).toBe('some words');
      done();
    });
  });

  it('getUserOnline', (done) => {
    socket.emit('getUserOnline');
    socket.on('getUserOnline', (data) => {
      expect(data).toEqual([]);
      done();
    });
  });

});
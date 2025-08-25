/* eslint-disable */
const request = require('supertest');

// Tokens provided by user
const ADMIN_TOKEN = 'XRqsHFed0TRTivHBNkJCJFnb3RE2';
const USER_TOKEN = 'JYX7mo7KsOZ1U2KrtJCvoPTCUtJ2';

// Prevent importing real FirebaseConfig (avoids Firestore and setInterval side-effects)
jest.mock('../public/javascripts/config/FirebaseConfig', () => ({
  db: {},
  authentications: { getUser: jest.fn() },
  storageBucket: { name: 'mock-bucket' },
  messaging: {},
  batchOperations: { batchWrite: jest.fn(), batchRead: jest.fn() },
  queryPerformanceMonitor: { startQuery: jest.fn(), endQuery: jest.fn() },
  getConnectionHealth: () => ({ healthy: true, lastCheck: Date.now() }),
}));

// Mock auth util to avoid real Firebase calls and control roles per token
jest.mock('../public/javascripts/util/AutenticationUtil', () => {
  return {
    getUserByUid: jest.fn((req) => {
      const auth = req.headers['authorization'];
      if (!auth) throw new Error('Authorization token is missing');
      const token = auth.split(' ')[1];
      if (token === ADMIN_TOKEN) {
        return Promise.resolve({
          email: 'admin@gmail.com',
          customClaims: { role: 'ADMIN' },
        });
      }
      if (token === USER_TOKEN) {
        return Promise.resolve({
          email: 'user@gmail.com',
          customClaims: { role: 'USER' },
        });
      }
      throw new Error('Invalid token');
    }),
  };
});

// Mock services used by routes to avoid DB dependencies
jest.mock('../public/javascripts/service/user/GetProfileCustomerService', () => ({
  getCustomer: jest.fn(async () => ({ ok: true, from: 'getCustomer' })),
}));

jest.mock('../public/javascripts/service/user/UserService', () => {
  return jest.fn().mockImplementation(() => ({
    getMentorReject: jest.fn(async () => ({ ok: true, from: 'getMentorReject' })),
  }));
});

jest.mock('../public/javascripts/service/user/GetAllMentorsService', () => ({
  getAllMentorsService: jest.fn(async () => ({ ok: true, list: [] })),
}));

jest.mock('../public/javascripts/service/syllabus/GetSyllabusService', () => ({
  getSyllabusByProjects: jest.fn(async () => ({ ok: true, list: [] })),
  getDetailSyllabus: jest.fn(async () => ({ ok: true, detail: {} })),
}));

jest.mock('../public/javascripts/service/syllabus/CreateNewSyllabusService', () => ({
  createNewSyllabus: jest.fn(async () => ({ ok: true })),
  updateSyllabus: jest.fn(async () => ({ ok: true })),
}));

// Import app AFTER mocks so routes use mocked implementations
const app = require('../app');

function withAuth(req, token) {
  return req.set('Authorization', `Bearer ${token}`);
}

describe('Role-based access control (functions)', () => {
  describe('GET /api/profile/get (USER only)', () => {
    test('401 when no token', async () => {
      const res = await request(app).get('/api/profile/get');
      expect([401, 403]).toContain(res.statusCode); // middleware returns 401 Unauthorized
      expect(res.body).toBeDefined();
    });

    test('200 for USER token', async () => {
      const res = await withAuth(request(app).get('/api/profile/get'), USER_TOKEN);
      expect(res.statusCode).toBe(200);
    });

    test('403 for ADMIN token', async () => {
      const res = await withAuth(request(app).get('/api/profile/get'), ADMIN_TOKEN);
      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/user/reject (ADMIN only)', () => {
    test('401 when no token', async () => {
      const res = await request(app).get('/api/user/reject');
      expect([401, 403]).toContain(res.statusCode);
    });

    test('403 for USER token', async () => {
      const res = await withAuth(request(app).get('/api/user/reject'), USER_TOKEN);
      expect(res.statusCode).toBe(403);
    });

    test('200 for ADMIN token', async () => {
      const res = await withAuth(request(app).get('/api/user/reject'), ADMIN_TOKEN);
      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET /api/mentors (USER, MENTOR, ADMIN)', () => {
    test('401 when no token', async () => {
      const res = await request(app).get('/api/mentors');
      expect([401, 403]).toContain(res.statusCode);
    });

    test('200 for USER token', async () => {
      const res = await withAuth(request(app).get('/api/mentors'), USER_TOKEN);
      expect(res.statusCode).toBe(200);
    });

    test('200 for ADMIN token', async () => {
      const res = await withAuth(request(app).get('/api/mentors'), ADMIN_TOKEN);
      expect(res.statusCode).toBe(200);
    });
  });

  describe('Syllabus endpoints', () => {
    test('GET /api/syllabus/:id - 401 when no token', async () => {
      const res = await request(app).get('/api/syllabus/abc123');
      expect([401, 403]).toContain(res.statusCode);
    });

    test('GET /api/syllabus/:id - 403 for USER token', async () => {
      const res = await withAuth(request(app).get('/api/syllabus/abc123'), USER_TOKEN);
      expect(res.statusCode).toBe(403);
    });

    test('GET /api/syllabus/:id - 200 for ADMIN token', async () => {
      const res = await withAuth(request(app).get('/api/syllabus/abc123'), ADMIN_TOKEN);
      expect(res.statusCode).toBe(200);
    });

    test('POST /api/syllabus/new/:id - 401 when no token', async () => {
      const res = await request(app).post('/api/syllabus/new/abc123').send({ any: 'payload' });
      expect([401, 403]).toContain(res.statusCode);
    });

    test('POST /api/syllabus/new/:id - 403 for USER token', async () => {
      const res = await withAuth(request(app).post('/api/syllabus/new/abc123').send({ any: 'payload' }), USER_TOKEN);
      expect(res.statusCode).toBe(403);
    });

    test('POST /api/syllabus/new/:id - 403 for ADMIN token', async () => {
      const res = await withAuth(request(app).post('/api/syllabus/new/abc123').send({ any: 'payload' }), ADMIN_TOKEN);
      expect(res.statusCode).toBe(403);
    });
  });
});

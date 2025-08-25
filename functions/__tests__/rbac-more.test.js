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

// ---- Service Mocks (return minimal successful payloads) ----

// Activity
jest.mock('../public/javascripts/service/activity/GetActivityService', () => ({
  getMyActivity: jest.fn(async () => ({ ok: true })),
}));
jest.mock('../public/javascripts/service/activity/UploadActivityService', () => ({
  uploadActivity: jest.fn(async () => ({ ok: true })),
}));
jest.mock('../public/javascripts/service/activity/ActivityService', () => {
  return jest.fn().mockImplementation(() => ({
    getActivitiForReport: jest.fn(async () => ({ ok: true })),
    doReport: jest.fn(async () => ({ ok: true })),
  }));
});

// Category
jest.mock('../public/javascripts/service/category/CategoryService', () => ({
  createCategory: jest.fn(async () => ({ ok: true })),
}));
jest.mock('../public/javascripts/service/category/CategoryServices', () => {
  return jest.fn().mockImplementation(() => ({
    getAllCategories: jest.fn(async () => ({ ok: true, list: [] })),
  }));
});

// Voucher
jest.mock('../public/javascripts/service/voucher/CreateVoucherService', () => ({
  createVoucher: jest.fn(async () => ({ ok: true })),
}));
jest.mock('../public/javascripts/service/voucher/GetVoucherActive', () => ({
  listVoucherActive: jest.fn(async () => ({ ok: true, list: [] })),
}));
jest.mock('../public/javascripts/service/voucher/DeleteVoucherService', () => ({
  deleteVouchers: jest.fn(async () => ({ ok: true })),
}));
jest.mock('../public/javascripts/service/voucher/UpdateVoucherService', () => ({
  updateVouchers: jest.fn(async () => ({ ok: true })),
}));
jest.mock('../public/javascripts/service/voucher/ClaimVoucherService', () => ({
  claimVoucher: jest.fn(async () => ({ ok: true })),
}));
jest.mock('../public/javascripts/service/voucher/GetUserVouchersService', () => ({
  getUserVouchers: jest.fn(async () => ({ ok: true, list: [] })),
  getAvailableUserVouchersForPayment: jest.fn(async () => ({ ok: true, list: [] })),
}));
jest.mock('../public/javascripts/service/voucher/GetAvailableVouchersService', () => ({
  getAvailableVouchersToClaim: jest.fn(async () => ({ ok: true, list: [] })),
}));
jest.mock('../public/javascripts/service/voucher/ClaimVoucherByCodeService', () => ({
  claimVoucherByCode: jest.fn(async () => ({ code: 200, ok: true })),
}));

// Project
jest.mock('../public/javascripts/service/project/ProjectServiceService', () => ({
  createProject: jest.fn(async () => ({ ok: true })),
}));
jest.mock('../public/javascripts/service/project/ProjectDescriptionInLearningPathService', () => ({
  getDescriptionInLearningPath: jest.fn(async () => ({ ok: true })),
}));
jest.mock('../public/javascripts/service/project/UpdateProjectService', () => ({
  updateProject: jest.fn(async () => ({ ok: true })),
}));
jest.mock('../public/javascripts/service/project/DeleteProjectSerivce', () => ({
  deleteProjectService: jest.fn(async () => ({ ok: true })),
}));
jest.mock('../public/javascripts/service/project/GetProjectPending', () => ({
  getProjectPendings: jest.fn(async () => ({ ok: true, list: [] })),
}));
jest.mock('../public/javascripts/service/project/AccptedProject', () => ({
  acceptedProject: jest.fn(async () => ({ ok: true })),
}));
jest.mock('../public/javascripts/service/project/GetAllProject', () => ({
  getAllProjectService: jest.fn(async () => ({ ok: true, list: [] })),
}));
jest.mock('../public/javascripts/service/project/ProjectService', () => {
  return jest.fn().mockImplementation(() => ({
    getLearningAccepted: jest.fn(async () => ({ ok: true })),
    getProjectRejected: jest.fn(async () => ({ ok: true })),
    getProjectPendingByMentor: jest.fn(async () => ({ ok: true })),
    getProjectRejectedForMentor: jest.fn(async () => ({ ok: true })),
  }));
});

// Learning
jest.mock('../public/javascripts/service/learning/GetLerningUser', () => ({
  getLearningsUser: jest.fn(async () => ({ ok: true })),
  getAllLearningsForAdmin: jest.fn(async () => ({ ok: true })),
}));
jest.mock('../public/javascripts/service/learning/GetProjectByCustomers', () => {
  return jest.fn().mockImplementation(() => ({
    getLearning: jest.fn(async () => ({ ok: true })),
    getLearningComplete: jest.fn(async () => ({ ok: true })),
  }));
});
jest.mock('../public/javascripts/service/learning/GetProjectByAdmin', () => {
  return jest.fn().mockImplementation(() => ({
    getAllLearning: jest.fn(async () => ({ ok: true })),
  }));
});
jest.mock('../public/javascripts/service/learning/LearningCompletionService', () => {
  return jest.fn().mockImplementation(() => ({
    completeLearningProcess: jest.fn(async () => ({ ok: true })),
  }));
});

// Consultation
jest.mock('../public/javascripts/service/Consultation/ConsultationService', () => ({
  createConsultation: jest.fn(async () => ({ code: 200, ok: true })),
  getAvailableConsultations: jest.fn(async () => ({ code: 200, ok: true })),
  acceptConsultation: jest.fn(async () => ({ code: 200, ok: true })),
  rejectConsultation: jest.fn(async () => ({ code: 200, ok: true })),
  completeConsultation: jest.fn(async () => ({ code: 200, ok: true })),
}));
jest.mock('../public/javascripts/service/chat/ChatService', () => ({
  getConsultationMessages: jest.fn(async () => ([])),
}));

// Survey
jest.mock('../public/javascripts/service/survey/CreateSurveyService', () => {
  return jest.fn().mockImplementation(() => ({
    createSurvey: jest.fn(async () => ({ code: 200, ok: true })),
  }));
});
jest.mock('../public/javascripts/service/survey/GetSurveysService', () => {
  return jest.fn().mockImplementation(() => ({
    getAllSurveys: jest.fn(async () => ({ code: 200, ok: true })),
    getSurveyById: jest.fn(async () => ({ code: 200, ok: true })),
  }));
});
jest.mock('../public/javascripts/service/survey/SubmitSurveyResponseService', () => {
  return jest.fn().mockImplementation(() => ({
    submitSurveyResponse: jest.fn(async () => ({ code: 200, ok: true })),
  }));
});
jest.mock('../public/javascripts/service/survey/GetSurveyTrackingService', () => {
  return jest.fn().mockImplementation(() => ({
    getSurveyTracking: jest.fn(async () => ({ code: 200, ok: true })),
    getAllSurveyTracking: jest.fn(async () => ({ code: 200, ok: true })),
  }));
});
jest.mock('../public/javascripts/service/survey/GetMentorSurveyResponsesService', () => {
  return jest.fn().mockImplementation(() => ({
    getAvailableSurveysForMentor: jest.fn(async () => ({ code: 200, ok: true })),
    getMentorSurveyResponses: jest.fn(async () => ({ code: 200, ok: true })),
  }));
});

// TopUp
jest.mock('../public/javascripts/service/topup/TopUpService', () => ({
  createTopUpTransaction: jest.fn(async () => ({ ok: true })),
}));
jest.mock('../public/javascripts/service/topup/ToUpNotificationService', () => ({
  handlePaymentNotification: jest.fn(async () => ({ code: 200, ok: true })),
}));
jest.mock('../public/javascripts/service/topup/GetHistoryTopUpService', () => ({
  getHistoryTopUpService: jest.fn(async () => ({ ok: true })),
}));

// Transaction
jest.mock('../public/javascripts/service/transaction/TransactionService', () => ({
  newTransaction: jest.fn(async () => ({ ok: true })),
}));
jest.mock('../public/javascripts/service/user/GetHistoryTransactionLearningService', () => ({
  getHistoryTransactionService: jest.fn(async () => ({ ok: true })),
}));
jest.mock('../public/javascripts/service/transaction/GetProjectPraTransaction', () => ({
  getProjectPraTransaction: jest.fn(async () => ({ ok: true })),
}));
jest.mock('../public/javascripts/service/transaction/TransactionNotificationService', () => ({
  notificationService: jest.fn(async () => ({ ok: true })),
}));
jest.mock('../public/javascripts/service/transaction/WithdrawalService', () => {
  return jest.fn().mockImplementation(() => ({
    doChangeCoin: jest.fn(async () => ({ ok: true })),
    doChangeMoney: jest.fn(async () => ({ ok: true })),
    getTransaction: jest.fn(async () => ({ ok: true })),
    getAllTransactionAdmin: jest.fn(async () => ({ ok: true })),
    updateStatusByAdmin: jest.fn(async () => ({ code: 200, ok: true })),
  }));
});

// Import app AFTER mocks so routes use mocked implementations
const app = require('../app');

function withAuth(req, token) {
  return req.set('Authorization', `Bearer ${token}`);
}

describe('RBAC thorough tests (USER and ADMIN) in functions', () => {
  // ActivityRouter
  describe('ActivityRouter', () => {
    test('GET /api/my/activity/:id - USER 200, ADMIN 200, no token 401', async () => {
      const no = await request(app).get('/api/my/activity/123');
      expect([401, 403]).toContain(no.statusCode);
      const user = await withAuth(request(app).get('/api/my/activity/123'), USER_TOKEN);
      expect(user.statusCode).toBe(200);
      const admin = await withAuth(request(app).get('/api/my/activity/123'), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(200);
    });

    test('POST /api/my/activity/upload/:id - USER 200, ADMIN 403', async () => {
      const user = await withAuth(request(app).post('/api/my/activity/upload/123').send({ any: 'data' }), USER_TOKEN);
      expect(user.statusCode).toBe(200);
      const admin = await withAuth(request(app).post('/api/my/activity/upload/123').send({ any: 'data' }), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(403);
    });

    test('GET /api/activity/:id - ADMIN 200, USER 403', async () => {
      const admin = await withAuth(request(app).get('/api/activity/123'), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(200);
      const user = await withAuth(request(app).get('/api/activity/123'), USER_TOKEN);
      expect(user.statusCode).toBe(403);
    });

    test('PUT /api/report/:id - ADMIN 403, USER 403', async () => {
      const admin = await withAuth(request(app).put('/api/report/123').send({}), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(403);
      const user = await withAuth(request(app).put('/api/report/123').send({}), USER_TOKEN);
      expect(user.statusCode).toBe(403);
    });
  });

  // CategoryRouter
  describe('CategoryRouter', () => {
    test('POST /api/categories/new - ADMIN 200, USER 403, no token 401', async () => {
      const admin = await withAuth(request(app).post('/api/categories/new').send({ name: 'Cat' }), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(200);
      const user = await withAuth(request(app).post('/api/categories/new').send({ name: 'Cat' }), USER_TOKEN);
      expect(user.statusCode).toBe(403);
      const no = await request(app).post('/api/categories/new').send({ name: 'Cat' });
      expect([401, 403]).toContain(no.statusCode);
    });

    test('GET /api/categories - USER 200, ADMIN 200, no token 401', async () => {
      const user = await withAuth(request(app).get('/api/categories'), USER_TOKEN);
      expect(user.statusCode).toBe(200);
      const admin = await withAuth(request(app).get('/api/categories'), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(200);
      const no = await request(app).get('/api/categories');
      expect([401, 403]).toContain(no.statusCode);
    });
  });

  // VoucherRouter
  describe('VoucherRouter', () => {
    test('POST /api/voucher/created - ADMIN 200, USER 403', async () => {
      const admin = await withAuth(request(app).post('/api/voucher/created').send({}), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(200);
      const user = await withAuth(request(app).post('/api/voucher/created').send({}), USER_TOKEN);
      expect(user.statusCode).toBe(403);
    });

    test('GET /api/voucher/get - ADMIN 200, USER 200, no token 401', async () => {
      const admin = await withAuth(request(app).get('/api/voucher/get'), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(200);
      const user = await withAuth(request(app).get('/api/voucher/get'), USER_TOKEN);
      expect(user.statusCode).toBe(200);
      const no = await request(app).get('/api/voucher/get');
      expect([401, 403]).toContain(no.statusCode);
    });

    test('DELETE /api/voucher/delete/:id - ADMIN 200, USER 403', async () => {
      const admin = await withAuth(request(app).delete('/api/voucher/delete/1'), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(200);
      const user = await withAuth(request(app).delete('/api/voucher/delete/1'), USER_TOKEN);
      expect(user.statusCode).toBe(403);
    });
  });

  // ProjectRouter
  describe('ProjectRouter', () => {
    test('POST /api/project/new - ADMIN 403, USER 403', async () => {
      const admin = await withAuth(request(app).post('/api/project/new').send({}), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(403);
      const user = await withAuth(request(app).post('/api/project/new').send({}), USER_TOKEN);
      expect(user.statusCode).toBe(403);
    });

    test('GET /api/learn/project/:id - USER 200, ADMIN 403', async () => {
      const user = await withAuth(request(app).get('/api/learn/project/abc'), USER_TOKEN);
      expect(user.statusCode).toBe(200);
      const admin = await withAuth(request(app).get('/api/learn/project/abc'), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(403);
    });

    test('GET /api/project/pending - ADMIN 200, USER 403', async () => {
      const admin = await withAuth(request(app).get('/api/project/pending'), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(200);
      const user = await withAuth(request(app).get('/api/project/pending'), USER_TOKEN);
      expect(user.statusCode).toBe(403);
    });

    test('GET /api/project/all - public 200', async () => {
      const res = await request(app).get('/api/project/all');
      expect(res.statusCode).toBe(200);
    });
  });

  // LearningRouter
  describe('LearningRouter', () => {
    test('GET /api/my/learning - USER 200, ADMIN 403', async () => {
      const user = await withAuth(request(app).get('/api/my/learning'), USER_TOKEN);
      expect(user.statusCode).toBe(200);
      const admin = await withAuth(request(app).get('/api/my/learning'), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(403);
    });

    test('GET /api/admin/learning - ADMIN 200, USER 403', async () => {
      const admin = await withAuth(request(app).get('/api/admin/learning'), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(200);
      const user = await withAuth(request(app).get('/api/admin/learning'), USER_TOKEN);
      expect(user.statusCode).toBe(403);
    });

    test('POST /api/learning/:id/complete - USER 200, ADMIN 403', async () => {
      const user = await withAuth(request(app).post('/api/learning/xyz/complete'), USER_TOKEN);
      expect(user.statusCode).toBe(200);
      const admin = await withAuth(request(app).post('/api/learning/xyz/complete'), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(403);
    });
  });

  // ConsultationRoutes
  describe('ConsultationRoutes', () => {
    test('POST /api/consultation/create - USER 200, ADMIN 403, no token 401', async () => {
      const user = await withAuth(request(app).post('/api/consultation/create').send({}), USER_TOKEN);
      expect(user.statusCode).toBe(200);
      const admin = await withAuth(request(app).post('/api/consultation/create').send({}), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(403);
      const no = await request(app).post('/api/consultation/create').send({});
      expect([401, 403]).toContain(no.statusCode);
    });

    test('GET /api/consultation/available - ADMIN 403, USER 403', async () => {
      const admin = await withAuth(request(app).get('/api/consultation/available'), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(403);
      const user = await withAuth(request(app).get('/api/consultation/available'), USER_TOKEN);
      expect(user.statusCode).toBe(403);
    });
  });

  // SurveyRouter
  describe('SurveyRouter', () => {
    test('GET /api/admin/surveys - ADMIN 200, USER 403', async () => {
      const admin = await withAuth(request(app).get('/api/admin/surveys'), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(200);
      const user = await withAuth(request(app).get('/api/admin/surveys'), USER_TOKEN);
      expect(user.statusCode).toBe(403);
    });

    test('GET /api/mentor/surveys - USER 403, ADMIN 403', async () => {
      const user = await withAuth(request(app).get('/api/mentor/surveys'), USER_TOKEN);
      expect(user.statusCode).toBe(403);
      const admin = await withAuth(request(app).get('/api/mentor/surveys'), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(403);
    });

    test('GET /api/survey/:id - ADMIN 200, USER 403', async () => {
      const admin = await withAuth(request(app).get('/api/survey/abc'), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(200);
      const user = await withAuth(request(app).get('/api/survey/abc'), USER_TOKEN);
      expect(user.statusCode).toBe(403);
    });
  });

  // TopUpRoutes
  describe('TopUpRoutes', () => {
    test('POST /api/coin/topUp - USER 200, ADMIN 403, no token 401', async () => {
      const user = await withAuth(request(app).post('/api/coin/topUp').send({ amount: 10000 }), USER_TOKEN);
      expect(user.statusCode).toBe(200);
      const admin = await withAuth(request(app).post('/api/coin/topUp').send({ amount: 10000 }), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(403);
      const no = await request(app).post('/api/coin/topUp').send({ amount: 10000 });
      expect([401, 403]).toContain(no.statusCode);
    });

    test('POST /api/topup/notification - public 200', async () => {
      const res = await request(app).post('/api/topup/notification').send({ any: 'payload' });
      expect(res.statusCode).toBe(200);
    });

    test('GET /api/coin/get - public 200', async () => {
      const res = await request(app).get('/api/coin/get');
      expect(res.statusCode).toBe(200);
    });
  });

  // TransactionRouter
  describe('TransactionRouter', () => {
    test('POST /api/payment/:id - USER 200, ADMIN 403', async () => {
      const user = await withAuth(request(app).post('/api/payment/proj1').send({}), USER_TOKEN);
      expect(user.statusCode).toBe(200);
      const admin = await withAuth(request(app).post('/api/payment/proj1').send({}), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(403);
    });

    test('GET /api/pay/:id - USER 200, ADMIN 403', async () => {
      const user = await withAuth(request(app).get('/api/pay/proj1'), USER_TOKEN);
      expect(user.statusCode).toBe(200);
      const admin = await withAuth(request(app).get('/api/pay/proj1'), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(403);
    });

    test('GET /api/admin/history/transaction - ADMIN 200, USER 403', async () => {
      const admin = await withAuth(request(app).get('/api/admin/history/transaction'), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(200);
      const user = await withAuth(request(app).get('/api/admin/history/transaction'), USER_TOKEN);
      expect(user.statusCode).toBe(403);
    });
  });

  // ChatRouter
  describe('ChatRouter', () => {
    test('POST /api/chat - USER 200, ADMIN 200, no token 401', async () => {
      const user = await withAuth(request(app).post('/api/chat').send({ text: 'hi' }), USER_TOKEN);
      expect(user.statusCode).toBe(200);
      const admin = await withAuth(request(app).post('/api/chat').send({ text: 'hi' }), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(200);
      const no = await request(app).post('/api/chat').send({ text: 'hi' });
      expect([401, 403]).toContain(no.statusCode);
    });

    test('GET /api/chat - USER 200, ADMIN 200, no token 401', async () => {
      const user = await withAuth(request(app).get('/api/chat'), USER_TOKEN);
      expect(user.statusCode).toBe(200);
      const admin = await withAuth(request(app).get('/api/chat'), ADMIN_TOKEN);
      expect(admin.statusCode).toBe(200);
      const no = await request(app).get('/api/chat');
      expect([401, 403]).toContain(no.statusCode);
    });
  });
});

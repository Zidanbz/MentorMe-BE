const express = require("express");
const router = express.Router();

const {
  getLearningsUser,
  getAllLearningsForAdmin,
} = require("../public/javascripts/service/learning/GetLerningUser");
const {
  authorizeRole,
} = require("../public/javascripts/config/SecurityConfig");
const GetProjectByCustomers = require("../public/javascripts/service/learning/GetProjectByCustomers");
const GetProjectByAdmin = require("../public/javascripts/service/learning/GetProjectByAdmin");
const LearningCompletionService = require("../public/javascripts/service/learning/LearningCompletionService");

/* GET home page. */
router.get(
  "/api/my/learning",
  authorizeRole("USER"),
  async function(req, res, next) {
    res.send(await getLearningsUser(req));
  },
);

router.get(
  "/api/admin/learning",
  authorizeRole("ADMIN"),
  async function(req, res, next) {
    res.send(await getAllLearningsForAdmin(req));
  },
);

router.get(
  "/api/project/buy",
  authorizeRole("MENTOR"),
  async function(req, res, next) {
    const object = new GetProjectByCustomers();
    const response = await object.getLearning(req);
    res.send(response);
  },
);

router.get(
  "/api/admin/project/buy",
  authorizeRole("ADMIN"),
  async(req, res, next) => {
    const handler = new GetProjectByAdmin();
    const response = await handler.getAllLearning(req);
    res.send(response);
  },
);

router.get(
  "/api/project/completed",
  authorizeRole("MENTOR"),
  async function(req, res, next) {
    const object = new GetProjectByCustomers();
    const response = await object.getLearningComplete(req);
    res.send(response);
  },
);

// --- RUTE BARU YANG DITAMBAHKAN ---
// Endpoint ini akan dipanggil oleh tombol "Selesaikan Pembelajaran"
router.post(
  "/api/learning/:id/complete",
  authorizeRole("USER"),
  async function(req, res, next) {
    const service = new LearningCompletionService();
    // Memanggil fungsi dari service baru dengan ID dari parameter URL
    const response = await service.completeLearningProcess(req.params.id);
    res.send(response);
  },
);

module.exports = router;

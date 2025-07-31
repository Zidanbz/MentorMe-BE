const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");
const ActivityRepo = require("../../repo/ActivityRepo");
const LearningRepo = require("../../repo/LearningRepo");
const MentorRepo = require("../../repo/MentorRepo");
const ProjectRepo = require("../../repo/ProjectRepo"); // Pastikan file dan path ini ada

class LearningCompletionService {
  /**
   * Memproses logika penyelesaian kelas oleh murid.
   * Ini mencakup verifikasi, pembaruan status, dan distribusi pendapatan ke mentor.
   * @param {string} learningId - ID unik dari pendaftaran (learning).
   */
  async completeLearningProcess(learningId) {
    try {
      // 1. Dapatkan detail pendaftaran (learning) untuk pengecekan awal
      const learningData = await LearningRepo.getLearningById(learningId);
      if (!learningData || learningData.length === 0) {
        throw new Error("Data pembelajaran tidak ditemukan.");
      }
      const learning = learningData[0];

      // 2. Cek apakah pembelajaran sudah pernah diselesaikan
      const isAlreadyCompleted =
        learning.progress === true || learning.progress === "true";
      if (isAlreadyCompleted) {
        return new APIResponse(
          HttpStatus.BAD_REQUEST.code,
          "Pembelajaran ini sudah pernah diselesaikan sebelumnya.",
          null,
          HttpStatus.BAD_REQUEST.message,
        );
      }

      // 3. Verifikasi apakah semua tugas sudah selesai
      const allTasksCompleted = await ActivityRepo.checkAllActivitiesComplete(
        learningId,
      );
      if (!allTasksCompleted) {
        throw new Error(
          "Gagal menyelesaikan. Pastikan semua tugas telah dikerjakan.",
        );
      }

      // 4. Dapatkan detail proyek untuk mengambil harga dan email mentor
      const projectId = learning.project;
      const projectData = await ProjectRepo.getProjectById(projectId);
      if (!projectData) {
        throw new Error("Detail proyek tidak ditemukan.");
      }
      const mentorEmail = projectData.mentor;
      const coursePrice = projectData.price;

      // 5. Hitung pendapatan untuk mentor
      // Misalnya, jika Anda ingin memberikan 80% dari harga kursus kepada mentor.
      // Anda bisa menyesuaikan logika perhitungan ini sesuai kebijakan bisnis Anda.
      const mentorEarnings = coursePrice * 0.8; // 80% untuk mentor

      // 6. Tambahkan pendapatan ke saldo mentor
      await MentorRepo.addEarningsToMentor(mentorEmail, mentorEarnings);

      // 7. Perbarui status progress pembelajaran menjadi selesai
      await LearningRepo.updateLearningProgress(learningId, true);

      // 8. Berikan respons sukses
      return new APIResponse(
        HttpStatus.OK.code,
        null,
        "Pembelajaran berhasil diselesaikan. Pendapatan telah ditambahkan ke mentor.",
        HttpStatus.OK.message,
      );
    }catch (error) {
      // Tangani error dan berikan respons yang sesuai
      return new APIResponse(
        HttpStatus.BAD_REQUEST.code,
        error.message,
        null,
        HttpStatus.BAD_REQUEST.message,
      );
    }
  }
}

module.exports = LearningCompletionService;

const multer = require('multer');
const path = require('path');
const fs = require('fs');

function getFilePicture(filename){
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname, "../../images", filename);
        fs.access(filePath, fs.constants.F_OK, err => {
            if (err) {
                return reject(new Error(err.message));
            }
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    return reject(new Error(err.message));
                }
                resolve(data.toString("base64"));
            });
        });
    });
}

function configureMulter({
                             fileSizeLimit = 5 * 1024 * 1024,
                             allowedMimeTypes =
                             ["image/jpeg", "image/png", "image/gif", "application/pdf"] }
                         = {}) {
    return multer({
        storage: multer.memoryStorage(), // File disimpan dalam memori (buffer)
        limits: { fileSize: fileSizeLimit }, // Batas ukuran file
        fileFilter: (req, file, cb) => {
            if (allowedMimeTypes.includes(file.mimetype)) {
                cb(null, true); // Terima file
            }else {
                cb(new Error(`Invalid file type. Allowed types: ${allowedMimeTypes.join(", ")}`), false); // Tolak file
            }
        },
    });
}

// Fungsi utama untuk menangani file upload dan mengembalikan file serta data body
function handleFileAndBodyUpload(req) {
    return new Promise((resolve, reject) => {
        // Memanggil multer untuk menangani upload file
        const upload = configureMulter({
            fileSizeLimit: 10 * 1024 * 1024, // Contoh batas ukuran 10MB
            allowedMimeTypes: ["image/jpeg", "image/png", "application/pdf"], // Contoh hanya menerima JPEG dan PNG
        });
        upload.single("picture")(req, null, err => {
            if (err) {
                return reject(err);
            }
            if (!req.file) {
                return reject(new Error("No file uploaded"));
            }
            const tempFile = req.file;
            const data = req.body; // Menyimpan data teks
            // Mengembalikan file dan body data
            resolve({ tempFile, data });
        });
    });
}

function saveFilePicture(file){
    return new Promise((resolve, reject) => {
        const originalFileName = file.originalname;
        const uniqName =
            Date.now() + "-" + Math.round(Math.random() * 1E9) + "-" + path.extname(originalFileName);
        const uploadPath = path.join(__dirname, "../../images", uniqName);

        fs.writeFile(uploadPath, file.buffer, err => {
            if (err) {
                return reject(new Error(err.message));
            }else {
                // Mengembalikan nama file yang telah disimpan
                resolve(uniqName);
            }
        });
    })
}

function deletePictureByName(filename) {
    const filePath = path.join(__dirname, "../../images", filename);
    return new Promise((resolve, reject) => {
        fs.access(filePath, fs.constants.F_OK, err => {
            if (err) {
                return reject(false);
            }
            fs.unlink(filePath, err => {
                if (err) {
                    return reject(false);
                }
                resolve(true);
            });
        });
    });
}

function saveFiles(file) {
    return new Promise((resolve, reject) => {
        const originalFileName = file.originalname;
        const fileExtension = path.extname(originalFileName).toLowerCase(); // Ekstensi file dalam huruf kecil
        let targetDir;
        // Pengkondisian direktori berdasarkan tipe file
        if (fileExtension === ".pdf") {
            targetDir = "../../documents"; // Direktori untuk file PDF
        }else if ([".jpg", ".jpeg", ".png"].includes(fileExtension)) {
            targetDir = "../../images"; // Direktori untuk file gambar
        }else {
            return reject(new Error("Unsupported file type")); // Menolak file selain yang diperbolehkan
        }
        // Nama file unik
        const uniqName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1e9) +
            fileExtension;

        // Lokasi penyimpanan lengkap
        const uploadPath = path.join(__dirname, targetDir, uniqName);

        // Menyimpan file
        fs.writeFile(uploadPath, file.buffer, err => {
            if (err) {
                return reject(new Error(err.message));
            }
            resolve({ fileName: uniqName, filePath: uploadPath }); // Mengembalikan nama dan path file yang disimpan
        });
    });
}

function handleMultipleFilesAndBodyUpload(req) {
    return new Promise((resolve, reject) => {
        const upload = configureMulter({});
        upload.any()(req, null, err => {
            if (err) {
                return reject(new Error(err.message));
            }
            const files = [];
            if (req.files){
                req.files.forEach(file => {
                    files.push(file);
                });
            }
            const body = req.body;
            resolve({files, body});
        })
    });
}

function handleMultipleFilesAndBodyUploadUpdate(req){
    return new Promise((resolve, reject) => {
       const upload = configureMulter({});
        const paths = path.join(__dirname, "../../images");

       upload.any()(req, null, err => {
           if (err) {
               return reject(new Error(err.message));
           }

           let isPictureChange = false;
           let picture = null;
           const body = req.body;

           if (req.files && req.files.length > 0) {
               req.files.forEach(file => {
                   if (file.fieldname === 'picture') {
                       const filePath = path.join(paths, file.originalname);

                       if (!fs.existsSync(filePath)) {
                           isPictureChange = true;
                           picture = file;
                       }
                   }
               });
           }
           if (isPictureChange){
               return resolve({picture, isPictureChange, body});
           }else {
               return resolve({isPictureChange, body});
           }
       });
    });
}

module.exports = {
    getFile: getFilePicture,
    deletePictureByName,
    handleFileAndBodyUpload,
    saveFile: saveFilePicture,
    handleMultipleFilesAndBodyUpload,
    saveFiles,
    handleMultipleFilesAndBodyUploadUpdate,
}
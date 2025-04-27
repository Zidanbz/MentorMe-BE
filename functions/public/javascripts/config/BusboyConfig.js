const path = require('path');
const os = require('os');
const fs = require('fs');
const Busboy = require('busboy');
const { storageBucket } = require("../config/FirebaseConfig");

/**
 * Parses a 'multipart/form-data' request.
 *
 * @param {Object} req HTTP request object.
 * @returns {Promise<{fields: Object, files: Object}>} Parsed fields and files.
 */
async function parseMultipartForm(req) {
    const tmpdir = os.tmpdir();
    const fields = {};
    const uploads = {};
    const fileWrites = [];

    const busboy = Busboy({ headers: req.headers });

    return new Promise((resolve, reject) => {
        busboy.on('field', (fieldname, val) => {
            fields[fieldname] = val;
        });

        busboy.on('file', (fieldname, file, { filename }) => {
            const localFilePath = path.join(tmpdir, filename);
            const storagePath = `uploads/${Date.now()}-${filename}`;
            const writeStream = fs.createWriteStream(localFilePath);

            file.pipe(writeStream);

            const promise = new Promise((resolve, reject) => {
                file.on('end', () => writeStream.end());
                writeStream.on('close', () => {
                    uploadToStorage(localFilePath, storagePath)
                        .then(fileName => {
                            // uploads[fieldname] = path.basename(fileName); // Only store the file name
                            uploads[fieldname] = fileName; // fileName sekarang adalah URL dari hasil uploadToStorage
                            fs.unlinkSync(localFilePath); // Remove the local file
                            resolve();
                        })
                        .catch(reject);
                });
                writeStream.on('error', reject);
            });

            fileWrites.push(promise);
        });

        busboy.on('finish', async() => {
            try {
                await Promise.all(fileWrites);
                resolve({ fields, files: uploads });
            }catch (error) {
                reject(error);
            }
        });

        busboy.on('error', reject);

        busboy.end(req.rawBody);
    });
}

function generatePublicUrl(fileName) {
    return `https://storage.googleapis.com/${storageBucket.name}/uploads/${fileName}`;
}
/**
 * Uploads a file to Firebase Storage and returns its name/path.
 *
 * @param {string} localFilePath Local file path.
 * @param {string} destination Path in Firebase Storage.
 * @returns {Promise<string>} Path of the uploaded file in Firebase Storage.
 */
// async function uploadToStorage(localFilePath, destination) {
//         await storageBucket.upload(localFilePath, {
//             destination,
//             metadata: {
//                 cacheControl: 'public, max-age=31536000',
//             },
//         });
//         return destination;
// }

async function uploadToStorage(localFilePath, destination) {
    await storageBucket.upload(localFilePath, {
        destination,
        metadata: {
            cacheControl: 'public, max-age=31536000',
        },
    });
    // Hanya return satu format URL
    return `https://storage.googleapis.com/${storageBucket.name}/${destination}`;
}
// Hapus atau tidak gunakan lagi fungsi generatePublicUrl jika sudah tidak diperlukan

/**
 * Retrieves the name of a file from its Firebase Storage path.
 *
 * @param {string} storagePath Path in Firebase Storage.
 * @returns {string} File name.
 */
function getFileName(storagePath) {
    return path.basename(storagePath);
}

async function getFileMetadata(filePath) {
    try {
        const paths = "uploads/" + filePath;
        const file = storageBucket.file(paths);
        const [metadata] = await file.download();
        return metadata.toString("base64");
    }catch (error) {
        throw new Error(`Failed to get metadata: ${error.message}`);
    }
}

async function getFileAsBuffer(filePath) {
    try {
        const paths = "uploads/" + filePath;
        const file = storageBucket.file(paths);
        const [fileBuffer] = await file.download();
        return fileBuffer; // Return file content as a buffer
    }catch (error) {
        throw new Error(`Error retrieving file: ${error.message}`);
    }
}

/**
 * Extracts file data from a 'multipart/form-data' request without saving it.
 *
 * @param {Object} req HTTP request object.
 * @returns {Promise<{fields: Object, files: Object}>} Extracted fields and file data as buffers.
 */
async function extractMultipartForm(req) {
    const fields = {};
    const files = {};

    const busboy = Busboy({ headers: req.headers });

    return new Promise((resolve, reject) => {
        busboy.on('field', (fieldname, val) => {
            fields[fieldname] = val; // Store the form fields
        });

        busboy.on('file', (fieldname, file, { filename, encoding, mimeType }) => {
            const fileData = []; // Array to store chunks of file data

            file.on('data', chunk => {
                fileData.push(chunk); // Collect data chunks
            });

            file.on('end', () => {
                files[fieldname] = {
                    filename,
                    encoding,
                    mimeType,
                    buffer: Buffer.concat(fileData), // Combine chunks into a single buffer
                };
            });

            file.on('error', reject); // Handle file stream errors
        });

        busboy.on('finish', () => {
            resolve({ fields, files }); // Resolve with fields and files
        });

        busboy.on('error', reject); // Handle Busboy errors

        busboy.end(req.rawBody);
    });
}

async function isFileNameAvailable(file){
    try {
        const directory = "uploads/";
        const [files] = await await storageBucket.getFile({prefix: directory});
        const fileMap = files.map(file => file.name);
        const filesNames = fileMap.map(filepath => path.basename(filepath));
        return !filesNames.includes(file);
    }catch (error){
        throw new Error(`Failed to get file: ${error.message}`);
    }
}

module.exports = {
    parseMultipartForm,
    getFileName,
    getFileMetadata,
    getFileAsBuffer,
    extractMultipartForm,
    isFileNameAvailable,
    generatePublicUrl,
    uploadToStorage,
};


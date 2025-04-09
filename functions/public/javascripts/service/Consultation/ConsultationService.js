// service/ConsultationService.js
const { db, storage } = require('../../config/FirebaseConfig');
const { v4: uuidv4 } = require('uuid');
const Consultation = require('../../entity/Consultation');
const HttpStatus = require('../../util/HttpStatus');
const APIResponse = require('../../DTO/response/APIResponse');

const CONSULTATION_PRICE = 100; // coins per consultation

// Punya orang

async function createConsultation(userId, data, file) {
    try {
        // Check user's coin balance
        const userDoc = await db.collection('user')
            .where('ID', '==', userId)
            .get();

        if (userDoc.empty) {
            throw new Error('User not found');
        }

        const userData = userDoc.docs[0].data();
        if (userData.coinBalance < CONSULTATION_PRICE) {
            throw new Error('Insufficient coin balance');
        }

        // Upload material file to Firebase Storage
        let materialFileUrl = null;
        if (file) {
            const fileBuffer = file.buffer;
            const fileName = `materials/${uuidv4()}-${file.originalname}`;
            const fileRef = storage.file(fileName);
            await fileRef.save(fileBuffer);
            materialFileUrl = await fileRef.getSignedUrl({ action: 'read', expires: '03-01-2500' });
        }

        // Create consultation
        const consultationId = `CONS-${uuidv4()}`;
        const consultation = new Consultation(
            consultationId,
            userId,
            null,
            data.institution,
            data.major,
            data.subject,
            materialFileUrl,
            data.description,
            CONSULTATION_PRICE,
            'PENDING',
        );

        // Deduct coins from user
        await db.collection('user').doc(userDoc.docs[0].id).update({
            coinBalance: userData.coinBalance - CONSULTATION_PRICE,
        });

        // Save consultation to database
        await db.collection('consultations').doc(consultationId).set(consultation.toObject());

        return new APIResponse(
            HttpStatus.CREATED.code,
            null,
            consultation.toObject(),
            HttpStatus.CREATED.message,
        );
    }catch (error) {
        return new APIResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            error.message,
            null,
            HttpStatus.INTERNAL_SERVER_ERROR.message,
        );
    }
}

async function getAvailableConsultations(mentorId) {
    try {
        const consultations = await db.collection('consultations')
            .where('status', '==', 'PENDING')
            .where('mentorId', '==', null)
            .get();

        return new APIResponse(
            HttpStatus.OK.code,
            null,
            consultations.docs.map(doc => doc.data()),
            HttpStatus.OK.message,
        );
    }catch (error) {
        return new APIResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            error.message,
            null,
            HttpStatus.INTERNAL_SERVER_ERROR.message,
        );
    }
}

async function acceptConsultation(consultationId, mentorId) {
    try {
        await db.collection('consultations').doc(consultationId).update({
            mentorId: mentorId,
            status: 'ACCEPTED',
        });

        return new APIResponse(
            HttpStatus.OK.code,
            null,
            { consultationId, status: 'ACCEPTED' },
            HttpStatus.OK.message,
        );
    }catch (error) {
        return new APIResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            error.message,
            null,
            HttpStatus.INTERNAL_SERVER_ERROR.message,
        );
    }
}

async function rejectConsultation(consultationId, mentorId) {
    try {
        await db.collection('consultations').doc(consultationId).update({
            status: 'REJECTED',
        });
        const consultation = await db.collection('consultations').doc(consultationId).get();

        const userData = await db.collection('user')
            .where('ID', '==', consultation.data().userId)
            .get();

        if (!userData.empty) {
            await db.collection('user').doc(userData.docs[0].id).update({
                coinBalance: userData.docs[0].data().coinBalance + consultation.data().coinAmount,
            });
        }
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            { consultationId, status: 'REJECTED' },
            HttpStatus.OK.message,
        );
    }catch (error) {
        return new APIResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            error.message,
            null,
            HttpStatus.INTERNAL_SERVER_ERROR.message,
        );
    }
}

async function completeConsultation(consultationId) {
    try {
        await db.collection('consultations').doc(consultationId).update({
            status: 'COMPLETED',
        });
        return new APIResponse(
            HttpStatus.OK.code,
            null,
            { consultationId, status: 'COMPLETED' },
            HttpStatus.OK.message,
        );
    }catch (error) {
        return new APIResponse(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            error.message,
            null,
            HttpStatus.INTERNAL_SERVER_ERROR.message,
        );
    }
}

module.exports = {
    createConsultation,
    getAvailableConsultations,
    acceptConsultation,
    rejectConsultation,
    completeConsultation,
};
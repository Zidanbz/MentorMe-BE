const Survey = require('../../entity/Survey');
const { createSurvey } = require('../../repo/SurveyRepo');
const APIResponse = require('../../DTO/response/APIResponse');
const HttpStatus = require('../../util/HttpStatus');
const { getUserByUid } = require('../../util/AutenticationUtil');

class CreateSurveyService {
    async createSurvey(req) {
        try {
            const { title, description, questions, deadline } = req.body;

            // Validate required fields
            if (!title || !description || !questions || !Array.isArray(questions)) {
                return new APIResponse(
                    HttpStatus.BAD_REQUEST.code,
                    true,
                    null,
                    "Title, description, and questions are required. Questions must be an array.",
                );
            }

            // Validate questions structure
            for (let i = 0; i < questions.length; i++) {
                const question = questions[i];
                if (!question.id || !question.text || !question.type) {
                    return new APIResponse(
                        HttpStatus.BAD_REQUEST.code,
                        true,
                        null,
                        `Question ${i + 1} must have id, text, and type fields.`,
                    );
                }

                // Validate question types
                const validTypes = ['text', 'multiple_choice', 'rating', 'textarea'];
                if (!validTypes.includes(question.type)) {
                    return new APIResponse(
                        HttpStatus.BAD_REQUEST.code,
                        true,
                        null,
                        `Question ${i + 1} has invalid type. Valid types: ${validTypes.join(', ')}`,
                    );
                }

                // Validate multiple choice questions have options
                if (question.type === 'multiple_choice' && (!question.options || !Array.isArray(question.options))) {
                    return new APIResponse(
                        HttpStatus.BAD_REQUEST.code,
                        true,
                        null,
                        `Multiple choice question ${i + 1} must have options array.`,
                    );
                }
            }

            // Get admin user info
            const adminUser = await getUserByUid(req);

            // Create survey object
            const survey = new Survey(
                title,
                description,
                questions,
                'ACTIVE',
                adminUser.email,
                deadline ? new Date(deadline) : null,
            );

            // Save to database
            const createdSurvey = await createSurvey(survey);

            return new APIResponse(
                HttpStatus.CREATED.code,
                false,
                createdSurvey.toObject(),
                "Survey created successfully",
            );
        }catch (error) {
            return new APIResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.code,
                true,
                null,
                error.message,
            );
        }
    }
}

module.exports = CreateSurveyService;

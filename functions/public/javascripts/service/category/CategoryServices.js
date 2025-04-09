const { getAllCategory } = require("../../repo/CategoryRepo");
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");

class CategoryServices{
    async getAllCategories(){
        const listCategory = await getAllCategory();
        try {
            return new APIResponse(
                HttpStatus.CREATED.code,
                null,
                listCategory,
                HttpStatus.CREATED.message,
            );
        }catch (err) {
            return new APIResponse(
                HttpStatus.BAD_REQUEST.code,
                err.message,
                null,
                HttpStatus.BAD_REQUEST.message,
            );
        }
    }
}

module.exports = CategoryServices;
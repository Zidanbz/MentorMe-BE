const { createNewCategory, getAllCategory } = require("../../repo/CategoryRepo");
const {ID} = require("../../util/UUID")
const Category = require ("../../entity/Category")
const APIResponse = require("../../DTO/response/APIResponse");
const HttpStatus = require("../../util/HttpStatus");

function isDuplicates(req, name) {
    if(req){
        throw new Error(`category with name ${name} already exists`);
    }
}

async function checkNameDuplicates(name){
    try {
        const categories = await getAllCategory();
        const isDuplicate = categories.some(
            (category) => category.name === name
        );
        isDuplicates(isDuplicate, name);
        return true;
    }catch (error){
        throw new Error(error.message);
    }
}

async function mapToCategory(req){
    try{
        const objectCategory = new Category(ID(), req.body.name);
        await checkNameDuplicates(objectCategory.getName());
        return objectCategory;
    }catch (error){
        throw new Error(error.message);
    }
}

async function createCategory(req){
    try {
        const category = await mapToCategory(req);
        await createNewCategory(category);
        const listCategory = await getAllCategory();

        return new APIResponse(
            HttpStatus.CREATED.code,
            null,
            listCategory,
            HttpStatus.CREATED.message
        );
    }catch (error){
        return new APIResponse(
            HttpStatus.BAD_REQUEST.code,
            error.message,
            null,
            HttpStatus.BAD_REQUEST.message
        );
    }
}

module.exports = {
    createCategory,
}
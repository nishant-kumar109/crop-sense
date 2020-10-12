const { response } = require("../../app");
const Users = require('../../models').users
const Farmers = require('../../models').farmers
const responseHandler = require('../../utils/responseHandler')

const createUserProfile = async (req, res, next) => {
    try {
        let password = req.body.password
        const userObj = {
            first_name:req.body.first_name,
            last_name : req.body.last_name,
            email:req.body.email,
            mobile_number : req.body.mobile_number,
            role : req.body.role,
            password:password,
            img_url : req.body.img_url,
            region : req.body.region
        }
        await Users.createUser(userObj)
        responseHandler.successDataResponse(res,userObj, "user profile created")
    } catch (error) {
        responseHandler.clientError(res, "email id already exist")
        console.log(error);
    }

}

const getUserProfileById = async(req, res, next)=>{
    try {
        const user = await Users.getUserById(req.query.id);
        if(user){
            responseHandler.successDataResponse(res,user,'User profile retrieved successfully')
        }else{
            responseHandler.clientError(res, user, "no user found")
        }
    } catch (error) {
        console.log(error)
        // next(error)
    }
}

const editUserProfile = async(req,res,next)=>{
    try {
        const user_id = req.query.id;
        const editObj = req.body.edit_details
            await Users.editUser(editObj, {
                returning: true,
                where : {
                    id : user_id
                }
            })
            .then(([rowsUpdate, [updatedUser]])=> {
                console.log('rowsUpdated', rowsUpdate);
                responseHandler.successDataResponse(res,updatedUser,'User profile updated successfully')
              });
    } catch (error) {
        console.log(error);
        next(error)
    }
}

const getAllUserProfile = async(req, res, next)=>{
    try {
        const page = req.query.page
        const limit = req.query.pageSize || 10;
        const offset = (req.query.page - 1 || 0) * limit;
        const userWithList = await Users.getAllUsersWithCount({
            limit: limit,
            offset: offset
        });
        responseHandler.successPaginatedDataResponse(res, userWithList, page, limit, 'User profile retrieved successfully')
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const deleteUserProfile = async(req,res,next)=>{
    try {
        const user_id = req.query.id;
        let user = await Users.deleteUser(user_id);
        responseHandler.successDataResponse(res,user,'User profile deleted successfully')
    } catch (error) {
        console.log(error);
        next(error)
    }
}

module.exports = {
    createUserProfile,
    getUserProfileById,
    editUserProfile,
    getAllUserProfile,
    deleteUserProfile
}
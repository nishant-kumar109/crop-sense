const { response } = require("../../app");
const user = require("../../models/user");
const Users = require('../../models').users
const Farmers = require('../../models').farmers
const Doctors = require('../../models/').doctors
const Admins = require('../../models').admins
const responseHandler = require('../../utils/responseHandler')
const Op = require("sequelize").Op;

const createUserProfile = async (req, res, next) => {
    try {
        if(req.user){
            if(req.body.img_url){
                await Users.editUser({img_url : req.body.img_url}, {returning: true, where : { id : req.user.id}})
            }
            const userObj = await Users.getUserById(req.user.id)

            if(req.user.role == 'farmer'){
                farmerObj = {
                    total_exprience : req.body.total_exprience,
                    about_me : req.body.about_me
                }
                await Farmers.editFarmer(farmerObj, {
                    returning: true,
                    where : {
                        id : req.user.farmer_id
                    }
                })
                .then(([rowsUpdate, [updatedFarmer]])=> {
                    let farmer = {}
                    farmer['farmer_details'] = updatedFarmer.dataValues
                    farmer['user_details'] = userObj.dataValues
                    console.log('farmer === ', farmer)
                    // console.log('rowsUpdated', rowsUpdate, farmer);
                    responseHandler.successDataResponse(res,farmer,'Farmer profile created successfully')
                  });

            }
            else if (req.user.role == 'doctor') {
                doctorObj = {
                    total_exprience : req.body.total_exprience,
                    about_me : req.body.about_me,
                    expert_in : req.body.expert_in,
                    certified_from : req.body.certified_from
                }
                await Doctors.editDoctor(doctorObj, {
                    returning: true,
                    where : {
                        id : req.user.doctor_id
                    }
                })
                .then(([rowsUpdate, [updatedDoctor]])=> {
                    let doctor = {}
                    doctor['doctor_details'] = updatedDoctor.dataValues
                    doctor['user_details'] = userObj.dataValues
                    console.log('doctor === ', doctor)
                    responseHandler.successDataResponse(res, doctor,'doctor profile created successfully')
                  });
            } 

            else if (req.user.role == 'admin') {
                    responseHandler.successDataResponse(res, userObj,'doctor profile created successfully')
            } else {
                responseHandler.serverError(res)
            }
        }
        responseHandler.clientError(res, "user does not exist")
    } catch (error) {
        responseHandler.clientError(res, "invalid token")
        console.log(error);
    }

}

const getProfile = async(req, res, next)=>{
    try {
        if(req.user.role == 'farmer'){
            const farmer = await Farmers.findOne({
                where:{
                    user_id : req.user.id
                },
                include : [{
                    model: Users,
                    as: "user",
                    attributes: {
                        exclude: ["region","createdAt", "updatedAt", "password"]
                    }
                }]
            })
            responseHandler.successDataResponse(res, farmer,'farmer profile retrieved successfully')
        }
        else if(req.user.role == 'doctor'){
            const doctor = await Doctors.findOne({
                where:{
                    user_id : req.user.id
                },
                include : [{
                    model: Users,
                    as: "user",
                    attributes: {
                        exclude: ["region","createdAt", "updatedAt", "password"]
                    }
                }]
            })
            responseHandler.successDataResponse(res, doctor,'doctor profile retrieved successfully')
        }

        else if(req.user.role == 'admin'){
            const admin = await Admins.findOne({
                where:{
                    user_id : req.user.id
                },
                include : [{
                    model: Users,
                    as: "user",
                    attributes: {
                        exclude: ["region","createdAt", "updatedAt", "password"]
                    }
                }]
            })
            responseHandler.successDataResponse(res, admin,'admin profile retrieved successfully')
        }
        else{
            responseHandler.clientError(res, null, 'invalid token')
        }
    } catch (error) {
        console.log(error)
        // next(error)
    }
}

const getOneProfileByUserId = async (req,res,next)=>{
    try {
        let user_id = req.query.id;
        console.log('user id ==', user_id)
        console.log(req.user.role)
        if(req.user.role == 'farmer'){
        const user = await Users.findOne({
            where:{
                id : user_id
            },
            attributes: {
                exclude: ["region","createdAt", "updatedAt", 'password']
            },
            include : [
                {
                    model: Doctors,
                    as: "doctor",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                }
            ]    
        })
        responseHandler.successDataResponse(res, user,'user profile retrieved successfully')
     }
    else if(req.user.role == 'doctor'){
        const user = await Users.findOne({
            where:{
                id : user_id
            },
            attributes: {
                exclude: ["region","createdAt", "updatedAt", 'password']
            },
            include : [
                {
                    model: Farmers,
                    as: "farmers",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"]
                    }
                }
            ]    
        })
        responseHandler.successDataResponse(res, user,'user profile retrieved successfully')
    }else{
        responseHandler.clientError(res, 'invalid token')
    }
    } catch (error) {
        console.log(error)
        responseHandler.clientError(res, 'token doesnot match')
    }
}

const editUserProfile = async(req,res,next)=>{
    try {
        const user_id = req.user.id;
        const editObj = req.body.edit_user
        const userObj =    await Users.editUser(editObj, {
                returning: true,
                where : {
                    id : user_id
                },
                attributes : {
                    exclude : ['password']
                }
            })
            .then(([rowsUpdate, [updatedUser]])=> {
                console.log('rowsUpdated', rowsUpdate);
                return updatedUser;
              });
              
              console.log(userObj)
            //   const userObj = await Users.getUserById(req.user.id)

              if(req.user.role == 'farmer'){
                  farmerObj = {
                      total_exprience : req.body.total_exprience,
                      about_me : req.body.about_me
                  }
                  await Farmers.editFarmer(farmerObj, {
                      returning: true,
                      where : {
                          id : req.user.farmer_id
                      }
                  })
                  .then(([rowsUpdate, [updatedFarmer]])=> {
                      let farmer = {}
                      farmer['farmer_details'] = updatedFarmer.dataValues
                      farmer['user_details'] = userObj.dataValues
                      console.log('farmer === ', farmer)
                      console.log('rowsUpdated', rowsUpdate, farmer);
                      responseHandler.successDataResponse(res,farmer,'Farmer profile created successfully')
                    });
              }
              else if (req.user.role == 'doctor') {
                  doctorObj = {
                      total_exprience : req.body.total_exprience,
                      about_me : req.body.about_me,
                      expert_in : req.body.expert_in,
                      certified_from : req.body.certified_from
                  }
                  await Doctors.editDoctor(doctorObj, {
                      returning: true,
                      where : {
                          id : req.user.doctor_id
                      }
                  })
                  .then(([rowsUpdate, [updatedDoctor]])=> {
                      let doctor = {}
                      doctor['doctor_details'] = updatedDoctor.dataValues
                      doctor['user_details'] = userObj.dataValues
                      console.log('doctor === ', doctor)
                      responseHandler.successDataResponse(res, doctor,'doctor profile created successfully')
                    });
              } 
  
              else if (req.user.role == 'admin') {
                      responseHandler.successDataResponse(res, userObj,'doctor profile created successfully')
              } else {
                  responseHandler.serverError(res)
              }

    } catch (error) {
        console.log(error);
        // next(error)
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
    getProfile,
    getOneProfileByUserId,
    editUserProfile,
    getAllUserProfile,
    deleteUserProfile
}
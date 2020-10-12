const { response } = require("../app");
const Users = require('../models').users
const Farmers = require('../models').farmers
const Doctor = require('../models').doctors
const Admin = require('../models').admins
const bcrypt = require('bcrypt');
const JWT = require('../utils/jwt')
const responseHandler = require('../utils/responseHandler')

const signUpUser = async (req, res, next) => {
    try {
        let password = bcrypt.hashSync(req.body.password, 10);
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
        let user = await Users.createUser(userObj)
        
        let userWithRoleObj = {
            user_id : user.dataValues.id,
            region_belongs_to : user.dataValues.region
        }

        let payload = {};

        if(req.body.role == 'farmer'){
            let farmer = await Farmers.createFarmer(userWithRoleObj)
            payload['id'] = user.dataValues.id;
            payload['role'] = 'farmer';
            payload['email'] = user.dataValues.email;
            payload['farmer_id'] = farmer.dataValues.id
        }

        else if(req.body.role == 'doctor'){
            let doctor = await Doctor.createDoctor(userWithRoleObj)
            payload['id'] = user.dataValues.id;
            payload['role'] = 'admin';
            payload['email'] = user.dataValues.email;
            payload['doctor_id'] = doctor.dataValues.id
        }

        else if(req.body.role == 'admin'){
            let admin = await Admin.createAdmin(userWithRoleObj)
            payload['id'] = user.dataValues.id;
            payload['role'] = 'admin';
            payload['email'] = user.dataValues.email;
            payload['admin_id'] = admin.dataValues.id
        }
        else{
            responseHandler.clientError(res, null, "please sign up with a role")
        }
        payload['token'] = JWT.generateToken(payload);
        responseHandler.successDataResponse(res, payload,'successfully signup')
    } catch (error) {
        console.log(error);
        responseHandler.clientError(res, null, "some thing went wrong")
    }

}

const logInUser = async(req,res,next)=>{
    try {
        let userDetails = await Users.findUserByEmail(req.body.email);
        // console.log('user ==', userDetails.dataValues.password)
        if(userDetails){
            const validatePassword = await bcrypt.compare(req.body.password, userDetails.dataValues.password);
            const payload = {}
            payload['id'] = userDetails.dataValues.id;
            payload['email'] = userDetails.dataValues.email
            let role = userDetails.dataValues.role;
            if(validatePassword){
                if(role == 'farmer'){
                    let farmer = await Farmers.getFarmerByUserId(userDetails.dataValues.id)
                    payload['role'] = role
                    payload['farmer_id'] = farmer.dataValues.id;
                    payload["token"] = JWT.generateToken(payload, {
                        expiresIn: '24h'
                    });
                    responseHandler.successDataResponse(res, payload,'successfully login')
                }
                else if(role == 'doctor'){
                    let doctor = await Doctor.getDoctorByUserId(userDetails.dataValues.id)
                    payload['role'] = role
                    payload['doctor_id'] = doctor.dataValues.id;
                    payload["token"] = JWT.generateToken(payload, {
                        expiresIn: '24h'
                    });
                    responseHandler.successDataResponse(res, payload,'successfully login')
                }
                else if(role == 'admin'){
                    let admin = await Admin.getAdminByUserId(userDetails.dataValues.id)
                    payload['role'] = role
                    payload['doctor_id'] = admin.dataValues.id;
                    payload["token"] = JWT.generateToken(payload, {
                        expiresIn: '24h'
                    });
                    responseHandler.successDataResponse(res, payload,'successfully login')
                }
                else{
                    responseHandler.clientError(res, null, "please sign up with a role")
                }
                 
            }else{
                responseHandler.clientError(res, null, "please enter correct password")
            }
        }else{
            responseHandler.clientError(res, null, "user does not exist")
        }
    } catch (error) {
        console.log(error)
        responseHandler.serverError(res, message)
    }
}

module.exports = {
    signUpUser,
    logInUser
}
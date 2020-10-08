const { response } = require("../app");
const Users = require('../models').users
const Farmers = require('../models').farmers
const Doctor = require('../models').doctors
const Admin = require('../models').admins
const bcrypt = require('bcrypt');
const JWT = require('../utils/jwt')
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

        payload['token'] = JWT.generateToken(payload);
        return res.status(200).json(payload);

    } catch (error) {
        console.log(error);
        next(error);
    }

}

const logInUser = async(req,res,next)=>{
    try {
        let userDetails = await Users.findUserByEmail(req.body.email);
        console.log('user ==', userDetails.dataValues.password)
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
                    return res.status(200).json(payload); 
                }
                else if(role == 'doctor'){
                    let doctor = await Doctor.getDoctorByUserId(userDetails.dataValues.id)
                    payload['role'] = role
                    payload['doctor_id'] = doctor.dataValues.id;
                    payload["token"] = JWT.generateToken(payload, {
                        expiresIn: '24h'
                    });
                    return res.status(200).json(payload); 
                }
                else if(role == 'admin'){
                    let admin = await Admin.getAdminByUserId(userDetails.dataValues.id)
                    payload['role'] = role
                    payload['doctor_id'] = admin.dataValues.id;
                    payload["token"] = JWT.generateToken(payload, {
                        expiresIn: '24h'
                    });
                    return res.status(200).json(payload); 
                }
                else{
                    return res.status(500).json({
                        "message" : "please sign up with a role"
                    }); 
                }
                 
            }else{
                return res.status(400).json({
                    message : "please enter correct password"
                }); 
            }
        }else{
            return res.status(400).json({
                message : "email does not exist"
            }); 
        }
    } catch (error) {
        
    }
}

module.exports = {
    signUpUser,
    logInUser
}
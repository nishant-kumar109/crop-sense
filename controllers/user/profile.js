const { response } = require("../../app");
const Users = require('../../models').users
const Farmers = require('../../models').farmers
const createUserProfile = async (req, res, next) => {
    try {
        console.log('hitting the api controller ======= ')
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

     return res.status(200).json(userObj);
    } catch (error) {
        console.log(error);
        next(error);
    }

}

const getUserProfile = async(req, res, next)=>{
    try {
        const user = await Users.getUserById(req.query.id);
        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        next(error)
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
                return res.status(200).json(updatedUser)
              });
    } catch (error) {
        console.log(error);
        next(error)
    }
}


const deleteUserProfile = async(req,res,next)=>{
    try {
        const user_id = req.query.id;
        await Users.deleteUser(user_id);

        return res.status(200).json({
            "message" : "user deleted"
        })
    } catch (error) {
        console.log(error);
        next(error)
    }
}

module.exports = {
    createUserProfile,
    getUserProfile,
    editUserProfile,
    deleteUserProfile
}
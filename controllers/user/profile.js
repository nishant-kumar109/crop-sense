const { response } = require("../../app");


const createUserProfile = async (req, res, next) => {
    try {
        console.log('hitting the api controller ======= ')
        const userObj = {
            first_name:req.body.first_name,
            last_name : req.body.last_name,
            email:req.body.email,
            mobile_number : req.body.mobile_number,
            role : req.body.role
        }

        
        // if(userObj.role  == 'farmer'){

        // }

        return res.status(200).json(userObj);
    } catch (error) {
        console.log(error);
        next(error);
    }

}

module.exports = {
    createUserProfile
}
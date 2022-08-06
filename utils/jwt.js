const JWT = require('jsonwebtoken');
// const generator = require('generate-password');
//const bcrypt = require('bcrypt');

const generateToken = (data) => {

    return JWT.sign(data, process.env.PRIVATE_KEY,{expiresIn: "7d"});
}


const verifyToken = (token, req, res, next) => {
    try {
        let verifiedData = JWT.verify(token, process.env.PRIVATE_KEY)
        
        return verifiedData

    } catch (error) {
        console.log(error)
       return new Error(error)
    }
}


module.exports = {
    generateToken,
    verifyToken
}
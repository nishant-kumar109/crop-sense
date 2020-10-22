const JWT = require('jsonwebtoken');
// const generator = require('generate-password');
const bcrypt = require('bcrypt');

const generateToken = (data, options) => {

    return JWT.sign(data, process.env.PRIVATE_KEY, options);
}


const verifyToken = (token, req, res, next) => {
    try {
        let verifiedData = JWT.verify(token, process.env.PRIVATE_KEY)
        
        return verifiedData

    } catch (error) {
        console.log(error)
        // next(error)
    }
}


module.exports = {
    generateToken,
    verifyToken
}
'use strict';
module.exports = (sequelize, DataTypes) => {

    var Users = sequelize.define("users", {

        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        mobile_number: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.STRING
        },
        img_url: {
            type: DataTypes.STRING
        },
        first_name: {
            type: DataTypes.STRING
        },
        last_name: {
            type: DataTypes.STRING
        },
        region: {
            type: DataTypes.STRING
        } 
    },
        {
        freezeTableName: true, // Model tableName will be the same as the model name
        paranoid: true,
        timestamp: true,
        });

        Users.associate = (models)=>{

            models.users.hasOne(models.farmers, {
                as: "farmers",
                foreignKey: "user_id",
                onDelete: 'CASCADE',
                hooks : true
            });
    
            // models.users.hasOne(models.doctors, {
            //     as: "doctor",
            //     foreignKey: "user_id",
            //     // onDelete: 'CASCADE'
            // });
    
            // models.users.hasOne(models.admin, {
            //     as: "admin",
            //     foreignKey: "user_id",
            //     // onDelete: 'CASCADE'
            // });
        }

        Users.createUser = (userObj) => {
            return Users.create(userObj);
        }
        
        Users.getUserById = (id) =>{
            return Users.findByPk(id, { attributes: { exclude: ['password'] } });

        }

        Users.findUserByEmail = async(email)=>{
            return await Users.findOne({
                where : {
                    email : email
                }
            })
        }
        
        Users.editUser = async (editObject, includeObj) => {
            return await Users.update(editObject, includeObj);
        }

        Users.deleteUser = async(id) => {
            return await Users.destroy({
                where : {
                    id : id
                }
            });
        }

    return Users;
};
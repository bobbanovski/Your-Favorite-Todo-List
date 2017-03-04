module.exports = function (sequelize, DataTypes) { //sequelized instance, datatypes
    return sequelize.define('user', {
    // username: {
    //     type: DataTypes.STRING,
    //     allowNull: false,
    //     unique: true
    // },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
})
}
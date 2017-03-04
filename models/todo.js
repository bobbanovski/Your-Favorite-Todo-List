module.exports = function (sequelize, DataTypes) { //sequelized instance, datatypes
    return sequelize.define('todo', {
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }
    },
    completed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})
} 

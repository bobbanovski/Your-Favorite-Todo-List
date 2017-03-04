var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, { //create the database
    'dialect': 'sqlite',
    'storage': __dirname + '/data/sqlite-database.sqlite'
});

var db = {};

//load all seqlized models, held in the models folder
db.todo = sequelize.import(__dirname + '/models/todo.js'); //load model from separate file
db.user = sequelize.import(__dirname + '/models/user.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; //allows returning multiple items from a file

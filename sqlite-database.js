var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/sqlite-database.sqlite'
});

var User = sequelize.define('user', {
    username: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    }
})

var Todo = sequelize.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 250]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

//calling sync takes the models, then creates the database if !exists
//use sync({force: true}).then.. to drop and recreate table
sequelize.sync().then(function () {
    console.log('Database synced');

    //create new user object
    User.create({
        username: "admin",
        password: "dddd"
    }).then(function (user) {
        console.log('user created');
    });

    Todo.create({
        description: "Bake a cake"
        //completed: false
    }).then(function (todo) {
        console.log('todo created');
    });

    Todo.findById(1).then (function (todo) {
        if (todo) {
            console.log(todo.toJSON());
        } else{ 
            console.log('Todo not found');
        }
    })
})
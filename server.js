var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var db = require('./db.js'); //link to database
var middleware = require('./middleware'); // import local file, same directory

var app = express();
var PORT = process.env.PORT || 3000; //if port variable not set, set to 3000
var todoNextId = 4;

var todos = [{
    id: 1,
    description: "Pick up car",
    isCompleted: true
},
{
    id: 2,
    description: "Cook Dinner",
    isCompleted: false
},
{
    id: 3,
    description: "Test Software",
    isCompleted: false
}]

//implement middleware
//order is important - place above routes
//app.use(middleware.requireAuthentication) // use for all routes
app.use(middleware.logger);
app.use(bodyParser.json()); //post requests will not work without this
app.use(express.static(__dirname + '/public')); //overrides get('/)

//create route for root
app.get('/', function(req, res){ //request, response
    //res.sendFile(__dirname + '/public/index.html');
    res.send('Todo API Root')
})
app.get('/about', middleware.requireAuthentication, function(req, res){
    res.send('About Us');
})

//get all todos
app.get('/todos', function (req, res){
    res.json(todos);
})

app.get('/todos/:id', function (req, res){
    var todoId = parseInt(req.params.id, 10);
    
    // var matchedTodo;
    // todos.forEach(function (todo) {
    //     if (todoId === todo.id) {
    //         matchedTodo = todo
    //     }
    // });
    var matchedTodo = _.findWhere(todos, {id: todoId}) //list, search items

    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
})

app.post('/todos', function (req, res) {
    var body = _.pick(req.body,"isCompleted","description")

    //Sequelize
    db.todo.create(body).then(function (todo) {
        res.json(todo.toJSON());
    }, function (error) {
        res.status(400).json(error);
    });

    //ensure datatypes are valid
    // if (!_.isBoolean(body.isCompleted) || !_.isString(body.description) || body.description.trim().length === 0) { //if body not completed
    //     return res.status(400).send();
    // }
    // body.description = body.description.trim();
    // body.id = todoNextId++;
    // todos.push(body);
    //console.log('description: ' + body.description);
    //res.json(body);
});

app.delete('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    if (!matchedTodo){
        res.status(404).send();
    }    
    todos = _.without(todos, matchedTodo);
    res.json(todos);
});

app.put('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    if (!matchedTodo) {
        return res.status(404).send();
    }

    var body = _.pick(req.body,"isCompleted","description")
    
    var validAttributes = {};
    if(body.hasOwnProperty('isCompleted') && _.isBoolean(body.isCompleted)) {
        validAttributes.isCompleted = body.isCompleted;
    } else if (body.hasOwnProperty('isCompleted')) { //has isCompleted, not boolean
        return res.status(400).send();
    } else {
        res.status(404).json("error", "todo has no isCompleted specified")
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }
    
    // matchedTodo = _.extend(matchedTodo, validAttributes);
    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);
});

app.post('/users', function (req, res) {
    //filter data sent to request
    var body = _.pick(req.body, 'email', 'password'); //take only whats wanted from request body
    console.log(body);
    db.user.create(body).then(function(user){
        res.json(user.toJSON());
    }, function (e){         
        res.status(400).json(e); //in case of error
    });
});

db.sequelize.sync().then(function () { //instantiate database instance, call promise that calls server
    app.listen(PORT, function (){ //call application after starting database
        console.log("Express server started on port: " + PORT) // called after starting
    });
}) 

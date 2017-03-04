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
    var matchedTodo;

    todos.forEach(function (todo) {
        if (todoId === todo.id) {
            matchedTodo = todo
        }
    });
    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
})

app.post('/todos', function (req, res) {
    var body = req.body;
    body.id = todoNextId++;
    todos.push(body);
    //console.log('description: ' + body.description);
    res.json(body);
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

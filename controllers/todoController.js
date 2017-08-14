var bodyParser = require('body-parser');
var mongoose = require('mongoose');
require('dotenv').config();

//var data = [{item:'get milk'}, {item:'walk dog'}, {item:'kick ass!'}];
var urlencodedParser = bodyParser.urlencoded({extended:false});

// other database named 'mongodb://test:test@ds017246.mlab.com:17246/mayerxc');
var mongoDatabase= 'mongodb://' + process.env.DBUSER + ':' + process.env.DBPASSWORD + '@ds028310.mlab.com:28310/test-azure'

console.log(mongoDatabase);

//connect to the database testing new database
mongoose.connect(mongoDatabase); 

//create a schema - this is like a blueprint
var todoSchema = new mongoose.Schema({
    item: String
});

var Todo = mongoose.model('Todo', todoSchema);


module.exports = function(app){
    
    app.get('/todo', function(req, res){
        //get data from mongodb and pass it to the view
        Todo.find({}, function(err, data){
            if (err) throw err;
            res.render('todo', {todos: data});
        });
    });

    app.post('/todo', urlencodedParser, function(req, res){
        //get data from the view and add it to mongodb
        var newTodo = Todo(req.body).save(function(err, data){
            if (err) throw err;
            res.json(data);
        });
    });
    

    app.delete('/todo/:item', function(req, res){
        //delete the requested item from mongodb
        Todo.find({item: req.params.item.replace(/\-/g, " ")}).remove(function(err, data){
            if (err) throw err;
            res.json(data);
        });

    });
}


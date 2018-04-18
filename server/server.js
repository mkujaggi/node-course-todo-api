const {ObjectID}=require('mongodb');
var express=require('express');
var bodyParser=require('body-parser');

var {mongoose}=require('./db/mongoose');
var {Todo}=require('./models/todo');
var {User}=require('./models/users');

var app=express();
const port=process.env.PORT || 3000;
app.use(bodyParser.json());
app.post('/todos',(req,res)=>{
    var todo=new Todo({
        text:req.body.text
    });
    todo.save().then((result) => {
        res.send(result);
    },(err) => {
        res.status(400).send(err);
    });
});

app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        res.send({todos});
    },(err)=>{
        res.status(400).send(err);
    });
});

app.get('/todos/:id',(req,res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findById(id).then((todo)=>{
        if(!todo){
            return res.status(404).send('No todos found.');
        }
        res.send({todo});
    }).catch((err)=>res.status(400).send(err));
});

app.delete('/todos/:id',(req,res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo){
            return res.status(404).send('No record found');
        }
        res.send({todo});
    }).catch((err)=>{
        res.status(400).send();
    });
});

app.listen(port,()=>{
    console.log(`Started onport ${port}`);
});

module.exports={app};
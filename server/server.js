const _=require('lodash')
const {ObjectID}=require('mongodb');
const express=require('express');
const bodyParser=require('body-parser');

var {mongoose}=require('./db/mongoose');
var {Todo}=require('./models/todo');
var {User}=require('./models/users');
var {authenticate}=require('./middleware/authenticate');

var app=express();
const port=process.env.PORT;
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

app.patch('/todos/:id',(req,res)=>{
    var id=req.params.id;
    var body=_.pick(req.body,['text','completed']);
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    if(_.isBoolean(body.completed)&& body.completed){
        body.completedAt=new Date().getTime();
    }else{
        body.completed=false;
        body.completedAt=null;
    }
    Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(400).send();
    })
})

app.post('/users',(req,res)=>{
    var body=_.pick(req.body,['email','password']);
    var user=new User(body);
    user.save().then(()=>{
        return user.generateAuthTokens();
    }).then((token)=>{
        res.header('x-auth',token).send(user)
    }).catch((e)=>{
        res.status(400).send(e);
    });
});
var authenticate=(req,res,next)=>{
    var token=req.header('x-auth');
    User.findByToken(token).then((user)=>{
        if(!user){
            return Promise.reject();
        }
        req.user=user;
        req.token=token;
        next();
    }).catch((e)=>{
        res.status(401).send();
    });
};

app.get('/users/me',authenticate,(req,res)=>{
   res.send(red.user);
});
app.listen(port,()=>{
    console.log(`Started onport ${port}`);
    
});

module.exports={app};
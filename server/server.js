require('./config/config');
const _=require('lodash');
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
app.post('/todos',authenticate,(req,res)=>{
    var todo=new Todo({
        text:req.body.text,
        _creator:req.user._id
    });
    todo.save().then((result) => {
        res.send(result);
    },(err) => {
        res.status(400).send(err);
    });
});

app.get('/todos',authenticate,(req,res)=>{
    Todo.find({
        _creator:req.user._id
    }).then((todos)=>{
        res.send({todos});
    },(err)=>{
        res.status(400).send(err);
    });
});

app.get('/todos/:id',authenticate,(req,res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findOne({
        _id:id,
        _creator:req.user._id
    }).then((todo)=>{
        if(!todo){
            return res.status(404).send('No todos found.');
        }
        res.send({todo});
    }).catch((err)=>res.status(400).send(err));
});

app.delete('/todos/:id', authenticate,async(req,res)=>{
    try {
        const id=req.params.id;
        if(!ObjectID.isValid(id)){
            return res.status(404).send();
        }
        const todo=await Todo.findOneAndRemove({
            _id:id,
            _creator:req.user._id
        });
        if(!todo){
            return res.status(404).send('No record found');
        }
        res.send({todo});
    } catch (e) {
        res.status(400).send();
    }

    // Todo.findOneAndRemove({
    //     _id:id,
    //     _creator:req.user._id
    // }).then((todo)=>{
    //     if(!todo){
    //         return res.status(404).send('No record found');
    //     }
    //     res.send({todo});
    // }).catch((err)=>{
    //     res.status(400).send();
    // });
});

app.patch('/todos/:id',authenticate,(req,res)=>{
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
    Todo.findOneAndUpdate({
        _id:id,
        _creator:req.user._id
    },{$set:body},{new:true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>{
        res.status(400).send();
    })
})

app.post('/users',async (req,res)=>{
    try {
        const body=_.pick(req.body,['email','password']);
        const user=new User(body);
        await user.save();
        const token=await user.generateAuthTokens();
        res.header('x-auth',token).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
    

    // user.save().then(()=>{
    //     return user.generateAuthTokens();
    // }).then((token)=>{
    //     res.header('x-auth',token).send(user)
    // }).catch((e)=>{
    //     res.status(400).send(e);
    // });
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
   res.send(req.user);
});

app.post('/users/login',async (req,res)=>{
    try {
        const body=_.pick(req.body,['email','password']);
        const user= await User.findByCredentials(body.email,body.password);
        const token=await user.generateAuthTokens();
        res.header('x-auth',token).send(user);
    } catch (e) {
        res.status(400).send();
    }
    


    // User.findByCredentials(body.email,body.password).then((user)=>{
    //     return user.generateAuthTokens().then((token)=>{
    //         res.header('x-auth',token).send(user);
    //     });
    // }).catch((e)=>{
    //     res.status(400).send();
    // });
});

app.delete('/users/me/token',authenticate, async(req,res)=>{
    try {
        await req.user.removeToken(req.token);
        res.status(200).send();
    } catch (e) {
        res.status(400).send();
    }
    
    // req.user.removeToken(req.token).then(()=>{
    //     //res.status(200).send();
    //     res.sendStatus(200);
    // },()=>{
    //     res.status(400).send();
    // })
});
app.listen(port,()=>{
    console.log(`Started onport ${port}`);
    
});

module.exports={app};
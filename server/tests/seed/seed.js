const {ObjectID}=require('mongodb');
const jwt=require('jsonwebtoken');
const {Todo}=require('./../../models/todo');
const {User}=require('./../../models/users');

const userOneId=new ObjectID();
const userTwoId=new ObjectID();
const users =[{
    _id:userOneId,
    email:'mukul@xyz.com',
    password:'abc@1230',
    tokens:[{
        access:'auth',
        token:jwt.sign({_id:userOneId,access:'auth'},'abc123').toString()
    }]
},{
    _id:userTwoId,
    email:'mku@xyz.com',
    password:'userTwoPass'
}];
const todos=[{
    _id:new ObjectID(),
    text:'Fist text todo'
},{
    _id:new ObjectID(),
    text:'Second test todo',
    completed:true,
    completedAt:333
}];

const populateTodos=(done)=>{
    Todo.remove({}).then(()=>{
        Todo.insertMany(todos);
    }).then(()=>done());
};
const populateUsers=(done)=>{
    User.remove({}).then(()=>{
        var userOne=new User(users[0]).save();
        var userTwo=new User(users[1]).save();
        return Promise.all([userOne,userTwo])
    }).then(()=>done());
 };
module.exports={todos,populateTodos,users,populateUsers};
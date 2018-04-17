const {ObjectID}=require('mongodb');

const {mongoose}=require('./../server/db/mongoose');
const {Todo}=require('./../server/models/todo');
const {User}=require('./../server/models/users');

// var id='5ad5a0704c1f6e3368bbfe6a';
// if(!ObjectID.isValid(id)){
//     console.log('ID is not valid.')
// }
// Todo.find({
//     _id:id
// }).then((todos)=>{
//     console.log('Todos: ',todos);
// });

// Todo.findOne({
//     completed:false
// }).then((todo)=>{
//     console.log('Todo: ',todo);
// });

// Todo.findById(id).then((todo)=>{
//     if(!todo){
//         return console.log('Id not found.');
//     }
//     console.log('Todo by id: ',todo);
// }).catch((err)=>console.log(err));

var uId='5ad4b815667f3e39501ef33a';
if(!ObjectID.isValid(uId)){
    console.log('User id is not valid.');
}
User.findById(uId).then((user)=>{
    if(!user){
        return console.log('User not found.');
    }
    console.log('User: ',user);
},(e)=>{
    console.log(e);
}).catch((err)=>console.log(err));
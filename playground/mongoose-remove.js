const {ObjectID}=require('mongodb');

const {mongoose}=require('./../server/db/mongoose');
const {Todo}=require('./../server/models/todo');
const {User}=require('./../server/models/users');

//Remove all data
// Todo.remove({}).then((result)=>{
//     console.log(result);
// });

Todo.findByIdAndRemove('5ad6d16f3eabe915aa601cfc').then((todo)=>{
    console.log(todo); 
});
Todo.findOneAndRemove({_id:'5ad6d16f3eabe915aa601cfc'}).then((todo)=>{
    console.log(todo);
});
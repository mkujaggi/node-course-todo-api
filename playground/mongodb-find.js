//const MongoClient=require('mongodb').MongoClient;
const {MongoClient, ObjectID}=require('mongodb');//object destructring this same as code above


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err){
        return console.log('Unable to connect to MongoDB server.');
    }
    console.log('Connected to MongoDB server.');
    const db=client.db('TodoApp');
    // db.collection('Todos').find({
    //     _id:new ObjectID("5ad3328002e82c30bc6fb2bf")
    // }).toArray().then((docs)=>{
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs,undefined,2));
    // },(err)=>{
    //     console.log('Unable to fetch Todos.',err);
    // });
    // db.collection('Todos').find().count().then((count)=>{
    //     console.log(`Total count:: ${count}`);
    // },(err)=>{
    //     console.log('Unable to count. ',err);
    // });
    db.collection('Users').find({name:'Mukul'}).toArray().then((docs)=>{
        console.log('users');
        console.log(JSON.stringify(docs,undefined,2));
    },(err)=>{
        console.log('Unable to fetch Users.',err);
    });
    //client.close();
});
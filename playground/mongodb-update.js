//const MongoClient=require('mongodb').MongoClient;
const {MongoClient, ObjectID}=require('mongodb');//object destructring this same as code above


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err){
        return console.log('Unable to connect to MongoDB server.');
    }
    console.log('Connected to MongoDB server.');
    const db=client.db('TodoApp');
    // db.collection('Todos').findOneAndUpdate({_id: new ObjectID("5ad3330c3283540dd02ddec0")},
    // {
    //     $set:{
    //         complete:true
    //     }
    // },{
    //     returnOriginal:false
    // }).then((result)=>{
    //     console.log(result);
    // });
    db.collection('Users').findOneAndUpdate({_id:new ObjectID("5ad4326eacb82f3fb44cbdc5")}
    ,{
        $set:{
            name:'Mukul'
        },
        $inc:{
            age:1
        }
    },{
        returnOriginal:false
    }).then((results)=>{
        console.log(results);
    });
    //client.close();
});
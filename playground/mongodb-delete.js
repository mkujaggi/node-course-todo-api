//const MongoClient=require('mongodb').MongoClient;
const {MongoClient, ObjectID}=require('mongodb');//object destructring this same as code above


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
    if(err){
        return console.log('Unable to connect to MongoDB server.');
    }
    console.log('Connected to MongoDB server.');
    const db=client.db('TodoApp');
    //delete Many
    // db.collection('Todos').deleteMany({text:'go to gym'}).then((result)=>{
    //     console.log(result);
    // });
    // //delete one
    // db.collection('Todos').deleteOne({text:'ROI'}).then((result)=>{
    //     console.log(result);
    // })
    //find and delete 
    // db.collection('Todos').findOneAndDelete({complete: false}).then((result)=>{
    //     console.log(result);
    // });
    db.collection('Users').deleteMany({name:'Mukul'});
    db.collection('Users').findOneAndDelete({_id: new ObjectID("5ad432919aa27c3e1c40a31a")}).then((result)=>{
        console.log(JSON.stringify(result,undefined,2));
    });
    //client.close();
});
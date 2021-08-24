const mongodb=require('mongodb')
const mongoClient=mongodb.MongoClient
const connectionUrl='mongodb://127.0.0.1:27017'

    mongoClient.connect(connectionUrl,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log('error has occurred')
    }
    console.log('success')
    })
import mongoose from "mongoose";

const MongoDBURL = process.env.MONGODB_URI || "mongodb+srv://Tejas:Teju1234@cluster0.s5deqno.mongodb.net/?appName=Cluster0"

export const mongoConnect = async ()=>{
    try{
        await mongoose.connect(MongoDBURL)
        console.log("MongoDB Connected")
    }catch(err){
        console.log("Mongodb Connection error",err)
    }

}
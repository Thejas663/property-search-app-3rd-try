import mongoose from "mongoose";
const propertySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        unique:true,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    }

})

export default mongoose.model("Property",propertySchema);
import mongoose from "mongoose";
const propertySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
    },
    bedrooms:{
        type:Number,
        default:0
    },
    bathrooms:{
        type:Number,
        default:0
    },
    parkings:{
        type:Number,
        default:0
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        }
    }
})

propertySchema.index({ location: "2dsphere" });

export default mongoose.model("Property",propertySchema);
import { propertyMake } from "../services/Property.js";

export const makeProperty = async(req,res)=>{
    try{
        const data = await propertyMake(req.body)
        res.status(200).json({
            success:true,
            message:"property created successfully",
            data    
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:"property creation failed",
            error:err.message
        })
        
    }

}
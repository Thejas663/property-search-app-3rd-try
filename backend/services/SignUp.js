import User from "../models/User.Model.js";
import bcrypt from "bcrypt"

export const SignUp = async ({name,email,password})=>{
    
   const existingUser = await User.findOne({email})
   if(existingUser){
        throw new Error("User already Exist")
    
   }
   
   const hashedPassword = await bcrypt.hash(password,10)
   
    const newUser = await User.create({
        name,
        email,
        password:hashedPassword
   })

   return{
    user:{
        id:newUser._id,
        name:newUser.name,
        email:newUser.email
    }
   }



}
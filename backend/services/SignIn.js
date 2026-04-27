import { BiCurrentLocation } from "react-icons/bi";
import User from "../models/User.Model.js";
import bcrypt from "bcrypt"

export const SignIn = async ({email,password})=>{
    
   const existingUser = await UserModel.findOne({email})

   if(!existingUser){
    
        throw new Error("User not Registered")
    
   }

   const isPassword = await bcrypt.compare(
    password,
    existingUser.password
   )

   if(isPassword){
    return{
        user:{
            id:existingUser._id,
            name:existingUser.name,
            email:existingUser.email
        }
    }
   }

   throw new Error("Password is Incorrect")

  


}
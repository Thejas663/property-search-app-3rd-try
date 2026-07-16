import User from "../models/User.Model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const SignIn = async ({email,password})=>{
    
   const existingUser = await User.findOne({email})

   if(!existingUser){
        throw new Error("User not Registered")
   }

   const isPassword = await bcrypt.compare(
    password,
    existingUser.password
   )

   if(isPassword){
    const secret = process.env.JWT_SECRET || 'supersecretkey';
    const token = jwt.sign(
      { id: existingUser._id, name: existingUser.name, email: existingUser.email },
      secret,
      { expiresIn: '7d' }
    );

    return{
        user:{
            id:existingUser._id,
            name:existingUser.name,
            email:existingUser.email
        },
        token
    }
   }

   throw new Error("Password is Incorrect")
}

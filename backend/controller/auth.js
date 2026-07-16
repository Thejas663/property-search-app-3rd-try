

import { SignUp } from "../services/SignUp.js"
import { SignIn } from "../services/SignIn.js"

//signup
export const  signUp = async (req,res)=>{
    try{
        const data = await SignUp(req.body)

        res.status(201).json({
            success:true,
            message:"User Created Successfully",
            data
        })
    }catch(err){
        console.log(err)
        res.status(400).json({
            success:false,
            message:err.message || "User Creation Failed"
        })

    }


}

//signin
export const  signin = async (req,res)=>{
    try{
        const data = await SignIn(req.body)

        res.status(200).json({
            success:true,
            message:"User SignedIn Successfully",
            data
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:err.message || "Password is Incorrect"
        })

    }


}
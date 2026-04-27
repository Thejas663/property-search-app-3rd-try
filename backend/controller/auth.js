
import { data } from "react-router-dom"
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
        res.status(500).json({
            success:false,
            message:"User Creation Failed"
        })

    }


}

//signin
export const  signin = async (req,res)=>{
    try{
        const data = await SignIn(req.body)

        res.status(201).json({
            success:true,
            message:"User SignedIn Successfully",
            data
        })
    }catch(err){
        res.status(500).json({
            success:false,
            message:err
        })

    }


}
import express from "express"
import { signin, signUp } from "../controller/auth.js";


const RegisterRouter = express.Router()

RegisterRouter.post('/signUp', signUp)
RegisterRouter.post('/signIn', signin)

export default RegisterRouter
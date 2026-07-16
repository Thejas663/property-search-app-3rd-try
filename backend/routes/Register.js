import express from "express"
import { signin, signUp } from "../controller/auth.js";
import { validateRequest, signUpSchema, signInSchema } from "../middleware/validate.js";


const RegisterRouter = express.Router()

RegisterRouter.post('/signUp', validateRequest(signUpSchema), signUp)
RegisterRouter.post('/signIn', validateRequest(signInSchema), signin)

export default RegisterRouter
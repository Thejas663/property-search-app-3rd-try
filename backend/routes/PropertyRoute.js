import express from "express"
import { makeProperty } from "../controller/property.js"

const PropertyRouter = express.Router()

PropertyRouter.post('/property',makeProperty)



export default PropertyRouter
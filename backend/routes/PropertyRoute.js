import express from "express"
import { makeProperty, getProperties } from "../controller/property.js"

const PropertyRouter = express.Router()

PropertyRouter.post('/property', makeProperty)
PropertyRouter.get('/property', getProperties)


export default PropertyRouter
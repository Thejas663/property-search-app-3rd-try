import express from "express"
import { makeProperty, getProperties, getNearby, getMyProperties, editProperty, removeProperty } from "../controller/property.js"
import { requireAuth } from "../middleware/auth.js"
import { validateRequest, propertySchema } from "../middleware/validate.js"

const PropertyRouter = express.Router()

PropertyRouter.post('/property', requireAuth, validateRequest(propertySchema), makeProperty)
PropertyRouter.get('/property', getProperties)
PropertyRouter.get('/nearby', getNearby)
PropertyRouter.get('/my-properties', requireAuth, getMyProperties)
PropertyRouter.put('/property/:id', requireAuth, validateRequest(propertySchema), editProperty)
PropertyRouter.delete('/property/:id', requireAuth, removeProperty)


export default PropertyRouter
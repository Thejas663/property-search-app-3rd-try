import PropertyModel from "../models/Property.Model.js";

export const propertyMake = async ({user,title,description,price,image})=>{
    
   if(!user){
    
        throw new Error("SignIn to make property")
    
   }


    const newProperty = await PropertyModel.create({
        title:title,
        description:description,
        price:price,
        image:image
    })

    return{
        property:{
            id:newProperty._id,
            title:newProperty.title,
            description:newProperty.description,
            price:newProperty.price,
            image:newProperty.image
        }
    }



  


}
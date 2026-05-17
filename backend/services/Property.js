import PropertyModel from "../models/Property.Model.js";

export const propertyMake = async ({user, title, description, price, image}) => {
  if (!user) {
    throw new Error("SignIn to make property")
  }

  const newProperty = await PropertyModel.create({
    title,
    description,
    price,
    image
  })

  return {
    property: {
      id: newProperty._id,
      title: newProperty.title,
      description: newProperty.description,
      price: newProperty.price,
      image: newProperty.image
    }
  }
}

export const getAllProperties = async () => {
  const properties = await PropertyModel.find({})
  return properties.map((property) => ({
    id: property._id,
    title: property.title,
    description: property.description,
    price: property.price,
    image: property.image
  }))
}

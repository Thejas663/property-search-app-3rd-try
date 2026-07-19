import PropertyModel from "../models/Property.Model.js";

export const propertyMake = async ({user, title, description, price, image, city, bedrooms, bathrooms, parkings, latitude, longitude}) => {
  if (!user) {
    throw new Error("SignIn to make property")
  }

  const location = (latitude !== undefined && longitude !== undefined) ? {
    type: "Point",
    coordinates: [longitude, latitude]
  } : undefined;

  const newProperty = await PropertyModel.create({
    title,
    description,
    price,
    image,
    city,
    bedrooms,
    bathrooms,
    parkings,
    createdBy: user.id,
    ...(location && { location })
  })

  return {
    property: {
      id: newProperty._id,
      title: newProperty.title,
      description: newProperty.description,
      price: newProperty.price,
      image: newProperty.image,
      city: newProperty.city,
      bedrooms: newProperty.bedrooms,
      bathrooms: newProperty.bathrooms,
      parkings: newProperty.parkings,
      createdBy: newProperty.createdBy,
      latitude: newProperty.location?.coordinates?.[1],
      longitude: newProperty.location?.coordinates?.[0]
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
    image: property.image,
    city: property.city,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    parkings: property.parkings,
    createdBy: property.createdBy,
    latitude: property.location?.coordinates?.[1],
    longitude: property.location?.coordinates?.[0]
  }))
}

export const getNearbyProperties = async (lat, lng, radiusKm) => {
  const radiusMeters = radiusKm * 1000;
  const properties = await PropertyModel.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat]   // MongoDB: [longitude, latitude]
        },
        $maxDistance: radiusMeters
      }
    }
  });
  return properties.map((property) => ({
    id: property._id,
    title: property.title,
    description: property.description,
    price: property.price,
    image: property.image,
    city: property.city,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    parkings: property.parkings,
    createdBy: property.createdBy,
    latitude: property.location?.coordinates?.[1],
    longitude: property.location?.coordinates?.[0]
  }))
}

export const getUserProperties = async (userId) => {
  const properties = await PropertyModel.find({ createdBy: userId })
  return properties.map((property) => ({
    id: property._id,
    title: property.title,
    description: property.description,
    price: property.price,
    image: property.image,
    city: property.city,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    parkings: property.parkings,
    createdBy: property.createdBy,
    latitude: property.location?.coordinates?.[1],
    longitude: property.location?.coordinates?.[0]
  }))
}

export const updateProperty = async (propertyId, userId, updateData) => {
  const property = await PropertyModel.findOne({ _id: propertyId, createdBy: userId })
  if (!property) {
    throw new Error("Property not found or you are not authorized to edit this property")
  }

  // Update allowed fields
  const fields = ['title', 'description', 'price', 'image', 'city', 'bedrooms', 'bathrooms', 'parkings']
  fields.forEach(field => {
    if (updateData[field] !== undefined) {
      property[field] = updateData[field]
    }
  })

  if (updateData.latitude !== undefined && updateData.longitude !== undefined) {
    property.location = {
      type: "Point",
      coordinates: [updateData.longitude, updateData.latitude]
    }
  }

  await property.save()
  return {
    id: property._id,
    title: property.title,
    description: property.description,
    price: property.price,
    image: property.image,
    city: property.city,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    parkings: property.parkings,
    createdBy: property.createdBy,
    latitude: property.location?.coordinates?.[1],
    longitude: property.location?.coordinates?.[0]
  }
}

export const deleteProperty = async (propertyId, userId) => {
  const property = await PropertyModel.findOneAndDelete({ _id: propertyId, createdBy: userId })
  if (!property) {
    throw new Error("Property not found or you are not authorized to delete this property")
  }
  return { success: true }
}

import { propertyMake, getAllProperties, getUserProperties, updateProperty, deleteProperty } from "../services/Property.js";

export const makeProperty = async (req, res) => {
  try {
    const data = await propertyMake({ user: req.user, ...req.body })
    res.status(200).json({
      success: true,
      message: "property created successfully",
      data
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "property creation failed",
      error: err.message
    })
  }
}

export const getProperties = async (req, res) => {
  try {
    const data = await getAllProperties()
    res.status(200).json({
      success: true,
      data
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Could not load properties",
      error: err.message
    })
  }
}

export const getMyProperties = async (req, res) => {
  try {
    const data = await getUserProperties(req.user.id)
    res.status(200).json({
      success: true,
      data
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Could not load user properties",
      error: err.message
    })
  }
}

export const editProperty = async (req, res) => {
  try {
    const data = await updateProperty(req.params.id, req.user.id, req.body)
    res.status(200).json({
      success: true,
      message: "Property updated successfully",
      data
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Property update failed",
      error: err.message
    })
  }
}

export const removeProperty = async (req, res) => {
  try {
    await deleteProperty(req.params.id, req.user.id)
    res.status(200).json({
      success: true,
      message: "Property deleted successfully"
    })
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Property deletion failed",
      error: err.message
    })
  }
}

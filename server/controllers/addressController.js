import Address from "../models/Address.js";

//  Add Address : /api/address/add
export const addAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const data = req.body;

    

     const address = await Address.findOneAndUpdate(
      { userId },          
      { ...data, userId }, 
      {  upsert: true, returnDocument: 'after' } 
    );

    res.json({ success: true, message: "Address saved", address });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//  Get All Addresses (user specific) : /api/address/get
export const getUserAddress = async (req, res) => {
  try {
    const userId = req.userId;

    const addresses = await Address.find({ userId });

    res.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//  Delete Address : /api/address/
export const deleteAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const address = await Address.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!address) {
      return res.json({
        success: false,
        message: "Address not found",
      });
    }

    res.json({
      success: true,
      message: "Address deleted",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

//  Update Address
export const updateAddress = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const updated = await Address.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.json({
        success: false,
        message: "Address not found",
      });
    }

    res.json({
      success: true,
      message: "Address updated",
      address: updated,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
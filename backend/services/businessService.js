import Business from "../models/businessModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerBusiness = async ({ businessName, category, phoneNumber, password }) => {
  const businessExists = await Business.findOne({ phoneNumber });
  if (businessExists) {
    throw new Error("Business with this phone number already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const business = await Business.create({
    businessName,
    category,
    phoneNumber,
    password: hashedPassword,
  });

  const token = jwt.sign({ id: business._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

  return { token, business: { _id: business._id, businessName: business.businessName, category: business.category, phoneNumber: business.phoneNumber } };
};

export const loginBusiness = async ({ businessName, password }) => {
    const business = await Business.findOne({ businessName });
    if (!business || !(await bcrypt.compare(password, business.password))) {
      throw new Error("Invalid credentials");
    }
  
    const token = jwt.sign({ id: business._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  
    return { token, business: { _id: business._id, businessName: business.businessName, phoneNumber: business.phoneNumber, category: business.category } };
  };
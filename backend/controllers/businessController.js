// backend/controllers/businessController.js
import Business from '../models/businessModel.js';
import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new business
// @route   POST /api/businesses/register
// @access  Public
const registerBusiness = asyncHandler(async (req, res) => {
  const { businessName, businessType, phoneNumber, password } = req.body;

  const businessExists = await Business.findOne({ businessName });

  if (businessExists) {
    res.status(400);
    throw new Error('Business already exists');
  }

  const business = await Business.create({
    businessName,
    businessType,
    phoneNumber,
    password,
  });

  if (business) {
    res.status(201).json({
      _id: business._id,
      businessName: business.businessName,
      businessType: business.businessType,
      phoneNumber: business.phoneNumber,
      token: generateToken(business._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid business data');
  }
});

// @desc    Authenticate business & get token
// @route   POST /api/businesses/login
// @access  Public
const authBusiness = asyncHandler(async (req, res) => {
  const { businessName, password } = req.body;

  const business = await Business.findOne({ businessName });

  if (business && (await business.matchPassword(password))) {
    res.json({
      _id: business._id,
      businessName: business.businessName,
      businessType: business.businessType,
      phoneNumber: business.phoneNumber,
      token: generateToken(business._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid business name or password');
  }
});

export { registerBusiness, authBusiness };
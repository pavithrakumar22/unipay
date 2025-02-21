import Business from '../models/businessModel.js';
import Event from '../models/EventModel.js';

export const createEvent = async (req, res, next) => {
  try {
    const { organiserId, ...eventData } = req.body;
    
    const business = await Business.findOne({ phoneNumber: organiserId });
    if (!business) {
      return res.status(400).json({ success: false, message: 'Invalid organiserId: business not found.' });
    }
    
    const event = new Event({ organiserId, ...eventData });
    const savedEvent = await event.save();
    return res.status(201).json({ success: true, data: savedEvent });
  } catch (error) {
    next(error);
  }
};



export const updateEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;
    const { loggedInBusinessPhoneNumber, ...updateData } = req.body;

    if (!loggedInBusinessPhoneNumber) {
      return res.status(400).json({ success: false, message: 'Logged in business phone number is required.' });
    }

    const updatedEvent = await Event.updateEventDetails(eventId, loggedInBusinessPhoneNumber, updateData);

    if (!updatedEvent) {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this event or event not found.' });
    }
    return res.status(200).json({ success: true, data: updatedEvent });
  } catch (error) {
    next(error);
  }
};



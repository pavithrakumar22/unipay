import Event from "../models/EventModel.js"

const createEvent = async (eventData) => {
  const event = new Event(eventData);
  return await event.save();
};

const updateEvent = async (eventId, loggedInBusinessPhoneNumber, updateData) => {
    const event = await Event.findById(eventId);
    if (!event) {
      return null;
    }
  
    if (event.organiserId !== loggedInBusinessPhoneNumber) {
      return null;
    }
  
    Object.assign(event, updateData);
  
    return await event.save();
  };
  

  export default { createEvent,updateEvent };

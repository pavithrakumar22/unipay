import Event from "../models/EventModel.js"

const createEvent = async (eventData) => {
  // You can include additional business logic here if needed
  const event = new Event(eventData);
  return await event.save();
};

const updateEvent = async (eventId, loggedInBusinessPhoneNumber, updateData) => {
    // Find the event by its ID
    const event = await Event.findById(eventId);
    if (!event) {
      return null;
    }
  
    // Compare event.organiserId with the provided loggedInBusinessPhoneNumber
    if (event.organiserId !== loggedInBusinessPhoneNumber) {
      return null;
    }
  
    // Update allowed fields
    Object.assign(event, updateData);
  
    return await event.save();
  };
  

  export default { createEvent,updateEvent };

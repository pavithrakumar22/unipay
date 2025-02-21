import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const eventSchema = new Schema(
  {
    organiserId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    durationToBuyPasses: {
      type: Number, 
      required: true,
    },
    numberOfPasses: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

eventSchema.statics.updateEventDetails = async function(eventId, loggedInBusinessPhoneNumber, updateData) {
    const event = await this.findById(eventId);
    if (!event) {
      return null;
    }
    if (event.organiserId !== loggedInBusinessPhoneNumber) {
      return null;
    }
    Object.assign(event, updateData);
    return event.save();
  };

eventSchema.methods.reducePasses = async function () {
    if (this.numberOfPasses <= 0) {
      throw new Error('No passes available');
    }
    this.numberOfPasses = this.numberOfPasses - 1;
    return this.save();
  };

export default model('Event', eventSchema);

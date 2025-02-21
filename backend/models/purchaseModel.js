import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const purchaseSchema = new Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    userId: {  // Identifier for the user who purchased the pass
      type: String,
      required: true,
    },
    // Additional transaction details can be added here
  },
  { timestamps: true }
);

export default model('Purchase', purchaseSchema);

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const purchaseSchema = new Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    userId: {  
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model('Purchase', purchaseSchema);

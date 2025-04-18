const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:'User' // reference to the user collection here 'User' is model name
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref:"User"
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "accepted", "rejected", "interested"],
        message: "{VALUE} is incorrect",
      },
    },
  },
  { timestamps: true }
);

connectionRequestSchema.pre("save", function (next) {
  // this will run every time when we run save before saving , never forget to add next()
  // note we can check in the api itself
  const connectionRequest = this;
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error("You can't send request to yourself");
  }
  next()
});

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }) // Compound Indexing
// 1 means ascending order, -1 means descending order
// unique: true means we can't have same fromUserId and toUserId combination
const ConnectRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectRequestModel;

const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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
const ConnectRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = ConnectRequestModel;

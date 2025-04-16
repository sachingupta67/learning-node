const mongoose = require("mongoose");
const uri =
  "mongodb+srv://sachingupta769:kfOXK9o2iukT1WZF@namastenode-dev.6ctfxf3.mongodb.net/?retryWrites=true&w=majority&appName=NamasteNode-Dev";

const connectDB = async () => await mongoose.connect(uri);
module.exports = { connectDB };


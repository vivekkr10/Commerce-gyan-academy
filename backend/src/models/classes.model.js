import mongoose from "mongoose";

const classesSchema = new mongoose.Schema({
  classesName: { type: String, required: true, unique: true, trim: true },
},{timestamps:true});

export default mongoose.model("Classes", classesSchema);
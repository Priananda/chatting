import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  receiverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

messageSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();  
    ret.senderId = ret.senderId?.toString();
    ret.receiverId = ret.receiverId?.toString(); 
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model("Message", messageSchema);

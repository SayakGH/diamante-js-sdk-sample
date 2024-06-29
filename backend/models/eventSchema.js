import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    organizer: {//email of the one who created the event
        type: String,
        required: true,
    },
    Code: {
        type: String,
        required: true
    }
});

const Event  = mongoose.model("event", eventSchema);
export default Event;
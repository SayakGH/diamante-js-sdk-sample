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
    hostingCode: {
        type: String,
        required: true
    },
    participationCode: {
        type: String,
        required: true,
    }
});

const Event  = mongoose.model("event", eventSchema);
export default Event;
import mongoose from 'mongoose';

const banSchema = new mongoose.Schema(
    {
        cmd: { type: "String", required: true },
        reason: { type: String, default: "No reason provided", required: true },
        appealable: { type: Boolean, default: true, required: true }
    }
)

const userSchema = new mongoose.Schema(
    {
        user: { type: String, index: true, required: true },

        flags: {
            isBannedFrom: [banSchema]
        },

        badges: { type: [String], default: [] },

        afk: {
            message: { type: String, default: null },
            time: { type: Date, default: null }
        },

        config: {
            colour: { type: String, default: "#f3b3d3" }
        }
    }
);

export default mongoose.model('User', userSchema);
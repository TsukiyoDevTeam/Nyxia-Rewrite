import mongoose from 'mongoose';

const banSchema = new mongoose.Schema(
    {
        cmd: { type: "String", required: true },
        reason: { type: String, required: true },
        appealable: { type: Boolean, required: true }
    }
)

const userSchema = new mongoose.Schema(
    {
        user: { type: String, index: true, required: true },

        flags: {
            isBannedFrom: [banSchema]
        },

        badges: { type: [String] },

        afk: {
            message: { type: String },
            time: { type: Date }
        },

        config: {
            colour: { type: String, default: "#f8bed2" }
        }
    }
);

export default mongoose.model('User', userSchema);
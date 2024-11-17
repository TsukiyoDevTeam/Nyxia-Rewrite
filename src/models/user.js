import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        user: { type: String, index: true, required: true },

        flags: {
            isBannedFrom: { type: [String], default: [] }
        },

        badges: { type: [String], default: [] },

        afk: {
            message: { type: String, default: null },
            time: { type: Date, default: null },
            global: { type: Boolean, default: false }
        },

        config: {
            lang: { type: String, default: "english" },
            colour: { type: String, default: "#f3b3d3" }
        }
    }
);

export default mongoose.model('User', userSchema);
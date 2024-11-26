import mongoose from 'mongoose';


const guildSchema = new mongoose.Schema(
    {
        guild: { type: String, index: true, required: true },

        flags: {
            isBannedFrom: { type: [String], default: [] },
            isPremium: { type: Boolean, default: false }
        },

        config: {
            general: {
                main_chat: { type: String, default: null },
            },
            confess: {
                channel: { type: String, default: null },
                logs: {
                    enabled: { type: Boolean, default: false },
                    channel: { type: String, default: null }
                }
            }
        }
    }
);

export default mongoose.model('Guild', guildSchema);
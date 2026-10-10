import { Schema, model } from 'mongoose';

const participantSchema = new Schema({
    tournament: { type: Schema.Types.ObjectId, ref: 'Tourney', required: true, index: true },
    name: { type: String, required: true, trim: true },
    score: { type: Number, required: true }
}, { timestamps: true });

const Participant = model('Participant', participantSchema);

export default Participant;

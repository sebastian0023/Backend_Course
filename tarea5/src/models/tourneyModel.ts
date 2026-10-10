import { Schema, model } from 'mongoose';

const tourneySchema = new Schema({
    name: { type: String, required: true, trim: true },
    registrationDeadline: { type: Date, required: true },
    eventDate: { type: Date, required: true }
}, { timestamps: true });

const Tourney = model('Tourney', tourneySchema);

export default Tourney;

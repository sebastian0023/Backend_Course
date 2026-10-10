import { Schema, model } from 'mongoose';

// Un lugar dentro de un enfrentamiento: un participante, un "Bye" o un lugar
// todavía sin definir (name null e isBye false) que se llenará con el ganador
// de la ronda anterior.
const slotSchema = new Schema({
    participant: { type: Schema.Types.ObjectId, ref: 'Participant', default: null },
    name: { type: String, default: null },
    seed: { type: Number, default: null },
    isBye: { type: Boolean, default: false }
}, { _id: false });

const matchSchema = new Schema({
    matchNumber: { type: Number, required: true },
    player1: { type: slotSchema, required: true },
    player2: { type: slotSchema, required: true },
    winner: { type: slotSchema, default: undefined }
}, { _id: false });

const roundSchema = new Schema({
    round: { type: Number, required: true },
    name: { type: String, required: true },
    matches: { type: [matchSchema], default: [] }
}, { _id: false });

const bracketSchema = new Schema({
    tournament: { type: Schema.Types.ObjectId, ref: 'Tourney', required: true, unique: true },
    size: { type: Number, required: true },
    rounds: { type: [roundSchema], default: [] }
}, { timestamps: true });

const Bracket = model('Bracket', bracketSchema);

export default Bracket;

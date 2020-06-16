mongoose = require('mongoose');
const { Schema } = mongoose;

noteSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    id: { type: String }
});

module.exports = mongoose.model('notes', noteSchema);
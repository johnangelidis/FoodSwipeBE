const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let recipeSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    ingredients: {
        type: [String],
        required: false
    },
    directions: {
        type: [String],
        required: false
    }
}, {
    timestamps: false,
    _id: false
});

module.exports = recipeSchema;
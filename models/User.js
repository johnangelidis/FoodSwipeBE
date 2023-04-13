const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const recipeSchema = require("../models/Recipe")
let userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    savedRecipes: {
        type: [recipeSchema],
        required: true
    }
}, {
    timestamps: true,
    collection: process.env.USERS_COLLECTION
})

module.exports = mongoose.model('User', userSchema);
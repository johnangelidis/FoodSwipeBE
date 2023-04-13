const express = require('express');
const router = express.Router();

const {getUserRecipes, saveRecipe, removeRecipe} = require('../controllers/recipe');

router.get('/recipes', getUserRecipes);
router.put('/save', saveRecipe);
router.delete('/delete', removeRecipe);

module.exports = router;
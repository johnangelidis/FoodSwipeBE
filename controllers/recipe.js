const User = require("../models/User")

const getUserRecipes = (req, res) => {
    let { userId } = req.query;

    let errors = [];
    if (!userId) {
        errors.push({ userId: "required" });
    }

    User.findOne({_id: userId}).then(user => {
        if(!user) {
            return res.status(404).send("User not found");
        }
        res.status(200).json(user.savedRecipes);
    }).catch(err => {
        console.error(err);
        res.status(500).send('Internal Server Error');
    });
}

const saveRecipe = (req, res) => {
    let { userId, recipe } = req.body;

    let errors = [];
    if (!userId) {
        errors.push({ userId: "required" });
    }
    if (!recipe) {
        errors.push({ recipe: "required" });
    }
    User.findOneAndUpdate(
        { _id: userId, recipe: { $ne: recipe.id } },
        { $addToSet: { savedRecipes: recipe } },
        { new: true }
      )
        .then((updatedUser) => {
          if (updatedUser) {
            res.status(200).json(updatedUser.savedRecipes);
          } else {
            res.status(404).send("User not found");
          }
        })
        .catch((err) => {
          console.error(err);
          res.status(500).send("Internal Server Error");
        });
}

const removeRecipe = (req, res) => {
    let { userId, id } = req.body;
    let errors = [];
    if (!userId) {
        errors.push({ userId: "required" });
    }
    if (!id) {
        errors.push({ id: "required" });
    }

    User.findOneAndUpdate(
        {_id: userId},
        { $pull: {
            savedRecipes: {
                id: id
            }
        }},
        {new: true}
    ).then(updatedUser => {
        res.status(200).json(updatedUser.savedRecipes);
    }).catch(err => {
        console.error(err);
        res.status(500).send('Internal Server Error');
    });
}

module.exports = {
    getUserRecipes,
    saveRecipe,
    removeRecipe,
}
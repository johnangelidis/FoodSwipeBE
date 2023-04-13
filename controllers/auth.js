const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { createJWT } = require('../utils/auth');

exports.register = (req, res , next) => {
    let { name, email, password, passwordConfirmation, savedRecipes } = req.body;
    let errors = [];
    if (!name) {
        errors.push({ name: "required" });
      }
      if (!email) {
        errors.push({ email: "required" });
      }
      if (!password) {
        errors.push({ password: "required" });
      }
      if (!passwordConfirmation) {
        errors.push({
         passwordConfirmation: "required",
        });
      }
      if (!savedRecipes) {
        errors.push({ savedRecipes: "required" });
      }
      if (password != passwordConfirmation) {
        errors.push({ password: "mismatch" });
      }
      if (errors.length > 0) {
        return res.status(422).json({ errors: errors });
      }
      User.findOne({email: email})
      .then(user => {
          if(user){
              return res.status(422).json({ errors: [{ user: "Email already exists" }] });
          }
          else {
            const saltRounds = 8;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);
            const user = new User({
                name: name,
                email: email,
                password: hash,
                savedRecipes: savedRecipes
            });
            user.save().then(response => {
                res.status(200).json({
                    success: true,
                    result: response
                })
            }).catch(err => {
                res.status(500).json({
                    errors: [{ error: err }]
                });
            });
          }
      }).catch(err => {
          res.status(500).json({
              errors: [{ error: 'Error while searching for user: ' + err }]
          });
      });
}

exports.login = (req, res) => {
    let {email, password} = req.body;
    let errors = [];
     if (!email) {
       errors.push({ email: "required" });
     }
     if (!password) {
       errors.push({ passowrd: "required" });
     }
     if (errors.length > 0) {
      return res.status(422).json({ errors: errors });
     }
    User.findOne({ email: email }).then(user => {
        if(!user) {
            return res.status(404).json({
                errors: [{ user: "Not found" }],
            });
        }
        else {
            bcrypt.compare(password, user.password).then(isMatch => {
                if(!isMatch) {
                    return res.status(400).json({
                        errors: [{ password: "Incorrect password" }]
                    });
                }
                let accessToken = createJWT(
                    user.email,
                    user._id,
                    3600
                );
                jwt.verify(accessToken, process.env.TOKEN_SECRET, (err, decoded) => {
                    if(err) {
                        res.status(500).json({ errors: err });
                    }
                    if(decoded) {
                        return res.status(200).json({
                            success: true,
                            token: accessToken,
                            message: user
                        });
                    }
                });
            }).catch(err => {
                res.status(500).json({
                    errors: err
                });
            })
        }
    }).catch(err => {
        res.status(500).json({
            errors: err
        });
    });
}
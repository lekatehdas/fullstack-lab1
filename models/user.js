const mongoose = require('mongoose');
const Joi = require("joi");

// User Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    age: {
        type: Number,
        required: true,
        min: 0
    }
});

// User Model
const User = mongoose.model('User', userSchema);

// Validate customer
function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        age: Joi.number().min(0).required()
    });
    return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;

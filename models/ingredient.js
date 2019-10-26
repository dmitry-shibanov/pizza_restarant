const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ingredientsSchema = new Schema({
    name:{
        type: String,
        required: true
    }
});


module.exports = mongoose.model('Ingredients',ingredientsSchema);
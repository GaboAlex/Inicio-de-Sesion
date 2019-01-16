'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = Schema({
    name:String,
    description:String,
    category:String,
    langs:String,
    year:Number,
    image:String
});

module.exports = mongoose.model('Project',ProjectSchema);

//Mongoose automáticamente, cambia Project => projects en la base de datos
//en MongoDB


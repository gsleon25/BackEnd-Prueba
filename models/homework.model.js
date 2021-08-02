'use strict'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var HomeworkSchema = Schema({
    nameHomework: String,
    description: String,
    urgencyLevel: Number,
    importanceLevel: String,
    schedule: { type: Schema.Types.ObjectId, ref:'schedules'}

});


module.exports = mongoose.model('homeworks', HomeworkSchema);


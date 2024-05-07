const mongoose = require('mongoose');

// Schema for Course Selection
const formDataSchema = new mongoose.Schema({
    unit: String
});

// Compile model from schema
const CourseSelection = mongoose.model('CourseSelection', formDataSchema);

module.exports = CourseSelection;

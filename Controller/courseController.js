const CourseSelection = require('../Model/courseModel.js');

exports.submitCourseForm = async (req, res) => {
    const { unit } = req.body;

    // Validates the input to ensure 'unit' is provided
    if (!unit) {
        return res.status(400).json({ error: 'Unit field is required' });
    }

    try {
        // Creates a new document in the MongoDB database
        const formData = new CourseSelection({ unit });
        await formData.save();

        // Responds with a success message including the saved document
        res.status(200).json({
            message: 'Form submitted successfully',
            data: formData
        });
    } catch (err) {
        // Logs the error and sends an appropriate error message
        console.error('Error submitting form:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

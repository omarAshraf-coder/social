const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://portalrumble123_db_user:Omar123456@cluster0.hfqtkqe.mongodb.net/?retryWrites=true&w=majority');
        console.log('Connected to MongoDB successfully');
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
};

module.exports = connectDB;
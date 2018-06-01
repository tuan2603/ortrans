require('dotenv').config();
module.exports = {
    'secret': process.env.SECRET,
    'bearer': process.env.BEARER,
    'database': process.env.MONGO_URL,
    'AUrl': process.env.port || 80,
    'API_KEY': process.env.NEXMO_API_KEY,
    'API_SECRET': process.env.NEXMO_API_SECRET,
    'NUMBER': 84975227856,
};
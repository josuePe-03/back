const mongoose = require('mongoose');

const DATABASE_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME;
const DATABASE_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD;
const DATABASE_HOST = process.env.DATABASE_HOST;
const DATABASE_PORT = process.env.DATABASE_PORT;
const DB_CNN = process.env.DB_CNN;


const dbConnection = async() => {

    try {
        
        // await mongoose.connect(`mongodb://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}`, {
        await mongoose.connect(`${DB_CNN}`, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('DB Online');


    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de inicializar BD');
    }

}


module.exports = {
    dbConnection
}
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers');

const app = express();
const PORT = process.env.PORT || 4000;

// Database Connection
const DB_NAME = 'comp3133-101481884-Assignment1';
const DB_URL = process.env.MONGODB_URI || `mongodb://localhost:27017/${DB_NAME}`;


mongoose.connect(DB_URL)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => {
        console.error('Error connecting to MongoDB Atlas:', err.message);
        console.error('Make sure your current IP address is whitelisted in MongoDB Atlas Network Access.');
    });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
    // console.log("Connected to MongoDB"); // Already logged in .then()
});

async function startServer() {
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        formatError: (err) => {
            return {
                message: err.message,
                locations: err.locations,
                path: err.path, // Optional
                code: err.extensions?.code // Optional
            };
        }
    });

    await server.start();
    server.applyMiddleware({ app });

    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}${server.graphqlPath}`);
    });
}

startServer();

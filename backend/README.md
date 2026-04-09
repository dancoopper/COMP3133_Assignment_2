# Employee Management System Backend

Backend for an Employee Management System using Node.js, Express, GraphQL (Apollo Server), and MongoDB.

## Prerequisites

- Node.js
- MongoDB

## Setup

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the root directory (see `.env.example` or below):
    ```env
    PORT=4000
    MONGODB_URI=mongodb://localhost:27017/comp3133_101481884_Assignment1
    JWT_SECRET=your_jwt_secret
    ```
4.  Start the server:
    ```bash
    npm start
    ```

## GraphQL API

The API is available at `http://localhost:4000/graphql`.

### Operations

-   **User**: `signup`, `login`
-   **Employee**: `getAllEmployees`, `searchEmployeeByEid`, `searchEmployeeByDesignationOrDepartment`, `addNewEmployee`, `updateEmployeeByEid`, `deleteEmployeeByEid`

## Docker

You can also run the application using Docker.

### Prerequisites

- Docker
- Docker Compose

### Running with Docker Compose

1.  Ensure your `.env` file is set up with valid credentials.
2.  Run the following command:
    ```bash
    docker-compose up --build
    ```
    The server will be available at `http://localhost:4000/graphql`.

### Running with Docker CLI

1.  Build the image:
    ```bash
    docker build -t employee-mgmt-system .
    ```
2.  Run the container:
    ```bash
    docker run -p 4000:4000 --env-file .env employee-mgmt-system
    ```
-   Input validation is implemented in Mongoose models and Resolvers.
-   Employee Salary must be >= 1000.

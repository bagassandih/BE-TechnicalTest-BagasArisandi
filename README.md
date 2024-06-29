# Library Management System - Technical Test for PT. EIGEN TRI MATHEMA
This project is a library management system that includes the following features:
- Checking books and members
- Borrowing books with a maximum limit of 2 books
- Returning books with a penalty system

## Penalty System
- Members will incur a penalty if they return a book more than 7 days after borrowing it.
- Members with penalties will be unable to borrow books for 3 days starting from the return date.

## Technologies Used
- Express.js for the API
- MongoDB (NoSQL) for the database
- Swagger for API documentation
- Jest for unit testing
- Moment.js for date and time management
- Domain-Driven Design (DDD) pattern implementation

## Installation
1. Clone the repository:
    ```sh
    git clone https://github.com/bagassandih/BE-TechnicalTest-BagasArisandi.git
    ```

2. Navigate to the project directory:
    ```sh
    cd BE-TechnicalTest-BagasArisandi/backend-test-case
    ```

3. Install the dependencies:
    ```sh
    npm install
    ```

4. Start the server:
    ```sh
    npm start
    ```

5. Run unit tests:
    ```sh
    npm test
    ```

## Algorithm File
To run the algorithm file:

1. Navigate to the algorithm directory:
    ```sh
    cd BE-TechnicalTest-BagasArisandi/algoritma
    ```

2. Execute the algorithm script:
    ```sh
    node algoritma.js
    ```
## Localhost Port
The server runs on port 3000.

## API Documentation
The API documentation can be accessed at: [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)

Thank you!

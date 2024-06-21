# PollingApp

# Real-time Polling and Chat Application

## Setup

1. Clone the repository:

    ```bash
    git clone https://github.com/Anshika056/PollingApp.git
    cd real-time-polling-chat
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Ensure MongoDB is running:

    ```bash
    mongod
    ```

4. Start the server:

    ```bash
    node server/index.js
    ```

5. Open your browser and go to `http://localhost:3000`.

## Features

- Real-time polling system with live vote updates.
- Real-time chat with other users.
- Basic user authentication using JWT.
- MongoDB for storing poll options, and user information.

## Technical Implementation

- Server-side code using Express, Socket.IO, and Mongoose.
- MongoDB for persistent storage of user data, and poll information.
- Real-time updates and communication using WebSockets with Socket.IO.
- Secure user authentication with bcrypt and JWT.

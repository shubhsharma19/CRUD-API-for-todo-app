# Mini Todo Server with Persistent Storage

This is a simple CRUD API built using Node.js and Express.js that provides basic functionality for managing a todo list. 

The unique feature of this server is its ability to persist data even after the server is closed. It achieves this by storing the todo items in a JSON file (`minidatabase.json`) on the server's file system.

## Features
- **Get All Todos**: Retrieve a list of all todo items.
- **Add a Todo**: Create a new todo item.
- **Get a Specific Todo**: Retrieve information about a specific todo item based on its ID.
- **Update a Todo**: Modify the details of a specific todo item.
- **Delete a Todo**: Remove a specific todo item from the list.

## Installation
1. Clone the repository to your local machine.
2. Install dependencies by running:

```bash
  npm install
```

# Usage

1. Start the server by running:

    ```bash
    npm start
    ```

   The server will run on port 3000 by default.

2. Use the following endpoints to interact with the API:

    - **GET /todos**: Retrieve a list of all todo items.

    - **POST /todos**: Add a new todo item.
        - Request body should include:
            - `title` (string): Title of the todo.
            - `description` (string): Description of the todo.
            - `isCompleted` (boolean): Indicates whether the todo is completed.

    - **GET /todos/:id**: Retrieve a specific todo item by its ID.

    - **PUT /todos/:id**: Update a specific todo item by its ID.
        - Request body should include:
            - `title` (string): Updated title of the todo.
            - `description` (string): Updated description of the todo.
            - `isCompleted` (boolean): Updated completion status.

    - **DELETE /todos/:id**: Delete a specific todo item by its ID.

3. To stop the server, press `Ctrl + C` in the terminal.

# Persistent Storage

All todo items are stored in the `minidatabase.json` file on the server's file system. This allows data to persist even if the server is closed and restarted.

# Error Handling

- If there are issues reading or writing to the file, the server responds with a status code of 500 (Internal Server Error).
- If a requested todo item is not found, the server responds with a status code of 404 (Not Found).
- If there are issues deleting a todo item, the server responds with a status code of 400 (Bad Request) if the todo list is already empty.

# Notes

- The server generates random IDs for new todo items.
- The `findTodoByID` function is used to locate a todo item in the list by its ID.


# 06_berties_33828139 - Berties Books (Lab 6)

This application is "Berties Books," a dynamic web application built with Node.js, Express, and EJS. Critically, it expands on Lab 5 by integrating a **MySQL database** to create a data-driven application.

This project successfully implements:
* **MySQL Database Integration**: Connects to a MySQL database using a connection pool (`mysql2`) to read and write data.
* **Database Read Operations (SELECT)**: Dynamically queries the database to:
    *  Display all books on a `/books/list` page.
    *  Display a filtered list of books (price < £20) on a `/books/bargainbooks` page.
    *  Display partial-match search results using a `LIKE` query.
*  **Database Write Operations (INSERT)**: Uses an HTML form and a `POST` route to securely insert new books into the database.
* **EJS Templating with Partials**: Uses `header.ejs` and `footer.ejs` partials to share the same layout and stylesheet across all pages.
* **Static File Serving**: Serves the `style.css` file from a `public` directory.
* **Separate Route Files**: Organizes routes logically by separating them into `main.js` and `books.js`.

## Technologies Used

* **Node.js**: The JavaScript runtime environment.
* **Express.js**: The web framework used for the server and routing.
* **EJS**: The "Embedded JavaScript" templating engine.
*  **MySQL (mysql2)**: The relational database, and the Node.js driver used to connect to it.

## How to Install and Run Locally

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/](https://github.com/)vnturo/06_berties_33828139
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd 06_berties_33828139
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Set up the local database:**
    * Ensure you have a local MySQL server running.
    * Log in to your MySQL shell (e.g., `mysql -u root -p`).
    * Run the `create_db.sql` script to create the database, tables, and application user:
        ```sql
        source create_db.sql;
        ```
    * Run the `insert_test_data.sql` script to add the first 3 books:
        ```sql
        source insert_test_data.sql;
        ```
5.  **Start the server:**
    ```bash
    node index.js
    ```
6.  **View in browser:**
    The server will be running at `http://localhost:8000`.

## Available Routes

The application is deployed on the university VM and is accessible at the base URL:
**`http://www.doc.gold.ac.uk/usr/201/`**

The following routes are available:

| Route | Method | Description |
| :--- | :--- | :--- |
| `/` | `GET` | Displays the home page with navigation links. |
| `/about` | `GET` | Displays the static "About" page. |
| `/search` | `GET` | Displays the search form. |
| `/search-result` | `GET` |  Displays database results from a partial-match (`LIKE`) search. |
| `/register` | `GET` | Displays the user registration form. |
| `/registered` | `POST` | Handles the registration form submission. |
| `/books/list` | `GET` |  Displays a list of all books from the database. |
| `/books/addbook` | `GET` |  Displays the form to add a new book. |
| `/books/bookadded` | `POST` |  Handles the "Add Book" form submission and inserts data into the database. |
| `/books/bargainbooks` | `GET` | (Extension)  Displays all books priced under £20. |

## Project Structure

* `index.js`: The main server file.  Configures Express, EJS, middleware, the database pool, and loads the route files.
* `routes/main.js`: Contains all main route handlers (e.g., `/`, `/about`).
* `routes/books.js`: Contains all book-related routes (e.g., `/list`, `/search`, `/addbook`).
* `routes/users.js`: Contains all user-related routes (e.g., `/register`).
* `views/`: This directory contains all EJS templates.
    * `index.ejs`, `about.ejs`, `search.ejs`, `register.ejs`, etc.
    * `list.ejs`: Renders the list of all books.
    * `addbook.ejs`: The form for adding a new book.
    * `bargainbooks.ejs`: Renders the list of bargain books.
    * `search-result.ejs`: Renders the results of a search.
    * `partials/header.ejs`: Shared header file, including the `<title>` and CSS link.
    * `partials/footer.ejs`: Shared footer file to close the HTML.
* `public/`: This directory contains all static assets.
    * `css/style.css`: The stylesheet used across all pages.
* `links.txt`: (Submission) Contains the single link to the deployed application for marking.
*  `create_db.sql`: SQL script to create the `berties_books` database, `books` table, and `berties_books_app` user.
*  `insert_test_data.sql`: SQL script to populate the `books` table with 3 initial records.
*  `package.json`: Lists project dependencies (Express, EJS, mysql2).
* `.gitignore`: Instructs Git to ignore the `node_modules` folder.

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
# Changes
## 18/11/2025 Week 7
## DOTENV Application
The database connection code in `index.js` was modified to remove hardcoded credentials (like the password) to mitigate the security risk of storing sensitive information in a public GitHub repository .

This feature was implemented using the dotenv node.js module  via the following steps:

Installation: The dotenv module was installed as a project dependency.

Configuration File: A new file named .env was created in the root directory to store the database access details (e.g., DB_USER, DB_PASSWORD) as environment variables.

Security: The `.env` file was added to the `.gitignore` file to ensure these secrets are never tracked or pushed to GitHub.

Application Integration: The `index.js` file was updated to include `require('dotenv').config()` at the top. The hardcoded connection strings within the `mysql.createPool` object were replaced with calls to `process.env` (e.g., `user: process.env.DB_USER`) , allowing the application to securely load the credentials at runtime.

## Audit Log Application
This feature was implemented to improve application security by tracking and documenting all login attempts, both successful and failed.

Database Storage: A new table named `audit_log` was created in the database to store login event records, including the `username`, the action (`SUCCESSFUL_LOGIN` or `FAILED_LOGIN`), and a timestamp.

Recording Mechanism: The `router.post('/loggedin')` function in `users.js` was modified to execute an `INSERT` query into the `audit_log` table within the respective success and failure callbacks of the `bcrypt.compare` function.

Display Route: A new GET route, `/users/audit`, was implemented. This route executes a `SELECT` query on the `audit_log` table and passes the full history to the `audit.ejs` template for display.

## 25/11/2025 Week 8
Part A of this week I implemented these changes:
1. **Session Management:** I used the `express-session` module to configure the `index.js` to handle the user sessions.
2. **Login Middleware:**  I used `redirectLogin` which was created to act as a gatekeeper to check for a valid session ID before allowing access to a route.
3. **Session Creation:** When successfully logged in using `(POST /loggedin)` the users username is saved to the session using `(req.session.userId = req.body.username)`. 
4. **Logout Function:** A `/logout` route was implemented using `req.session.destroy()` to end the users session.

## Access Restrictions 
Access control was added to protect all data modification and viewing pages. Users that are not logged in are immediately redirected to the `/users/login` page when attempting to access these routes:

| Route | Purpose | Access Restricted |
| :--- | :--- | :--- |
| `/books/search` | Displays the search form | Yes |
| `/books/addbook` | Displays the form to add a new book. | Yes |
| `/books/bookadded` | Handles the database INSERT operation. | Yes |
| `/books/list` | Displays the general list of books. | Yes |
| `/books/bargainbooks` | Displays the filtered list of books. | Yes |
| `/books/listusers` | Displays registered usernames and emails. | Yes |
| `/books/audit` | Displays sensitive login history. | Yes |


# Lab 8bc

## Validation
I applied validation checks by using the `express-validator` module to make sure the data of the application becomes robust. Validation was applied to all routes that handle user-submitted data via `POST` requests.

### Applied Validation Checks
Validation has been applied to the following routes, ensuring that submitted data meets strict requirements before being processed by the application or stored in the database:

| Route | Purpose | Fields Validated | Reasoning |
| :--- | :--- | :--- | :--- |
| `/users/registered`(POST) | User Registration | `username`,`email`,`password`,`first`,`last` | **Security/Data Integrity:** Ensures strong password (min 8 characters), valid email format, and checks for alphanumeric, non-empty, and appropriately sized names/usernames |
| `/users/loggedin`(POST) | User Login | `username`,`password` | **Security/Efficiency:** Checks that fields are `.notEmpty()`. This prevents wasting resources on database lookups when the user has submitted blank fields. Error handling was refactored to securely use a generic failure message for all login issues.|
| `/books/search-result`(POST) | Search Results | `keyword` | **Performance/Security:** The search term is validated to ensure it is `.notEmpty()` and `.isLength({ max: 50 })`. This prevents users from spamming the database with excessively long query strings that could degrade performance. |
| `/books/bookadded`(POST) | Add New Book | `name`,`price` | **Data Integrity:** name must be `.notEmpty()`. price must be a `.isFloat({ min: 0 })` to ensure the value is a non-negative number suitable for currency storage. |

Validation was not applied to routes that simply display data or forms, as they do not process user inputs.

| Route Type | Examples | Reasoning |
| :--- | :--- | :--- |
| Display Routes | `/books/list`,`/users/audit`,`/users/list` | These are `GET` requests used only for retrieving and displaying data from the database. No user data is being submitted to these endpoints, so validation is unnecessary. |
| Form Display Routes | `/books/addbook` (GET), `/users/register` (GET) | These routes simply render the HTML form. Since the `req.body` is empty, there is no user input to validate at the moment the route is accessed. The validation is correctly placed on the corresponding `POST` handlers. |

## Sanitisation
I applied sanitisation using the `express-sanitizer` module to prevent Cross-Site Scripting (XSS). This ensures that malicious scripts entered into forms are removed before the data is processed or stored in the database.

Sanitisation was applied to the following text fields because this data is often displayed back to the user (e.g. "Hello [Name]" or in book lists). If a hacker injected a script here, it would execute in the browser of anyone viewing the page.

| Route | Purpose | Fields Sanitised | Reasoning |
| :--- | :--- | :--- | :--- |
| `/users/registered`(POST) | User Registration | `username`, `email`, `first`, `last` | **Prevention of XSS:** These fields are text strings that are stored and displayed. Sanitisation removes HTML tags (like `<script>`) to prevent code injection attacks. |
| `/users/loggedin` (POST) | User Login | `username` | **Security:** Ensures the username input is treated as plain text before being used in database queries. |
| `/books/search-result` (GET) | Search Results | `keyword` | **XSS Prevention:** The search keyword is echoed back to the user on the results page (e.g. "Search results for..."). Sanitisation prevents reflected XSS attacks via the URL. |
| `/books/bookadded`(POST) | Add New Book | `name` | **Data Safety:** Book titles are displayed in the main list. Sanitisation ensures no malicious code is stored in the library catalog. |

Sanitation was not applied in the passwords and price or else altering the input would break functionality or security.

| Field | Reason |
| :--- | :--- |
| `password` | **Data Integrity & Security:** Passwords must allow special characters (e.g. `!`, `@`, `&`, `<`) to be strong. Sanitising a password would remove these characters, altering the string before it is hashed. This would cause login failures and weaken password complexity rules. |
| `price` | **Redundancy:** The price field is strictly validated as a `float` (number). Since it cannot contain text or HTML tags if validation passes, sanitisation is unnecessary. |

# Lab 9ab
## API's

In part A I created the Weather API where the user can see what the weather is like in any city which also says the humidity, windspeed, and description of the weather.
I used the `request` node module to send HTTP GET requests to OvenWeatherMap
I stored the API key in the `.env` file (`process.envWEATHER_API_KEY`) to prevent it from being exposed in the source code.
I created a form in `weather.ejs` that allows the user to search any city name.
For error handling i implemented checks to prevent crashing if a user enters a non-existent city it will display an error message instead of failing.

## Part B

| Feature | Method | Endpoint Example | Description |
| :--- | :--- | :--- | :--- |
| List All Books | `GET` | `/api/books` | Returns a list of all books in the database |
| Search | `GET` | `/api/books?search=World` | Returns all books containing the search term in their title |
| Price Filter | `GET` | `/api/books?minprice=10&maxprice=20` | Returns the books priced between the specified minimum and maximum values |
| Sort | `GET` | `/api/books?sort=price` | Sorts the results by the specified column (`price` or `name`) |

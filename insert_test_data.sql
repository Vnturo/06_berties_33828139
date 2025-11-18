# Insert data into the tables

USE berties_books;

INSERT INTO books (name, price)VALUES('Brighton Rock', 20.25),('Brave New World', 25.00), ('Animal Farm', 12.99) ;

INSERT INTO users (username, first_name, last_name, email, hashedPassword) 
VALUES ('gold', 'gold', 'smiths', 'marker@univ.edu', '$2b$10$JYwCZ9nqeAvCoknzp5hERO3bjd.NIdW81tLwq5xTMY6Jc2N67PGhu');
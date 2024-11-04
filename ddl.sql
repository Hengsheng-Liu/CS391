CREATE DATABASE product_db;

\c product_db

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE TABLE USERS (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);  
COPY products(name, description, price)
FROM '/docker-entrypoint-initdb.d/product_data.csv' DELIMITER ',' CSV HEADER;
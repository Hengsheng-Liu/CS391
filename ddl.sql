CREATE DATABASE CS391;

\c CS391

CREATE TABLE IF NOT EXISTS USERS (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS EVENTS (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    location VARCHAR(255),
    food_type VARCHAR(255),
    rsvp_count INT,
    servings INT,
    created_at TIMESTAMP DEFAULT NOW(),
    expiration TIMESTAMP,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES USERS(id)
);
CREATE TABLE IF NOT EXISTS RSVP (
    id SERIAL PRIMARY KEY,
    user_id INT,
    event_id INT,
    FOREIGN KEY (user_id) REFERENCES USERS(id),
    FOREIGN KEY (event_id) REFERENCES EVENTS(id)
);
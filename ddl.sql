

CREATE TABLE IF NOT EXISTS USERS (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS EVENTS (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    rsvp_count INTEGER,
    expiration TIMESTAMP,
    created_at TIMESTAMP,
    host_id INTEGER,
    create_by VARCHAR(255),
    allergies VARCHAR(255)[],
    cuisine VARCHAR(255)[]
);

CREATE TABLE IF NOT EXISTS RSVP (
    id SERIAL PRIMARY KEY,
    user_id INT,
    event_id INT,
    FOREIGN KEY (user_id) REFERENCES USERS(id),
    FOREIGN KEY (event_id) REFERENCES EVENTS(id)
);
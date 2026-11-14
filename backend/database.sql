CREATE TABLE hotels (
    id SERIAL PRIMARY KEY,
    image VARCHAR(255),
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
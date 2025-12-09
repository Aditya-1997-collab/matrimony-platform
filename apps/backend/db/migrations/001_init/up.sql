CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    date_of_birth DATE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS profiles (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    caste VARCHAR(100),
    sub_caste VARCHAR(100),
    education VARCHAR(150),
    career VARCHAR(150),
    income VARCHAR(50),
    height_cm INT,
    weight_kg INT,
    marital_status VARCHAR(50),
    living_in VARCHAR(150),
    bio TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS photos (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    photo_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS search_filters (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    min_age INT,
    max_age INT,
    caste VARCHAR(100),
    sub_caste VARCHAR(100),
    marital_status VARCHAR(50),
    location VARCHAR(150),
    created_at TIMESTAMP DEFAULT NOW()
);
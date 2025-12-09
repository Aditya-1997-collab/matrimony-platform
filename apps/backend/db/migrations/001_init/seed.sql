-- Insert Users
INSERT INTO users (full_name, gender, date_of_birth, email, phone, password_hash)
VALUES
    ('Rahul Sharma', 'male', '1995-06-15', 'rahul@example.com', '9876543210', 'hashed_password_123'),
    ('Priya Verma', 'female', '1997-11-22', 'priya@example.com', '9876501234', 'hashed_password_456');

-- Insert Profiles
INSERT INTO profiles (user_id, caste, sub_caste, education, career, income, height_cm, weight_kg, marital_status, living_in, bio)
VALUES
    (1, 'Maratha', '96 Kuli', 'BE Computer Science', 'Software Engineer', '12 LPA', 175, 70, 'Never Married', 'Pune', 'Calm and introverted person.'),
    (2, 'Brahmin', 'Iyer', 'MBA Finance', 'Business Analyst', '10 LPA', 162, 55, 'Never Married', 'Mumbai', 'Love reading and classical music.');

-- Insert Photos
INSERT INTO photos (user_id, photo_url, is_primary)
VALUES
    (1, 'https://example.com/photos/rahul1.jpg', TRUE),
    (2, 'https://example.com/photos/priya1.jpg', TRUE);

-- Insert Search Filters
INSERT INTO search_filters (user_id, min_age, max_age, caste, sub_caste, marital_status, location)
VALUES
    (1, 20, 28, 'Brahmin', NULL, 'Never Married', 'Mumbai'),
    (2, 25, 32, 'Maratha', NULL, 'Never Married', 'Pune');

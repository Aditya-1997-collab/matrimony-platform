-- Users Table Indexes
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_gender ON users(gender);
CREATE INDEX IF NOT EXISTS idx_users_dob ON users(date_of_birth);

-- Profiles Table Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_caste_subcaste ON profiles(caste, sub_caste);
CREATE INDEX IF NOT EXISTS idx_profiles_living_in ON profiles(living_in);
CREATE INDEX IF NOT EXISTS idx_profiles_marital_status ON profiles(marital_status);
CREATE INDEX IF NOT EXISTS idx_profiles_height ON profiles(height_cm);

-- Photos Table Indexes
CREATE INDEX IF NOT EXISTS idx_photos_user_id ON photos(user_id);
CREATE INDEX IF NOT EXISTS idx_photos_is_primary ON photos(is_primary);

-- Search Filters Table Indexes
CREATE INDEX IF NOT EXISTS idx_filters_user ON search_filters(user_id);
CREATE INDEX IF NOT EXISTS idx_filters_age ON search_filters(min_age, max_age);
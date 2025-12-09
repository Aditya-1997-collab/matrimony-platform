-- Search Filters Table Indexes
DROP INDEX IF EXISTS idx_filters_age;
DROP INDEX IF EXISTS idx_filters_user;

-- Photos Table Indexes
DROP INDEX IF EXISTS idx_photos_is_primary;
DROP INDEX IF EXISTS idx_photos_user_id;

-- Profiles Table Indexes
DROP INDEX IF EXISTS idx_profiles_height;
DROP INDEX IF EXISTS idx_profiles_marital_status;
DROP INDEX IF EXISTS idx_profiles_living_in;
DROP INDEX IF EXISTS idx_profiles_caste_subcaste;

-- Users Table Indexes
DROP INDEX IF EXISTS idx_users_dob;
DROP INDEX IF EXISTS idx_users_gender;
DROP INDEX IF EXISTS idx_users_phone;
DROP INDEX IF EXISTS idx_users_email;

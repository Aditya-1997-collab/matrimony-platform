CREATE ROLE app_user;
GRANT SELECT, INSERT, UPDATE ON users, profiles, photos, search_filters TO app_user;

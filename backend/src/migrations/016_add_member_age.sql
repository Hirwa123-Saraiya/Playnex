-- Age determines the member tier during registration and is retained on the member profile.
ALTER TABLE users ADD COLUMN IF NOT EXISTS age INTEGER CHECK (age IS NULL OR age BETWEEN 5 AND 99);

-- Apple Sign In support
ALTER TABLE users ADD COLUMN IF NOT EXISTS apple_id VARCHAR(255) UNIQUE;

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_auth_provider_check;
ALTER TABLE users ADD CONSTRAINT users_auth_provider_check
  CHECK (auth_provider IN ('local', 'google', 'apple'));

CREATE INDEX IF NOT EXISTS idx_users_apple_id ON users (apple_id);

# CREATE TABLE users (
#     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
#     email TEXT UNIQUE NOT NULL,
#     created_at TIMESTAMP DEFAULT NOW()
# );

# CREATE TABLE documents (
#     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
#     user_id UUID REFERENCES users(id),
#     filename TEXT NOT NULL,
#     uploaded_at TIMESTAMP DEFAULT NOW()
# );

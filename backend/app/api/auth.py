from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from app.db.postgres import get_db
from app.core.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])

# -------- Request Schemas --------
class SignupRequest(BaseModel):
    email: EmailStr
    name: str
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# -------- Signup --------
@router.post("/signup")
def signup(data: SignupRequest):
    conn = get_db()
    cur = conn.cursor()

    cur.execute("SELECT id FROM users WHERE email = %s", (data.email,))
    if cur.fetchone():
        raise HTTPException(status_code=400, detail="User already exists")

    cur.execute(
        """
        INSERT INTO users (email, password_hash,name)
        VALUES (%s, %s, %s)
        RETURNING id
        """,
        (data.email, hash_password(data.password),data.name)
    )

    user_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    token = create_access_token(str(user_id))
    return {"access_token": token}

# -------- Login --------
@router.post("/login")
def login(data: LoginRequest):
    conn = get_db()
    cur = conn.cursor()

    cur.execute(
        "SELECT id, password_hash FROM users WHERE email = %s",
        (data.email,)
    )
    user = cur.fetchone()

    if not user or not verify_password(data.password, user[1]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    cur.close()
    conn.close()

    token = create_access_token(str(user[0]))
    return {"access_token": token}

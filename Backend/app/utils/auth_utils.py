from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import jwt

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SECRET_KEY = "your_super_secret_key_change_this"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


def hash_password(password: str) -> str:
    """
    Hash password safely by enforcing 72-byte limit for bcrypt.
    """
    if not isinstance(password, str):
        raise ValueError("Password must be a string")

    # Convert to bytes first and truncate at 72 bytes (bcrypt limit)
    password_bytes = password.encode("utf-8")[:72]
    safe_password = password_bytes.decode("utf-8", errors="ignore")

    # Debug print (you’ll see this in console)
    print(f"[hash_password] Password length after truncation: {len(safe_password.encode('utf-8'))} bytes")

    return pwd_context.hash(safe_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password safely (also truncated to 72 bytes)
    """
    plain_bytes = plain_password.encode("utf-8")[:72]
    safe_plain = plain_bytes.decode("utf-8", errors="ignore")
    return pwd_context.verify(safe_plain, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    """
    Generate JWT token with expiry.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

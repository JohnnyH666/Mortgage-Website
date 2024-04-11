from email.message import EmailMessage
import smtplib
from typing import Annotated, Union
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from os import getenv
from pydantic import BaseModel
from passlib.context import CryptContext
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import re

import crud, models, schemas

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# For JWT
TOKEN_EXPIRE_MINUTES = 30
SECRET_KEY = getenv("SECRET_KEY", default="my_precious_secret_key")
ALGORITHM = "HS256"

class Token(BaseModel):
    access_token: str
    token_type: str
    usertype: str | None = None

class TokenData(BaseModel):
    email: str | None = None

# create an instance of the OAuth2PasswordBearer class
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Create a password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Check whether the plain password corresponds to this hashed password
def check_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def check_email_format(email: str):
    """
        check if email format valid
    """
    email_regex = r'^\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    return re.match(email_regex, email) is not None

# get hashed password by receive plainpassword
def get_hashed_password(password):
    return pwd_context.hash(password)

# Receive the database and the user email and unencrypted password,
# return the userdetail, or return false
# if the user is present and the password is correct, return the user, otherwise return false
def authenticate_user(db: Session, email: str, password: str):
    # get user by email
    user:models.Customer|models.Staff = crud.get_user_by_email(db, email)
    # if not exist his user
    if not user:
        return False
    # if password is wrong
    if not check_password(password, user.hashed_password):
        return False
    # if user exist and password true
    return user

# Receive: dict which include email, and databases
# Return: Returns a jwt token which include expire time and user email
# Create a jwt token
def create_jwt_token(data: dict, expires_delta: timedelta | None = None):
    uncode = data.copy()
    # Set expiry time, or default 15 minutes
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    # add expire time to data
    uncode.update({"exp": expire})
    # encode data to token
    encoded_token = jwt.encode(uncode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_token

# Receive: token get from oauth2_scheme, and databases
# Return: Returns the user profile created from the format of the model in user
# Verify the token and return the user information if the verification is successful
async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # decode jwt token
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("email")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    # get user by the email in jwt token
    user = crud.get_user_by_email(db=db, email=token_data.email)
    # if email not exist, raise error
    if user is None:
        raise credentials_exception
    # if user is customer, return model "Customer" in schemas
    return user
    #return create_user_from_model(user)


async def send_reset_password_email(email: str, password_reset_token: str):
    reset_link = f"http://localhost:5173/reset_password?token={password_reset_token}"
    email_body = f"Hello, \n Use the link below to reset your password. \n {reset_link}"
    
    # Calling the send_email function
    send_email(email, "Reset Your Password", email_body)

def send_email(to_address: str, subject: str, body: str):
    msg = EmailMessage()
    msg.set_content(body)
    msg["Subject"] = subject
    msg["From"] = "unswmortgagemates@gmail.com"
    msg["To"] = to_address

    server = smtplib.SMTP("smtp.gmail.com", 587)  # smtp server and port
    server.starttls()  # start use secure connection
    server.login("unswmortgagemates@gmail.com", "dhhyqrjuairkmpmc")  # your sending email login credentials
    server.send_message(msg)
    server.quit()


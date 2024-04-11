import base64
from fastapi import BackgroundTasks, Depends, FastAPI, Form, HTTPException, status, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import crud, models, schemas, auth, calc
from database import SessionLocal, engine
import asyncio

from datetime import datetime, timedelta
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

import time as time
from typing import Literal, List
import json

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173",  # Allow this origin
    # You can add more origins if needed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    email: str

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

tags_metadata = [
    {
        "name": "Users applications",
        "description": "API calls related to loan applications available for the users"
    }, 
    {
        "name": "Managers applications",
        "descriptions": "API calls related to loan applications available to managers"
    },
    {
        "name": "Loan Package",
        "descriptions": "API calls related to loan packages"
    }, 
    {
        "name": "Auth",
        "descriptions": "Authorisation API's" 
    },
    {
        "name": "Home Recommendation",
        "description": "Recommendation of Homes for customer"
    }
]

@app.get("/")
async def root():
    return {"message": "Hello, World!"}

"""
#############################################
########## AUTHORISATION ####################
#############################################
"""

'''
This is for user login
Accepts a username(email) and password as input, authenticates the user,
and returns a response dictionary containing the access token and user type
'''
@app.post("/token", response_model=auth.Token, tags=["Auth"])
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Session = Depends(get_db)
):
    # Call auth.authenticate_user function to authenticate the user
    user = auth.authenticate_user(db, form_data.username, form_data.password)

    # If authentication fails, raise HTTPException
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # If successful, create an access token and return
    access_token_expires = timedelta(minutes=auth.TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_jwt_token(
        data={"email": user.email, "usertype": user.__tablename__}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer", "usertype": user.__tablename__}

'''
# Receive: schemas models which include user detail
# Return: Returns corresponding schema response if success
# if username and email valid, create new user detail in database.
'''
@app.post("/register/", response_model=schemas.CustomerResponse, tags=["Auth"])
async def register_customer(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    firstname: str,
    lastname: str,
    db: Session = Depends(get_db),
    is_staff: bool = False
):  
    # Check if the email form is valid
    if not auth.check_email_format(form_data.username):
        raise HTTPException(status_code=400, detail="Invalid email format")
    # Check if the email is registered
    if crud.get_user_by_email(db, email=form_data.username):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user_dict = {
        "email": form_data.username,
        "firstname": firstname,
        "lastname": lastname,
        "password": form_data.password
    }
    
    # Store user data in database according to user type
    if is_staff:
        new_user_models = schemas.StaffCreate(**new_user_dict)
        crud.create_staff(db, new_user_models)
    else:
        new_user_models = schemas.CustomerCreate(**new_user_dict)
        crud.create_customer(db, new_user_models)
    
    return new_user_models


# This function allow user to change password
@app.post("/change_password/", tags=["Auth"])
async def change_password(
    current_user: Annotated[models.Customer | models.Staff, Depends(auth.get_current_user)],
    old_password: str = Form(),
    new_password: str = Form(),
    db: Session = Depends(get_db),
):
    # Verify old password
    if not auth.check_password(old_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Old password is incorrect")

    # Set new password
    hashed_password = auth.get_hashed_password(new_password)
    crud.update_password(db, current_user, hashed_password)
    return {"message": "Password updated successfully!"}

@app.post("/reset_password", tags=["Auth"])
async def change_password(
    current_user: Annotated[models.Customer | models.Staff, Depends(auth.get_current_user)],
    new_password: str = Form(),
    db: Session = Depends(get_db),
):
    # Set new password
    hashed_password = auth.get_hashed_password(new_password)
    crud.update_password(db, current_user, hashed_password)
    return {"message": "Password successfully reset!"}

@app.post("/forgot_password/{email}", tags=["Auth"])
async def forgot_password(email: str, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # Validate if the email is in the database.
    user = crud.get_user_by_email(db, email=email)

    if not user:
        raise HTTPException(status_code=400, detail="Email not found")

    # Create a password reset token that only lasts for 30 minutes
    access_token_expires = timedelta(minutes=auth.TOKEN_EXPIRE_MINUTES)
    password_reset_token = auth.create_jwt_token(data={"email": user.email, "usertype": user.__tablename__}, expires_delta=access_token_expires)

    # Use a background task to send the reset password email
    background_tasks.add_task(auth.send_reset_password_email, email, password_reset_token)

    return {"message": "A reset password link has been sent to your email."}

######## FILES ########
@app.post("/uploadfile/", tags=["Users applications"])
async def create_upload_file(
    current_user: Annotated[models.Customer | models.Staff, Depends(auth.get_current_user)],
    file: UploadFile | None = None,
    db: Session = Depends(get_db)
):
    """
    Upload single file

    Parameters:
    - *file*: file for upload

    Returns:
    - *string*: File name
    """

    if not file:
        raise HTTPException(status_code=400, detail="No file selected")
    content = await file.read()
    doc = crud.create_document(db, content, file.filename, current_user)
    if not doc:
        return {"message": "Database error"}

    return {"filename": file.filename}

# @app.post("/uploadfile/")
# async def upload_file(file: UploadFile | None = None):
#     if not file:
#         return {"message": "No upload file sent"}
#     else:
#         return {"filename": file.filename}

@app.post("/uploadfiles/", tags=["Users applications"])
async def upload_files(
    current_user: Annotated[models.Customer | models.Staff, Depends(auth.get_current_user)],
    files: list[UploadFile],
    types: Annotated[list, str] = [],
    db: Session = Depends(get_db)
):
     """
    Upload multiple files   

    Parameters:
    - *files*: files for upload

    Returns:
    - *string*: All file names
    """
     if len(files) == 0:
        raise HTTPException(status_code=400, detail="No files selected")
    
     
     for file, type in zip(files, types):
        print(type)
        content = await file.read()
        doc = crud.create_document(db, content, file.filename, current_user, type, 0) # 0 for now application

     return {"filenames": [file.filename for file in files]}


############################################
########### LOAN APPLICATION ###############
############################################

@app.post("/loan_application/", tags=["Users applications"])
async def submit_loan_application(
    current_user: Annotated[models.Customer | models.Staff, Depends(auth.get_current_user)],
    application: schemas.ApplicationBase,
    db: Session = Depends(get_db)
):
    """
    Gets all data needed for loan application

    Parameters:
    - models.Customer | models.Staff
    - Session

    Returns:
    - *string*: success / error
    """
    
    try:
        crud.create_loan_application(db, application, current_user)
    except Exception as e: 
        print("Failed to store application in Database", str(e))
    
    return {"message": "success"}

@app.post("/loan_application/complete/", tags=["Users applications"])
async def submit_loan_application_complete(
    current_user: Annotated[models.Customer | models.Staff, Depends(auth.get_current_user)],
    application: schemas.ApplicationBase = Depends(),
    files: list[UploadFile] = File(...),
    types: Annotated[list, str] = [],
    db: Session = Depends(get_db)
):
    """
    Gets all loan application for target customer.
    For staff, they provide user email

    Parameters:
    - models.Customer | models.Staff
    - schemas.ApplicationBase
    - files
    - types: Literal = ["Identity", "Bank Statement", "Bank Statement Partner"]
    - Session

    Returns:
    - "Sucess"
    """  
    try:
        application = crud.create_loan_application(db, application, current_user)
    except Exception as e: 
        print("Failed to store application in Database", str(e))

    if len(files) == 0:
        raise HTTPException(status_code=400, detail="No files selected")
     
    for file, type in zip(files, types):
        content = await file.read()
        doc = crud.create_document(db, content, file.filename, current_user, type, application.id)
     
     # Store documents with application. 
    return {"message": "success"}


@app.post("/get_files_by_app_id/", tags=["Managers applications", "Users applications"])
async def get_customer_loan_application(
    current_user: Annotated[models.Customer | models.Staff, Depends(auth.get_current_user)],
    application_id: int,
    db: Session = Depends(get_db)
):
    """
    Gets all loan application for application_id
    Works for both customer and staff

    Parameters:
    - models.Customer | models.Staff
    - Application id
    - Session

    Returns:
    - models.Application / HTTPException
    """
    
    files = crud.get_files_by_app_id(db, application_id)

    if len(files) == 0:
        raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Files not found for the provided application",
    )

    # If customer, check email
    if current_user.__tablename__ == "customers":
        if current_user.email != files[0].customer_email:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No permission to perform this operation",
            )

    return_docs = []
    for doc in files:
        doc_json = {
            "id": doc.id,
            "title": doc.title,
            "content": base64.b64encode(doc.content).decode('utf-8'),
            "customer_email": doc.customer_email
        }
        return_docs.append(doc_json)

    return return_docs
    

@app.post("/get_applications_by_email/", tags=["Managers applications"])
async def get_customer_loan_application(
    current_user: Annotated[models.Customer | models.Staff, Depends(auth.get_current_user)],
    user_email: str,
    db: Session = Depends(get_db)
):
    """
    Gets all loan application for target customer.
    For staff, they provide user email

    Parameters:
    - models.Customer | models.Staff
    - The email of user
    - Session

    Returns:
    - models.Application / HTTPException
    """
    
    if current_user.__tablename__ == "customers":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No permission to perform this operation",
        )
    
    application = crud.get_user_application_by_email(db, user_email)

    if len(application) > 0:
        return application
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Application not found for the provided user email",
    )

@app.get("/application_status/", tags=["Managers applications"])
async def get_application_status(
    current_user: Annotated[models.Customer | models.Staff, Depends(auth.get_current_user)],
    application_id: int,
    db: Session = Depends(get_db)
):
    if current_user.__tablename__ == "customers":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No permission to perform this operation",
        )
    
    status = crud.get_applciation_status(application_id, db)
        
    if status == None:
        return "No applications for the provided application id"
    
    return status

@app.put("/edit_application_docs", tags=["Managers applications"])
async def edit_loan_application(
    current_user: Annotated[models.Customer | models.Staff, Depends(auth.get_current_user)],
    application_id: int,
    type: Literal["Identity", "Bank Statement", "Bank Statement Partner"],
    file: UploadFile,
    db: Session = Depends(get_db)
):
    if current_user.__tablename__ == "customers":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No permission to perform this operation",
        )
    
    files = crud.get_files_by_app_id(db, application_id)
    # Remove current doc
    for doc in files:
        if doc.type == type:
            db.delete(doc)

    content = await file.read()
    new_file = crud.create_document(db, content, file.filename, current_user, type, application_id)

    return "Success"

@app.post("/set_application_status/", tags=["Managers applications"])
async def set_application_status(
    current_user: Annotated[models.Customer | models.Staff, Depends(auth.get_current_user)],
    status: Literal["pending", "approved", "declined"],
    application_id: int,
    db: Session = Depends(get_db)
):
    """
    Gets all loan application for target customer 

    Parameters:
    - models.Customer | models.Staff
    - application_id
    - status: "pending" | "approved" | "declined"
    - Session

    Returns:
    - application
    """

    if current_user.__tablename__ == "customers":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No permission to perform this operation",
        )
    
    application = crud.change_application_status(status, application_id, db)

    if application.status != status:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to change status of application",
        )

    email = application.customer_email
    subject = "Loan Application with Mortgage Mates"
    message = "Your application status just changed to: " + application.status 
    auth.send_email(email, subject, message)

    return application


@app.get("/get_all_loan_applications/", tags=["Managers applications"])
async def submit_loan_application(
    current_user: Annotated[models.Customer | models.Staff, Depends(auth.get_current_user)],
    db: Session = Depends(get_db)
):  
    """
    Returns all current loan_applications

    Parameters:
    - models.Customer | models.Staff
    - Session

    Returns:
    - models.Application / HTTPException
    """
    if current_user.__tablename__ == "customers":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No permission to perform this operation",
        )
    
    
    # Get all or all by manager
    all_apps = crud.get_all_applications(db)
    # For each customer loop through and find all documents

    if len(all_apps) > 0:
        return all_apps
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="No applications submitted"
    )

@app.get("/loan_limit/", tags=["Users applications"])
def get_loan_limit(
    current_user: Annotated[models.Customer | models.Staff, Depends(auth.get_current_user)],
    income: float,
    expenses: float,
    dependents: int
):
    """
    get a users loan limit with 

    Parameters:
    Income: income
    expenses: expenses
    dependents: dependents

    Return: Users loan limit
    """
    
    return calc.calculate_loan_limit(income, expenses, dependents)

@app.put("/loan_application/edit/", tags=["Users applications"])
def loan_application_edit(
    current_user: Annotated[models.Customer | models.Staff, Depends(auth.get_current_user)],
    application_id: int,
    application: schemas.ApplicationBase,
    db: Session = Depends(get_db)
):
    # Get application
    application_old = crud.get_user_application_by_id(db, application_id)
    # Check email corresponds
    if application_old.customer_email != current_user.email:
        raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have authorisation to access this loan application"
    )

    # Then pass application to crud.edit_application
    application_new = crud.edit_application(db, application_old, application)
    
    return "Success"

@app.get("/get_all_applications/", tags=["Users applications"])
def get_loan_applications(
    current_user: Annotated[models.Customer | models.Staff, Depends(auth.get_current_user)],
    db: Session = Depends(get_db)
):
    """
    Logged in user able to retrieve all applications associated with their email

    Parameters:
    - current_user
    _ session

    Return: All applications for user
    """

    if current_user.__tablename__ == "staffs":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No permission to perform this operation",
        )
    
    applications = crud.get_user_application_by_email(db, current_user.email)
    
    if len(applications) > 0:
        return applications

    raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="You have no submitted applications",
        )

@app.get("/user_documents/", tags=["Managers applications"])
def get_user_docs(
    customer_email: str,
    current_user: Annotated[models.Customer | models.Staff, Depends(auth.get_current_user)],
    db: Session = Depends(get_db),
):
    """
    Returns the documents for one user.

    Parameters:
    - customer_email: str
    - Current user(manager)
    - Session

    Returns:
    - Documents for user with email == customer_email
    """
    
    if current_user.__tablename__ == "customers":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No permission to perform this operation",
        )
    
    customer_docs = crud.get_customer_docs(db, customer_email)

    if len(customer_docs) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No documents for current user"
        )
    
    return_docs = []
    for doc in customer_docs:
        doc_json = {
            "id": doc.id,
            "title": doc.title,
            "content": base64.b64encode(doc.content).decode('utf-8'),
            "customer_email": doc.customer_email
        }
        return_docs.append(doc_json)

    return return_docs

async def application_notification():
    """
    Starts when server starts.
    Sends an email to all incomplete loan applications every x seconds
    """
    db = SessionLocal()
    
    while True:
        await asyncio.sleep(60) # Waits 1 minute

        # Check database for incomplete applications
        if db is not None:
            incomplete_applications = db.query(models.Application).filter(models.Application.status == "pending").all()
            for app in incomplete_applications:
                email = app.customer_email
                subject = "Loan Application with Mortgage Mates"
                message = "We are still processing your applicatoin:)" 
                auth.send_email(email, subject, message)
    db.close()


"""
###################################################
############ LOAN PACKAGES ########################
###################################################
"""
@app.get("/loan_package/get_all", tags=["Loan Package"])
def get_loan_package(db: Session = Depends(get_db)):
    """
    This function returns all loan packages from the database

    Parameters:
    db: Session

    Returns:
    A list of loan packages
    """
    return crud.get_all_loan_package(db)

@app.post("/loan_package/create", tags=["Loan Package"])
def create_loan_package(current_user: Annotated[models.Staff, Depends(auth.get_current_user)], loan_package: schemas.LoanPackageCreate, 
                        db: Session = Depends(get_db)):
    """
    This function create a loan packages and store into the database

    Parameters:
    models.Customer | models.Staff
    loan_package: A schemas-like dict
    db: Session

    Returns: A loan packages
    """
    if current_user.__tablename__ == "customers":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No permission to perform this operation",
        )
    return crud.create_loan_package(db, loan_package)
     
@app.delete("/loan_package/{loan_package_id}", tags=["Loan Package"])
def delete_loan_package(current_user: Annotated[models.Staff, Depends(auth.get_current_user)], id: int,
                        db: Session = Depends(get_db)):
    """
    This function delete a loan packages by id and store into the database

    Parameters:
    models.Customer | models.Staff
    id: loan package id
    db: Session

    Returns: A string
    """
    if current_user.__tablename__ == "customers":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No permission to perform this operation",
        )
    
    loan_package = crud.get_loan_package(db, id)
    if loan_package is None:
        raise HTTPException(status_code=500, detail="Loan package not found")
    
    crud.delete_loan_package(db, id)
    return {"message": "delete success"}

@app.put("/loan_package/edit", tags=["Loan Package"])
def edit_loan_package(current_user: Annotated[models.Staff, Depends(auth.get_current_user)], id: int, 
                      loan_package: schemas.LoanPackageCreate, db: Session = Depends(get_db)):
    """
    This edit a loan packages by id and store into the database

    Parameters:
    models.Customer | models.Staff
    id: loan package id
    loan_package: A schemas-like dict
    db: Session

    Returns: A string
    """
    if current_user.__tablename__ == "customers":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No permission to perform this operation",
        )
    if loan_package is None:
        raise HTTPException(status_code=500, detail="Target loan package not found")
    
    crud.edit_loan_package(db, loan_package, id)
    return {"message": "edit success"}

@app.get("/loan_package/auto_recommend", tags=["Loan Package"])
def auto_recommend_loan_package(
    current_user: Annotated[models.Customer | models.Staff, Depends(auth.get_current_user)],
    loan_application_id: int,
    db: Session = Depends(get_db)
):
    """
    This recommend the relevant loan packages to customer based on the loan limit of thier application 

    Parameters:
    loan_application_id: loan application id
    db: Session

    Returns:
    A List of recommended loan package
    """
    loan_packages = crud.get_recommended_loan_packages(db, loan_application_id)
    if len(loan_packages) > 0:
        return loan_packages
    
    raise HTTPException(
        status_code=500,
        detail="No suitable loan package"
    )

@app.get("/loan_package/input_search", tags=["Loan Package"])
def loan_package_input_search(loan_amount: float,db: Session = Depends(get_db)):
    """
    This recommend the relevant loan packages base on customer input loan amount

    Parameters:
    loan_application_id: loan application id
    db: Session

    Returns:
    A List of recommended loan package
    """
    loan_packages = crud.get_recommended_loan_packages_input(db, loan_amount)
    if len(loan_packages) > 0:
        return loan_packages
    
    raise HTTPException(
        status_code=500,
        detail="No suitable loan package"
    )

###################################################
######## HOME RECOMMEND ###########################
###################################################
@app.get("/home_recommend", tags=["Home Recommendation"])
def auto_recommend_home(
    page: int,
    application_id: int = None,
    location: str = None,
    db: Session = Depends(get_db)
):
    house_list = crud.get_filtered_recommended_houses(db, page, application_id, location)
    if len(house_list) > 0:
        return house_list
    
    raise HTTPException(
        status_code=500,
        detail="No suitable loan package"
    )



"""
###################################################
############ APPOINTMENT ##########################
###################################################
"""
@app.get("/staff/get_all", tags=["Appointment"])
def get_all_staff(db: Session = Depends(get_db)):
    """
    This function returns all satffs from the database

    Parameters:
    db: Session

    Returns:
    A list of staff
    """
    staffs = crud.get_all_staff(db)
    if len(staffs) < 0:
        raise HTTPException(
            status_code=500,
            detail="No staff avaliable"
        )
    return staffs

@app.post("/appointment/create", tags=["Appointment"])
def create_appointment(current_user: Annotated[models.Customer | models.Staff, Depends(auth.get_current_user)],
                       appointment: schemas.AppointmentBase, db: Session = Depends(get_db)):
    """
    This function create an appointment and store into the database

    Parameters:
    appointment: A schemas-like dict
    db: Session
    Returns:
    A appointment
    """
    appointment_create = schemas.AppointmentCreate(**appointment.dict(), customer_email=current_user.email)
    book_appointment = crud.create_appointment(db, appointment_create)
    if book_appointment is None:
        raise HTTPException(
        status_code=500,
        detail="The date is reserved by others"
    )
    return book_appointment

@app.get("/appointment/get_unavaliable_date", tags=["Appointment"])
def get_unavaliable_date(db: Session = Depends(get_db)):
    """
    This function returns all loan packages from the database

    Parameters:
    db: Session

    Returns:
    A list of unavaliable date
    """
    unavaliabe_dates = crud.get_unavaliable_date(db)
    if len(unavaliabe_dates) < 0:
        raise HTTPException(
            status_code=500,
            detail="All dates are avaliable"
        )
    return unavaliabe_dates

@app.get("/appointment/get_all", tags=["Appointment"])
def get_all_appointments(current_user: Annotated[models.Customer | models.Staff, Depends(auth.get_current_user)], 
                           db: Session = Depends(get_db)):
    """
    This function returns all appointments associated with specific staff

    Parameters:
    db: Session

    Returns:
    A list of appointment for a specific staff
    """
    appointments = crud.get_all_appointments(db, current_user)
    if len(appointments) < 0:
        raise HTTPException(
            status_code=500,
            detail="All dates are avaliable"
        )
    return appointments

@app.put("/appointment/status", tags=["Appointment"])
async def set_appointment_status(current_user: Annotated[models.Customer | models.Staff, Depends(auth.get_current_user)],
                            new_status: Literal["approved", "declined"], appointment_id: int, db: Session = Depends(get_db)):
    """
    This function update the statu of an appointment in the database

    Parameters:
    db: Session

    Returns:
    A list of appointment for a specific staff
    """
    if current_user.__tablename__ == "customers":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No permission to perform this operation",
        )

    appointment = crud.change_appointment_status(new_status, appointment_id, db)
    
    if appointment.status != new_status:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to change status of appointment",
        )

    email = appointment.customer_email
    subject = "Appointment with Mortgage Mates"
    message = f"Your appointment status with {current_user.firstname} {current_user.lastname} has changed to {appointment.status}"  
    auth.send_email(email, subject, message)
    return appointment




######## STARTUP ########

@app.on_event("startup")
async def startup_evnent():
    asyncio.create_task(application_notification())

@app.on_event("startup")
async def startup_evnent_2(db: Session = Depends(get_db)):
    db = SessionLocal()
    loan_package_1 = {"name" : "Standard Variable Rate", "description" : "This is a variable rate loan package", "interest_rate" : 6.24,
                             "period" : 30, "fee" : 395}
    loan_package_2 = {"name" : "Fiexed Rate", "description" : "This is a fixed rate loan package", "interest_rate" : 6.64,
                             "period" : 30, "fee" : 750}
    loan_package_3 = {"name" : "Extra Home Loan", "description" : "A home loan with a variable interest rate and low fees", "interest_rate" : 6.29,
                             "period" : 30, "fee" : 0}
    
    crud.create_loan_package(db, schemas.LoanPackageCreate(**loan_package_1))
    crud.create_loan_package(db, schemas.LoanPackageCreate(**loan_package_2))
    crud.create_loan_package(db, schemas.LoanPackageCreate(**loan_package_3))

    return 
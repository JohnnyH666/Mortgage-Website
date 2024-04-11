import json
from sqlalchemy.orm import Session
from sqlalchemy import LargeBinary, DateTime, func
from datetime import datetime, timedelta

from auth import get_hashed_password
import models, schemas, auth, calc

from realestate_com_au import RealestateComAu

api = RealestateComAu()

"""
#######################################
This section is all about Get methods #
#######################################
"""
def get_customer(db: Session, user_email: str):
    return db.query(models.Customer).filter(models.Customer.email == user_email).first()

def get_staff(db: Session, user_email: str):
    return db.query(models.Staff).filter(models.Staff.email == user_email).first()

def get_all_staff(db: Session):
    staffs = db.query(models.Staff).all()

    return staffs

def get_user_by_email(db: Session, email: str):
    staff_user = db.query(models.Staff).filter(models.Staff.email == email).first()
    if staff_user:
        return staff_user

    customer_user = db.query(models.Customer).filter(models.Customer.email == email).first()
    if customer_user:
        return customer_user

    return None

def get_user_application_by_email(db: Session, email: str):
    user_applications = db.query(models.Application).filter(models.Application.customer_email == email).all()
    return user_applications

def get_user_application_by_id(db: Session, id: int):
    user_applications = db.query(models.Application).filter(models.Application.id == id).first()
    return user_applications

def get_all_applications(db:Session):
    """
    Returns all applications

    Parameters:
    - Session

    Returns:
    - models.Application
    """

    applications = db.query(models.Application).all()

    return applications

def get_applciation_status(application_id: int, db: Session):
    """
    Get application status with provided application id

    Parameters:
    - application_id
    - Session

    Returns:
    - Application status
    """
    application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if application:
        return application.status
    return None

def get_loan_package(db: Session, loan_id: int):
    return db.query(models.LoanPackage).filter(models.LoanPackage.id == loan_id).first()

def get_recommended_loan_packages(db: Session, id: int):
    user_application = get_user_application_by_id(db, id)
    loan_limit = user_application.loan_limit
    recommended_loan_packages = []
    if user_application:
        for loan_package in get_all_loan_package(db):
            new_loan_package = {column.name: getattr(loan_package, column.name) for column in models.LoanPackage.__table__.columns}
            new_loan_package["loan_amount"] = loan_limit
            new_loan_package["repayment"] =  loan_limit/loan_package.period/12 + loan_limit*loan_package.interest_rate/12
            recommended_loan_packages.append(new_loan_package)
    return recommended_loan_packages

def get_recommended_loan_packages_input(db: Session, loan_amount: int):
    recommended_loan_packages = []
    for loan_package in get_all_loan_package(db):
        new_loan_package = {column.name: getattr(loan_package, column.name) for column in models.LoanPackage.__table__.columns}
        new_loan_package["loan_amount"] = loan_amount
        new_loan_package["repayment"] =  loan_amount/loan_package.period/12 + loan_amount*loan_package.interest_rate/12
        recommended_loan_packages.append(new_loan_package)
    return recommended_loan_packages

def get_all_loan_package(db: Session):
    loan_package_list = []
    loan_package_list = db.query(models.LoanPackage).all()
    sorted_loan_package_list = sorted(loan_package_list, key=lambda x: x.interest_rate)
    return sorted_loan_package_list

def get_customer_docs(db: Session, customer_email: str):
    """
    Returns the documents for one user.

    Parameters:
    - customer_email: str
    - Session

    Returns:
    - Documents for user with email == customer_email
    """
    customer_docs = db.query(models.Document).filter(models.Document.customer_email == customer_email).all()

    return customer_docs

def get_unavaliable_date(db: Session):
    current_date = datetime.now()
    next_month = current_date + timedelta(days=30)
    appointments = db.query(models.Appointment).filter(models.Appointment.status == "approved", models.Appointment.time >= current_date, 
                                                       models.Appointment.time < next_month).all()
    unavaliable_dates = []
    for appointment in appointments:
        unavaliable_dates.append(appointment.time)
    return unavaliable_dates

def get_all_appointments(db: Session, user: models.Customer | models.Staff): 
    if isinstance(user, models.Customer):
        return db.query(models.Appointment).filter(models.Appointment.customer_email == user.email).all()
    if isinstance(user, models.Staff):
        return db.query(models.Appointment).filter(models.Appointment.manager_email == user.email).all()

'''
def get_filtered_recommended_houses(db: Session, page: int, application_id: int = None, location: str = None):


    house_value = None

    if application_id is not None:
        user_application = get_user_application_by_id(db, application_id)
        if user_application.house_value:
            house_value = int(user_application.house_value)
        else:
            house_value = calc.calculate_loan_limit(
                user_application.income_before_tax,
                user_application.living_expesnes,
                user_application.num_depends_over_18 + user_application.num_depends_under_18
            )
    
    search_params = {
        "limit": 200,
        "start_page": 1,
        "exclude_no_sale_price" :True
    }
    if house_value is not None:
        search_params["max_price"] = house_value
    if location is not None:
        search_params["locations"]= [location]

    listings = api.search(**search_params)

    #return listings
    filtered_listings = [listing for listing in listings if listing.price is not None]

    sorted_listings = sorted(
        filtered_listings,
        key=lambda x: x.bedrooms if x.bedrooms is not None else -float('inf'),
        reverse=True
    )


    page_size = 10
    start_index = (page - 1) * page_size
    end_index = start_index + page_size

    return sorted_listings[start_index:end_index]
'''

def get_filtered_recommended_houses(db: Session, page: int, application_id: int = None, location: str = None):

    house_value = None

    if application_id is not None:
        user_application = get_user_application_by_id(db, application_id)
        if user_application is not None:
            house_value = user_application.loan_limit

    with open('homeList.js', 'r') as f:
        listings = json.load(f)

    if house_value is not None:
        listings = [listing for listing in listings if listing['price'] <= house_value]
    if location is not None:
        listings = [listing for listing in listings if location in listing['short_address']]

    sorted_listings = sorted(
        listings,
        key=lambda x: x['bedrooms'] if x.get('bedrooms') is not None else -float('inf'),
        reverse=True
    )

    page_size = 10
    start_index = (page - 1) * page_size
    end_index = start_index + page_size

    return sorted_listings[start_index:end_index]

"""
##########################################
This section is all about Create methods #
##########################################
"""

# Create a Customer record in database
def create_customer(db: Session, customer: schemas.CustomerCreate):
    hashed_password = get_hashed_password(customer.password)
    db_customer = models.Customer(firstname=customer.firstname, lastname=customer.lastname, email=customer.email, 
                              hashed_password=hashed_password)
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

# Create a Staff record in database
def create_staff(db: Session, staff: schemas.StaffCreate):
    hashed_password = get_hashed_password(staff.password)
    db_staff = models.Staff(firstname=staff.firstname, lastname=staff.lastname, email=staff.email, 
                              hashed_password=hashed_password)
    db.add(db_staff)
    db.commit()
    db.refresh(db_staff)
    return db_staff

def create_document(db: Session, content: LargeBinary, filename: str, customer: models.Customer, type_str: str, application_id: int):
    '''
        - Creates document and adds it to the database. 
    '''
    db_document = models.Document(
        title = filename,
        content = content,
        customer_email = customer.email,
        type = type_str,
        app_id = application_id
       )
    db.add(db_document)
    db.commit()
    return db_document

def create_loan_application(db: Session, application: schemas.ApplicationBase, user: models.Customer | models.Staff):
    '''
    Stores loan applications in database. 

    Parameters:
        - Session
        - models.Customer | models.Stafff
        - models.Application
    '''

    income = application.income_before_tax + application.income_partner + application.income_other
    expenses = application.living_expenses + application.loan_repayment_expense
    dependents = application.num_depends_under_18 + application.num_depends_over_18

    application_db = models.Application(
        num_depends_under_18 = application.num_depends_under_18,
        num_depends_over_18 = application.num_depends_over_18,
        own_house = application.own_house,
        house_value = application.house_value,
        income_before_tax = application.income_before_tax,
        income_partner = application.income_partner,
        income_other = application.income_other,
        living_expesnes = application.living_expenses,
        loan_repayment_expense = application.loan_repayment_expense,
        complete = application.complete,
        loan_limit = calc.calculate_loan_limit(income, expenses, dependents),

        customer_email = user.email,
        manager_email = user.manager_email,

        status = "pending"
    )

    db.add(application_db)
    db.commit()

    return application_db

def get_application_status(application_id: int, db: Session):
    """
    Get application status with provided application id

    Parameters:
    - application_id
    - Session

    Returns:
    - Application status
    """
    application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if application:
        return application.status
    return None

def change_application_status(new_status: str, application_id: int, db: Session):
    """
    Set application status to given str

    Parameters:
    - Status
    - application_id
    - Session
    """

    application = db.query(models.Application).filter(models.Application.id == application_id).first()

    if application:
        application.status = new_status
        db.commit()

    return application


def get_user_application_by_email(db: Session, email: str):
    user_applications = db.query(models.Application).filter(models.Application.customer_email == email).all()
    return user_applications

def get_user_application_by_id(db: Session, id: int):
    user_applications = db.query(models.Application).filter(models.Application.id == id).first()
    return user_applications

def get_files_by_app_id(db: Session, app_id: int):
    files = db.query(models.Document).filter(models.Document.app_id == app_id).all()
    return files

def create_loan_package(db: Session, loan_package: schemas.LoanPackageCreate):
    db_loan_package = models.LoanPackage(**loan_package.dict())
    db.add(db_loan_package)
    db.commit()
    db.refresh(db_loan_package)
    return db_loan_package

def create_appointment(db: Session, appointment: schemas.AppointmentCreate):
    date = appointment.time.strftime('%Y-%m-%d %H')
    exist_appointment = db.query(models.Appointment).filter(func.strftime('%Y-%m-%d %H', models.Appointment.time) == date,
                                                            models.Appointment.status == "approved").first()
    if exist_appointment:
        return None
    db_appointment = models.Appointment(**appointment.dict())
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment


#########################################
# This section is all about Update method
#########################################

def update_password(db: Session, user: models.Customer|models.Staff, hashed_password: str):
    '''
        - update user's hashed password. 
    '''
    # check type
    if isinstance(user, models.Customer):
        # if customer
        db.query(models.Customer).filter(models.Customer.email == user.email).\
            update({"hashed_password": hashed_password}, synchronize_session='evaluate')
    else:
        # if staff
        db.query(models.Staff).filter(models.Staff.email == user.email).\
            update({"hashed_password": hashed_password}, synchronize_session='evaluate')
    db.commit()

def change_application_status(new_status: str, application_id: int, db: Session):
    """
    Set application status to given str

    Parameters:
    - Status
    - application_id
    - Session
    """

    application = db.query(models.Application).filter(models.Application.id == application_id).first()

    if application:
        application.status = new_status
        db.commit()

    return application


def get_user_application_by_email(db: Session, email: str):
    user_applications = db.query(models.Application).filter(models.Application.customer_email == email).all()
    return user_applications

def get_user_application_by_id(db: Session, id: int):
    user_applications = db.query(models.Application).filter(models.Application.id == id).first()
    return user_applications

def get_files_by_app_id(db: Session, app_id: int):
    files = db.query(models.Document).filter(models.Document.app_id == app_id).all()
    return files

def create_loan_package(db: Session, loan_package: schemas.LoanPackageCreate):
    db_loan_package = models.LoanPackage(**loan_package.dict())
    db.add(db_loan_package)
    db.commit()
    db.refresh(db_loan_package)
    return db_loan_package

def get_all_loan_package(db: Session):
    loan_package_list = []
    loan_package_list = db.query(models.LoanPackage).all()
    sorted_loan_package_list = sorted(loan_package_list, key=lambda x: x.interest_rate)
    return sorted_loan_package_list

def get_all_applications(db:Session):
    """
    Returns all applications

    Parameters:
    - Session

    Returns:
    - models.Application
    """

    applications = db.query(models.Application).all()

    return applications

def delete_loan_package(db: Session, idx: int):
    db_loan_package = db.query(models.LoanPackage).filter(models.LoanPackage.id == idx).first()
    db.delete(db_loan_package)
    db.commit()
    #db.refresh(db_loan_package)
    return

def edit_loan_package(db: Session, loan_package: schemas.LoanPackageCreate, idx: int):
    db_loan_package = db.query(models.LoanPackage).filter(models.LoanPackage.id == idx).first()

    if db_loan_package is not None:
    #Iterate over each property and update them
    ############## WARNING TEMPORARY PRESCRIPTION ##############
        for key, value in loan_package.dict().items():
            setattr(db_loan_package, key, value)
    db.commit()
    db.refresh(db_loan_package)
    return db_loan_package

def get_customer_docs(db: Session, customer_email: str):
    """
    Returns the documents for one user.

    Parameters:
    - customer_email: str
    - Session

    Returns:
    - Documents for user with email == customer_email
    """
    customer_docs = db.query(models.Document).filter(models.Document.customer_email == customer_email).all()

    return customer_docs

def edit_application(db: Session, application: models.Application, application_new: schemas.ApplicationBase):
    """
    Edits loan application
    
    Parameters:
    - Session
    - Application_id
    - Schemas.ApplicationBase

    Returns:
    - Updated application
    """

    data = application_new.dict()

    if application:
        
        for key, value in data.items():
            setattr(application, key, value)
        
        db.add(application)
        db.commit()
    
    return application

def edit_loan_package(db: Session, loan_package: schemas.LoanPackageCreate, idx: int):
    db_loan_package = db.query(models.LoanPackage).filter(models.LoanPackage.id == idx).first()

    if db_loan_package is not None:
    #Iterate over each property and update them
    ############## WARNING TEMPORARY PRESCRIPTION ##############
        for key, value in loan_package.dict().items():
            setattr(db_loan_package, key, value)
    db.commit()
    db.refresh(db_loan_package)
    return db_loan_package


def change_appointment_status(new_status: str, appointment_id: int, db: Session):
    """
    Set application status to given str

    Parameters:
    - Status
    - application_id
    - Session
    """
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if appointment:
        appointment.status = new_status
    db.commit()
    db.refresh(appointment)
    return appointment


"""
#########################################
This seciton is all about Delete method #
#########################################
"""
def delete_loan_package(db: Session, idx: int):
    db_loan_package = db.query(models.LoanPackage).filter(models.LoanPackage.id == idx).first()
    db.delete(db_loan_package)
    db.commit()
    #db.refresh(db_loan_package)
    return

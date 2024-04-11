'''
The Pydantic models in the schemas module define the data schemas relevant to the API. It has nothing to 
do with the database yet. Some of these schemas define what data is expected to be received by certain API endpoints 
for the request to be considered valid. Others define what the data returned by certain endpoints will look like.
'''

from pydantic import BaseModel, Field
from fastapi import File
from typing import Literal, List, Annotated
from datetime import datetime

# CustomerBase includes shared attributes for both Record creation and response returning
# CustomerCreate is specially for Record creation
# CustomerResponse is specially for reading / returning data to route
class CustomerBase(BaseModel):
    firstname: str = Field(..., max_length=50)
    lastname: str = Field(..., max_length=50)
    email: str = Field(..., max_length=50)

class CustomerCreate(CustomerBase):
    password: str = Field(..., max_length=50)

class CustomerResponse(CustomerBase):
    pass

    class Config:
        orm_mode = True

# Staff Model
class StaffBase(BaseModel):
    firstname: str = Field(..., max_length=50)
    lastname: str = Field(..., max_length=50)
    email: str = Field(..., max_length=50)

class StaffCreate(StaffBase):
    password: str = Field(..., max_length=50)

class StaffResponse(StaffBase):
    pass

    class Config:
        orm_mode = True

# Document
class DocumentBase(BaseModel):
    document: Annotated[bytes, File()]
    type: Literal["Identity", "df"]

# Application Model
class ApplicationBase(BaseModel):
    num_depends_under_18 : int
    num_depends_over_18 : int
    own_house : bool
    house_value : float
    income_before_tax : float
    income_partner : float
    income_other : float
    living_expenses : float
    loan_repayment_expense: float
    complete: bool = False

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationResponse(ApplicationBase):
    id : int

    class Config:
        orm_mode = True


# Loan Package Model
class LoanPackageBase(BaseModel):
    name : str
    description : str
    interest_rate : float
    period : int
    #repayment : float
    fee : float

class LoanPackageCreate(LoanPackageBase):
    pass

class LoanPackageResponse(LoanPackageBase):
    id : int

    class Config:
        orm_mode = True



# Appointment Model
class AppointmentBase(BaseModel):
    time : datetime
    manager_email : str

class AppointmentCreate(AppointmentBase):
    customer_email : str
    
class AppointmentResponse(AppointmentBase):
    id : int

    class Config:
        orm_mode = True
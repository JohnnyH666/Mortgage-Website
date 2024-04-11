from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, LargeBinary, Float, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy import CheckConstraint

from database import Base

import uuid

# Define a Customer table 
class Customer(Base):
    __tablename__ = "customers"

    email = Column(String, primary_key=True, unique=True, nullable=False)

    firstname = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    
    manager_email = Column(Integer, ForeignKey("staffs.email"))

    # Relationship
    manager = relationship("Staff", back_populates = "customer")
    application = relationship("Application", back_populates = "customer")
    documents = relationship("Document", back_populates= "customer")
    appointment = relationship("Appointment", back_populates = "customer")

# Define a Staff table
class Staff(Base):
    __tablename__ = "staffs"

    email = Column(String, primary_key=True, unique=True, nullable=False)

    firstname = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)

    # Relationship
    customer = relationship("Customer", back_populates = "manager")
    application = relationship("Application", back_populates = "manager")
    appointment = relationship("Appointment", back_populates = "manager")

# Define a Application table
class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    num_depends_under_18 = Column(Integer, nullable=True)
    num_depends_over_18 = Column(Integer, nullable=True)
    own_house = Column(Boolean, nullable=False)
    house_value = Column(Float, nullable=True)
    income_before_tax = Column(Float, nullable=False)
    income_partner = Column(Float, nullable=True)
    income_other = Column(Float, nullable=True)
    living_expesnes = Column(Float, nullable=False)
    loan_repayment_expense = Column(Float, nullable=True)
    complete = Column(Boolean, nullable=False)
    loan_limit = Column(Float, nullable=True)

    customer_email = Column(String, ForeignKey("customers.email"))
    manager_email = Column(String, ForeignKey("staffs.email"))

    # Relationship
    manager = relationship("Staff", back_populates = "application")
    customer = relationship("Customer", back_populates = "application")

    # Status
    status = Column(String, nullable=False)

    __table_args__ = (
        CheckConstraint(
            status.in_(["pending", "approved", "declined"]),
            name="check_status_values"
        ),
    )

# Define a Document table 
class Document(Base):
    __tablename__ = 'documents'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    title = Column(String, index=True)
    content = Column(LargeBinary)
    
    customer_email = Column(String, ForeignKey('customers.email'))
    # Application
    app_id = Column(Integer, nullable=False)
    
    # Type of document
    type = Column(String, nullable=False)

    

    # Relationship
    customer = relationship("Customer", back_populates='documents')

# Define a LoanPackage table 
class LoanPackage(Base):
    __tablename__ = "loan_packages"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    name = Column(String, nullable=False)
    description = Column(String, nullable=False)
    interest_rate = Column(Float, nullable=True)
    period = Column(Integer, nullable=True)
    #repayment = Column(Float, nullable=False)
    fee = Column(Float, nullable=True)
    
    # Relationship

# Define a Appointment table 
class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    
    time = Column(DateTime, nullable=False)

    customer_email = Column(String, ForeignKey("customers.email"))
    manager_email = Column(String, ForeignKey("staffs.email"))
    
    # Relationship
    manager = relationship("Staff", back_populates = "appointment")
    customer = relationship("Customer", back_populates = "appointment")


    # Status
    status = Column(String, default="pending", nullable=False)

    __table_args__ = (
        CheckConstraint(
            status.in_(["pending", "approved", "declined"]),
            name="check_status_values"
        ),
    )

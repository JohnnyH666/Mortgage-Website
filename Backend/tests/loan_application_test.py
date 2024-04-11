### Testing application APIS ###

from fastapi import FastAPI
from fastapi.testclient import TestClient
from fastapi.security import OAuth2PasswordRequestForm
import crud
from database import SessionLocal
import sys

import sys
import os
 
from fastapi.encoders import jsonable_encoder
import schemas

# getting the name of the directory
# where the this file is present.
current = os.path.dirname(os.path.realpath(__file__))
 
# Getting the parent directory name
# where the current directory is present.
parent = os.path.dirname(current)
 
# adding the parent directory to
# the sys.path.
sys.path.append(parent)

import main

client = TestClient(main.app)

def get_staff_token():
    response = client.post(
            "/token",
            data={"username": 'test2@test.com', "password": 'test'}
        )
    assert response.status_code == 200
    response_json = response.json()
    return response_json["access_token"]

def get_cus_token():
    response = client.post(
            "/token",
            data={"username": 'test1@test.com', "password": 'test'}
        )
    assert response.status_code == 200
    response_json = response.json()
    return response_json["access_token"]

# test about /loan_application
def test_loan_application_create():
    
    db = SessionLocal()

    access_token = get_cus_token()

    loan_application = schemas.ApplicationBase(
        num_depends_under_18 = 1,
        num_depends_over_18 = 1,
        own_house = True,
        house_value = 100000.00,
        income_before_tax = 50000.00,
        income_partner = 25000.00,
        income_other = 10000.00,
        living_expenses = 20000.00,
        loan_repayment_expense = 10000.00,
        complete = True
    )
        
    response = client.post(
        "/loan_application/",
        headers={"Authorization": f"Bearer {access_token}"},
        json=loan_application.dict()
    )
        
    assert response.status_code == 200
    assert response.json() == {"message": "success"}

    db_application = crud.get_user_application_by_id(db, 1)

    assert db_application.num_depends_under_18 == loan_application.num_depends_under_18
    assert db_application.num_depends_over_18 == loan_application.num_depends_over_18
    assert db_application.own_house == loan_application.own_house
    assert db_application.house_value == loan_application.house_value
    assert db_application.income_before_tax == loan_application.income_before_tax
    assert db_application.income_partner == loan_application.income_partner
    assert db_application.income_other == loan_application.income_other
    assert db_application.loan_repayment_expense == loan_application.loan_repayment_expense
    assert db_application.complete == loan_application.complete

# test about /get_applications_by_email
def test_get_applications_by_email():

    access_token = get_staff_token()
    
    response = client.post(
        "/get_applications_by_email/",
        headers={"Authorization": f"Bearer {access_token}"},
        params={"user_email": 'test1@test.com'}
    )
        
    assert response.status_code == 200
    assert len(response.json()) == 1

# test /application_status/
def test_application_status():

    access_token = get_staff_token()

    response = client.get(
        "/application_status/",
        headers={"Authorization": f"Bearer {access_token}"},
        params={"application_id": 1}
    )

    assert response.status_code == 200
    assert response.json() == 'pending'

# test /loan_application/edit/
def test_loan_application_edit():
    
    db = SessionLocal()

    access_token = get_cus_token()

    loan_application = schemas.ApplicationBase(
        num_depends_under_18 = 1,
        num_depends_over_18 = 1,
        own_house = True,
        house_value = 500000.00,
        income_before_tax = 50000.00,
        income_partner = 25000.00,
        income_other = 10000.00,
        living_expenses = 20000.00,
        loan_repayment_expense = 10000.00,
        complete = True
    )

    response = client.put(
        "/loan_application/edit/",
        headers={"Authorization": f"Bearer {access_token}"},
        params={"application_id": 1},
        json=loan_application.dict()
    )

    assert response.status_code == 200
    db_application = crud.get_user_application_by_id(db, 1)
    assert db_application.house_value == loan_application.house_value

    access_token = get_staff_token()

    response = client.put(
        "/loan_application/edit/",
        headers={"Authorization": f"Bearer {access_token}"},
        params={"application_id": 1},
        json=loan_application.dict()
    )
    assert response.status_code == 403

# test /get_all_applications/
def test_get_all_applications():
    
    db = SessionLocal()

    access_token = get_cus_token()

    response = client.get(
        "/get_all_applications/",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    assert response.status_code == 200
    assert len(response.json()) == 1

    loan_application = schemas.ApplicationBase(
        num_depends_under_18 = 1,
        num_depends_over_18 = 1,
        own_house = True,
        house_value = 100000.00,
        income_before_tax = 50000.00,
        income_partner = 25000.00,
        income_other = 10000.00,
        living_expenses = 20000.00,
        loan_repayment_expense = 10000.00,
        complete = True
    )
        
    response = client.post(
        "/loan_application/",
        headers={"Authorization": f"Bearer {access_token}"},
        json=loan_application.dict()
    )

    response = client.get(
        "/get_all_applications/",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    assert response.status_code == 200
    assert len(response.json()) == 2
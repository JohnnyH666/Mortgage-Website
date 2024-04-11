### Testing authorisation APIS ###

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

# test about /loan_package/create
def test_loan_package_create():

    access_token = get_staff_token()

    loan_package = schemas.LoanPackageCreate(
        name = 'test',
        description = 'test',
        interest_rate = 3.0,
        period = 12,
        fee = 3000.0
    )
        
    response = client.post(
        "/loan_package/create/",
        headers={"Authorization": f"Bearer {access_token}"},
        json=loan_package.dict()
    )
        
    assert response.status_code == 200

    data = response.json()
    assert data["name"] == loan_package.name
    assert data["description"] == loan_package.description
    assert data["interest_rate"] == loan_package.interest_rate
    assert data["period"] == loan_package.period
    assert data["fee"] == loan_package.fee

# test /loan_package/get_all
def test_loan_package_get_all():

    access_token = get_staff_token()

    response = client.get(
        "/loan_package/get_all/",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    assert response.status_code == 200
    assert len(response.json()) == 1

    loan_package = schemas.LoanPackageCreate(
        name = 'test',
        description = 'test',
        interest_rate = 3.0,
        period = 12,
        fee = 3000.0
    )
        
    response = client.post(
        "/loan_package/create/",
        headers={"Authorization": f"Bearer {access_token}"},
        json=loan_package.dict()
    )
        
    response = client.get(
        "/loan_package/get_all/",
        headers={"Authorization": f"Bearer {access_token}"}
    )

    assert response.status_code == 200
    assert len(response.json()) == 2

# test /loan_package/edit
def test_loan_package_edit():

    db = SessionLocal()

    access_token = get_staff_token()

    loan_package = schemas.LoanPackageCreate(
        name = 'change test',
        description = 'test',
        interest_rate = 3.0,
        period = 12,
        fee = 3000.0
    )
        
    response = client.put(
        "/loan_package/edit/",
        headers={"Authorization": f"Bearer {access_token}"},
        params={"id": 1},
        json=loan_package.dict()
    )
        
    assert response.status_code == 200
    assert response.json() == {"message": "edit success"}

    dp_package = crud.get_loan_package(db, 1)

    assert dp_package.name == loan_package.name

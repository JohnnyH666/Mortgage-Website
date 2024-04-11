### Testing booking APIS ###

from datetime import datetime, timedelta
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

# test about /appointment/create
def test_appointment_create_create():
    
    db = SessionLocal()

    access_token = get_cus_token()

    appointment = {
        "time": "2023-08-04 13:05:59.000123",
        "manager_email": "test2@test.com"
    }
        
    response = client.post(
        "/appointment/create/",
        headers={"Authorization": f"Bearer {access_token}"},
        json=appointment
    )
        
    assert response.status_code == 200

    db_application = response.json()

    assert db_application["time"] == "2023-08-04T13:05:59.000123"
    assert db_application["manager_email"] == appointment["manager_email"]

# test about /appointment/get_all
def test_appointment_get_all():

    access_token = get_staff_token()

    appointment = {
        "time": "2023-08-04 13:05:59.000123",
        "manager_email": "test2@test.com"
    }
        
    response = client.get(
        "/appointment/get_all/",
        headers={"Authorization": f"Bearer {access_token}"}
    )
        
    assert response.status_code == 200
    assert len(response.json()) == 1

    db_application = response.json()[0]

    assert db_application["time"] == "2023-08-04T13:05:59.000123"
    assert db_application["manager_email"] == appointment["manager_email"]
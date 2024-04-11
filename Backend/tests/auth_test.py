### Testing authorisation APIS ###

from fastapi import FastAPI
from fastapi.testclient import TestClient
from fastapi.security import OAuth2PasswordRequestForm
import sys

import sys
import os
 
from fastapi.encoders import jsonable_encoder

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


def test_register_customer():
    firstname = 'Mikkel'
    lastname = 'endr'
    is_staff = False
    response = client.post(
        '/register/?firstname=Mikkel&lastname=Endresen&is_staff=false',
        data = {
            'username': 'test1@test.com',
            'password': 'test',
            'grant_type': 'password',
        },
        headers={
            'content-type': 'application/x-www-form-urlencoded',
            'accept': 'application/json'
        }
    )
    print(response.json())
    assert response.status_code == 200
    assert response.json() == {
        'firstname': 'Mikkel',
        'lastname': 'Endresen',
        'email': 'test1@test.com'
    }

def test_register_staff():

    response = client.post(
        '/register/?firstname=Jason&lastname=Spike&is_staff=true',
        data = {
            'username': 'test2@test.com',
            'password': 'test',
            'grant_type': 'password',
        },
        headers={
            'content-type': 'application/x-www-form-urlencoded',
            'accept': 'application/json'
        }
    )
    print(response.json())
    assert response.status_code == 200
    assert response.json() == {
        'firstname': 'Jason',
        'lastname': 'Spike',
        'email': 'test2@test.com'
    }

def test_login():
    response = client.post(
            "/token",
            data={"username": 'test2@test.com', "password": 'test'}
        )
    assert response.status_code == 200

def test_change_password():

    response = client.post(
        '/register/?firstname=Jason&lastname=Spike&is_staff=true',
        data = {
            'username': 'test3@test.com',
            'password': 'test',
            'grant_type': 'password',
        },
        headers={
            'content-type': 'application/x-www-form-urlencoded',
            'accept': 'application/json'
        }
    )

    response = client.post(
            "/token",
            data={"username": 'test3@test.com', "password": 'test'}
        )
    assert response.status_code == 200
    response_json = response.json()
    token = response_json["access_token"]

    response = client.post(
        "/change_password/",
        headers={"Authorization": f"Bearer {token}"},
        data={"old_password": 'test', "new_password": 'testtest'}
    )

    assert response.status_code == 200

    response = client.post(
            "/token",
            data={"username": 'test3@test.com', "password": 'test'}
        )
    assert response.status_code != 200

    response = client.post(
            "/token",
            data={"username": 'test3@test.com', "password": 'testtest'}
        )
    assert response.status_code == 200

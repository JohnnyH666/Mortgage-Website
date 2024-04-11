from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
import sys

import sys
import os
 
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


def test_return_list():
    response = client.get("/home_recommend", params={"page": 1})

    assert response.status_code == 200
    assert len(response.json()) > 0

def test_home_recommendation_page_and_sort():
    response = client.get("/home_recommend", params={"page": 1})
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 10
    for i in range(len(data) - 1):
        assert data[i]['bedrooms'] >= data[i+1]['bedrooms']

def test_home_recommendation_location():
    response = client.get("/home_recommend", params={"page": 1, "location": "2559"})
    assert response.status_code == 200
    data = response.json()
    for i in range(len(data) - 1):
        assert data[i]['bedrooms'] >= data[i+1]['bedrooms']

    for i in data:
        assert "2559" in i['short_address']

def test_home_recommendation_diff_page():
    response_page_1 = client.get("/home_recommend", params={"page": 1})
    assert response_page_1.status_code == 200
    data_page_1 = response_page_1.json()
    assert len(data_page_1) == 10

    response_page_2 = client.get("/home_recommend", params={"page": 2})
    assert response_page_2.status_code == 200
    data_page_2 = response_page_2.json()
    assert len(data_page_2) == 10

    assert data_page_1 != data_page_2
# Use the official Python base image with the desired Python version
FROM python:3.11

# Set the working directory inside the container
WORKDIR /app

# Copy the application files into the container
COPY main.py /app/main.py
COPY requirements.txt /app/requirements.txt

# Install the required dependencies
    # --no-cache-dir, means that pip does not download packages in 
    # local directory. Please use. 
RUN pip install --no-cache-dir fastapi uvicorn
RUN pip install pydantic
RUN pip install passlib[bcrypt]
RUN pip install python-jose[cryptography]
    # -r specifies requirements file
RUN pip install --no-cache-dir -r requirements.txt

RUN pip install -e git+https://github.com/tomquirk/realestate-com-au-api.git#egg=realestate_com_au_api

COPY . /app
# Randomly generate key environment variables
RUN export SECRET_KEY=$(openssl rand -hex 32)


# Install pytest
RUN pip install pytest
RUN pip install pytest httpx

# Run the tests, if want to test, please uncomment next line
#RUN pytest
#RUN rm -rf /full/path

# Expose the port on which your FastAPI application will listen
EXPOSE 8000

# Start the FastAPI application using Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]



# To build image: docker build -t my_fastapi_app .
# TO run in container: docker run -d -p 8000:8000 my_fastapi_app
    # Enter Docker app, and click url from there
    # Or, localhost:8000
# To stop docker from running: docker stop <CONTAINER ID>
# To list running dockers: docker ps
# capstone-project-3900h14amortgagemates
capstone-project-3900h14amortgagemates created by GitHub Classroom

##Build Instructions
###Backend
1. **To start the backend application you first ensure you are in the correct directory**
####`cd Backend`
2. **Then build the docker file:**
####`docker build -t my_fastapi_app .`
3. **Finally run your built docker file:**
####`docker run -d -p 8000:8000 my_fastapi_app`
4. **To stop the application run:**
####`docker stop <CONTAINER_ID>`


###Frontend
1. **To start the frontend application you first ensure you are in the correct directory**
####`cd Frontend`
2. **Then build the docker file:**
####`docker build -t my-vite-app .`
3. **Finally run your built docker file:**
####`docker run -d -p 5173:5173 my-vite-app`
4. **To stop the application run:**
####`docker stop <CONTAINER_ID>`

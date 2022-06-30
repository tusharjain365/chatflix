# Chatflix

Chatflix is a full stack MERN chat app made with socket.

Whole app can be found here [Chatflix](https://tj-chatflix.herokuapp.com/)

## Features
1. Authentication with JWT token.
2. User can do one to one chat 
3. User can do group chat 
4. User can view profile of members of group chat 
5. Only User who created the group have certain privilege to add other users or rename group, that user is called group admin.
6. Reactjs is used for frontend while Nodejs is used for backend along with mongodb database and mongoose is used to communicate with database whereas socket is used for real time chatting.

## Variables for .env file

`PORT` = 5000 (You can take it anything I just took 5000)

`MONGO_URI` = (Your mongodb link which you will get after making this project on mongodb atlas)

`SECRET` = KYADEKHRHA (Your secret to match with JWT token while authenticating, it could be anything)

`NODE_ENV` = producion (Used for Deployment of app)

## Steps 
1. Clone this repo to your local machine using `git clone`
2. Install all the packages for frontend and for backend.
3. Create an .env file and make above mentioned variables.
4. Run server with `npm start` to run backend and navigate to frontend folder and run command `npm start` to run frontend.

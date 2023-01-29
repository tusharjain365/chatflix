# Chatflix

Chatflix is a full stack MERN chat app made with socket.

Whole app can be found here [Chatflix](https://chatflix.onrender.com/)

# Screenshots

## Login and SignUp
<img width="434" alt="image" src="https://user-images.githubusercontent.com/75572829/215311897-885cbe5b-1c28-4c8e-850a-9023c9a89311.png">

## Realtime chatting and typing indicator
<img width="935" alt="image" src="https://user-images.githubusercontent.com/75572829/215311975-718a8dd4-6079-431e-973a-ddbb64cb8bb2.png">

## Home Screen and Create Chat modal
<img width="933" alt="image" src="https://user-images.githubusercontent.com/75572829/215312031-9457a6ab-9c4e-44ed-bfcf-78b04f162140.png">

## Search User Screen
<img width="936" alt="image" src="https://user-images.githubusercontent.com/75572829/215312048-3c393dc8-c3f8-4dd3-843e-3743e6467a40.png">

## Admin privileges
<img width="928" alt="image" src="https://user-images.githubusercontent.com/75572829/215312071-b5709a24-66dc-4e14-87d3-058b313d7308.png">


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

# Basic Authentication API
Here's a basic API for user authentication using **Node JS**, **Express JS**, **Passport JS** and **Typescript**, complete with tests.

It uses an email and password for signup and subsequent logins, with *JWT* authentication for subsequent requests. Blacklisted refresh tokens are stored in the user model, and access tokens only last for 10 mins, although the token validity could be configured.

## Installation
- git clone
- npm install
- create a config/config.json in the project root, and choose your database (SQL) dialect
- run *npx sequelize-cli db:migrate*

## Running
- To run the development server: *npm run dev*
- To run the production server: *npm start*

## Testing
- To test, run *npm test*
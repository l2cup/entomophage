# Entomophage-users

This is the user service for the issue/bug tracker Entomophage. This service is responsible for managing users and teams.

## About

The users service is responsible for both the users and their teams. It serves the routes '/user', '/team' as well as '/register' and '/login'. It is also responsible for __authorization but not for authentification__.

## Running

It uses mongo for data storage, the configuration for the database connection should be in the .env file as seen in the example provided in the repo. The port should be configured there too, if not it uses port 5050.

### Nodemon

Nodemon is available as a yarn script using ```yarn serve-watch``` but it watches on the .js file so for now building when changing .ts files is necesarry. There is a way for watching .ts files and partial building but i had no need for it as the build times are small.

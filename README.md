# prophius
A simple API server using HapiJs framework with the following properties
Database Used: Mongo DB
Queue Used: RabbitMQ
Mail Client: Mailgun

- a model for users with the following structure
  -- firstname
  -- lastname
  -- email
  -- mobile
- 'POST /api/user' to save/register a new user
- 'GET /api/users' to get all saved users
- 'GET /api/user/:id' to get a user with the specified Id
- 'PATCH /api/user/:id' to update the user information
- 'DEL /api/user/:id' to delete the user from the database

This project have 2 services:
 1. users-Service: handles users registration
 2. notifcation-service: handles notifications like email
 
 # Steps to start the services in Docker
  From the project root folder `cd users-service`

 #### Running the Service

    npm run docker:start
    
 #### Running the Service with Seed Data

    npm run docker:start:seed
    
#### Tailing the Log

    npm run docker:tail

#### Running in Debug Mode

    npm run docker:debug
    
#### Stop in Running Services
    
    npm run docker:stop

## Testing

This project uses the Jest test framework which has built in support for
code coverage. To run the suite of tests, use the following command

    npm run docker:test

## Swagger Documentation Url

    http://localhost:5071/documentation
    


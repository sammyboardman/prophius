# prophius
A simple API server using HapiJs framework with the following properties
- Database Used: Mongo DB
- Queue Used: RabbitMQ
- Mail Client: Mailgun

a model for users with the following structure
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
 1. users-service: handles users registration
 2. notifcations-service: handles notifications like email

# Note
   1. The services run on >= Node 12
   2. To avoid getting 401 Unauthorised MailGUN StatusCode when trying to send Email
       - Add FROM_EMAIL [Here](https://github.com/sammyboardman/prophius/blob/master/docker-compose.dev.yml#L49) 
       - Add MAILGUN_API_KEY [Here](https://github.com/sammyboardman/prophius/blob/master/docker-compose.dev.yml#L50) 
       - Add DOMAIN [Here](https://github.com/sammyboardman/prophius/blob/master/docker-compose.dev.yml#L51) 

 # Steps to start the services in Docker
  From the project root folder `cd users-service`

 #### Running the Service

    npm run docker:start
    
 #### Running the Service with Seed Data

    npm run docker:start:seed

#### Tailing the User-Service Log

    npm run docker:tail
    
#### Tailing the Notificaton-Service Log
    From the project root folder:
 
    cd notifications-service
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
    

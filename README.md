# TO DO App 

An authroization based ToDo app API made with typescript and express. 


## Features
* Authentication
* Organization
  > Organize task by notebooks

## How to start

* Clone the repository
* Create postgresql database and provide it in env file
* Run prisma migrate commands
* To start API run `npm run dev`


## Tech stack

* Typescript
* NodeJS
* Express JS
* Postgresql
* Prisma ORM


## TODO

- [x] Configure app
- [x] Configure ts
- [x] Configure morgan and winston
- [x] Create database db
- [x] Api views
  - [x] Add query filter for tasks
  - [x] Auth views
- [x] Add user support
  - [x] Install bcrypt
  - [x] Configure some bcrypt util functions
    - [x] Create hashed password
    - [x] Compare password
    - [x] Basic login support
    - [x] Find out more
  - [x] Install passport, passport local and jwt
  - [x] Configure passport and jwt
- [x] Validator
  - [x] Install express-validator
  - [x] Configure express-validator for API views
    - [x] Configure for user
    - [x] Configure for notebook
    - [x] Configure for task
- [x] Middleware for giving permission users to theirs own notebooks
- [x] Make error messages beautiful
- [ ] Deploy?


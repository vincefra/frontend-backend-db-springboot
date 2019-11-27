# API service for Find-Out Infographics visualization  


## Prerequisites
- [Java](https://java.com/en/download/)
- [Maven](https://maven.apache.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose Tools](https://docs.docker.com/compose/install/)

If running Docker from Ubuntu on Windows, make sure to update base mount point in wsl.conf (https://nickjanetakis.com/blog/setting-up-docker-for-windows-and-wsl-to-work-flawlessly#ensure-volume-mounts-work)  

## Running the application LOCAL

### Build
`./mvn clean install`
### Run the application along with the DB 
`docker-compose up --build`
### Run integration tests using pre-running docker DB
`mvn integrationTest`  [TBD]

### Run this command to remove docker-builds
`docker-compose down`

## Updating the application on AWS

### Connect to TEST-AWS (Talk to Gustav to get PEM and correct ssh-link)
`ssh -i "vincent.pem" ubuntu@ec2-3-123-154-0.eu-central-1.compute.amazonaws.com`

### How to pull from repository (gitlab)
If you setup a new server, it is important to regenerate a new key for your gitlab account.

Go to following folder,
 `findout/findout-infographics`

Pull latest code from git,
 `git pull`
 
After pulling new update, go to
 `backend-db/SpringJPA-PostgreSQL`
 
Run following command,
 `mvn clean install`

And then run this command to update container,
 `docker-compose up --build -d` 
 
Congratulations, you have just updated the server!

## Accessing the application

The backend server is available at, 
http://localhost:7878/
http://ec2-3-123-154-0.eu-central-1.compute.amazonaws.com

Sample call: /ping

Swagger UI: /swagger-ui.html

DB console is available at http://localhost:9081/ with default settings:
- System: PostgreSQL
- server: postgres:5432
- username: postgres
- password: password
- Database: postgres

## Settings for the application
- sources/backend-db/SpringJPA-PostgreSQL/src/main/resources

--/application.yaml

Here are the settings for database and flyway. If set to true, flyway till run all the scripts and make the databas ready with data.

--/db/migration

Here are the scriptfiles for database.

## Problem (?)
Try using `sudo` when using command.

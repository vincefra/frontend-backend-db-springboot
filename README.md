# API service for Find-Out Infographics visualization  


## Prerequisites
- [Java](https://java.com/en/download/)
- [Maven](https://maven.apache.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose Tools](https://docs.docker.com/compose/install/)

If running Docker from Ubuntu on Windows, make sure to update base mount point in wsl.conf (https://nickjanetakis.com/blog/setting-up-docker-for-windows-and-wsl-to-work-flawlessly#ensure-volume-mounts-work)  

## Running the application LOCAL

In application.yaml, you find the profiles. When developing on your computer, profile will be set to "develop". It is important you link to correct database, setup a database in PostgresSQL and flyway will take care of the rest. 

Current link is jdbc:postgresql://localhost:5432/findout-migrate-new3, change this one to your own database. You can also use docker container for database, its already been configured. You can just copy the link from "localdocker" profile. 

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

Localhost, 
http://localhost:7878/

Amazon Server,
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

Try this commando to take down containers,
`docker-compose down`


# FindOut Infographics (Old readme before implementation of Backend)

A visualization over FindOut's projects, employees and clients.

## Setup

How to set up this project.

### Prerequisite

Node.js should be installed. To install Node.js in macOS with Homebrew:
> brew install node

### Project Setup

Clone the project

> git clone git@gitlab.com:GustavTaxen/findout-infographics.git

In the project directory, install dependencies

> npm install

Create a configuration file named `config.json` in `/src` directory. Add the access token to Dropbox.

```JSON
{
  accessToken: "<access token>"
}
```

## Development Mode

Runs the app in the development mode

> npm start

Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console.

## Data and Assets

Data and assets that are used in the visualization.

### Assets

Images that are used in the visualization

#### Employee Images

Employee images are under the folder `/public/img/employees`. The first letter in the employee's first name and last name are capitalized. They should be saved as `<FirstName>_<LastName>.jpg`. \
Example: `Stacy_Baker.jpg`.

#### Company Images

Company images are saved under the folder `/public/img/logos`. They are named `<CompanyName>.png` and should be capitalized as their official names. Any whicespace should be replaced with an underscore. \
Example: `Example_Company.png`

### Data

The data used for the visualisation can be found in the company Dropbox folder `/FindOut- Projekt/FindOut/Infographics/Data` and is named `data.xlsx`.

The Excel file contains three sheets. They can be edited and will be automatically updated in the visualization.

#### Projects

List of projects that FindOut has worked with.

| Column | Description |
| --- | --- |
| ID  | Unique ID that identifies a project. |
| Project Type  | A tag that identify the type of the project using FindOut's guideline. |
| Start Dates | Starting dates (resumed) of a project, separated with comas. Formatted `YYYY-MM-DD` |
| End Dates | End dates of a project separated with comas. Ongoing project's end date are left out. Formatted `YYYY-MM-DD`. |
| Customer | Customer/client's name. Capitalized as their official name. Should be an existing one in [customers](#customers) sheet. |
| Employees | List of employees that has worked in the project, separated with comas. The first letter in an employee's first name and last name should be capitalized. The employee should exist in the [employees](#employees) sheet.|
| Description | A short description of the project. Multiple description in different languages are separated with a backslash `\`, where the Swedish version comes first. |
| Technologies | List of technologies that are used in the project, separated with comas. |

#### Employees

List of employees that has worked for FindOut.

| Column | Description |
| --- | --- |
| ID | Unique ID that identifies an employee. |
| Name | First name of an employee. First letter capitalized. |
| Title | Last name of an employee. First letter capitalized. |
| Type | Working Field. Management/Admin/Konsult |
| Birth year | Year of birth. |
| Year In | The year they started working at FindOut. |
| Year Out | The year they stopped working at FindOut. The year is left out if the employee is still working at FindOut. |
| Location | Which office an employee belongs to |
| Technologies | List of technologies an employee knows/uses. |
| Languages | List of languages an employee knows, separated with comas. Multiple languagues in different languages are separated with a backslash `\`, where the Swedish version comes first. |

#### Customers

List of customers/clients FindOut has worked with.

| Column | Description |
| --- | --- |
| ID | Unique ID that identifies a company/customer/client. |
| Name | The name of the company/customer/client. Capitalized  as their official name.|
| Category | The category/industry the company's in. |
| Location | The location the company is located. |
| Description | A descrption of the company. Multiple description in different languages are separated with a backslash `\`, where the Swedish version comes first. |

## Future Features

Following ideas/features that can be implemented to futher enhace the experience of the visualization.

### Implement a Database

Currently the data is fetchen from Dropbox's API. It's not durable and it's very currently very awkward when the visualization needs to do lots of calculations. The refactoring would mean a back-end side that would store the data in a database and fetch the corresponding data through queries. That would mean a lot of rewrite on the front-end side and lots of unnecessary calculations, thanks to queries, can be deleted.

This implementation would also mean updating the data would be much easier and there would be less unstrunctured data, e.g. there won't be any duplicates of any skills and several ways of spelling 'Java'.

### User Interface

A user interface to update the data for the visualization. When the database is set, it would be of interest to update the data as there might contain wrong information from the initial data scrapping and it would be of interest to update information as projects gets finished etc.

Make sure that there will be as little manual user input as possible. Make use of information that are already existing in the database, eg. if a user wants to update his/her skills/technologies, by adding Java, there should be a list of existing skills as soon as the user types 'Java', this would keep the database from having several 'Java's.

### Help Overlay

An help overlay that would give the user some initial help/instructions on how the user can interact will the visualization. The help icon (?) represent this feature but was not implemented.

### Deployment

A build version which can be hosted/deployed in some way or another.

### Confidentiality

Stuff to think about when deploying the visualization is to ask if the visualization will be in public or not. Not everyone wants to be in public. An idea is to make the visualization anonymous.

The visualization also contains all (most of them) projects through FindOuts history. Some of them might be confidential. An idea is to have a flag in the database which tells if the project/client is confidential or not.

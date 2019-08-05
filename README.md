# FindOut Infographics

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

Employee images are under the folder `/public/img`. The first letter in the employee's first name and last name are capitalized. They should be saved as `<FirstName>_<LastName>.jpg`. \
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

## Deployment

Todo.

# FindOut Infographics

A visualization over FindOut.

## Setup

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

## Deployment

Todo
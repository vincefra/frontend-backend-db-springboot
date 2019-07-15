import request from 'request';
import config from '../config.json';

export function load() {
  const requestURL = 'https://api.dropboxapi.com/2/files/get_metadata';
  const options = {
    uri: requestURL,
    method: 'POST',
    auth: {
      bearer: config.accessToken
    },
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      path:'/findout- projekt/findout/infographics/data/projects.xlsx'
    }) 
  };

  request(options, (error, response, body) => {
    console.log(response);
  });
}

export default {
  load
};
import axios from 'axios';

const apiRoute = 'http://localhost:7878/api/';
export async function fetchEmployee() {

  const requestURL = `${apiRoute}employee/findallarrayzero`;
  const options = {
    url: requestURL,
    responseType: "json",
    method: 'GET',
  };

  let response;
  try {
    response = await axios(options);
  } catch (error) {
    return {};
  }

  if (response.status === 200) {
    const employees = response.data;
    return { employees };
  }
}
export async function fetchCustomer() {

  const requestURL =`${apiRoute}customer/findallarrayzero`;
  const options = {
    url: requestURL,
    responseType: "json",
    method: 'GET',
  };

  let response;
  try {
    response = await axios(options);

  } catch (error) {
    return {};
  }

  if (response.status === 200) {
    const clients = response.data;
    return { clients};
  }
}

export async function fetchProject() {

  const requestURL =`${apiRoute}project/findallarrayzero`;
  const options = {
    url: requestURL,
    responseType: "json",
    method: 'GET',
  };

  let response;
  try {
    response = await axios(options);
  } catch (error) {
    return {};
  }

  if (response.status === 200) {
    const projects = response.data;
    return { projects};
  }
}

export async function fetchProjectCount() {

  const requestURL =`${apiRoute}project/findandcount`;
  const options = {
    url: requestURL,
    responseType: "json",
    method: 'GET',
  };

  let response;
  try {
    response = await axios(options);
  } catch (error) {
    return {};
  }

  if (response.status === 200) {
    const projects = response.data;
    return { projects};
  }
}

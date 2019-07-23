import axios from 'axios';
import config from '../config.json';
import XLSX from 'xlsx';
axios.defaults.headers.common['Authorization'] = `Bearer ${config.accessToken}`;

export async function load() {
  const data = await getData();
  return data;
}

async function getData() {
  const requestURL = 'https://content.dropboxapi.com/2/files/download';
  const options = {
    url: requestURL,
    responseType: 'arraybuffer',
    method: 'POST',
    headers: {
      'Dropbox-API-Arg': JSON.stringify({ 'path': 'id:tj_uftrYnS8AAAAAAABpIg' })
    }
  };

  let response;
  try {
    response = await axios(options);
  } catch {
    return {};
  }

  if (response.status === 200) {
    const uniCodedData = new Uint8Array(response.data);
    const workbook = XLSX.read(uniCodedData, { type: 'array' });
    const projectSheet = workbook.Sheets[workbook.SheetNames[0]];
    const employeeSheet = workbook.Sheets[workbook.SheetNames[1]];
    const projectHeaders = ['id', 'projectName', 'projectType', 'startDates', 'endDates', 'customer', 'employees', 'technologies'];
    const employeeHeaders = ['id', 'firstName', 'lastName', 'role', 'birthYear', 'yearStart', 'yearEnd', 'location', 'technologies', 'languages'];
    let projects = XLSX.utils.sheet_to_json(projectSheet, { header: projectHeaders });
    let employees = XLSX.utils.sheet_to_json(employeeSheet, {header: employeeHeaders });
    projects.shift();
    employees.shift();
    return { projects, employees };
  }
}

export default {
  load
};
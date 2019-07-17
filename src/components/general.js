import axios from 'axios';
import config from '../config.json';
import XLSX from 'xlsx';
axios.defaults.headers.common['Authorization'] = `Bearer ${config.accessToken}`;

export async function load() {
  const projects = await getProjects();
  const { employees, employeesProject } = await getEmployees();
  return { projects, employees, employeesProject };
}

async function getProjects() {
  const requestURL = 'https://content.dropboxapi.com/2/files/download';
  const options = {
    url: requestURL,
    responseType: 'arraybuffer',
    method: 'POST',
    headers: {
      'Dropbox-API-Arg': JSON.stringify({ 'path': 'id:tj_uftrYnS8AAAAAAABpHw' })
    }
  };

  let response;
  try {
    response = await axios(options);
  } catch {
    return [];
  }

  if (response.status === 200) {
    const uniCodedData = new Uint8Array(response.data);
    const workbook = XLSX.read(uniCodedData, { type: 'array' });
    const firstSheet = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheet];
    const headers = ['ID', 'projectName', 'projectType', 'startDates', 'endDates', 'customer', 'employees'];
    let projects = XLSX.utils.sheet_to_json(worksheet, { header: headers });
    projects.shift();
    return projects;
  }

}

async function getEmployees() {
  const requestURL = 'https://content.dropboxapi.com/2/files/download';
  const options = {
    url: requestURL,
    responseType: 'arraybuffer',
    method: 'POST',
    headers: {
      'Dropbox-API-Arg': JSON.stringify({ 'path': 'id:tj_uftrYnS8AAAAAAABo_A' })
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
    const employeeSheet = workbook.Sheets[workbook.SheetNames[0]];
    const employeesProjectSheet = workbook.Sheets[workbook.SheetNames[1]];

    let employees = XLSX.utils.sheet_to_json(employeeSheet);
    let employeesProject = XLSX.utils.sheet_to_json(employeesProjectSheet);
    return { employees, employeesProject };
  }
}

export default {
  load
};
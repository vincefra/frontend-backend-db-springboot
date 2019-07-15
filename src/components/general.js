import axios from 'axios';
import config from 'config.json';
import XLSX from 'xlsx';
axios.defaults.headers.common['Authorization'] = `Bearer ${config.accessToken}`;

export async function load() {
  const projects =  await getProjects();
  console.log('Klar med projektfunktionen');
  // const employees = getEmployees();
}

async function getProjects() {
  const requestURL = 'https://content.dropboxapi.com/2/files/download';
  const options = {
    url: requestURL,
    responseType: 'arraybuffer',
    method: 'POST',
    headers: {
      'Dropbox-API-Arg': JSON.stringify({'path':'id:tj_uftrYnS8AAAAAAABpHw'})
    }
  };
  
  try {
    const response = await axios(options);
    if (response.status === 200) {
      const uniCodedData = new Uint8Array(response.data);
      const workbook = XLSX.read(uniCodedData, {type:'array'});
      const firstSheet = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheet];
      const headers = ['ID', 'projectName', 'projectType', 'startDates', 'endDates', 'customer', 'employees'];
      let projects = XLSX.utils.sheet_to_json(worksheet, {header: headers});
      projects.shift();
      console.log('Hämtat');
      
      return projects;
    }
  } catch (error) {
    return [];
  }
  
  
  await axios(options, (error, response, body) => {
    
    
    
  });
}

// function getEmployees() {
//   const requestURL = 'https://content.dropboxapi.com/2/files/download';
//   const options = {
//     uri: requestURL,
//     method: 'POST',
//     auth: {
//       bearer: config.accessToken
//     },
//     headers: {
//       'Dropbox-API-Arg': JSON.stringify({'path':'id:tj_uftrYnS8AAAAAAABo_A'})
//     },
//     encoding: null
//   };

//   request(options, (error, response, body) => {
//     if (error)  return [];
//     else if (response.statusCode === 200) {
//       const uniCodedData = new Uint8Array(body);
//       const workbook = XLSX.read(uniCodedData, {type:'array'});
//       const employeeSheet = workbook.Sheets[workbook.SheetNames[0]];
//       const employeesProjectSheet = workbook.Sheets[workbook.SheetNames[1]];
      
//       let employees = XLSX.utils.sheet_to_json(employeeSheet);
//       let employeesProject = XLSX.utils.sheet_to_json(employeesProjectSheet);
//       return { employees, employeesProject };
//     }
//   });
  
// }

export default {
  load
};
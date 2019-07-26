import axios from 'axios';
import config from '../config.json';
import XLSX from 'xlsx';
import moment from 'moment';
import ColorThief from 'color-thief';
var colorThief = new ColorThief();
const dateFormat = 'YYYY-MM-DD';

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
      'Dropbox-API-Arg': JSON.stringify({ 'path': 'id:tj_uftrYnS8AAAAAAABpIw' }),
      'Authorization': `Bearer ${config.accessToken}`
    }
  };

  let response;
  try {
    response = await axios(options);
  } catch {
    return {};
  }

  let employeeList = [];
  let clientList = [];
  let technologyList = [];
  let clientIdCounter = 0;
  let technologyIdCounter = 0;

  function getTechList(technologies) {
    if (!technologies || typeof (technologies) != 'string') return [];
    let techList = technologies.split(',').map(technology => technology.trim());
    return techList = techList.map(technology => {
      let techObj = technologyList.find(t => t.name.toLowerCase() === technology.toLowerCase());
      if (!techObj) {
        techObj = {
          id: technologyIdCounter++,
          name: technology,
          highlight: true
        };
        technologyList.push(techObj);
      }
      return techObj.id;
    });
  }

  function getColor(src) {
    return new Promise((resolve, reject) => {
      let img = new Image();
      img.onload = () => {
        let dominantColor = colorThief.getColor(img);
        dominantColor = dominantColor.map(x => {
          x = parseInt(x).toString(16);
          return (x.length === 1) ? '0' + x : x;
        });
        resolve(`#${dominantColor.join('')}`);
      };
      img.onerror = () => reject('');
      img.src = `${process.env.PUBLIC_URL}${src}`;
    });
  }

  async function getClientId(client) {
    if (!client) client = '';
    let clientObj = clientList.find(c => c.name.toLowerCase() === client.toLowerCase());
    let src = `/img/logos/${client.trim().replace(/\s/g, '_')}.png`;
    let color = '';
    try {
      color = await getColor(src);
    } catch (error) {
      color = '';
      src = '/img/logos/company_placeholder.png';
    }

    if (!clientObj) {
      clientObj = {
        id: clientIdCounter++,
        name: client,
        hours: 0,
        color: color,
        logo: src,
        highlight: true,
        projects: [],
        type: '',
        description: '',
        location: ''
      };
      clientList.push(clientObj);
    }
    return clientObj.id;
  }

  function updateClient(clientId, projectId, duration) {
    if (!clientList[clientId].projects.includes(projectId)) clientList[clientId].projects.push(projectId);
    clientList[clientId].hours += duration;
  }

  function getEmployeeList(employees) {
    if (!employees || typeof (employees) != 'string') return;
    let empList = employees.split(',').map(employee => employee.trim());
    return empList.map(employee => employeeList.find(e => e.name.toLowerCase() === employee.toLowerCase()).id);
  }

  // TODO
  function getDates(startDates, endDates) {
    const startDateList = startDates.split(',').map(date => date.trim());
    const endDateList = endDates ? endDates.split(',').map(date => date.trim()) : [moment().format(dateFormat)];
    const startDate = startDateList[0];
    const endDateSplitted = endDateList[0].split('-');
    const endDate = moment(`${endDateSplitted[0]}-${endDateSplitted[1]}`).endOf('month').format(dateFormat);
    return { startDate, endDate };
  }

  if (response.status === 200) {
    const uniCodedData = new Uint8Array(response.data);
    const workbook = XLSX.read(uniCodedData, { type: 'array' });
    const projectSheet = workbook.Sheets[workbook.SheetNames[0]];
    const employeeSheet = workbook.Sheets[workbook.SheetNames[1]];
    const projectHeaders = ['id', 'name', 'type', 'startDates', 'endDates', 'client', 'employees', 'description', 'technologies'];
    const employeeHeaders = ['id', 'firstName', 'lastName', 'role', 'birthYear', 'startYear', 'endYear', 'location', 'technologies', 'languages'];
    let projects = XLSX.utils.sheet_to_json(projectSheet, { header: projectHeaders });
    let employees = XLSX.utils.sheet_to_json(employeeSheet, { header: employeeHeaders });
    projects.shift();
    employees.shift();

    employees.forEach(employee => {
      employeeList.push({
        id: employee.id,
        name: `${employee.firstName} ${employee.lastName}`,
        highlight: true,
        roll: `${employee.role ? employee.role : ''}`,
        img: `img/${[employee.firstName, employee.lastName].join('_').replace(/\s/g, '_')}.jpg`,
        initDate: moment(`${employee.startYear}-01-01`).format(dateFormat),
        endDate: `${employee.endYear ? moment(employee.endYear + '-01-01').format(dateFormat) : moment().format(dateFormat)}`,
        skills: getTechList(employee.technologies)
      });
    });

    let projectList = [];
    for (const project of projects) {
      const { startDate, endDate } = getDates(project.startDates, project.endDates);
      const duration = Math.floor(moment.duration(moment(endDate).diff(moment(startDate))).asHours());
      const clientId = await getClientId(project.client);
      updateClient(clientId, project.id, duration);
      projectList.push({
        id: project.id,
        name: project.name,
        highlight: true,
        type: project.type ? project.type : '',
        description: project.description,
        clientId: clientId,
        employeeId: getEmployeeList(project.employees),
        dateInit: new Date(startDate),
        dateEnd: new Date(endDate),
        skills: getTechList(project.technologies),
        color: '#e00026',
        hours: duration
      });
    }
    projects.forEach(async project => {

    });
    return { projectList, employeeList, technologyList, clientList };
  }
}

export default {
  load
};
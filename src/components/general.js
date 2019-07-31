import axios from 'axios';
import config from '../config.json';
import XLSX from 'xlsx';
import moment from 'moment';
import ColorThief from 'color-thief';

var colorThief = new ColorThief();
const dateFormat = 'YYYY-MM-DD';
const maxAnnularSectors = 7; // + 1 sector with the 'other' sector

export async function load() {
  const data = await getData();
  const categories = groupCategories(data.clientList);
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
  let projectList = [];
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
          highlight: false
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

  function getClientId(client) {
    if (!client) return -1;
    let clientObj = clientList.find(c => c.name.toLowerCase() === client.toLowerCase());
    return clientObj.id;
  }

  function getClientColor(client) {
    if (!client) return -1;
    const clientObj = clientList.find(c => c.name.toLowerCase() === client.toLowerCase());
    return clientObj.color;
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
    const clientSheet = workbook.Sheets[workbook.SheetNames[2]];
    const projectHeaders = ['id', 'name', 'type', 'startDates', 'endDates', 'client', 'employees', 'description', 'technologies'];
    const employeeHeaders = ['id', 'firstName', 'lastName', 'role', 'birthYear', 'startYear', 'endYear', 'location', 'technologies', 'languages'];
    const clientHeaders = ['id', 'name', 'category', 'location', 'description'];
    const projects = XLSX.utils.sheet_to_json(projectSheet, { header: projectHeaders });
    const employees = XLSX.utils.sheet_to_json(employeeSheet, { header: employeeHeaders });
    const clients = XLSX.utils.sheet_to_json(clientSheet, { header: clientHeaders });
    projects.shift();
    employees.shift();
    clients.shift();

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

    for (const client of clients) {
      let imageSrc = `/img/logos/${client.name.trim().replace(/\s/g, '_')}.png`;
      try {
        var color = await getColor(imageSrc);
      } catch (error) {
        color = '';
        imageSrc = '/img/logos/company_placeholder.png';
      }
      clientList.push({
        id: client.id,
        name: client.name,
        hours: 0,
        color: color,
        logo: imageSrc,
        highlight: true,
        projects: [],
        type: client.category,
        description: client.description,
        location: client.location
      });
    }

    clientList.push({
      id: -1,
      name: '',
      hours: 0,
      color: '#000000',
      logo: '/img/logos/company_placeholder.png',
      highlight: true,
      projects: [],
      type: 'Other',
      description: '',
      location: ''
    });


    for (const project of projects) {
      const { startDate, endDate } = getDates(project.startDates, project.endDates);
      const duration = Math.floor(moment.duration(moment(endDate).diff(moment(startDate))).asHours());
      const clientId = getClientId(project.client);
      const clientColor = getClientColor(project.client);
      updateClient(clientId === -1 ? clients.length : clientId, project.id, duration);
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
        color: clientColor,
        hours: duration
      });
    }
    projects.forEach(async project => {

    });

    clientList.sort((a, b) => b.hours - a.hours);
    projectList.sort((a, b) => b.hours - a.hours);
    return { projectList, employeeList, technologyList, clientList };
  }
}

function groupCategories(clients) {
  const grouped = {};
  for (let client of clients) {
    if (!(client.type in grouped)) grouped[client.type] = [client];
    else grouped[client.type].push(client);
  }

  const sorted = [];
  let counter = 0;
  for (let category in grouped)
    sorted.push({
      id: counter++,
      name: category,
      list: grouped[category],
      hours: grouped[category].length,
      color: '#000',
      highlight: true,
      projects: [],
    });
  sorted.sort((a, b) => b.list.length - a.list.length);
  const categories = sorted.slice(0, maxAnnularSectors);
  categories.push({
    id: counter++,
    name: 'Other',
    list: [],
    hours: 0,
    color: '#000',
    highlight: true,
    projects: []
  });

  for (let i = maxAnnularSectors; i < sorted.length; i++) categories[maxAnnularSectors].list = categories[maxAnnularSectors].list.concat(sorted[i].list);
  categories[maxAnnularSectors].hours = categories[maxAnnularSectors].list.length;
  categories.sort((a, b) => b.hours - a.hours);
  return categories;
}

function getLargestClients(clients) {
  const clientList = clients.slice(0, maxAnnularSectors);
  if (clients.length <= maxAnnularSectors) return clientList;
  clientList.push({
    id: -2,
    name: 'Other',
    highlight: true,
    color: '#000',
    hours: 0,
    clients: [],
    projects: []
  });
  for (let i = maxAnnularSectors; i < clients.length; i++) {
    clientList[maxAnnularSectors].hours += clients[i].hours;
    clientList[maxAnnularSectors].clients.push(clients[i]);
  }
  return clientList;
}

export default {
  load,
  getLargestClients
};

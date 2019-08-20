import axios from 'axios';
import config from '../config.json';
import XLSX from 'xlsx';
import moment from 'moment';
import ColorThief from 'color-thief';
import { union } from 'components/general';

var colorThief = new ColorThief();
const dateFormat = 'YYYY-MM-DD';
const maxAnnularSectors = 7; // total annular sectors = maxAnnular + 1 ('other')

export async function load() {
  const { projectList, employeeList, technologyList, clientList, unsortedClients } = await getData();
  const categories = await groupCategories(clientList);
  categories.clients = clientList.map((_, i) => i);
  categories.projects = projectList.map((_, i) => i); 
  categories.employees = employeeList.map((_, i) => i);
  categories.skills = technologyList.map((_, i) => i);
  return {
    categories,
    projectList,
    employeeList,
    technologyList,
    clientList,
    unsortedClients
  };
}

async function getData() {
  function getTechList(technologies, clientId, projectId, employeeId) {
    if (!technologies) return [];
    let techList = technologies.split(',').map(technology => technology.trim());
    return techList = techList.map(technology => {
      let techObj = technologyList.find(t => t.name.toLowerCase() === technology.toLowerCase());
      if (techObj) {
        if (clientId && !techObj.clients.includes(clientId)) 
          techObj.clients.push(clientId);
        if (projectId && !techObj.projects.includes(projectId)) 
          techObj.projects.push(projectId);
        if (employeeId && !techObj.employees.includes(employeeId)) 
          techObj.employees.push(employeeId);
      } else {
        techObj = {
          id: technologyIdCounter++,
          name: technology,
          highlight: false,
          clients: clientId ? [clientId] : [],
          projects: projectId ? [projectId] : [],
          employees: employeeId ? [employeeId] : []
        };
        technologyList.push(techObj);
      }
      return techObj.id;
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

  function updateClient(clientId, projectId, duration, employees, skills) {
    if (!clientList[clientId].projects.includes(projectId)) clientList[clientId].projects.push(projectId);
    clientList[clientId].hours += duration;
    union(clientList[clientId].employees, employees);
    union(clientList[clientId].skills, skills);
  }

  function updateEmployee(clientId, projectId, employees) {
    employees.forEach(employeeId => {
      employeeList[employeeId].projects.push(projectId);
      if (!employeeList[employeeId].clients.includes(clientId))
        employeeList[employeeId].clients.push(clientId);
    });
  }

  function getEmployeeList(employees) {
    let empList = employees.split(',').map(employee => employee.trim());
    return empList.map(employee => employeeList.find(e => e.name.toLowerCase() === employee.toLowerCase()).id);
  }

  function getDates(startDates, endDates) {
    const startDateList = startDates.split(',').map(date => date.trim());
    const endDateList = endDates ? endDates.split(',').map(date => date.trim()) : [];
    const startDate = startDateList[0];
    let endDate;
    if (startDateList.length === endDateList.length) {
      // Number of days doesn't always correspond to the month
      const endDateSplitted = endDateList[endDateList.length - 1].split('-');
      const year = endDateSplitted[0];
      const month = endDateSplitted[1];
      endDate = moment(`${year}-${month}`).endOf('month').format(dateFormat);
    } else  // Ongoing project
      endDate = moment().format(dateFormat);
    return { startDate, endDate };
  }

  async function fetchData() {
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
    } catch (error) {
      return {};
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
      return { clients, projects, employees};
    }
  }
  
  const { clients, projects, employees } = await fetchData();
  if (!clients || !projects || !employees) return Error;
  
  let clientList = [];
  let technologyList = [];
  let projectList = [];
  let employeeList = [];
  let technologyIdCounter = 0;
  for (let employee of employees) {
    let img;
    try {
      img = `img/employees/${[employee.firstName, employee.lastName].join('_').replace(/\s/g, '_')}.jpg`;
      await imageExists(img);
    } catch {
      img = null;
    }
    employeeList.push({
      id: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      highlight: true,
      roll: `${employee.role ? employee.role : ''}`,
      img,
      initDate: moment(`${employee.startYear}-01-01`).format(dateFormat),
      endDate: `${employee.endYear ? moment(employee.endYear + '-01-01').format(dateFormat) : moment().format(dateFormat)}`,
      skills: getTechList(employee.technologies, undefined, undefined, employee.id),
      projects: [],
      clients: []
    });
  }

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
      category: client.category,
      description: client.description ? client.description : '',
      location: client.location,
      type: 'client',
      employees: [],
      skills: [],
      list: []
    });
  }

  clientList.push({
    id: clientList.length,
    name: 'Other',
    hours: 0,
    color: '#3E5641',
    logo: '/img/logos/company_placeholder.png',
    highlight: true,
    projects: [],
    category: 'Other',
    description: 'Projects without client.',
    location: '',
    type: 'client',
    employees: [],
    skills: [],
    list: []
  });


  for (const project of projects) {
    const { startDate, endDate } = getDates(project.startDates, project.endDates);
    const duration = Math.floor(moment.duration(moment(endDate).diff(moment(startDate))).asHours());
    let clientId = getClientId(project.client);
    clientId = clientId === -1 ? clients.length : clientId;
    const color = getClientColor(project.client);
    const employees = getEmployeeList(project.employees);
    const skills = getTechList(project.technologies, clientId, project.id);
    updateClient(clientId, project.id, duration, employees, skills);
    updateEmployee(clientId, project.id, employees);
    projectList.push({
      id: project.id,
      name: project.name,
      highlight: true,
      brushedDisplay: false,
      type: project.type ? project.type : 'Normal',
      description: project.description,
      clientId,
      employees,
      dateInit: new Date(startDate),
      dateEnd: new Date(endDate),
      skills,
      color,
      hours: duration
    });
  }

  const unsortedClients = [...clientList];
  clientList.sort((a, b) => b.hours - a.hours);
  return { projectList, employeeList, technologyList, clientList, unsortedClients };
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

function imageExists(src) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject();
    img.src = `${process.env.PUBLIC_URL}${src}`;
  });
}

async function groupCategories(clients) {
  const grouped = {};
  for (let client of clients) {
    if (!(client.category in grouped)) grouped[client.category] = [client];
    else grouped[client.category].push(client);
  }

  const sorted = [];
  let counter = clients.length;
  for (let category in grouped) {
    let imageSrc = `/img/categories/${category.trim().replace(/\s/g, '_')}.png`;
    try {
      var color = await getColor(imageSrc);
    } catch (error) {
      color = '';
      imageSrc = '/img/logos/company_placeholder.png';
    }
  
    let employees = [];
    let projects = [];
    let skills = [];
    let clients = [];
    for (let client of grouped[category]) {
      union(employees, client.employees);
      union(projects, client.projects);
      union(skills, client.skills);
      clients.push(client.id);
    }

    sorted.push({
      id: counter++,
      name: category,
      category: '',
      type: 'category',
      list: grouped[category],
      hours: grouped[category].length,
      color,
      highlight: true,
      textHighlight: false,
      logo: imageSrc,
      projects,
      employees,
      skills,
      clients
    });
  }

  sorted.sort((a, b) => b.list.length - a.list.length);
  const categories = getLargestClients(sorted);

  categories[maxAnnularSectors].hours = categories[maxAnnularSectors].list.length;
  categories[maxAnnularSectors].list.sort((a, b) => b.hours - a.hours);

  return {
    id: counter++,
    name: 'Categories',
    category: '',
    type: 'root',
    list: categories,
    hours: 0,
    color: '#000',
    highlight: true,
    textHighlight: false,
    projects: [],
    employees: [],
    clients: [],
    skills: [],
    logo: ''
  };
}

export function getLargestClients(clients) {
  let imageSrc = '/img/categories/more.png';
  if (!clients) return clients;
  if (clients.length <= maxAnnularSectors + 1) return clients;
  const clientList = clients.slice(0, maxAnnularSectors);
  const other = {
    id: -1,
    name: 'More',
    category: '',
    type: 'more',
    highlight: true,
    color: '#2D2A32',
    hours: 0,
    list: [],
    projects: [],
    employees: [],
    clients: [],
    skills: [],
    logo: imageSrc
  };

  for (let i = maxAnnularSectors; i < clients.length; i++) {
    other.hours += clients[i].hours;
    other.list.push(clients[i]);
    union(other.employees, clients[i].employees);
    other.projects.push(...clients[i].projects);
    if (clients[i].type === 'category') 
      other.clients.push(...getClients(clients[i].list));
    else
      other.clients.push(clients[i].id);
    union(other.skills, clients[i].skills);
  }
  clientList.push(other);

  return clientList;
}

function getClients(clients) { 
  const list = [];
  for (let client of clients) {
    if (client.type === 'category') list.push(...getClients(clients));
    else list.push(client.id);
  }
  return list;
}

export default {
  load,
  getLargestClients
};
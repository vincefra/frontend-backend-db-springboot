export function getEmployeeObjs(employeeIds, employeeList) {
  return employeeIds.map(id => employeeList[id]);
}

export function getProjectObjs(projectIds, projectList) {
  const projects = projectIds.map(id => projectList[id]);
  return projects.sort((a, b) => b.hours - a.hours);
}

export function getObjects(ids, list) {
  return ids.map(id => list[id]);
}

export function getClients(clients) {
  let clientList = [];
  for (let client of clients) {
    if (client.type === 'more' || client.type === 'category') clientList.push(...getClients(client.list));
    else clientList.push(client);
  }
  return clientList;
}

export default {
  getClients,
  getEmployeeObjs,
  getProjectObjs,
  getObjects
};

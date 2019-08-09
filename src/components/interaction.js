import moment from 'moment';

/**
   * Set the Highlight state either to true or false
   * returns an array with the modified items
   *
   * @param highLight Boolean to set the state
   * @param modArray Array to modify
   */
export function setHighlight(highLight, modArray) {
  const nArray = modArray.map(d => {
    d.highlight = highLight;
    return d;
  });
  return nArray;
}

/**
   * Modify the hightlight atribute of an object if it
   * matches the id
   *
   * @param highLight Boolean to set the state
   * @param modArray Array to modify
   * @param idArray array with number IDs to modify
   * @pram ifIncludes Boolean check if it includes or it does not
   */
export function setHighlightElement(highlight, idArray, modArray, ifIncludes) {
  return modArray.map(d => {
    if (idArray.includes(d.id) === ifIncludes) {
      d.highlight = highlight;
    }
    return d;
  });
}

/**
   * Modify the hightlight atribute of an object if it
   * matches the id
   *
   * @param highhighlightElementLight Boolean to set the state
   * @param highlightText boolean for the text
   * @param modArray Array to modify
   * @param idArray array with number IDs to modify
   * @pram ifIncludes Boolean check if it includes or it does not
   */
export function setHighlightText(highlightText, idArray, modArray, ifIncludes) {
  return modArray.map(d => {
    if (idArray.includes(d.id) === ifIncludes) {
      d.textHighlight = highlightText;
    }
    return d;
  });
}

export function unHighlightText(modArray) {
  return modArray.map(d => {
    d.textHighlight = false;
    return d;
  });
}
/**
 * Checks if the element skills match the id and modifies the highlight state to true
 * checks if clients from the element do not match 
 * 
 * @param id Number of skill 
 * @param modArray array to modify
 */
export function highlightElementWithSkill(id, modArray) {
  let clients = [];
  const projectsHighLight = modArray.map(d => {
    if (d.skills.includes(id)) {
      d.highlight = true;
      if (!clients.includes(d.clientId)) clients.push(d.clientId);
    } else {
      d.highlight = false;
    }
    return d;
  });
  return [clients, projectsHighLight];
}

/**
 * searches for skills in element, if it has it turns it's highlight state to true
 * @param {number} id of skill to search in element
 * @param {array} mdArray array to modify
 */
export function elementWithSkill(id, mdArray) {
  return mdArray.map(d => {
    d.highLight = d.skills.includes(id);
    return d;
  });
}


/**
 * Returns a array of ids of list if employee id is included
 * @param {number} id of the employee to search in list
 * @param {array} list array of a list
 */
export function getIdsByEmployeeId(id, list) {
  return list.filter(o => o.employees.includes(id)).map(o => o.id);
}


/**
 * search for an element with the id and return it
 * @param {number} id of the element to find
 * @param {array} array array to search
 */
export function getElementById(id, array) {
  const element = array.find(d => d.id === id);
  return element;
}

export function getSkillsIDsFromProject(projectList, client) {
  let employeesId = [];
  let skillsId = [];
  const projects = projectList.filter(prj => {
    return ~client.projects.indexOf(prj.id);
  });
  //get the employeesId from the project and add it to the array of employeesId of the client
  for (let i in projects) {
    skillsId = skillsId.concat(projects[i].skills);
    employeesId = employeesId.concat(projects[i].employees);
  }
  skillsId = [...new Set(skillsId)];
  return skillsId;
}

export function getSkills(skillIds, skillList) {
  return skillIds.map(id =>skillList[id]);
}

/**
 * Filters all the projects within the brInitweek and the brEndWeek and returns an array with the filtered projects
 * @param {array} projects array with projects to be filtered 
 * @param {date} initDate inital date 
 * @param {date} brInitWeek current init brush week within initial and ending dates
 * @param {date} brEndWeek current end brush week within inital and ending dates
 */
export function brushProjects(projects, initDate, brInitWeek, brEndWeek) {
  const nowInit = moment(initDate).add(brInitWeek, 'M');
  const nowEnd = moment(initDate).add(brEndWeek, 'M');
  const brushedProjects = projects.filter(p => moment(p.dateInit).diff(nowInit, 'months') >= 0 && nowEnd.diff(moment(p.dateEnd), 'months') >= 0);
  return brushedProjects;
}

/**
 * checks all the projects and sets the inital and ending date
 * @param {array} projects array with all the projects
 */
export function getDateRange(projects) {
  const initDates = projects.map(p => moment(p.dateInit));
  const endDates = projects.map(p => moment(p.dateEnd));
  const min = moment.min(initDates).toDate();
  const max = moment.max(endDates).toDate();
  return [min, max];
}

export default {
  setHighlight,
  setHighlightElement,
  highlightElementWithSkill,
  getElementById,
  elementWithSkill,
  getSkillsIDsFromProject,
  getSkills,
  brushProjects,
  getDateRange,
  setHighlightText,
  unHighlightText,
  getIdsByEmployeeId
};


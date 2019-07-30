import * as d3 from 'd3';

const sliceHeight = 50;
const projectHeight = 10;
const projectRadius = sliceHeight / 2;
const imageSize = 50;
const imageDistance = 10;
const filterChildren = 40;
const projectPadding = (2 * Math.PI) / 180;
const clientArcPadding = (1.2 * Math.PI) / 180;

//Create a pie chart with the clients total time in a project
export function calculatePieClient(props, radius) {
  //arc generator for clients
  const arcGenerator = d3
    .arc()
    .padAngle(clientArcPadding) //pad angle defines the distance between each arc
    .cornerRadius(4); //cornerRadius

  //arc generator for the Text labels
  const LogoArcGenerator = d3
    .arc()
    .outerRadius(radius + imageDistance)
    .innerRadius(radius + imageDistance);

  //PIE object to calculate the arc distribution
  const pie = d3
    .pie()
    .sort(null)
    .value(function (d) {
      return d.hours;
    });

  //arc array with the position and information in the pie
  const arcs = pie(props.clients);
  
  //create an object SLICES in order to update the state
  //contains all the information one slice needs in order to be rendered
  let projectSlice = [];
  const clientSlice = arcs.map((d, i) => {
    const path = arcGenerator({
      startAngle: d.startAngle,
      endAngle: d.endAngle,
      innerRadius: radius - sliceHeight,
      outerRadius: radius
    });

    const centroid = LogoArcGenerator.centroid(d);
    //calculate the anchor point of the image depending on its position on the center
    let anchor = centroid;
    if (anchor[0] > 0 && anchor[1] < 0) {
      anchor = [centroid[0], centroid[1] - imageSize];
    } else if (anchor[0] < 0 && anchor[1] < 0) {
      anchor = [centroid[0] - imageSize, centroid[1] - imageSize];
    } else if (anchor[0] < 0 && anchor[1] > 0) {
      anchor = [centroid[0] - imageSize, centroid[1]];
    } else if (anchor[0] > 0 && anchor[1] > 0) {
      anchor = [centroid[0], centroid[1]];
    }

    const logo = {
      centroid: anchor
    };
    const projects = getClientProjects(d.data.projects, props.projects);
    const projectSlices = calculatePieProject(
      d.startAngle + projectPadding,
      d.endAngle - projectPadding,
      projects,
      radius
    );

    projectSlice = projectSlice.concat(projectSlices);
    return {
      path,
      fill: d.data.color,
      logo,
      img: d.data.logo,
      id: d.data.id,
      highlight: d.data.highlight,
      data: d.data
    };
  });

  return { clientSlice, projectSlice };
}

// recieves projects 
// projectsID : array of ID numbers of the projects 
// returns array with objects with the projects information
function getClientProjects(projectsId, proj) {
  const projects = proj.filter(function (el) {
    return ~projectsId.indexOf(el.id);
  });
  return projects;
}

//add to the state slices of clients to draw
function calculatePieProject(initAngle, endAngle, projects, radius) {
  const angleScale = d3
    .scaleLinear()
    .domain([0, 2 * Math.PI])
    .range([initAngle, endAngle]);
  //arc generator for clients
  const arcGenerator = d3
    .arc()
    .padAngle(0.013) //pad angle defines the distance between each arc
    .cornerRadius(50); //cornerRadius
  //PIE object to calculate the arc distribution
  const pie = d3
    .pie()
    .sort(null)
    .value(function (d) {
      return d.hours;
    });

  //arc array with the position and information in the pie
  const arcs = pie(projects);

  //create an object SLICES in order to update the state
  //contains all the information one slice needs in order to be rendered
  const slices = arcs.map((d) => {
    const path = arcGenerator({
      startAngle: angleScale(d.startAngle),
      endAngle: angleScale(d.endAngle),
      innerRadius: radius - projectRadius - projectHeight / 2,
      outerRadius: radius - projectRadius + projectHeight / 2,
    });
    d.path = path;
    return {
      d
    };
  });
  return slices;
}

export function createLinks(skills) {
  //Create a hierarchy and sort it alphabetically
  let children = skills.children !== undefined ? skills.children.length > filterChildren ? skills.children.slice(0, filterChildren) : skills.children : [];
  const remainder = skills.children !== undefined ? skills.children.length > filterChildren ? skills.children.length - filterChildren : skills.children : 0;
  if (remainder > 0) children.push(
    {
      id: -1,
      name: '+' + remainder + ' technologies',
      highlight: false
    }
  );
  const skillsData = {
    name: 'Front-End',
    children: children
  };

  const data = skillsData;
  // data.children = children;
  const root = d3
    .hierarchy(data)
    .sort((a, b) => a.data.name.localeCompare(b.data.name));
  //create a tree layout an process the
  const treeLayout = d3.tree();

  //angle scale to calculate the angle they should be based on their X distance
  const angleScale = d3
    .scaleLinear()
    .domain([0, 1])
    .range([0, 360]);

  const nodes = treeLayout(root);

  for (let i in nodes.children) {
    let node = nodes.children[i];
    node.angle = angleScale(node.x); //set angle in radians
    node.textRotation = -node.angle;
    node.anchorText = node.angle < 90 || node.angle > 270 ? 'start' : 'end';
  }

  return nodes;
}

export function calculateEmployee() {
  const circle = {
    radius: '28',
    fill: '#98abc5',
    x: '0',
    y: '0'
  };

  return { circle };
}

export default { calculatePieClient, createLinks, calculateEmployee };
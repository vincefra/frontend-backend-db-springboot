import * as d3 from 'd3';

const filterChildren = 40;

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

  const layOut = treeLayout(root);

  for (let i in layOut.children) {
    let node = layOut.children[i];
    node.angle = angleScale(node.x); //set angle in radians
    node.textRotation = -node.angle;
    node.anchorText = node.angle < 90 || node.angle > 270 ? 'start' : 'end';
  }

  return layOut;
}

export default {
  createLinks
};
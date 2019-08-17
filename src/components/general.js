export function getObjects(ids, list) {
  return ids.map(id => list[id]);
}

export default {
  getObjects
};

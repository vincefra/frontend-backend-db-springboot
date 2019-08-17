export function getObjects(ids, list) {
  return ids.map(id => list[id]);
}

/*
* Merge two primitive arrays.
* Resulting array consists of unique elements from input arrays. 
*/
export function union(a, b) { 
  const result = [...a];
  result.push(...b.filter(e => !a.includes(e)));
  return result;
}

export default {
  getObjects,
  union
};
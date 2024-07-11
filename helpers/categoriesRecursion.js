const createTree = (arr, parent_id = "") => {
  const tree = [];
  arr.forEach((item) => {
    if (item.parent_category_id === parent_id) {
      const children = createTree(arr, item.id);
      if (children.length > 0) {
        item.children = children;
      }
      tree.push(item);
    }
  });
  return tree;
};

module.exports.tree = (arr) => {
  const result = createTree(arr);
  return result;
};

/*
    1. base condition
    2. operations
    Lap trinh (parent_id = "")
    + Nen tang (parent_id)
        - Java (parent_id)
        - JavaScript
        - Python
        - C++
        - C
    + Chuyen nganh
        - Web
        - Mobile App
        - Game
    Kinh doanh
    Tin hoc co ban
    Ky nang mem
*/

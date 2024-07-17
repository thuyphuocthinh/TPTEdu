const CoursesCategories = require("../models/courses_categories.model");
const BlogsCategories = require("../models/blogs-categories.model");

module.exports.getSubCategory = async (parent_id) => {
  const getCategory = async (parent_id) => {
    const subs = await CoursesCategories.find({
      parent_category_id: parent_id,
      deleted: false,
      status: "active",
    });
    let allSubs = [...subs];
    if (subs.length > 0) {
      for (const sub of subs) {
        const childs = await getCategory(sub.id);
        if (childs.length > 0) {
          // concat return new array without modifying the original array
          allSubs = allSubs.concat(childs);
        }
      }
    }
    return allSubs;
  };
  const result = await getCategory(parent_id);
  return result;
};

module.exports.getSubBlogsCategory = async (parent_id) => {
  const getCategory = async (parent_id) => {
    const subs = await BlogsCategories.find({
      parent_category_id: parent_id,
      deleted: false,
      status: "active",
    });
    let allSubs = [...subs];
    if (subs.length > 0) {
      for (const sub of subs) {
        const childs = await getCategory(sub.id);
        if (childs.length > 0) {
          // concat return new array without modifying the original array
          allSubs = allSubs.concat(childs);
        }
      }
    }
    return allSubs;
  };
  const result = await getCategory(parent_id);
  return result;
};

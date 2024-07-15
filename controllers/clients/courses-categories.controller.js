const Courses = require("../../models/courses.model");
const CoursesCategories = require("../../models/courses_categories.model");
const Settings = require("../../models/general-settings.model");
const { pagination } = require("../../helpers/objectPagination");
const { newPrices } = require("../../helpers/price");
const { tree } = require("../../helpers/categoriesRecursion");
const { getSubCategory } = require("../../helpers/subCategories");

const index = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    let find = { deleted: false };
    const settings = await Settings.findOne({ deleted: false });

    // sort
    let sort = [
      {
        keyValue: "title-desc",
        title: "Sắp xếp tên khóa học giảm dần",
      },
      {
        keyValue: "title-asc",
        title: "Sắp xếp tên khóa học tăng dần",
      },
      {
        keyValue: "price-desc",
        sortValue: "desc",
        title: "Sắp xếp theo giá giảm dần",
      },
      {
        keyValue: "price-asc",
        title: "Sắp xếp theo giá tăng dần",
      },
      {
        keyValue: "position-desc",
        title: "Sắp xếp theo vị trí giảm dần",
      },
      {
        keyValue: "position-asc",
        title: "Sắp xếp theo vị trí tăng dần",
      },
      {
        keyValue: "discountPercentage-desc",
        title: "Sắp xếp theo discount giảm dần",
      },
      {
        keyValue: "discountPercentage-asc",
        title: "Sắp xếp theo discount tăng dần",
      },
    ];

    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    let sortObj, sortedBy;
    if (sortKey && sortValue) {
      sortObj = { [sortKey]: sortValue };
      sortedBy = sortKey + "-" + sortValue;
    }

    // pagination
    let objectPagination = {
      limitItem: 4,
      totalPages: 0,
      currentPage: page || 1,
      skip: 0,
    };

    const totalItems = await Courses.countDocuments(find);
    objectPagination = pagination(objectPagination, totalItems);

    let courses = await Courses.find(find)
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip)
      .sort(sortObj);

    courses.forEach((course, index) => {
      course.index = index + 1;
    });

    courses = newPrices(courses);

    // courses-categories
    let categories = await CoursesCategories.find({
      deleted: false,
    });

    categories = tree(categories);

    res.render("clients/pages/courses-categories/index", {
      pageTitle: "Tất cả khóa học",
      courses,
      pagination: objectPagination,
      sort,
      sortedBy,
      settings,
      categories,
    });
  } catch (error) {
    console.log(error);
  }
};

const getBySlug = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const settings = await Settings.findOne({ deleted: false });
    const slug = req.params.slug;
    
    const category = await CoursesCategories.findOne({
      slug: slug,
      deleted: false,
      status: "active",
    });

    // subCategories
    const subCategories = await getSubCategory(category.id);
    const subCategoriesIds = [];
    subCategories.forEach((item) => {
      subCategoriesIds.push(item.id);
    });
    subCategoriesIds.push(category.id);

    // sort
    let sort = [
      {
        keyValue: "title-desc",
        title: "Sắp xếp tên khóa học giảm dần",
      },
      {
        keyValue: "title-asc",
        title: "Sắp xếp tên khóa học tăng dần",
      },
      {
        keyValue: "price-desc",
        sortValue: "desc",
        title: "Sắp xếp theo giá giảm dần",
      },
      {
        keyValue: "price-asc",
        title: "Sắp xếp theo giá tăng dần",
      },
      {
        keyValue: "position-desc",
        title: "Sắp xếp theo vị trí giảm dần",
      },
      {
        keyValue: "position-asc",
        title: "Sắp xếp theo vị trí tăng dần",
      },
      {
        keyValue: "discountPercentage-desc",
        title: "Sắp xếp theo discount giảm dần",
      },
      {
        keyValue: "discountPercentage-asc",
        title: "Sắp xếp theo discount tăng dần",
      },
    ];

    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    let sortObj, sortedBy;
    if (sortKey && sortValue) {
      sortObj = { [sortKey]: sortValue };
      sortedBy = sortKey + "-" + sortValue;
    }

    // pagination
    let objectPagination = {
      limitItem: 4,
      totalPages: 0,
      currentPage: page || 1,
      skip: 0,
    };
    let courses = await Courses.find({
      course_category_id: { $in: subCategoriesIds },
      deleted: false,
    });
    const totalItems = courses.length;
    objectPagination = pagination(objectPagination, totalItems);

    courses = await Courses.find({
      course_category_id: { $in: subCategoriesIds },
      deleted: false,
    })
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip)
      .sort(sortObj);

    courses = newPrices(courses);

    // courses-categories
    let categories = await CoursesCategories.find({
      deleted: false,
    });

    categories = tree(categories);

    res.render("clients/pages/courses-categories/detail", {
      pageTitle: category.title,
      courses,
      pagination: objectPagination,
      sort,
      sortedBy,
      settings,
      categories,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  index,
  getBySlug,
};

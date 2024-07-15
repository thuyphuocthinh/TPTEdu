const Courses = require("../../models/courses.model");
const CoursesCategories = require("../../models/courses_categories.model");
const Settings = require("../../models/general-settings.model");
const { pagination } = require("../../helpers/objectPagination");
const { newPrices, newPrice } = require("../../helpers/price");
const searchHelper = require("../../helpers/search");

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

    res.render("clients/pages/courses/index", {
      pageTitle: "Tất cả khóa học",
      courses,
      pagination: objectPagination,
      sort,
      sortedBy,
      settings,
    });
  } catch (error) {
    console.log(error);
  }
};

const getDetailBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const settings = await Settings.findOne({ deleted: false });
    let course = await Courses.findOne({
      slug: slug,
      deleted: false,
    });

    const category = await CoursesCategories.findOne({
      _id: course.course_category_id,
      deleted: false,
    });
    course.categoryTitle = category.title;
    course = newPrice(course);

    const relatedCourses = await Courses.find({
      _id: { $ne: course.id },
      course_category_id: category.id,
      deleted: false,
    });

    res.render("clients/pages/courses/detail", {
      pageTitle: slug,
      course,
      settings,
      relatedCourses,
    });
  } catch (error) {
    console.log(error);
  }
};

const search = async (req, res) => {
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

    // search
    let objSearch;
    if (req.query.keyword) {
      objSearch = searchHelper.search(req);
      find = {
        ...find,
        title: objSearch.regex,
      };
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
      .sort({ position: "desc" });

    courses.forEach((course, index) => {
      course.index = index + 1;
    });

    courses = newPrices(courses);

    res.render("clients/pages/search/index", {
      pageTitle: "Kết quả tìm kiếm",
      courses,
      pagination: objectPagination,
      keyword: objSearch?.keyword || "",
      settings,
      sort,
      sortedBy,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  index,
  getDetailBySlug,
  search,
};

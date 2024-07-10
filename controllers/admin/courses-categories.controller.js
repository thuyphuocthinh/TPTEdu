const { prefixAdmin } = require("../../config/system.config");
const CoursesCategories = require("../../models/courses_categories.model");
const { pagination } = require("../../helpers/objectPagination");
const searchHelper = require("../../helpers/search");

const index = async (req, res) => {
  try {
    let find = { deleted: false };

    const page = parseInt(req.query.page);
    // sort
    let sort = [
      {
        keyValue: "title-desc",
        title: "Sắp xếp tên danh mục khóa học giảm dần",
      },
      {
        keyValue: "title-asc",
        title: "Sắp xếp tên danh mục khóa học tăng dần",
      },
      {
        keyValue: "position-desc",
        title: "Sắp xếp theo vị trí giảm dần",
      },
      {
        keyValue: "position-asc",
        title: "Sắp xếp theo vị trí tăng dần",
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

    // filterByStatus
    const filterOptions = [
      {
        name: "all",
        value: "all",
        title: "Tất cả",
      },
      {
        name: "active",
        value: "active",
        title: "Hoạt động",
      },
      {
        name: "inactive",
        value: "inactive",
        title: "Ngừng hoạt động",
      },
    ];
    let filterByStatus = "all";
    if (req.query.filterByStatus) {
      find = {
        ...find,
        status: req.query.filterByStatus,
      };
      filterByStatus = req.query.filterByStatus;
      console.log(find);
    }

    // pagination
    let objectPagination = {
      limitItem: 4,
      totalPages: 0,
      currentPage: page || 1,
      skip: 0,
    };
    const totalItems = await CoursesCategories.countDocuments({
      deleted: false,
    });
    objectPagination = pagination(objectPagination, totalItems);

    const categories = await CoursesCategories.find(find);

    res.render("admin/pages/courses-categories/index", {
      pageTitle: "Danh mục khóa học",
      categories,
      pagination: objectPagination,
      keyword: objSearch?.keyword || "",
      sort,
      sortedBy,
      filterOptions,
      filterByStatus,
    });
  } catch (error) {
    console.log(error);
  }
};

const getCreate = async (req, res) => {
  try {
    res.render("admin/pages/courses-categories/create", {
      pageTitle: "Tạo danh mục khóa học mới",
    });
  } catch (error) {
    console.log(error);
  }
};

const postCreate = async (req, res) => {};

const getDetail = async (req, res) => {};

const getEdit = async (req, res) => {};

const patchEdit = async (req, res) => {};

const updateStatus = async (req, res) => {};

const changeMulti = async (req, res) => {};

module.exports = {
  index,
  getCreate,
  postCreate,
  getDetail,
  getEdit,
  patchEdit,
  updateStatus,
  changeMulti,
};

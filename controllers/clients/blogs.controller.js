const Blogs = require("../../models/blogs.model");
const Settings = require("../../models/general-settings.model");
const searchHelper = require("../../helpers/search");
const { pagination } = require("../../helpers/objectPagination");

const index = async (req, res) => {
  try {
    const settings = await Settings.findOne({ deleted: false });
    const page = parseInt(req.query.page);
    let find = { deleted: false };
    // sort
    let sort = [
      {
        keyValue: "title-desc",
        title: "Sắp xếp tên bài viết giảm dần",
      },
      {
        keyValue: "title-asc",
        title: "Sắp xếp tên bài viết tăng dần",
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
    }

    // pagination
    let objectPagination = {
      limitItem: 4,
      totalPages: 0,
      currentPage: page || 1,
      skip: 0,
    };
    const totalItems = await Blogs.countDocuments(find);
    objectPagination = pagination(objectPagination, totalItems);

    const blogs = await Blogs.find(find)
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip)
      .sort(sortObj);

    blogs.forEach((course, index) => {
      course.index = index + 1;
    });

    res.render("clients/pages/blogs/index", {
      pageTitle: "Bài viết",
      blogs,
      pagination: objectPagination,
      keyword: objSearch?.keyword || "",
      sort,
      sortedBy,
      filterOptions,
      filterByStatus,
      settings,
    });
  } catch (error) {
    console.log(error);
  }
};

const getDetailBySlug = async (req, res) => {
  try {
    const settings = await Settings.findOne({ deleted: false });
    const slug = req.params.slug;
    const blog = await Blogs.findOne({
      slug: slug,
      deleted: false,
    });
    const relatedBlogs = await Blogs.find({
      _id: { $ne: blog.id },
      blog_category_id: blog.blog_category_id,
      deleted: false,
    });
    res.render("clients/pages/blogs/detail", {
      pageTitle: blog.title,
      blog,
      relatedBlogs,
      settings,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  index,
  getDetailBySlug,
};

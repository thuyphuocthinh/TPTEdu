const { prefixAdmin } = require("../../config/system.config");
const { pagination } = require("../../helpers/objectPagination");
const Courses = require("../../models/courses.model");
const CoursesCategories = require("../../models/courses_categories.model");
const searchHelper = require("../../helpers/search");
const { tree } = require("../../helpers/categoriesRecursion");

const index = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    let find = { deleted: false };
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
    const totalItems = await Courses.countDocuments(find);
    objectPagination = pagination(objectPagination, totalItems);

    const courses = await Courses.find(find)
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip)
      .sort(sortObj);

    courses.forEach((course, index) => {
      course.index = index + 1;
    });

    for (let i = 0; i < courses.length; i++) {
      const course = courses[i];
      let categoryTitle = "";
      if (course.course_category_id) {
        const category = await CoursesCategories.findOne({
          _id: course.course_category_id,
          deleted: false,
        });
        categoryTitle = category.title;
      }
      course.index = i + 1;
      course.category = categoryTitle;
    }

    // get categories
    const categories = await CoursesCategories.find({ deleted: false });
    // categories recursion
    const treeCategories = tree(categories);

    res.render("admin/pages/courses/index", {
      pageTitle: "Khóa học",
      courses,
      pagination: objectPagination,
      keyword: objSearch?.keyword || "",
      sort,
      sortedBy,
      filterOptions,
      filterByStatus,
      categories: treeCategories,
    });
  } catch (error) {
    console.log(error);
  }
};

const getCreate = async (req, res) => {
  try {
    const courses = await Courses.find({
      deleted: false,
    });
    const position = courses.length + 1;
    // get categories
    const categories = await CoursesCategories.find({ deleted: false });
    // categories recursion
    const treeCategories = tree(categories);

    res.render("admin/pages/courses/create", {
      pageTitle: "Thêm khóa học mới",
      position,
      categories: treeCategories,
    });
  } catch (error) {
    console.log(error);
  }
};

const postCreate = async (req, res) => {
  try {
    req.body.position = parseInt(req.body.position);
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    const course = new Courses(req.body);
    await course.save();
    req.flash("success", "Tạo khóa học mới thành công!");
    res.redirect("/admin/courses");
  } catch (error) {
    console.log(error);
  }
};

const getDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const course = await Courses.findOne({
      _id: id,
      deleted: false,
    });
    res.render("admin/pages/courses/detail", {
      pageTitle: "Chi tiết khóa học",
      course,
    });
  } catch (error) {
    console.log(error);
    res.redirect("back");
  }
};

const deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await Courses.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
      }
    );
    req.flash("success", "Xóa thành công!");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

const getEdit = async (req, res) => {
  try {
    const id = req.params.id;
    const course = await Courses.findOne({
      _id: id,
    });
    // get categories
    const categories = await CoursesCategories.find({ deleted: false });
    // categories recursion
    const treeCategories = tree(categories);
    res.render("admin/pages/courses/edit", {
      pageTitle: "Chỉnh sửa khóa học",
      course,
      categories: treeCategories,
    });
  } catch (error) {}
};

const patchEdit = async (req, res) => {
  try {
    if (req.body.position) {
      req.body.position = parseInt(req.body.position);
    }

    if (!req.body.thumnail) {
      delete req.body.thumnail;
    }

    const id = req.params.id;

    await Courses.updateOne(
      {
        _id: id,
      },
      req.body
    );
    req.flash("success", "Cập nhật thành công!");
    res.redirect(`${prefixAdmin}/courses`);
  } catch (error) {
    console.log(error);
  }
};

const updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;

    if (id && status) {
      await Courses.updateOne(
        {
          _id: id,
        },
        {
          status: status,
        }
      );
    }
    req.flash("success", "Cập nhật trạng thái thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

const changeMulti = async (req, res) => {
  try {
    const changeType = req.body.changeMulti;
    const ids = req.body.ids.split(",");

    switch (changeType) {
      case "deleteAll": {
        ids.forEach(async (id) => {
          await Courses.updateOne(
            {
              _id: id,
            },
            {
              deleted: true,
            }
          );
        });
        break;
      }
      case "changeStatus": {
        ids.forEach(async (id) => {
          const item = await Courses.findOne({ _id: id, deleted: false });
          const statusChange = item.status === "active" ? "inactive" : "active";
          await Courses.updateOne(
            {
              _id: id,
            },
            {
              status: statusChange,
            }
          );
        });
        break;
      }
      default:
        break;
    }
    req.flash("success", "Cập nhật thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  index,
  getCreate,
  postCreate,
  getDetail,
  deleteItem,
  getEdit,
  patchEdit,
  updateStatus,
  changeMulti,
};

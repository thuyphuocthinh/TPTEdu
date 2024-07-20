const { prefixAdmin } = require("../../config/system.config");
const CoursesCategories = require("../../models/courses_categories.model");
const Accounts = require("../../models/accounts.model");
const { pagination } = require("../../helpers/objectPagination");
const searchHelper = require("../../helpers/search");
const { tree } = require("../../helpers/categoriesRecursion");

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

    const categories = await CoursesCategories.find(find)
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip)
      .sort(sortObj);

    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      let parentCategoryTitle = "";
      if (category.parent_category_id) {
        const parentCategory = await CoursesCategories.findOne({
          _id: category.parent_category_id,
          deleted: false,
        }).select("title");
        parentCategoryTitle = parentCategory.title;
      }
      category.index = i + 1;
      category.parentCategoryTitle = parentCategoryTitle;
    }

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
    const position =
      (await CoursesCategories.countDocuments({ deleted: false })) + 1;
    // get categories
    const categories = await CoursesCategories.find({ deleted: false });
    // categories recursion
    const treeCategories = tree(categories);
    res.render("admin/pages/courses-categories/create", {
      pageTitle: "Tạo danh mục khóa học mới",
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
    const account = await Accounts.findOne({
      token: req.cookies.token,
      deleted: false,
      status: "active",
    });
    req.body.createdBy = {
      user_id: account.id,
      created_at: new Date(),
    };
    const category = new CoursesCategories(req.body);
    await category.save();
    req.flash("success", "Thêm danh mục khóa học mới thành công");
    res.redirect(`${prefixAdmin}/courses-categories`);
  } catch (error) {
    console.log(error);
  }
};

const getEdit = async (req, res) => {
  try {
    const id = req.params.id;
    const category = await CoursesCategories.findOne({
      _id: id,
      deleted: false,
    });
    // get categories
    const categories = await CoursesCategories.find({ deleted: false });
    // categories recursion
    const treeCategories = tree(categories);
    res.render("admin/pages/courses-categories/edit", {
      pageTitle: "Chỉnh sửa danh mục khóa học",
      category,
      categories: treeCategories,
    });
  } catch (error) {
    console.log(error);
  }
};

const patchEdit = async (req, res) => {
  try {
    const id = req.params.id;
    req.body.position = parseInt(req.body.position);
    const account = await Accounts.findOne({
      token: req.cookies.token,
      deleted: false,
      status: "active",
    });
    const updatedBy = {
      user_id: account.id,
      updated_at: new Date(),
    };
    await CoursesCategories.updateOne(
      {
        _id: id,
      },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );
    req.flash("success", "Cập nhật thành công");
    res.redirect(`${prefixAdmin}/courses-categories`);
  } catch (error) {
    console.log(error);
  }
};

const updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;
    const account = await Accounts.findOne({
      token: req.cookies.token,
      deleted: false,
      status: "active",
    });
    const updatedBy = {
      user_id: account.id,
      updated_at: new Date(),
    };
    await CoursesCategories.updateOne(
      {
        _id: id,
      },
      {
        status: status,
        $push: { updatedBy: updatedBy },
      }
    );
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
    const account = await Accounts.findOne({
      token: req.cookies.token,
      deleted: false,
      status: "active",
    });
    const updatedBy = {
      user_id: account.id,
      updated_at: new Date(),
    };
    switch (changeType) {
      case "deleteAll": {
        ids.forEach(async (id) => {
          await CoursesCategories.updateOne(
            {
              _id: id,
            },
            {
              deleted: true,
              $push: { updatedBy: updatedBy },
            }
          );
        });
        break;
      }
      case "changeStatus": {
        ids.forEach(async (id) => {
          const item = await CoursesCategories.findOne({
            _id: id,
            deleted: false,
          });
          const statusChange = item.status === "active" ? "inactive" : "active";
          await CoursesCategories.updateOne(
            {
              _id: id,
            },
            {
              status: statusChange,
              $push: { updatedBy: updatedBy },
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
    req.flash("success", "Cập nhật thất bại");
  }
};

const deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    const account = await Accounts.findOne({
      token: req.cookies.token,
      deleted: false,
      status: "active",
    });
    const deletedBy = {
      user_id: account.id,
      deleted_at: new Date(),
    };
    await CoursesCategories.updateOne(
      {
        _id: id,
      },
      {
        deleted: true,
        $push: { deletedBy: deletedBy },
      }
    );
    req.flash("success", "Xóa danh mục khóa học thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Xóa danh mục khóa học thất bại");
  }
};

module.exports = {
  index,
  getCreate,
  postCreate,
  getEdit,
  patchEdit,
  updateStatus,
  changeMulti,
  deleteItem,
};

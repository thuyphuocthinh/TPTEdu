const { prefixAdmin } = require("../../config/system.config");
const { pagination } = require("../../helpers/objectPagination");
const searchHelper = require("../../helpers/search");
const Roles = require("../../models/roles.model");

const index = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    let find = { deleted: false };
    // sort
    let sort = [
      {
        keyValue: "title-desc",
        title: "Sắp xếp tên vai trò giảm dần",
      },
      {
        keyValue: "title-asc",
        title: "Sắp xếp tên vai trò tăng dần",
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
    const totalItems = await Roles.countDocuments(find);
    objectPagination = pagination(objectPagination, totalItems);

    const roles = await Roles.find(find)
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip)
      .sort(sortObj);

    roles.forEach((role, index) => {
      role.index = index + 1;
    });

    for (let i = 0; i < roles.length; i++) {
      const role = roles[i];
      role.index = i + 1;
    }

    res.render("admin/pages/roles/index", {
      pageTitle: "Khóa học",
      roles,
      pagination: objectPagination,
      keyword: objSearch?.keyword || "",
      sort,
      sortedBy,
    });
  } catch (error) {
    console.log(error);
  }
};

const getCreate = async (req, res) => {
  try {
    res.render("admin/pages/roles/create", {
      pageTitle: "Tạo vai trò mới",
    });
  } catch (error) {
    console.log(error);
  }
};

const postCreate = async (req, res) => {
  try {
    const role = new Roles(req.body);
    await role.save();
    req.flash("success", "Thêm quyền mới thành công");
    res.redirect(`${prefixAdmin}/roles`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Thêm quyền mới thất bại");
  }
};

const getEdit = async (req, res) => {
  try {
    const id = req.params.id;
    const role = await Roles.findOne({ _id: id, deleted: false });
    res.render("admin/pages/roles/edit", {
      pageTitle: "Tạo vai trò mới",
      role,
    });
  } catch (error) {
    console.log(error);
  }
};

const patchEdit = async (req, res) => {
  try {
    const id = req.params.id;
    await Roles.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật thành công");
    res.redirect(`${prefixAdmin}/roles`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật thất bại");
  }
};

const deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await Roles.updateOne(
      { _id: id },
      {
        deleted: true,
      }
    );
    req.flash("success", "Xóa thành công");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Xóa thất bại");
  }
};

module.exports = {
  index,
  getCreate,
  postCreate,
  getEdit,
  patchEdit,
  deleteItem,
};

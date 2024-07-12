const { pagination } = require("../../helpers/objectPagination");
const searchHelper = require("../../helpers/search");
const { prefixAdmin } = require("../../config/system.config");
const Accounts = require("../../models/accounts.model");
const Roles = require("../../models/roles.model");
const md5 = require("md5");

const index = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    let find = { deleted: false };
    // sort
    let sort = [
      {
        keyValue: "email-desc",
        title: "Sắp xếp email giảm dần",
      },
      {
        keyValue: "email-asc",
        title: "Sắp xếp email tăng dần",
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
    const totalItems = await Accounts.countDocuments(find);
    objectPagination = pagination(objectPagination, totalItems);

    const accounts = await Accounts.find(find)
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip)
      .sort(sortObj);

    accounts.forEach((course, index) => {
      course.index = index + 1;
    });

    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      const role = await Roles.findOne({
        _id: account.role_id,
        deleted: false,
      });
      account.role = role;
      account.index = i + 1;
    }

    res.render("admin/pages/accounts/index", {
      pageTitle: "Tài khoản quản trị",
      accounts,
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
    const roles = await Roles.find({ deleted: false });
    res.render("admin/pages/accounts/create", {
      pageTitle: "Tạo tài khoản quản trị",
      roles,
    });
  } catch (error) {
    console.log(error);
  }
};

const postCreate = async (req, res) => {
  try {
    const emailExist = await Accounts.findOne({
      email: req.body.email,
      deleted: false,
    });

    if (!emailExist) {
      req.body.password = md5(req.body.password);
      const account = new Accounts(req.body);
      await account.save();
      req.flash("success", "Tạo tài khoản thành công");
      res.redirect(`${prefixAdmin}/accounts`);
    } else {
      req.flash("error", "Email đã tồn tại");
      res.redirect("back");
    }
  } catch (error) {
    req.flash("error", "Tạo tài khoản không thành công");
    console.log(error);
  }
};

const getEdit = async (req, res) => {
  try {
    const id = req.params.id;
    const account = await Accounts.findOne({ _id: id, deleted: false });
    const roles = await Roles.find({ deleted: false });
    res.render("admin/pages/accounts/edit", {
      pageTitle: "Chỉnh sửa tài khoản quản trị",
      roles,
      account,
    });
  } catch (error) {
    console.log(error);
  }
};

const patchEdit = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.body.password) {
      delete req.body.password;
    }
    await Accounts.updateOne(
      {
        _id: id,
      },
      req.body
    );
    req.flash("success", "Cập nhật thành công");
    res.redirect(`${prefixAdmin}/accounts`);
  } catch (error) {
    req.flash("error", "Cập nhật thất bại");
    console.log(error);
  }
};

const updateStatus = async (req, res) => {
  const id = req.params.id;
  const status = req.params.status;
  await Accounts.updateOne(
    {
      _id: id,
    },
    {
      status: status,
    }
  );
  req.flash("success", "Cập nhật trạng thái tài khoản thành công");
  res.redirect(`${prefixAdmin}/accounts`);
  try {
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật trạng thái tài khoản thất bại");
  }
};

const changeMulti = async (req, res) => {
  try {
    const changeType = req.body.changeMulti;
    const ids = req.body.ids.split(",");

    switch (changeType) {
      case "deleteAll": {
        ids.forEach(async (id) => {
          await Accounts.updateOne(
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
          const item = await Accounts.findOne({ _id: id, deleted: false });
          const statusChange = item.status === "active" ? "inactive" : "active";
          await Accounts.updateOne(
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
    req.flash("error", "Cập nhật thất bại");
  }
};

const deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await Accounts.updateOne({ _id: id }, { deleted: true });
    req.flash("success", "Xóa tài khoản thành công");
    res.redirect(`${prefixAdmin}/accounts`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Xóa tài khoản thất bại");
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

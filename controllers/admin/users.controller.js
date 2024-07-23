const Users = require("../../models/users.model");
const { pagination } = require("../../helpers/objectPagination");
const searchHelper = require("../../helpers/search");
const { prefixAdmin } = require("../../config/system.config");

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
        fullName: objSearch.regex,
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
    const totalItems = await Users.countDocuments(find);
    objectPagination = pagination(objectPagination, totalItems);

    const users = await Users.find(find)
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip)
      .sort(sortObj);

    users.forEach((course, index) => {
      course.index = index + 1;
    });

    res.render("admin/pages/users/index", {
      pageTitle: "Quản lí users",
      users,
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

const updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.params.status;
    await Users.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      }
    );
    req.flash("success", "Cập nhật trạng thái tài khoản thành công");
    res.redirect(`${prefixAdmin}/users`);
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
      case "changeStatus": {
        ids.forEach(async (id) => {
          const item = await Users.findOne({ _id: id, deleted: false });
          const statusChange = item.status === "active" ? "inactive" : "active";
          await Users.updateOne(
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

module.exports = {
  index,
  updateStatus,
  changeMulti,
};

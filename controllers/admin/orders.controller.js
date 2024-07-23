const { pagination } = require("../../helpers/objectPagination");
const { prefixAdmin } = require("../../config/system.config");
const Orders = require("../../models/orders.model");
const Courses = require("../../models/courses.model");
const { newPrice } = require("../../helpers/price");

const index = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    let find = {};
    // sort
    let sort = [
      {
        keyValue: "email-desc",
        title: "Sắp xếp giá giảm dần",
      },
      {
        keyValue: "email-asc",
        title: "Sắp xếp giá tăng dần",
      },
    ];

    const sortKey = req.query.sortKey;
    const sortValue = req.query.sortValue;
    let sortObj, sortedBy;
    if (sortKey && sortValue) {
      sortObj = { [sortKey]: sortValue };
      sortedBy = sortKey + "-" + sortValue;
    }

    // filterByStatus
    const filterOptions = [
      {
        name: "all",
        value: "all",
        title: "Tất cả",
      },
      {
        name: "Pending",
        value: "Pending",
        title: "Chờ duyệt",
      },
      {
        name: "Approved",
        value: "Approved",
        title: "Đã duyệt",
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
    const totalItems = await Orders.countDocuments(find);
    objectPagination = pagination(objectPagination, totalItems);

    const orders = await Orders.find(find)
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip)
      .sort(sortObj);

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      let totalCost = 0;
      for (const item of order.courses) {
        totalCost +=
          item.quantity *
          (item.price - (item.discountPercentage * item.price) / 100);
      }
      order.totalCost = totalCost;
      order.index = i + 1;
    }

    res.render("admin/pages/orders/index", {
      pageTitle: "Quản lí orders",
      orders,
      pagination: objectPagination,
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
    await Orders.updateOne(
      {
        _id: id,
      },
      {
        status: status,
      }
    );
    req.flash("success", "Cập nhật trạng thái đơn hàng thành công");
    res.redirect(`${prefixAdmin}/orders`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật trạng thái đơn hàng  thất bại");
  }
};

const getDetail = async (req, res) => {
  try {
    const id = req.params.orderId;
    const order = await Orders.findOne({ _id: id });
    let totalCost = 0;
    for (let i = 0; i < order.courses.length; i++) {
      const item = order.courses[i];
      item.index = i + 1;
      let course = await Courses.findOne({ _id: item.course_id });
      course = newPrice(course);
      item.newPrice = course.newPrice;
      item.cost = item.quantity * course.newPrice;
      item.title = course.title;
      totalCost += item.cost;
    }
    order.totalCost = totalCost;
    res.render("admin/pages/orders/detail", {
      pageTitle: "Chi tiết đơn hàng",
      order,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  index,
  updateStatus,
  getDetail,
};

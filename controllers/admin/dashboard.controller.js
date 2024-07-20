const Courses = require("../../models/courses.model");
const CoursesCategories = require("../../models/courses_categories.model");
const Blogs = require("../../models/blogs.model");
const BlogsCategories = require("../../models/blogs-categories.model");
const Accounts = require("../../models/accounts.model");
const Users = require("../../models/users.model");
const Orders = require("../../models/orders.model");

const index = async (req, res) => {
  try {
    const statistic = {
      coursesCategories: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      courses: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      blogsCategories: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      blogs: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      accounts: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      users: {
        total: 0,
        active: 0,
        inactive: 0,
      },
      orders: {
        total: 0,
        pending: 0,
        approved: 0,
        totalCost: 0,
      },
    };

    statistic.courses.total = await Courses.countDocuments({ deleted: false });
    statistic.courses.active = await Courses.countDocuments({
      deleted: false,
      status: "active",
    });
    statistic.courses.inactive = await Courses.countDocuments({
      deleted: false,
      status: "inactive",
    });

    statistic.coursesCategories.total = await CoursesCategories.countDocuments({
      deleted: false,
    });
    statistic.coursesCategories.active = await CoursesCategories.countDocuments(
      {
        deleted: false,
        status: "active",
      }
    );
    statistic.coursesCategories.inactive =
      await CoursesCategories.countDocuments({
        deleted: false,
        status: "inactive",
      });

    statistic.blogs.total = await Blogs.countDocuments({ deleted: false });
    statistic.blogs.active = await Blogs.countDocuments({
      deleted: false,
      status: "active",
    });
    statistic.blogs.inactive = await Blogs.countDocuments({
      deleted: false,
      status: "inactive",
    });

    statistic.blogsCategories.total = await BlogsCategories.countDocuments({
      deleted: false,
    });
    statistic.blogsCategories.active = await BlogsCategories.countDocuments({
      deleted: false,
      status: "active",
    });
    statistic.blogsCategories.inactive = await BlogsCategories.countDocuments({
      deleted: false,
      status: "inactive",
    });

    statistic.accounts.total = await Accounts.countDocuments({
      deleted: false,
    });
    statistic.accounts.active = await Accounts.countDocuments({
      deleted: false,
      status: "active",
    });
    statistic.accounts.inactive = await Accounts.countDocuments({
      deleted: false,
      status: "inactive",
    });

    statistic.users.total = await Users.countDocuments({ deleted: false });
    statistic.users.active = await Users.countDocuments({
      deleted: false,
      status: "active",
    });
    statistic.users.inactive = await Users.countDocuments({
      deleted: false,
      status: "inactive",
    });

    statistic.orders.total = await Orders.countDocuments();
    statistic.orders.pending = await Orders.countDocuments({
      status: "Pending",
    });
    statistic.orders.approved = await Orders.countDocuments({
      deleted: false,
      status: "Approved",
    });

    const orders = await Orders.find({ status: "Approved" });
    let totalCost = 0;
    for (const order of orders) {
      for (const course of order.courses) {
        totalCost +=
          course.quantity *
          (course.price - (course.price * course.discountPercentage) / 100);
      }
    }
    statistic.orders.totalCost = totalCost.toLocaleString();

    res.render("admin/pages/dashboard/index", {
      pageTitle: "Dashboard",
      statistic,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  index,
};

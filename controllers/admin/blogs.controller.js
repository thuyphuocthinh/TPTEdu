const { pagination } = require("../../helpers/objectPagination");
const searchHelper = require("../../helpers/search");
const { tree } = require("../../helpers/categoriesRecursion");
const Blogs = require("../../models/blogs.model");
const BlogsCategories = require("../../models/blogs-categories.model");
const { prefixAdmin } = require("../../config/system.config");

const index = async (req, res) => {
  try {
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

    for (let i = 0; i < blogs.length; i++) {
      const blog = blogs[i];
      let categoryTitle = "";
      if (blog.blog_category_id) {
        const category = await BlogsCategories.findOne({
          _id: blog.blog_category_id,
          deleted: false,
        });
        categoryTitle = category.title;
      }
      console.log(categoryTitle);
      blog.category = categoryTitle;
      blog.index = i + 1;
    }

    res.render("admin/pages/blogs/index", {
      pageTitle: "Bài viết",
      blogs,
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
    const position = (await Blogs.countDocuments({ deleted: false })) + 1;
    // get categories
    const categories = await BlogsCategories.find({ deleted: false });
    // categories recursion
    const treeCategories = tree(categories);
    res.render("admin/pages/blogs/create", {
      pageTitle: "Thêm mới bài viết",
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
    const blog = new Blogs(req.body);
    await blog.save();
    req.flash("success", "Thêm bài viết mới thành công");
    res.redirect(`${prefixAdmin}/blogs`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Thêm bài viết mới thất bại");
  }
};

const getDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blogs.findOne({
      _id: id,
      deleted: false,
    });
    res.render("admin/pages/blogs/detail", {
      pageTitle: "Chi tiết bài viết",
      blog,
    });
  } catch (error) {
    console.log(error);
  }
};

const getEdit = async (req, res) => {
  try {
    const id = req.params.id;
    const blog = await Blogs.findOne({ _id: id, deleted: false });
    // get categories
    const categories = await BlogsCategories.find({ deleted: false });
    // categories recursion
    const treeCategories = tree(categories);
    res.render("admin/pages/blogs/edit", {
      pageTitle: "Chỉnh sửa bài viết",
      blog,
      categories: treeCategories,
    });
  } catch (error) {
    console.log(error);
  }
};

const patchEdit = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.body.thumbnail) {
      delete req.body.thumbnail;
    }
    req.body.position = parseInt(req.body.position);

    await Blogs.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật bài viết thành công");
    res.redirect(`${prefixAdmin}/blogs`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật bài viết thất bại");
  }
};

const deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    await Blogs.updateOne({ _id: id }, { deleted: true });
    req.flash("success", "Xóa bài viết thành công");
    res.redirect(`${prefixAdmin}/blogs`);
  } catch (error) {
    console.log(error);
    req.flash("error", "Xóa bài viết thất bại");
  }
};

const updateStatus = async (req, res) => {
  const id = req.params.id;
  const status = req.params.status;
  await Blogs.updateOne(
    {
      _id: id,
    },
    {
      status: status,
    }
  );
  req.flash("success", "Cập nhật trạng thái bài viết thành công");
  res.redirect(`${prefixAdmin}/blogs`);
  try {
  } catch (error) {
    console.log(error);
    req.flash("error", "Cập nhật trạng thái bài viết thất bại");
  }
};

const changeMulti = async (req, res) => {
  try {
    const changeType = req.body.changeMulti;
    const ids = req.body.ids.split(",");

    switch (changeType) {
      case "deleteAll": {
        ids.forEach(async (id) => {
          await Blogs.updateOne(
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
          const item = await Blogs.findOne({ _id: id, deleted: false });
          const statusChange = item.status === "active" ? "inactive" : "active";
          await Blogs.updateOne(
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
  getCreate,
  postCreate,
  getDetail,
  getEdit,
  patchEdit,
  deleteItem,
  updateStatus,
  changeMulti,
};

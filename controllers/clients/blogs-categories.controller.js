const Blogs = require("../../models/blogs.model");
const BlogsCategories = require("../../models/blogs-categories.model");
const Settings = require("../../models/general-settings.model");
const { pagination } = require("../../helpers/objectPagination");
const { tree } = require("../../helpers/categoriesRecursion");
const { getSubBlogsCategory } = require("../../helpers/subCategories");

const index = async (req, res) => {
  try {
    try {
      const page = parseInt(req.query.page);
      let find = { deleted: false };
      const settings = await Settings.findOne({ deleted: false });

      // sort
      let sort = [
        {
          keyValue: "title-desc",
          title: "Sắp xếp tên danh mục bài viết giảm dần",
        },
        {
          keyValue: "title-asc",
          title: "Sắp xếp tên danh mục bài viết tăng dần",
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

      // pagination
      let objectPagination = {
        limitItem: 4,
        totalPages: 0,
        currentPage: page || 1,
        skip: 0,
      };

      const totalItems = await Blogs.countDocuments(find);
      objectPagination = pagination(objectPagination, totalItems);

      let blogs = await Blogs.find(find)
        .limit(objectPagination.limitItem)
        .skip(objectPagination.skip)
        .sort(sortObj);

      blogs.forEach((blog, index) => {
        blog.index = index + 1;
      });

      // courses-categories
      let categories = await BlogsCategories.find({
        deleted: false,
      });

      categories = tree(categories);

      res.render("clients/pages/blogs-categories/index", {
        pageTitle: "Tất cả bài viết",
        blogs,
        pagination: objectPagination,
        sort,
        sortedBy,
        settings,
        categories,
        settings,
      });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
};

const getBySlug = async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const settings = await Settings.findOne({ deleted: false });
    const slug = req.params.slug;

    const category = await BlogsCategories.findOne({
      slug: slug,
      deleted: false,
      status: "active",
    });

    // subCategories
    const subCategories = await getSubBlogsCategory(category.id);
    const subCategoriesIds = [];
    subCategories.forEach((item) => {
      subCategoriesIds.push(item.id);
    });
    subCategoriesIds.push(category.id);

    // sort
    let sort = [
      {
        keyValue: "title-desc",
        title: "Sắp xếp tên danh mục bài viết giảm dần",
      },
      {
        keyValue: "title-asc",
        title: "Sắp xếp tên danh mục bài viết tăng dần",
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

    // pagination
    let objectPagination = {
      limitItem: 4,
      totalPages: 0,
      currentPage: page || 1,
      skip: 0,
    };

    let blogs = await Blogs.find({
      course_category_id: { $in: subCategoriesIds },
      deleted: false,
    });
    const totalItems = blogs.length;
    objectPagination = pagination(objectPagination, totalItems);

    blogs = await Blogs.find({
      course_category_id: { $in: subCategoriesIds },
      deleted: false,
    })
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip)
      .sort(sortObj);

    // courses-categories
    let categories = await BlogsCategories.find({
      deleted: false,
    });

    categories = tree(categories);

    res.render("clients/pages/blogs-categories/detail", {
      pageTitle: category.title,
      blogs,
      pagination: objectPagination,
      sort,
      sortedBy,
      settings,
      categories,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  index,
  getBySlug,
};

module.exports.pagination = (objectPagination, totalItems) => {
  objectPagination.totalPages = Math.ceil(
    totalItems / objectPagination.limitItem
  );
  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItem;
  return objectPagination;
};

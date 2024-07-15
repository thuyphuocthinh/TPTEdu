module.exports.newPrices = (courses) => {
  for (const course of courses) {
    course.newPrice =
      course.price - (course.price * course.discountPercentage) / 100;
  }
  return courses;
};

module.exports.newPrice = (course) => {
  course.newPrice =
    course.price - (course.price * course.discountPercentage) / 100;
  return course;
};

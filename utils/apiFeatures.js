class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    // 1) Filtering
    const queryObj = { ...this.queryString };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // 2) Advanced Filtering
    // console.log(queryObj, req.query);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(
      /\b(ne|gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );
    // { difficulty: 'easy', duration: {gte: 5}}
    // { difficulty: 'easy', duration: {$gte: 5}}
    // gte, gt, lte, lt
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
    // let query = Tour.find(JSON.parse(queryStr));
  }

  sort() {
    // 3) Sorting
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      // sort('price ratingsAverage')
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // 4) Field Limit
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // 4) Pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    //page=3&limit=10, 1-10, page 1, 11-20, page 2, 21-30, page 3
    this.query = this.query.skip(skip).limit(limit);

    // if (this.queryString.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error('This page does not exist!');
    // }
    return this;
  }
}
module.exports = APIFeatures;

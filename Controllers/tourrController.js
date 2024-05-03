/*
const Tourr = require("../Model/tourrModel");
const { query } = require("express");

exports.getAllTourrs = async (req, res) => {
  try {
    console.log(req.query);

    //this is querying by client using url
    //[http://127.0.0.1:3030/api/v1/tourrs?duration=5&difficulty=easy]
    //req.query gives us { duration_gte: '5', difficulty: 'easy' }

    //Exclude some of the keyword from querying
    const queryObj = { ...req.query };

    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    //handling operations like greater than less than
    //[http://127.0.0.1:3030/api/v1/tourrs?duration[gte]=5&difficulty=easy] this is how url looks like
    // what req.query gives
    // { duration: { gte: '5' }, difficulty: 'easy' }
    //what we need
    // { duration: { $gte: 5 }, difficulty: "easy" }
    //lets do some js
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    // console.log(JSON.parse(queryStr));
    queryStr = JSON.parse(queryStr); //this gives more querying except gte like parameters

    // console.log(JSON.stringify(queryObj));
    let query = Tourr.find(queryStr);

    // SORTING
    //Single field
    if (req.query.sort) {
      // query = query.sort("price");
      // query = query.sort(req.query.sort);

      // query = query.sort("price ratingsAverage");

      //this is url
      //[http://127.0.0.1:3030/api/v1/tourrs?sort=price,ratingsAverage]
      //req.query gives  { sort: 'price,ratingsAverage' }
      //what we want
      //  {"price ratingsAverage"}

      //how to lets do some js
      console.log(req.query.sort.split(",").join(" "));
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("createdAt");
    }

    //LETS LIMIT FIELDS
    if (req.query.fields) {
      // query = query.select("name duration price");

      //[http://127.0.0.1:3030/api/v1/tourrs?fields=name,duration,price]
      //req.query gives us { fields: 'name,duration,price' }
      //we want name duration price
      //same js as sorting
      queryBy = req.query.fields.split(",").join(" ");
      console.log(queryBy);
      query = query.select(queryBy);
    } else {
      query = query.select("-__v");
    }

    ///PAGINATION
    //mean set of action on pages based suppose we want to selectively show the documents
    //[http://127.0.0.1:3030/api/v1/tourrs?page=2&limit=10]
    //this is how request hits
    // { page: '2', limit: '5' } this is what req.query gives us
    //hardcoded means skip strting 10 doc and show next 10
    //matlab ki skip 5 document  krne hai jo ki first page ke hai and show karwane hai second page ke liye jo ki 5 honge kyoki limit 5 hai na
    //thi is hardcoded
    // query.skip(5).limit(5);
    //[http://127.0.0.1:3000/api/v1/tours?page=2&limit=10]
    //url means on page 1 we have 1-10 results and next 11-20 results are on next page 2 so we have to skip 10 results
    // query = query.skip(10).limit(10)
    //if
    // //[http://127.0.0.1:3000/api/v1/tours?page=3&limit=10]
    // //url means on page 1 we have 1-10 results and next 11-20 results are on next page 2 so we have to skip 20 results for page 3
    // query = query.skip(20).limit(10)

    //dynamically
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    //what if page is not there
    if (req.query.page) {
      const numTours = await Tourr.countDocuments();
      if (skip >= numTours) throw new Error("page not exist");
    }

    query = query.skip(skip).limit(limit);

    const tourr = await query;

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: tourr.length,
      data: {
        tourr,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getTourr = async (req, res) => {
  try {
    const id = req.params.id * 1;

    const tourr = await Tourr.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tourr,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createTourr = async (req, res) => {
  try {
    const newTourr = await Tourr.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        newTourr,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTourr = async (req, res) => {
  try {
    const updateTour = await Tourr.findOneAndUpdate(req.body.params, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour: updateTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.deleteTourr = async (req, res) => {
  try {
    await Tourr.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

*/

//ye saaf suthraa code
/*

const Tourr = require("../Model/tourrModel");
const { query } = require("express");

exports.getAllTourrs = async (req, res) => {
  try {
    const queryObj = { ...req.query };

    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    queryStr = JSON.parse(queryStr);

    let query = Tourr.find(queryStr);

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("createdAt");
    }

    if (req.query.fields) {
      queryBy = req.query.fields.split(",").join(" ");
      query = query.select(queryBy);
    } else {
      query = query.select("-__v");
    }

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    if (req.query.page) {
      const numTours = await Tourr.countDocuments();
      if (skip >= numTours) throw new Error("page not exist");
    }

    query = query.skip(skip).limit(limit);

    const tourr = await query;

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: tourr.length,
      data: {
        tourr,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getTourr = async (req, res) => {
  try {
    const id = req.params.id * 1;

    const tourr = await Tourr.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tourr,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createTourr = async (req, res) => {
  try {
    const newTourr = await Tourr.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        newTourr,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTourr = async (req, res) => {
  try {
    const updateTour = await Tourr.findOneAndUpdate(req.body.params, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour: updateTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.deleteTourr = async (req, res) => {
  try {
    await Tourr.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
*/

/*


// thoda sa masala in this code
const Tourr = require("../Model/tourrModel");
const { query } = require("express");

exports.aliasTopTour = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

//  //Aliasing -some unconventional calls from the client
//  const features = new APIFeatures(Tour.find(), req.query()).filter().sort().limitFields().paginate()
// const tours = await features.query.exec();

class APIFeatures {
  //ye class pata hai basically ek object return karegi or wo fetures kehlayegi dost
  //yaha query=Tour.find() hai jo ki mongoose ka method hai jo saree documents provide krta hai
  //while queryString ye wala express ke method req.query() sse ayegaa
  //hence
  
  // {
  //    query:Tour.find(),
  //    queryString:queryString 
     
  // }
  //pure game me apan ne query ko hi to update kiya hia hai
  //shuru me query Tour.find() hota hai fir Tour.find(queryString) ho jata hai .......and then goes on
  //yaha bhi this.query update hogaa or return this fir last me features.query karke query le lengee fir await lagake run karelengee bro
  //ab apne pass dono Tour.find() or queryString hai inko use karengee or methods create krengee 
  //baad me methods bhi add ho jayengee ye filter walee sorting walee sab or fir is feature object me ye sba hongee and use them whenever u want to
  
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  //ye kuch methods define kardiye brother
  filter() {
    // const queryObj = { ...req.query };
    //ab req.query available hai so using queryString basically
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // let query = Tour.find(JSON.parse(queryStr));
    //ab Tour directly nhi use kr rhee na bro
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    //req.query() ki jagah this.queryString
    //
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
    //this waise puraa object return karege fir features ka jo bhi use karna hai krlena
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

exports.getAllTourrs = async (req, res) => {
  try {
    const queryObj = { ...req.query };

    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    queryStr = JSON.parse(queryStr);

    let query = Tourr.find(queryStr);

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("createdAt");
    }

    if (req.query.fields) {
      queryBy = req.query.fields.split(",").join(" ");
      query = query.select(queryBy);
    } else {
      query = query.select("-__v");
    }

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    // if (req.query.page) {
    //   const numTours = await Tourr.countDocuments();
    //   if (skip >= numTours) throw new Error("page not exist");
    // }
    query = query.skip(skip).limit(limit);

    //Aliasing -some unconventional calls from the client
    const features = new APIFeatures(Tourr.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tourrs = await features.query.exec();

    // const tourr = await query;

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: tourrs.length,
      data: {
        tourrs,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getTourr = async (req, res) => {
  try {
    const id = req.params.id * 1;

    const tourr = await Tourr.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tourr,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createTourr = async (req, res) => {
  try {
    const newTourr = await Tourr.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        newTourr,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTourr = async (req, res) => {
  try {
    const updateTour = await Tourr.findOneAndUpdate(req.body.params, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour: updateTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.deleteTourr = async (req, res) => {
  try {
    await Tourr.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
*/

/*
// Neat and clean
const Tourr = require("../Model/tourrModel");
const { query } = require("express");

exports.aliasTopTour = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

exports.getAllTourrs = async (req, res) => {
  try {
    const queryObj = { ...req.query };

    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    queryStr = JSON.parse(queryStr);

    let query = Tourr.find(queryStr);

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("createdAt");
    }

    if (req.query.fields) {
      queryBy = req.query.fields.split(",").join(" ");
      query = query.select(queryBy);
    } else {
      query = query.select("-__v");
    }

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const features = new APIFeatures(Tourr.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tourrs = await features.query.exec();

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: tourrs.length,
      data: {
        tourrs,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getTourr = async (req, res) => {
  try {
    const id = req.params.id * 1;

    const tourr = await Tourr.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tourr,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createTourr = async (req, res) => {
  try {
    const newTourr = await Tourr.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        newTourr,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTourr = async (req, res) => {
  try {
    const updateTour = await Tourr.findOneAndUpdate(req.body.params, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour: updateTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.deleteTourr = async (req, res) => {
  try {
    await Tourr.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
*/

////////////////////////////////////////////////////////////////////////////////////

const Tourr = require("../Model/tourrModel");
const { query } = require("express");

//export it
//import it
const APIFeatures = require("./../utils/apiFeatures");

exports.getAllTourrs = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    queryStr = JSON.parse(queryStr);

    let query = Tourr.find(queryStr);

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("createdAt");
    }

    if (req.query.fields) {
      queryBy = req.query.fields.split(",").join(" ");
      query = query.select(queryBy);
    } else {
      query = query.select("-__v");
    }

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    const features = new APIFeatures(Tourr.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tourrs = await features.query.exec();

    res.status(200).json({
      status: "success",
      requestedAt: req.requestTime,
      results: tourrs.length,
      data: {
        tourrs,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.getTourr = async (req, res) => {
  try {
    const id = req.params.id * 1;

    const tourr = await Tourr.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tourr,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createTourr = async (req, res) => {
  try {
    const newTourr = await Tourr.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        newTourr,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTourr = async (req, res) => {
  try {
    const updateTour = await Tourr.findOneAndUpdate(req.body.params, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        tour: updateTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
exports.deleteTourr = async (req, res) => {
  try {
    await Tourr.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTourrStats = async (req, res) => {
  const stats = await Tourr.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: null,
        numRatings: { $sum: "$ratingsQuantity" },
        numTours: { $sum: 1 },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
  ]);
};

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
    if(req.query.page) {
      const numTours=await Tourr.countDocuments()
      if(skip>=numTours)
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
      message: err,
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

const express = require("express");
const fs = require("fs");
const tourrController = require("./../Controllers/tourrController");

const router = express.Router();

router.route("/tourr-stats").get(tourrController.getTourrStats);

router
  .route("/")
  .get(tourrController.getAllTourrs)
  .post(tourrController.createTourr);

router
  .route("/:id")
  .get(tourrController.getTourr)
  .patch(tourrController.updateTourr)
  .delete(tourrController.deleteTourr);

module.exports = router;

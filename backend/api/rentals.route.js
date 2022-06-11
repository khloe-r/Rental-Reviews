import express from "express";
import RentalsCtrl from "./rentals.controller.js";
import ReviewsCtrl from "./reviews.controller.js";

const router = express.Router();

router.route("/").get(RentalsCtrl.apiGetRentals);
router.route("/property-types").get(RentalsCtrl.apiGetRentalProperties);
router.route("/id/:id").get(RentalsCtrl.apiGetRentalById);
router.route("/review").post(ReviewsCtrl.apiPostReview).put(ReviewsCtrl.apiUpdateReview).delete(ReviewsCtrl.apiDeleteReview);

export default router;

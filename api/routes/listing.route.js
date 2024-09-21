import verifyToken from "../utils/verifyToken.js";
import express from "express";

import {
  getListing,
  createListing,
  deleteListing,
  updateListing,
} from "../controller/listing.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.post("/update/:id", verifyToken, updateListing);
router.get("/get/:id", getListing);

export default router;

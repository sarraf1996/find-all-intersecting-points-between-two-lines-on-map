import express from "express";

//middleware
import { isAuthenticated } from "../middleware/auth.js";

//controllers
//default import
import homePage from "../controller/HomePageController.js";
//named imports
import {
  findIntersectionPointForGetMethod,
  findIntersectionPointForPostMethod,
} from "../controller/FindIntersectionPointController.js";

const router = express.Router();

router.get("/", homePage);
router.get("/find-intersection", findIntersectionPointForGetMethod);
router.post(
  "/find-intersection",
  isAuthenticated,
  findIntersectionPointForPostMethod
);

export default router;

const router = require("express").Router();
const authenticationMiddleware = require("../middleware/authentication-middleware");
const {
  createMeal,
  showMeals,
  showAllMeals,
  listHashtags,
  listFoodItems,
} = require("../controllers/mealController");

router.get("/showAll?", showAllMeals);
router.get("/hashtags", listHashtags);
router.get("/foodItems", listFoodItems);

router.post("/", authenticationMiddleware, createMeal);
router.get("/?", authenticationMiddleware, showMeals);

module.exports = router;

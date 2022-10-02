const MealModel = require("../models/Meal");
const HashtagsModel = require("../models/Hashtags");
const CustomAPIError = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createMeal = async (req, res) => {
  const { hashtags, foodItems } = req.body;

  if (!hashtags || !foodItems) {
    throw new CustomAPIError.BadRequestError("Please provide all details");
  }

  if (
    !Array.isArray(hashtags) ||
    !Array.isArray(foodItems) ||
    hashtags.length === 0 ||
    foodItems.length === 0
  ) {
    throw new CustomAPIError.BadRequestError("Invalid data");
  }

  const sanitizedHashtags = hashtags.map(
    (hashtag) => hashtag.trim().toLowerCase().replace(/[\W]/g, "") // sanitising data
  );

  const sanitizedFooditems = foodItems.map((foodItem) =>
    foodItem.trim().toLowerCase()
  );

  for (let hashtag of sanitizedHashtags) {
    const hashtagExists = await HashtagsModel.findOne({ hashtag });
    if (!hashtagExists) {
      await HashtagsModel.create({ hashtag, creator: req.user.userId });
    }
  }

  const meal = await MealModel.create({
    hashtags: sanitizedHashtags,
    foodItems: sanitizedFooditems,
    userId: req.user.userId,
  });

  res.status(StatusCodes.CREATED).json({ success: true, meal });
};

const showMeals = async (req, res) => {
  const { hashtags, foodItems } = req.query;

  const queryObj = { userId: req.user.userId };

  if (hashtags) {
    queryObj["hashtags"] = hashtags.trim().toLowerCase();
  }

  if (foodItems) {
    queryObj["foodItems"] = foodItems.trim().toLowerCase();
  }

  const meals = await MealModel.find(queryObj).populate({
    path: "userId",
    select: "name",
  });

  if (!meals || meals.length === 0) {
    throw new CustomAPIError.NotFoundError(
      `No meals found for ${req.user.name}`
    );
  }

  res.status(StatusCodes.OK).json({ count: meals.length, meals });
};

const showAllMeals = async (req, res) => {
  const { hashtags, foodItems } = req.query;

  const queryObj = {};

  if (hashtags) {
    queryObj["hashtags"] = hashtags.trim().toLowerCase();
  }

  if (foodItems) {
    queryObj["foodItems"] = foodItems.trim().toLowerCase();
  }

  const meals = await MealModel.find(queryObj).populate({
    path: "userId",
    select: "name",
  });

  if (!meals || meals.length === 0) {
    throw new CustomAPIError.NotFoundError(`No meals found`);
  }

  res.status(StatusCodes.OK).json({ count: meals.length, meals });
};

const listHashtags = async (req, res) => {
  const hashtags = await HashtagsModel.find({}).select("hashtag");

  if (!hashtags) {
    throw new CustomAPIError.NotFoundError("No hashtags found");
  }

  res.status(StatusCodes.OK).json({ hashtags });
};

const listFoodItems = async (req, res) => {
  const foodItems = MealModel.schema.path("foodItems").caster.enumValues;

  res.status(StatusCodes.OK).json({ foodItems });
};

module.exports = {
  createMeal,
  showMeals,
  showAllMeals,
  listHashtags,
  listFoodItems,
};

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

  console.log(hashtags);

  const sanitizedHashtags = hashtags.map(
    (hashtag) => hashtag.toLowerCase().trim().replace(/[\W]/g, "") // sanitising data
  );

  for (let hashtag of sanitizedHashtags) {
    const hashtagExists = await HashtagsModel.findOne({ hashtag });
    if (!hashtagExists) {
      await HashtagsModel.create({ hashtag, creator: req.user.userId });
    }
  }

  const meal = await MealModel.create({
    hashtags: sanitizedHashtags,
    foodItems,
    userId: req.user.userId,
  });

  res.status(StatusCodes.CREATED).json({ success: true, meal });
};

const showMeals = async (req, res) => {
  const userId = req.user.userId;

  const meals = await MealModel.find({ userId });

  if (!meals || meals.length === 0) {
    throw new CustomAPIError.NotFoundError(
      `No meals found for ${req.user.name}`
    );
  }

  res.status(StatusCodes.OK).json({ meals });
};

const showAllMeals = async (req, res) => {
  const { hashtags, foodItems } = req.query;

  const queryObj = {};

  if (hashtags) {
    queryObj["hashtags"] = hashtags;
  }

  if (foodItems) {
    queryObj["foodItems"] = foodItems;
  }

  const meals = await MealModel.find(queryObj);

  if (!meals || meals.length === 0) {
    throw new CustomAPIError.NotFoundError(`No meals found`);
  }

  res.status(StatusCodes.OK).json({ meals });
};

const listHashtags = async (req, res) => {
  const hashtags = await HashtagsModel.find({});

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

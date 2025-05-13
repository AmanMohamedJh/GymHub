const { getAllSubscriptions } = require("./getAllSubscriptionsController");
const {
  updateSubscriptionPrice,
} = require("./updateSubscriptionPriceController");
const { getSubscriptionPlans } = require("./getSubscriptionPlansController");

module.exports = {
  getAllSubscriptions,
  updateSubscriptionPrice,
  getSubscriptionPlans,
};

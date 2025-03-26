const Subscription = require('../../models/SubscriptionModel');

const verifySubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findOne({
            userId: req.user._id,
            status: 'Active',
            endDate: { $gt: new Date() }
        });

        if (!subscription && req.user.role === 'gymowner') {
            return res.status(403).json({
                message: 'Active subscription required',
                requiresSubscription: true
            });
        }

        req.subscription = subscription;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error verifying subscription' });
    }
};

module.exports = verifySubscription;

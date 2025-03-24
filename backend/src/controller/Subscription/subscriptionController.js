const stripe = require('../../config/stripe');
const Subscription = require('../../models/Subscription/SubscriptionModel');
const User = require('../../models/userModel');

const DOMAIN = process.env.FRONTEND_URL || 'http://localhost:3000';

const PLANS = {
    Monthly: {
        price: 2999, // $29.99
        interval: 'month'
    },
    Yearly: {
        price: 29999, // $299.99
        interval: 'year'
    }
};

exports.createCheckoutSession = async (req, res) => {
    try {
        const { planType } = req.body;
        const userId = req.user._id;

        if (!PLANS[planType]) {
            return res.status(400).json({ message: 'Invalid plan type' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${planType} Subscription`,
                        description: `GymHub ${planType} Plan Subscription`
                    },
                    unit_amount: PLANS[planType].price,
                    recurring: {
                        interval: PLANS[planType].interval
                    }
                },
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${DOMAIN}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${DOMAIN}/subscription/failure`,
            customer_email: req.user.email,
            metadata: {
                userId: userId.toString(),
                planType
            }
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Checkout session error:', error);
        res.status(500).json({ message: 'Error creating checkout session' });
    }
};

exports.handleWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
        console.log('Received webhook event:', event.type);

        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object;
                console.log('Processing checkout session:', session);

                const { userId, planType } = session.metadata;
                if (!userId || !planType) {
                    throw new Error('Missing userId or planType in session metadata');
                }

                const endDate = new Date();
                endDate.setMonth(endDate.getMonth() + (planType === 'Yearly' ? 12 : 1));

                // First, check if user already has an active subscription
                const existingSubscription = await Subscription.findOne({
                    userId,
                    status: { $regex: new RegExp('^active$', 'i') }
                });

                // For subscription mode, use subscription ID as payment ID
                const paymentId = session.subscription;

                if (existingSubscription) {
                    // Update existing subscription
                    existingSubscription.planType = planType;
                    existingSubscription.paymentId = paymentId;
                    existingSubscription.endDate = endDate;
                    existingSubscription.stripeCustomerId = session.customer;
                    existingSubscription.stripeSubscriptionId = session.subscription;
                    await existingSubscription.save();
                    console.log('Updated existing subscription:', existingSubscription);
                } else {
                    // Create new subscription
                    const subscription = await Subscription.create({
                        userId,
                        planType,
                        status: 'Active',
                        paymentId: paymentId,
                        startDate: new Date(),
                        endDate,
                        stripeCustomerId: session.customer,
                        stripeSubscriptionId: session.subscription
                    });
                    console.log('Created new subscription:', subscription);
                }

                // Update user's subscription status
                const user = await User.findByIdAndUpdate(
                    userId,
                    { hasActiveSubscription: true },
                    { new: true }
                );
                console.log('Updated user subscription status:', user);
                break;
            }
            case 'customer.subscription.deleted': {
                const subscription = event.data.object;
                console.log('Processing subscription deletion:', subscription);

                const updatedSubscription = await Subscription.findOneAndUpdate(
                    { stripeSubscriptionId: subscription.id },
                    { 
                        status: 'Canceled',
                        endDate: new Date()
                    },
                    { new: true }
                );
                console.log('Updated subscription status to canceled:', updatedSubscription);

                if (updatedSubscription) {
                    const user = await User.findByIdAndUpdate(
                        updatedSubscription.userId,
                        { hasActiveSubscription: false },
                        { new: true }
                    );
                    console.log('Updated user subscription status:', user);
                }
                break;
            }
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ error: 'Webhook processing failed' });
    }
};

exports.getUserSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            userId: req.user._id,
            status: { $regex: new RegExp('^active$', 'i') }
        });
        res.json(subscription);
    } catch (error) {
        console.error('Error fetching subscription:', error);
        res.status(500).json({ message: 'Error fetching subscription' });
    }
};

exports.cancelSubscription = async (req, res) => {
    try {
        const userId = req.user._id;
        
        // Find active subscription
        const subscription = await Subscription.findOne({
            userId,
            status: { $regex: new RegExp('^active$', 'i') }
        });

        if (!subscription) {
            return res.status(404).json({ error: 'No active subscription found' });
        }

        // Cancel the subscription in Stripe
        const canceledSubscription = await stripe.subscriptions.cancel(
            subscription.stripeSubscriptionId
        );

        // Update subscription in database
        subscription.status = 'Canceled';
        subscription.endDate = new Date(canceledSubscription.cancel_at * 1000);
        await subscription.save();

        // Update user's subscription status
        await User.findByIdAndUpdate(userId, { hasActiveSubscription: false });

        res.json({ 
            message: 'Subscription canceled successfully',
            subscription: subscription
        });
    } catch (error) {
        console.error('Error canceling subscription:', error);
        res.status(500).json({ error: 'Failed to cancel subscription' });
    }
};

exports.getSubscription = async (req, res) => {
    try {
        const userId = req.user._id;
        
        const subscription = await Subscription.findOne({
            userId,
            status: { $in: ['Active', 'Canceled'] }
        }).sort({ createdAt: -1 });

        if (!subscription) {
            return res.status(404).json({ error: 'No subscription found' });
        }

        res.json(subscription);
    } catch (error) {
        console.error('Error fetching subscription:', error);
        res.status(500).json({ error: 'Failed to fetch subscription details' });
    }
};

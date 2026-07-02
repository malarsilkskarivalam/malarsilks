const twilio = require('twilio');

const sendSMSNotification = async (order, adminPhone) => {
    try {
        // Initialize Twilio client
        // Ensure you have TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER in your .env
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
        
        if (!accountSid || !authToken || !twilioPhone) {
            console.log('Twilio credentials missing. Skipping SMS notification.');
            return false;
        }

        const client = twilio(accountSid, authToken);
        const toPhone = adminPhone || process.env.ADMIN_PHONE;

        if (!toPhone) {
            console.log('Admin phone number missing. Skipping SMS notification.');
            return false;
        }

        const message = `Malar Silks - New Order!\nOrder ID: #${order.id}\nTotal: ₹${order.total_price || order.totalPrice}\nItems: ${order.orderItems.length}\nPlease check admin panel.`;

        const response = await client.messages.create({
            body: message,
            from: twilioPhone,
            to: toPhone
        });

        console.log('Order notification SMS sent:', response.sid);
        return true;
    } catch (error) {
        console.error('Error sending SMS notification:', error);
        return false;
    }
};

module.exports = sendSMSNotification;

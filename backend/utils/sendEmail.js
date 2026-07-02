const nodemailer = require('nodemailer');

const sendEmailNotification = async (order, adminEmail) => {
    try {
        // Create a transporter using SMTP (e.g., Gmail)
        // Ensure you have SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in your .env file
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER, 
                pass: process.env.SMTP_PASS, 
            },
        });

        // Format order items for the email
        const itemsList = order.orderItems.map(
            item => `<li>${item.qty}x ${item.name} - ₹${item.price}</li>`
        ).join('');

        const mailOptions = {
            from: `"Malar Silks Orders" <${process.env.SMTP_USER}>`,
            to: adminEmail || process.env.ADMIN_EMAIL, 
            subject: `New Order Received! #${order.id}`,
            html: `
                <h2>New Order Alert - Malar Silks</h2>
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Total Amount:</strong> ₹${order.total_price || order.totalPrice}</p>
                <p><strong>Payment Method:</strong> ${order.payment_method || order.paymentMethod}</p>
                <br/>
                <h3>Shipping Details:</h3>
                <pre>${JSON.stringify(order.shipping_address || order.shippingAddress, null, 2)}</pre>
                <br/>
                <h3>Order Items:</h3>
                <ul>
                    ${itemsList}
                </ul>
                <br/>
                <p>Please check the admin panel for more details.</p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Order notification email sent: %s', info.messageId);
        return true;
    } catch (error) {
        console.error('Error sending order email:', error);
        return false;
    }
};

module.exports = sendEmailNotification;

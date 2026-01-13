const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = "1015079581848-dcu14ralv0724g0uoeb7u24hdl8d10np.apps.googleusercontent.com";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    const guestId = req.headers['x-guest-id'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            req.userId = payload.sub; // Google User ID
            return next();
        } catch (error) {
            console.error('Invalid Google Token:', error.message);
            return res.status(401).json({ error: 'Invalid authentication token' });
        }
    } else if (guestId) {
        // For Guest ID, we prefix with 'guest_' to avoid collisions in the DB
        req.userId = `guest_${guestId}`;
        return next();
    } else {
        return res.status(401).json({ error: 'Authentication required' });
    }
}

module.exports = { authenticate };

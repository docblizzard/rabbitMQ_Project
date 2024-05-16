const { createUser, authUser } = require('../user/user.js');
const { generateToken } = require('../user/jwtToken');
async function createUserController(req, res) {
    try {
        const { username, password } = req.body;
        console.log(username, password);
        const createdUser = await createUser(username, password);
        if (createdUser.created) {
            const token = generateToken({ username: username });
            return res.status(200).json({ success: true, message: 'User created', jwt_token: token });
        } else {
            return res.status(401).json({ error: 'Unauthorized', message: 'Username already taken' });
        }
    }
    catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

async function authenticateUserController(req, res) {
    try {
        const { username, password } = req.body;
        console.log(username, password);
        const isAuthenticated = await authUser(username, password);
        if (isAuthenticated.isAuthenticated){
            const token = generateToken({ username: username });
            return res.status(200).json({ success: true, message: 'User logged in', jwt_token: token });
        } else {
            return res.status(401).json({ error: 'Unauthorized', message: 'Invalid username or password' });
        }
    }
    catch (error) {
        console.error("Error sending message:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { createUserController, authenticateUserController }
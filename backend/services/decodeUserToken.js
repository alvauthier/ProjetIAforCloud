const jwt = require('jsonwebtoken');

function decodeUserToken(token) {
    try {
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        const userId = decodedToken.userId;
        return userId;
    } catch (error) {
        console.error('Erreur lors du décodage du token:', error);
        return null;
    }
}

module.exports = decodeUserToken;

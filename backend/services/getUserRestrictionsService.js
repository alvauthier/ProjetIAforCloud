const Restriction = require('../db').Restriction;

async function getUserRestrictionsService(userId) {
    try {
        const restrictions = await Restriction.findAll({
            where: { userId },
        });
    return restrictions;
    } catch (error) {
        console.error('Erreur lors de la récupération des restrictions:', error);
        throw error;
    }
}

module.exports = getUserRestrictionsService;
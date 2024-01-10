const jwt = require("jsonwebtoken");
const User = require("../db").User;
require("dotenv").config({ path: ".env.local", override: true });

async function adminMiddleware(req, res, next) {
  const token = req.cookies["token"];
  if (!token) {
    return res.status(401).json({ error: "Authentification requise !" });
  }

  try {
    // Vérifier et décoder le jeton
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    req.userRole = decodedToken.userRole; // Ajouter l'ID de l'utilisateur à la requête

    const user = await User.findOne({ where: { role: req.userRole } });

    if (user) {
      req.userRole = decodedToken.userRole;
      next();
    } else {
      return res.status(403).json({ error: "Accès refusé." });
    }
  } catch (error) {
    res.status(401).json({ error: "Token invalide !" });
  }
}

module.exports = adminMiddleware;

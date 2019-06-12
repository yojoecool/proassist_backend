require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { APP_SECRET } = process.env;

  try {
    if (!req.headers.authorization) {
      throw new Error('Unauthroized');
    }
    const authArray = req.headers.authorization.split(' ');
    if (authArray.length === 2 && authArray[0] === 'Bearer') {
      const decoded = jwt.verify(authArray[1], APP_SECRET);

      if (!req.locals) {
        req.locals = {};
      }
      req.locals.userId = decoded.userId;
      req.locals.email = decoded.email;
      req.locals.userType = decoded.userType;

      next();
    } else {
      throw new Error('Unauthroized');
    }
  } catch (err) {
    console.log(err);
    if (err.message === 'Unauthroized') {
      res.status(403);
      res.json({
        error: 'Either your token has expired or you are not authorized to access this resouce.'
      });
    } else {
      res.status(500);
      res.json({ error: 'There was an error processing the request.' });
    }
  }
}
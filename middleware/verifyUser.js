require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { APP_SECRET } = process.env;

  try {
    if (!req.headers.authorization) {
      throw new Error('Unauthorized');
    }
    const authArray = req.headers.authorization.split(' ');
    if (authArray.length === 2 && authArray[0] === 'Bearer') {
      if (authArray[1] === 'null') {
        throw new Error('No Token');
      }

      const decoded = jwt.verify(authArray[1], APP_SECRET);

      if (!req.locals) {
        req.locals = {};
      }
      req.locals.userId = decoded.userId;
      req.locals.email = decoded.email;
      req.locals.userType = decoded.userType;

      next();
    } else {
      throw new Error('Unauthorized');
    }
  } catch (err) {
    console.log(err);
    if (err.message === 'Unauthorized') {
      res.status(403);
      res.json({
        error: 'Either your token has expired or you are not authorized to access this resouce.'
      });
    } else if (err.message === 'No Token') {
      res.status(404);
      res.json({
        error: 'No token included with request.'
      });
    } else {
      res.status(500);
      res.json({ error: 'There was an error processing the request.' });
    }
  }
}
module.exports = (req, res, next) => {
  if (!req.locals || req.locals.userType !== 'Admin') {
    res.status(403);
    res.json({
      error: 'You are not authorized to access this resource.'
    });
    return;
  }

  next();
};

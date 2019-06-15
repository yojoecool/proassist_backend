const verifyUser = require('./verifyUser');
const verifyAdmin = require('./verifyAdmin');
const s3Upload = require('./s3Upload');

module.exports = {
  verifyUser,
  verifyAdmin,
  s3Upload
};

const jwt = require("jsonwebtoken");

exports.getToken = async (user_id) => { // Accept user_id as argument
  const token = jwt.sign({ identifier: user_id }, "RJHBVENIMO");
  return token;
};

module.exports=exports;

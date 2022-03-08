const userModel = require('../models/users')

/// ------------------------------------------------------------------------ ///
/// SHOW USER
/// ------------------------------------------------------------------------ ///

exports.user_details = (req, res) => {
  const user = userModel.find({ userId: req.session.passport.user.id })

  res.render('../views/account/details', {
    user,
    actions: {}
  })
}

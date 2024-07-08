const organisationModel = require('../models/organisations')

const cycleHelper = require('../helpers/cycles')

const settings = require('../data/dist/settings')

exports.cycle_list = (req, res) => {
  const isRollover = settings.isRollover || process.env.IS_ROLLOVER

  if (isRollover === 'true') {
    const organisation = organisationModel.findOne({ organisationId: req.params.organisationId })
    res.render('../views/cycles/list', {
      organisation
    })
  } else {
    const cycleId = cycleHelper.CURRENT_CYCLE.code || req.params.cycleId
    res.redirect(`/organisations/${req.params.organisationId}/cycles/${cycleId}`);
  }
}

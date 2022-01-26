exports.getOrganisationLabel = (code) => {
  let label = code
  const organisations = require('../data/organisations')

  label = organisations.find(organisation => organisation.code === code).name

  return label
}

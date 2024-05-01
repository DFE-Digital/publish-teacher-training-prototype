const numeral = require('numeral')

const financialIncentives = require('../data/dist/financial-incentives')

exports.getFinancialIncentives = (subjectCode, academicYear) => {
  const incentives = financialIncentives.filter(incentive =>
    incentive.subjectCode === subjectCode
    && incentive.academicYear === academicYear.toString()
  )
  return incentives
}

exports.getFinancialIncentiveLabel = (subjectCode, academicYear) => {
  let label = ''

  if (subjectCode && academicYear) {
    const incentives = this.getFinancialIncentives(subjectCode, academicYear)

    // financialIncentives.filter(incentive =>
    //   incentive.subjectCode === subjectCode
    //   && incentive.academicYear === academicYear.toString()
    // )

    const bursary = incentives.find(incentive => incentive.type === 'bursary')
    const scholarship = incentives.find(incentive => incentive.type === 'scholarship')

    if (bursary) {
      if (scholarship) {
        label = `Scholarships of £${numeral(scholarship.amount).format('0,0')} and bursaries of £${numeral(bursary.amount).format('0,0')} are available`
      } else {
        label = `Bursaries of £${numeral(bursary.amount).format('0,0')} available`
      }
    }
  }

  return label
}

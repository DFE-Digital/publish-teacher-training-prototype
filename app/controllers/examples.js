const schoolModel = require("../models/schools")

exports.find_school_get = (req, res) => {

  res.render("../views/examples/schools/find", {

    actions: {
      save: `/examples/schools/find`,
      back: `/examples/schools`,
      cancel: `/examples/schools`,
      edit: `/examples/schools/edit`
    },
  })
}

exports.find_school_post = (req, res) => {
  const errors = []

  if (!req.session.data.query.length) {
    const error = {}
    error.fieldName = 'query'
    error.href = '#query'
    error.text = 'Enter a school, university, college, URN or postcode'
    errors.push(error)
  }

  if (errors.length) {
    res.render("../views/examples/schools/find", {

      actions: {
        save: `/examples/schools/find`,
        back: `/examples/schools`,
        cancel: `/examples/schools`,
        edit: `/examples/schools/edit`
      },
      errors,
    })
  } else {

    // if (true) {
    //   res.redirect(
    //     `/examples/schools/edit`
    //   )
    // } else {
      res.redirect(
        `/examples/schools/choose`
      )
    // }

  }
}

exports.choose_school_get = (req, res) => {
  const schools = schoolModel.findMany({
    query: req.session.data.query
  })

  // store total number of results
  const schoolCount = schools.length

  // parse the school results for use in macro
  let schoolItems = []
  schools.forEach(school => {
    const item = {}
    item.text = school.name
    item.value = school.urn
    item.hint = {
      text: `${school.address.town}, ${school.address.postcode}`
    }
    schoolItems.push(item)
  })

  // sort items alphabetically
  schoolItems.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  // only get the first 15 items
  schoolItems = schoolItems.slice(0,15)

  res.render("../views/examples/schools/choose", {
    schoolItems,
    schoolCount,
    searchTerm: req.session.data.query,
    actions: {
      save: `/examples/schools/choose`,
      back: `/examples/schools/find`,
      cancel: `/examples/schools`,
    },
  })
}

exports.choose_school_post = (req, res) => {
  const schools = schoolModel.findMany({
    query: req.session.data.query
  })

  // store total number of results
  const schoolCount = schools.length

  // parse the school results for use in macro
  let schoolItems = []
  schools.forEach(school => {
    const item = {}
    item.text = school.name
    item.value = school.urn
    item.hint = {
      text: `${school.address.town}, ${school.address.postcode}`
    }
    schoolItems.push(item)
  })

  // sort items alphabetically
  schoolItems.sort((a,b) => {
    return a.text.localeCompare(b.text)
  })

  // only get the first 15 items
  schoolItems = schoolItems.slice(0,15)

  const errors = []

  if (!req.session.data.school) {
    const error = {}
    error.fieldName = 'school'
    error.href = '#school'
    error.text = 'Select a school'
    errors.push(error)
  }

  if (errors.length) {
    res.render("../views/examples/schools/choose", {
      schoolItems,
      schoolCount,
      searchTerm: req.session.data.query,
      actions: {
        save: `/examples/schools/choose`,
        back: `/examples/schools/find`,
        cancel: `/examples/schools`,
      },
      errors,
    })
  } else {
    res.redirect(
      `/examples/schools/edit`
    )
  }
}

exports.edit_school_get = (req, res) => {
  let location = {}
  if (req.session.data.location) {
    location = req.session.data.location
  } else {
   location = schoolModel.findOne({ urn: req.session.data.school })
  }

  res.render("../views/examples/schools/edit", {
    location,
    actions: {
      save: `/examples/schools/edit`,
      back: `/examples/schools`,
      cancel: `/examples/schools`,
    },
  })
}

exports.edit_school_post = (req, res) => {
  const errors = []

  if (errors.length) {
    res.render("../views/examples/schools/edit", {

      actions: {
        save: `/examples/schools/edit`,
        back: `/examples/schools`,
        cancel: `/examples/schools`,
      },
      errors,
    })
  } else {

  }
}

exports.isValidEmail = (email) => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  let valid = true
  if (!email || !regex.test(email)) {
    valid = false
  }
  return valid
}

exports.isValidURL = (url) => {
  const regex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/igm
  let valid = true
  if (!url || !regex.test(url)) {
    valid = false
  }
  return valid
}

exports.isValidPostcode = (postcode) => {
  const regex = /^(([A-Z]{1,2}[0-9][A-Z0-9]?|ASCN|STHL|TDCU|BBND|[BFS]IQQ|PCRN|TKCA) ?[0-9][A-Z]{2}|BFPO ?[0-9]{1,4}|(KY[0-9]|MSR|VG|AI)[ -]?[0-9]{4}|[A-Z]{2} ?[0-9]{2}|GE ?CX|GIR ?0A{2}|SAN ?TA1)$/
  let valid = true
  if (!postcode || !regex.test(postcode.toUpperCase())) {
    valid = false
  }
  return valid
}


exports.isValidWordCount = (text, wordCount) => {
  const string = text
          .replace(/(^\s*)|(\s*$)/gi,'') //exclude start and end white-space
          .replace(/[ ]{2,}/gi,' ') //2 or more space to 1
          .replace(/\n /,'\n') //exclude newline with a start spacing

  let valid = true

  if (string.split(' ').length > wordCount) {
    valid = false
  }

  return valid
}

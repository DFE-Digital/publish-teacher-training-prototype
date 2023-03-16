const debugAutocomplete = false

// What should get set in the input once a value is selected
const valueForInput = (result) => {
  if (!result) return ''
  else if (typeof result == 'string'){
    return result
  }
  else if (typeof result == 'object'){
    return result.name
  }
}

// What gets displayed for each option
const menuResultItem = (result) => {
  if (result) {
    // If using DefaultValue, result can be a string - bug with autcomplete  https://github.com/alphagov/accessible-autocomplete/issues/424
    if (typeof result == 'string'){
      return result
    }
    // What our sort function returns
    else if (typeof result == 'object'){
      let name = (debugAutocomplete) ? `${result.name} (${result.weight})` : result.name
      let output = result.append ? `<span>${name}</span> ${result.append}` : `<span>${name}</span>`
      return result.hint ? `${output}<span class="autocomplete__option--hint">${result.hint}</span>` : output

    }
  }
  else return ''
}

const onConfirm = (selected) => {

  // Create a hidden input and use this to submit the value or the name

  // Visible input that user interacts with
  let autocompleteInput = document.getElementById(this.id)
  let autocompleteId = autocompleteInput.id

  // Hidden input to store value / submit data
  let autocompleteValueId = `${autocompleteId}-value`
  let autocompleteValueInput = document.getElementById(autocompleteValueId)

  // Create hidden input if it doesn’t already exist
  if (!autocompleteValueInput){
    let hiddenInput = document.createElement('input')
    hiddenInput.setAttribute("type", "hidden");

    // Copy over attributes from visible input
    hiddenInput.setAttribute("id", autocompleteValueId);
    hiddenInput.setAttribute("name", `${this.name}`);
    hiddenInput.value = autocompleteInput.value

    // Save the string from the input so we can compare it later
    hiddenInput.setAttribute("data-text", autocompleteInput.value)

    // Clear the original input's name, so it doesn't get submitted
    autocompleteInput.setAttribute("name", '')

    // Append after the visible input
    autocompleteInput.parentElement.append(hiddenInput)

    // Save reference to new input
    autocompleteValueInput = document.getElementById(autocompleteValueId)
  }

  // onConfirm gets called once an item is picked *and* on blur. When called on blur,
  // selected is undefined.
  // If we have a selected item we co
  if (selected){
    autocompleteValueInput.value = selected.value || selected.name
    autocompleteValueInput.setAttribute("data-text", selected.name)
  }
  // Probably running on blur
  else {
    // If the source input is blank, our value should be too
    if (autocompleteInput.value == ''){
      autocompleteValueInput.value = ''
      autocompleteValueInput.setAttribute("data-text", '')
    }
    // If the value is not blank and doesn’t match the stored data-text, then the user
    // must have typed something in the autocomplete without picking an option. Therefore we
    // need to store the current typed text.
    else if (autocompleteInput.value != autocompleteValueInput.getAttribute('data-text') ){
      autocompleteValueInput.value = autocompleteInput.value
      autocompleteValueInput.setAttribute('data-text', autocompleteInput.value)
    }
  }

  if (this.hasOnConfirmExtra){
    onConfirmExtra(selected)
  }

 };

// Extract data attributes from select options
const enhanceSelectOption = (option) => {
  return {
    name: option.label,
    value: option.value,
    ...(option.getAttribute('data-synonyms') ? { synonyms: option.getAttribute('data-synonyms').split('|') } : {}),
    ...(option.getAttribute('data-append') ? { append: option.getAttribute('data-append') } : {}),
    ...(option.getAttribute('data-hint') ? { hint: option.getAttribute('data-hint') } : {}),
    boost: (parseFloat(option.getAttribute('data-boost')) || 1)
  }
}

const setupAutocomplete = (component) => {

  // Locate the elements
  const selectElement = component.querySelector('select')
  const inputElement = component.querySelector('input')

  // We might be enhancing a select or an input
  const elementType = (selectElement) ? 'select' : 'input'
  const element = selectElement || inputElement || false
  const id = element.id

  // Get config for autocomplete
  const autoselect          = element.getAttribute('data-autoselect') || false
  const classes             = element.getAttribute('data-classes') || false
  const describedByIds      = element.getAttribute('aria-describedby') || false
  const minLength           = element.getAttribute('data-min-length') || 2
  const placeholder         = element.getAttribute('data-placeholder') || false
  const showAllValues       = element.getAttribute('data-show-all-values') || false
  const showNoOptionsFound  = element.getAttribute('data-show-no-options-found') || true
  const showSuggestions     = element.getAttribute('data-show-suggestions') || false
  const hasOnConfirmExtra   = element.getAttribute('data-on-confirm-extra') || false

  // Default value should be set to '' if there's no item or else the autocomplete will display the
  // initial value of the select 'please select'
  const defaultValue               = element.getAttribute('data-value') || ''

  let values                = JSON.parse(element.getAttribute('data-autocomplete-values') || "[]")

  // If the enhanced element has aria-describedBy, grab the description to pass
  // to the autocomplete
  let describedBy = null
  if (describedByIds){

    // Can be an array where the field is in error
    let describedByIdsArray = describedByIds.trim().split(' ')
    describedBy = describedByIdsArray.map(describedById => {
      let innerText = document.getElementById(describedById).innerText
      // Make sure each item ends in a full stop.
      if (!innerText.endsWith(".")){
        innerText = `${innerText}.`
      }
    }).join(' ')
  }

  // If enhancing a select and values not provided, fall back to options from select
  if (!values.length && elementType == 'select'){
    let selectOptions = Array.from(selectElement?.options)
      // Remove empty or disabled select options
      .filter(option => {
        if (option.disabled || option.label == "") return false
        return true
      })

    // Extract values from data attributes in each option
    values = selectOptions.map(option => enhanceSelectOption(option))
  }

  if (!values || values.length == 0){
    console.log(`Autocomplete error: no values found for ${element?.id}`)
  }

  const describedByHint = () => {
    return `${describedBy} When autocomplete results are available use up and down arrows to review and enter to select. Touch device users, explore by touch or with swipe gestures.`
  }

  const filter = (query, populateResults) => {
    let results = autocompleteSort(query, values)

    // If in suggestions mode we don’t want to show a 'suggestions' banner when there are no results
    if (showSuggestions){
      if (results.length == 0) component.classList.add('app-autocomplete--with-suggestions-no-results')
      else {
        component.classList.remove('app-autocomplete--with-suggestions-no-results')
      }
    }

    populateResults(results)
  }

  // Alternate strings to use when in suggestions mode
  const suggestionNoResults = () => 'No suggestions found. Enter your own answer'
  const suggestionStatusNoResults = () => "No suggestions found"

  let autocompleteOptions = {
    id,
    name: element.name,
    templates: {
      inputValue: valueForInput,
      suggestion: menuResultItem
    },
    ...(defaultValue ? { defaultValue } : {}),
    onConfirm,
    autoselect,
    minLength,
    placeholder,
    showAllValues,
    showNoOptionsFound,
    source: filter,
    ...(describedBy ? { tAssistiveHint: describedByHint } : {}),
    ...(showSuggestions ? { tNoResults: suggestionNoResults } : {}), // conditional
    ...(showSuggestions ? { tStatusNoResults: suggestionStatusNoResults } : {}), // conditional
    hasOnConfirmExtra
  }

  // Select mode commented out, because of bug https://github.com/alphagov/accessible-autocomplete/issues/495 - where the select's default 'Please select' would get pre-filled as if it's a valid option, and then render as an option when you focus the field.

  // Have tried using js to clear the input, but this expands the menu and it can't then be collapsed. By avoiding the enhanceSelectElement entirely, the result is more usable.

  // if (selectElement){
  //   accessibleAutocomplete.enhanceSelectElement({
  //     selectElement: element,
  //     ...autocompleteOptions
  //   })
  // }
  // else if (inputElement){

    const autocompleteContainer = document.getElementById(`${element.id}-autocomplete-container`)

    // Because of the govuk macros, the container for the autocomplete is initially
    // placed _after_ the input. We now move the container within the input container.
    const inputFormGroup = autocompleteContainer.previousElementSibling
    if (inputFormGroup.contains(element)) {
      inputFormGroup.appendChild(autocompleteContainer)
    }

    accessibleAutocomplete({
      element: autocompleteContainer,
      ...autocompleteOptions
    })
  // }

  // Remove the original input
  element.remove()

  // If there should be a default value, set this manually after the autocomplete input is
  // created. This avoids the issue documented at https://github.com/alphagov/accessible-autocomplete/issues/424
  if (defaultValue){
    document.getElementById(id).value = defaultValue
  }

}

const initAutocompletes = () => {
  const allAutocompleteElements = document.querySelectorAll('[data-module="app-autocomplete"]')
  allAutocompleteElements.forEach(element => setupAutocomplete(element))
}

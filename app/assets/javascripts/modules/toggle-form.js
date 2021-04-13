(function (Modules) {
  'use strict'

  Modules.ToggleForm = function () {
    this.start = function ($el) {
      const toggleSelector = '.js-toggle'

      $el.on('click', toggleSelector, toggle)

      function toggle (event) {
        $el.find('.js-hidden-form').show()
        $el.find('.js-hide-on-toggle').hide()

        event.preventDefault()
      }
    }
  }
})(window.GOVUK.Modules)

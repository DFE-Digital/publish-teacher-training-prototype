/* global $ */

;(function (global) {
  'use strict'

  const GOVUK = global.GOVUK || {}
  GOVUK.Modules = GOVUK.Modules || {}

  GOVUK.Modules.CopyContent = function () {
    this.start = function (element) {
      element.on('submit', copyContent)
      prepareSelectOptions()

      function prepareSelectOptions () {
        element.find('select option').each(function () {
          const option = $(this)
          const v = option.attr('value')

          // Remove options that have no saved data yet
          if (!Object.keys(data).some(function (k) { return ~k.indexOf(v) })) {
            option.remove()
          }
        })

        if (element.find('select option').length === 1) {
          element.find('.js-cant-copy').show()
        } else {
          element.find('.js-can-copy').show()
        }
      }

      function copyContent (evt) {
        evt.preventDefault()
        const code = element.find('select').val()
        const copied = []

        $('.form-control').each(function () {
          const field = $(this)
          const fieldType = this.id.slice(4)
          const newValue = data[code + fieldType]

          if (newValue) {
            field.val(newValue)
            copied.push(field.parents('.form-group').find('label').text())

            // var $codemirror = field.nextAll('.CodeMirror')[0].CodeMirror;
            // $codemirror.getDoc().setValue(newValue);
          }
        })

        $('.multiple-choice input').each(function () {
          const field = $(this)
          const fieldType = $(this).attr('name').slice(4)
          const newValue = data[code + fieldType]

          if (newValue === field.attr('value')) {
            field.prop('checked', true)
            copied.push('Course length')
          }
        })

        showWhatCopied(copied)
      }

      function showWhatCopied (copied) {
        if (copied.length === 0) {
          element.find('.js-success-copy').hide()
          element.find('.js-error-copy').show()
        } else {
          const $ul = $('<ul class="govuk-list govuk-!-margin-bottom-0">')
          const $whatCopied = element.find('.js-what-copied')

          for (let i = 0, l = copied.length; i < l; i++) {
            $ul.append('<li>' + copied[i] + '</li>')
          }

          $whatCopied.empty().append($ul)
          element.find('.js-success-copy').show()
          element.find('.js-error-copy').hide()
        }
      }
    }
  }

  global.GOVUK = GOVUK
})(window)

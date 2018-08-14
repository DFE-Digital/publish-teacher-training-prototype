/* global $ */
/* global GOVUK */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  GOVUK.modules.start();

  $(function(){
    var charCount = new GOVUK.CharCount();
    charCount.init({
      selector: 'js-char-count',
      wordCount: true
    })

    $('textarea').each(function() {
      var $textarea = $(this);

      var simplemde = new SimpleMDE({
        element: $(this).get(0),
        hideIcons: [
          'bold',
          'italic',
          'heading',
          'image',
          'help',
          'quote'
        ],
        spellChecker: false,
        status: [ {
          className: "trigger",
          onUpdate: function(el) {
            // Make GOV char count work
            $textarea.blur();
          }
        }],
        forceSync: true,
        styleSelectedText: false
      });
    });
  });

  // Use GOV.UK shim-links-with-button-role.js to trigger a link styled to look like a button,
  // with role="button" when the space key is pressed.
  GOVUK.shimLinksWithButtonRole.init()

  // Show and hide toggled content
  // Where .multiple-choice uses the data-target attribute
  // to toggle hidden content
  var showHideContent = new GOVUK.ShowHideContent()
  showHideContent.init()
})

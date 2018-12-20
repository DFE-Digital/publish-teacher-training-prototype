/* global $ */
/* global GOVUK */

// Warn about using the kit in production
if (window.console && window.console.info) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
}

$(document).ready(function () {
  //GOVUK.modules.start();

  $(function(){
    var charCount = new GOVUK.CharCount();
    charCount.init({
      selector: 'js-char-count',
      wordCount: true
    })

    // $('textarea').each(function() {
    //   var $textarea = $(this);
    //
    //   var simplemde = new SimpleMDE({
    //     element: $(this).get(0),
    //     autosave: {
    //       enabled: true,
    //       delay: 1000,
    //       uniqueId: $textarea.attr('id')
    //     },
    //     hideIcons: [
    //       'bold',
    //       'italic',
    //       'heading',
    //       'image',
    //       'help',
    //       'quote'
    //     ],
    //     spellChecker: false,
    //     status: [ {
    //       className: "trigger",
    //       onUpdate: function(el) {
    //         // Make GOV char count work
    //         $textarea.blur();
    //       }
    //     }],
    //     forceSync: true,
    //     styleSelectedText: false
    //   });
    // });
  });
  window.GOVUKFrontend.initAll()
})

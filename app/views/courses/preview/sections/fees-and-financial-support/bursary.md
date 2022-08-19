You’ll get a bursary of £{{ course.bursaryAmount | numeral('0,0') }} if you have {{ course.bursaryFirstLineEnding }}{{ "." if course.bursaryRequirements.length == 1 }}

{% if course.bursaryRequirements.length > 1 %}
{% for requirement in course.bursaryRequirements %}
- {{ requirement }}
{% endfor %}
{% endif %}

You do not have to apply for a bursary - if you’re eligible, you’ll automatically start receiving it once you begin your course.

You may be eligible for a [loan while you study](https://getintoteaching.education.gov.uk/funding-my-teacher-training/tuition-fee-and-maintenance-loans).

Find out about financial support if you’re from [outside the UK](https://www.gov.uk/government/publications/train-to-teach-in-england-non-uk-applicants/train-to-teach-in-england-if-youre-a-non-uk-citizen#rate).

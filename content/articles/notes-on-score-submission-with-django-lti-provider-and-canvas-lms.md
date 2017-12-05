---
title: "Notes on score submission with django-lti-provider and Canvas LMS"
date: "2017-12-05"
draft:  true
type: "post"
author_name:  "Nik Nyby"
author_url: "https://ctl.columbia.edu/about/team/nyby/"
lede: "This post describes some challenges and guidelines to be aware of when integrating a Django application with Canvas."
poster: ""
poster_sourceurl: ""
poster_source: ""
topics: 
- Research and Development
tags: ["python", "django", "lti"]
---

[django-lti-provider](https://github.com/ccnmtl/django-lti-provider)
is a Python library for integrating Django apps with an
[LTI](http://www.imsglobal.org/activity/learning-tools-interoperability)
consumer like
[Canvas](https://www.canvaslms.com/). `django-lti-provider` uses
[pylti](https://github.com/mitodl/pylti) to make LTI oauth
requests. The [lti](https://github.com/pylti/lti) library could also
be used for this same purpose.

django-lti-provider has
[documentation](https://github.com/ccnmtl/django-lti-provider#documentation)
on how to set everything up in Django, but I want to document a few
challenges I ran into when trying to get grade submission to Canvas
working.

You need to learn the Canvas interface and its concepts in order to
figure out where you're going to integrate the tool. Integration can
be done in Canvas's rich-text editor by defining a toolbar button, and
then allowing an asset's iframe to be embedded in the Canvas
content. This is a great method for its flexibility, but keep in mind
that the LTI authentication step won't occur on the content you
embed. The content author will be authenticated when they click the
toolbar button, but the student viewing the content won't be. So, if
you're expecting to do [grade passback](https://canvas.instructure.com/doc/api/file.assignment_tools.html), 
this method isn't a good
option. For my purposes, I ended up using Canvas's Assignment model and
connecting my tool to it using the External Tool option. Now, when a
student views the assignment, a POST request is made to my tool
containing auth credentials for automatic authentication.

Also when you're developing, keep in mind that PyLTI doesn't yet give
much detail about why a score submission request failed. So if you see
`django-lti-provider` displaying a "Post grade failed" error, add the
pylti logger to your local_settings.py and look at the actual response
that Canvas gave:

```
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'pylti': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'DEBUG'),
        },
    },
}
```

There are a few scenarios I've found that cause this to fail:

* The score isn't a number between 0 and 1.
* The assignment doesn't have any number of points set.
* You're an instructor, not a student. For this, Canvas will say:
  Invalid sourcedid.
* You removed your tool from Settings -> Apps -> External Apps and
  submitted a request to an Assignment you made before you removed the
  tool.

I expect that we'll improve the behavior of `django-lti-provider` and
PyLTI to make them easier to use, and more aware of these scenarios.

---
title: "How to mock non-standard authentication in a Django view test"
date: "2017-12-08"
type: "post"
author_name:  "Nik Nyby"
author_url: "https://ctl.columbia.edu/about/team/nyby/"
lede: "Ideally when making automated tests, you don't have to mock anything. You just test exactly what would be executed in production. Some scenarios make that a challenge, though. What if you're testing a view that relies on an external authentication service, like an LTI server?"
poster: "poster-mock-lti-auth.jpg"
poster_sourceurl: "https://www.instagram.com/lilothehusky/"
poster_source: "Lilo The Husky"
topics: 
- Research and Development
tags: ["python", "django", "lti", "testing"]
---

Ideally when making automated tests, you don't have to
[mock](https://en.wikipedia.org/wiki/Mock_object) anything. You just test exactly what would be
executed in production. Some scenarios make that a
challenge, though.  What if you're testing a view that
relies on an external authentication service, like an LTI
server?

It's probably possible to automate an LTI server to run
alongside my tests, just like a test database. But that
adds a lot of complexity without adding much
value. Although that would make the test environment more
similar to the production one, right now I just want to be
able to detect regressions in my custom view.

I'm making a test for a view that uses
[LTIAuthMixin](https://github.com/ccnmtl/django-lti-provider/blob/master/lti_provider/mixins.py#L12)
from
the [django-lti-provider](https://github.com/ccnmtl/django-lti-provider)
library. If you look at LTIAuthMixin, you can see that all the
authentication is handled in `dispatch()`, a method that's called with
each HTTP method of a view object (`.get()`, `.post()`, `.put()`,
etc).  Python has a
[mock](https://docs.python.org/3/library/unittest.mock.html) library
that I've never really gotten a handle on. I thought I could use this
library here, and tried to mock out LTIAuthMixin's `dispatch()`
method. I was able to get my test to ignore LTI authentication, but I
couldn't figure out how to tell my mocked dispatch method to still
return the necessary response data given a request with an authed
user.  So I kept thinking of alternatives, keeping in mind that all I
cared about testing here is not even the view's `.get()` method, but
just `.get_context_data()`.

Through a combination of Django's [RequestFactory](https://docs.djangoproject.com/en/2.0/topics/testing/advanced/#django.test.RequestFactory)
and directly instantiating the view object, you can just
alter its attributes as necessary. So I made a plan to not
use Django's test client, and just do something like this:

``` 
# LoggedInTestMixin just sets self.u to an authenticated user.

class MyLTILandingPageTest(LoggedInTestMixin, TestCase):
    def setUp(self):
        super(MyLTILandingPageTest, self).setUp()
        self.factory = RequestFactory()
        self.g = GraphFactory(title='Quiz graph',
                              needs_submit=True)
        self.submission = SubmissionFactory(
            graph=self.g, user=self.u, choice=3)

     def test_get(self):
        request = self.factory.get('/lti/landing/')
        request.user = self.u
        view = MyLTILandingPage()

        ctx = view.get_context_data()
        self.assertEqual(ctx.get('submissions').count(), 1)
```

The test above runs into a few
errors. `self.lti` needs to be set,
and it also needs to respond to a `course_context()`
method call. This turned out to be sufficient:

```
class MockLTI(object):
    def course_context(self, request):
        return None
```

I also needed to attach the request object to the view
I've instantiated, so it knows who the current user is.
Here's the completed test:

```
def test_get(self):
    request = self.factory.get('/lti/landing/')
    request.user = self.u
    view = MyLTILandingPage()
    view.lti = MockLTI()
    view.request = request

    ctx = view.get_context_data()
    self.assertEqual(ctx.get('submissions').count(), 1)
    submission = ctx.get('submissions').first()
    self.assertEqual(submission.user, self.u)
    self.assertEqual(submission.choice, 3)
```

Now my test confirms that this view's context data
contains a graph submission connected to the authenticated
user. It doesn't matter to `get_context_data()` that
the user wasn't actually authenticated with LTI.

So, if there's a clearer, more idiomatic way to do this
using Python's standard mock library, maybe a way to
override `dispatch()` using mock, I'd like see some
examples.

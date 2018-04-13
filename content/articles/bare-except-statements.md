---
author_name: "Nik Nyby"
author_url: https://ctl.columbia.edu/about/team/nyby/
date: 2017-02-03
lede: "Bare except statements are a well-known anti-idiom in Python, and this post illustrates one example why that is."
poster:
poster_source: ""
poster_sourceurl: ""
tags: ["python"]
title: A reminder not to use bare except statements in Python
topics:
- Process
type: post
---

Using a bare `except:` statement is "almost never a good idea"
according to Python's documentation:

> Because `except:` catches all exceptions, including SystemExit,
> KeyboardInterrupt, and GeneratorExit (which is not an error and
> should not normally be caught by user code), using a bare `except:`
> is almost never a good idea. In situations where you need to catch
> all “normal” errors, such as in a framework that runs callbacks, you
> can catch the base class for all normal exceptions, Exception.
>
> -- <cite>https://docs.python.org/2/howto/doanddont.html#except</cite>

I want to go into more depth to show exactly what can happen with a
bare `except:`.  I wrote this code in 2015 when working on the E-WORTH
project:

    try:
        GoalCheckInResponse.objects.create_or_update(
            goal_setting_response=resp,
            defaults=updated_values)
    except:
        GoalCheckInResponse.objects.filter(
            goal_setting_response=resp,
        ).delete()

        updated_values.update({'goal_setting_response': resp})
        GoalCheckInResponse.objects.create(**updated_values)
                                                        

I remember that my intention here was along the lines of, "try to
create or update this response, but if anything goes wrong, it doesn't
matter what, just delete the response in question if it's there, and
make a new one." Sounds reasonable, right? I thought I was programming
cautiously and defensively here.

[Sentry](https://sentry.io) recently alerted us of an `IntegrityError` triggered in the
except stanza of this code. I did some debugging, trying to come up
with a unit test that reproduced this error. That's when I found that
the except part of this code was always being used, because the method
I wanted to call is [update_or_create()](https://docs.djangoproject.com/en/1.10/ref/models/querysets/#update-or-create),
and there is no `create_or_update()` in Django. Back then I was more
used to Rails than Django, so that explains the mistake. And this
would have been quickly caught by my unit tests if it wasn't inside a
try/except block that was hiding all exceptions.

---
author_name: "Anders Pearson"
author_url: https://thraxil.org/
date: 2016-10-24
lede: "At CTL, we've been using smoketest for several years now. It is a standard part of our stack now and has helped us prevent numerous issues from making it to production as well as simplified and sped up the identification and fixing of production environment issues."
poster: 
poster_source: ""
poster_sourceurl: ""
tags: ["testing", "django", "smoketests", "devops"]
title: Smoke(test)ing for Health
topics:
- Research and Development
type: post
---

In the quest for high quality, high reliability, and rapid development, one of the most powerful tools available to software developers is the automated test.

We have unit tests which test the functionality of individual components at a very low level, isolated from everything else.
These are run frequently during development and help us make changes to these individual components safely and quickly.

The limitation of unit tests is that they can't usually catch problems that arise when multiple components are combined.
For these cases, we write integration tests.
Integration tests ensure that all the pieces of the code we write are still connected and working together like we planned.
Integration tests run the gamut from "glorified unit tests" that run in the regular unit test environment, but string together a few components at a time, up to more thorough tests that run in a "production-like" environment with full databases, browser automation, etc.

A good deployment process makes sure that the unit tests and integration tests always get run (and pass) before the software makes it out to production.
Not every software development organization has completely gotten on board with this approach, but the benefits of unit testing, integration testing and automated tests as part of deployment are not exactly controversial anymore in the industry.

Unfortunately, this is often as far as software developers take their automated tests.
The software running in production may be monitored, either by watching log files or by periodically polling the site to make sure that it is responding to requests.
This will catch some problems, but frequently represents a large drop-off in thoroughness and automation compared to the previous stages of the software's lifecycle. 

A typical web application running in production has a lot of dependencies on other systems, and there are a lot of ways that things can break.
A database can crash, a filesystem can get corrupted, a new firewall rule can cut off access between the application server and the database, an access token for a third party application can expire, a sysadmin can inadvertently introduce a syntax error in a config file.
Any developer who has supported production systems for any length of time could list scenarios like that ad infinitum.

Back in the dark ages of software development, developers and operations were separate teams.
Developers would write and test the software, then "throw it over the wall" to operations, who were expected to run it, monitor it, and deal with whatever came up.
I believe that it was this separation that resulted in a lack of emphasis on testing past the point of deployment.
To developers it was "not my problem", while operations were really only able to treat the software as a black box.
This was a time of great frustration and conflict.
Now, of course, the "devops" movement has made great strides in breaking down this barrier and encouraged more cooperation between developers and operations. Making sure the code we write runs properly in production is a responsibility shared by everyone.

However, testing approaches have been slow to catch up with this new world.

The class of tests that I would like to see get more attention are "smoke tests".
A smoke test is a test that is designed to run within the actual production environment to help verify that both the production environment itself and the software's integration into that environment are functioning properly.

For Django, we've developed a library, [django-smoketest](https://github.com/ccnmtl/django-smoketest), which makes it as straightforward to write and run smoketests for a Django application as it is to write unit tests.

Once `django-smoketest` is installed, a developer can add a `smoke.py` file to any other module within the application.
Test classes that follow the same conventions as standard python `unittest` tests (`test_` methods, various `asserts`, etc.) will then be auto-detected and run as expected when a client hits the smoketest endpoint. The response will then be either a `200 OK` (with some information about how many smoketests ran, timing, etc.) or a `500` (with information about which smoketests failed).

Eg, from the documentation, a simple smoketest to check that a model can be read from and written to the database might look something like this:

```
from smoketest import SmokeTest
from myapp.models import FooModel


class DemoTest(SmokeTest):
    def test_foomodel_reads(self):
        """ just make sure we can read data from the db """
        cnt = FooModel.objects.all().count()
        self.assertTrue(cnt > 0)

    def test_foomodel_writes(self):
        """ make sure we can also write to the database
        but do not leave any test detritus around. Smoketests
        are automatically rolled back.
        """
        f = FooModel.objects.create()
```

Developers can very easily add additional smoketests to their application wherever they would like to assert something about the production environment.
I've written smoketests to check that the application can write to a required temp directory, that there is a minimum amount of disk space available for that temp directory, that the Django settings contained certain expected optional settings values, that a specific version of `ffmpeg` was available on the server and executable, that certain DNS names were resolving, and that AWS credentials existed and were valid.

With `django-smoketest` in place, it's simple to add a final step to the deployment process, immediately after the application is running in production that hits the smoketest endpoint and gets a nice confirmation that everything is running properly (and initiate a rollback if it isn't).
The smoketest endpoint also becomes a natural target for monitoring the production system.
Eg, we use a tool called [chimney](https://github.com/thraxil/chimney/) to poll the smoketest endpoints on all of our applications and log the results for alerting.
Then, if a smoketest fails, not only do we know that there is a problem, but the detailed output from the smoketest can quickly tell us exactly what the problem is (database connectivity, disk issue, etc.)

We've been using `django-smoketest` for several years now (though we have only considered the API stable enough to be considered 1.0 for about six months).
It is a standard part of our stack now and has helped us prevent numerous issues from making it to production as well as simplified and sped up the identification and fixing of production environment issues.

[Note: One area where this approach to testing is actually common is with container orchestration and cluster management.
Eg, [Kubernetes](https://kubernetes.io/) expects to be able to run a [health check](http://kubernetes.io/docs/user-guide/liveness/) on the containers that it runs and implementing a `/healthz` endpoint that does something very similar to `django-smoketest` is a common approach.
Similarly, [Prometheus](https://prometheus.io/), expects to poll endpoints that produce a similar sort of output (but including more performance metrics).]

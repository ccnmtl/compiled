---
author_name: "Zarina Mustapha"
author_url: https://ctl.columbia.edu/about/team/mustapha/
date: 2016-10-04T12:15:58-04:00
lede: "In second part of a the MATCH and PASS sustainability summary, we outline the solutions and development of the migration process, from framework choices for the sites to packaging JavaScript interactives."
poster: poster-match-pass02.jpg
poster_source: 10 Cats on YouTube
poster_sourceurl: https://www.youtube.com/watch?v=hq2jVB9OGRo
tags: ["hugo", "webpack", "javascript", "html5"]
title: "Massing and Patching of MATCH and PASS: Migration Process"
topics:
- Process
type: post
---

*This is the second of a three-part summary on the sustainability project of MATCH and PASS.*

In the first part of this summary,
“[Towards Sustainability](/articles/match-pass-migration-01/)”,
we recounted the circumstances that drove the decision to migrate MATCH and
PASS to an open and sustainable framework. We also listed a few questions that
we must address before moving forward with the implementation. Here, we’ll
outline the solutions and development of the migration process.

## Openness and anonymity

First, we needed to define what it meant to have the MATCH and PASS completely
“open” to all learners, and what the corollaries of this “openness” were.

MATCH and PASS modules would be independently linkable, and offered as free and
open educational resources through external learning management systems. No
user data would be collected and no reports would be generated in these two
sites. Anyone can access these sites from anywhere using any device and
platform.

Corollaries of openness that surfaced immediately were those involving
accessibility (a11y), device and platform compatibilities. The original
learning modules were tested on multiple browsers, but they were not optimized
for tablets, smartphones, and assistive technologies (AT). Many of the
JavaScript interactives required generous screen real estate to work properly;
therefore, we needed to either redesign or accommodate with graceful
degradation.

The user story and module narratives might be affected too. The original
quizzes and JavaScript interactives provided instant feedback to guide the
learners as they progress through the modules. In the anonymous, open and
modular environment, however, we must rethink how this guiding feedback and
reporting would take place, and if any revision in content that we implemented
would affect learners’ experience.

In addition to opening the learning modules to the world, we’ve placed all the
source codes and files for these two sites and the associated interactives in
public repositories on Github.

## Framework

Since MATCH and PASS have reached the final year of the HRSA grant funding, it
was crucial for us to keep the maintenance cost for these sites at a minimum.
While Pagetree is stable and robust, we would have to perform necessary
periodic maintenance to keep the underlying infrastructure current and secure.
This recurring cost will be required ad infinitum.

In addition to cost, we wanted a new framework that:

* is lightweight with low technology stack and doesn’t require a database,
* separates content from templates,
* supports version control tools to track changes to the content and codes, and allows rollbacks,
* allows content editing with Github interface, and
* outputs static content that can be hosted anywhere.


We’ve defined
[static content](https://en.wikipedia.org/wiki/Static_web_page)
as HTML5, images, and JavaScript files delivered to the user exactly as they
are stored in the file system. The dynamic interactions on the web pages are
all on the client side.

{{< figure src="/img/assets/hugo-logo.png" class="pull-right" alt="Logo linking to Hugo site." link="http://gohugo.io" >}}

We chose Hugo as the framework for these sites. [Hugo](http://gohugo.io/) is a
general-purpose, open-sourced static site generator that renders HTML files as
output from content files and layout templates. The framework doesn’t rely on a
database; all the content is in simple text files with Markdown or limited HTML
formatting that can be revised using any text editing tool. Hugo met the
aforementioned requirements, and we considered it a fit for MATCH and PASS.
We’ve also used Hugo for other projects at CTL, such as this blog, with great
success.

All the source code for MATCH, PASS, and the JavaScript interactives are on
Github. We use [Jenkins](https://jenkins.io) to manage deployment and
continuous integration. The HTML and other output files are hosted on Amazon
[Simple Storage Service](https://aws.amazon.com/s3/).

The following diagram summarizes the migration process of MATCH and PASS into
the new framework:

{{< figure src="/img/assets/match-pass-export-flow.png" class="text-center" alt="This diagram summarizes the migration process of MATCH and PASS into the new framework." >}}

## JavaScript interactives

First, we isolated the JavaScript interactives from the Pagetree infrastructure
to convert them into standalone and stateless interactives. Parts of the
content required rewriting to preserve coherence of context as these
interactives exist independently.

Our developer, [Susan Dreher](https://ctl.columbia.edu/about/team/dreher/),
conducted extensive research on bundling, implementing and disseminating
JavaScript interactives for these projects. In her CompilED posts, Susan
detailed her
[strategy for bundling these interactives](/articles/standalone-interactives/)
using [Webpack](http://webpack.github.io) and [NPM](https://www.npmjs.com), and
[testing these unit](/articles/standalone-interactives-testing/)
before dissemination.

{{< figure src="/img/assets/interactives-ctl-logo.png" link="https://interactives.ctl.columbia.edu" class="pull-right" alt="Logo linking to Interactives@CTL." >}}

These JavaScript interactives are modular, reusable, and can be embedded
anywhere using the `iframe` element. They require no more than a web server.
They are also available on
[Interactives@CTL](https://interactives.ctl.columbia.edu),
a larger collection of our efforts to build interactive widgets with a minimal
technology stack.

## Content exporter

We’ve left out multiple-choice quizzes in MATCH and PASS as part of the core
content that included text and images. This was because no data would be
collected from these quizzes, and they were narrative tools instead of
evaluative devices. All quizzes were converted into client-side JavaScript
rhetorical quizzes.

Susan and I wrote a
[Python exporter](https://github.com/ccnmtl/pass/blob/master/pass_app/main/management/commands/export_markdown.py)
that converted the core content from Pagetree database to Markdown files (`.md`) formatted for Hugo. Codes embedding the JavaScript interactives and videos were also included in the exporter.

## Reporting

We’ve decided that all assessment and evaluative feedback be conducted outside
of the MATCH and PASS learning modules. This approach would allow the
instructors to use any LMS platform to assess their students independently.

JavaScript interactives and quizzes still offer the user instant feedback, but
only for the page’s lifetime. We’ve replaced the backend storage mechanisms
with the ability to save results locally via printing or saving off to PDF.

## Videos

All the videos in Pagetree MATCH and PASS are mp4 videos streaming from an H264
server through the [Flowplayer](https://flowplayer.org/) player. While these
videos are available without authentication, they are difficult to search for
outside the learning modules. The websites’ traffic data will be recorded using
[Google Analytics](https://www.google.com/analytics/).

We’ve decided to make these videos publicly available as standalone instances
on YouTube, complete with more description and information to connect back to
the learning modules.

## Responsiveness and accessibility

With openness and sustainability come interesting challenges such as
responsiveness and improving the sites’ accessibility (a11y). We have committed
ourselves to good faith effort in striving for comparable compliance to
[Section 508 Accessibility Program](https://www.section508.gov/),
and in making sure that both sites and all the standalone JavaScript
interactives perform well on all devices including assistive technologies.

I’ve written about
[making the main sites responsive and accessible](/articles/deconstructing-accessibility/)
in my earlier CompilED post.

Many of the JavaScript interactives, however, were not designed with
accessibility or responsiveness in mind. They require screen real-estate, and
the user interactions on screen are rather extensive. We’ve decided to keep the
constraints on screen size and user interactions, and placed ample notices and
alerts whenever those limitations are not met. This is part of our continuing
effort to comply with a11y, and we will return to each interactive in the
future to make further improvements.

## Copyrights and licensing

Finally, the openness of these learning modules necessitates copyrights and
licensing information for both content and code. The licenses will allow
the MATCH and PASS content and interactives to be used as open educational
resources domestically and internationally.

The following diagram summarizes the content pieces put together in the new
framework:

{{< figure src="/img/assets/complete-puzzle-match-pass.png" class="text-center" alt="This is a screenshot of MATCH website." >}}

<hr style="width: 70%;" />

In the third part of this summary, “Lessons Learned”, we’ll share what we’ve
learned and understood from migrating projects of this size with multiple
moving components.
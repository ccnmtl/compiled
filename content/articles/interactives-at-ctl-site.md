---
author_name: "Zarina Mustapha"
author_url: https://ctl.columbia.edu/about/team/mustapha/
date: 2016-09-09
lede: "This summer, we revisited client-side interactives that we built for online learning web applications, and bundled them using Webpack as JavaScript packages for open and wider distribution. We are proud to announce that we now have a portfolio site to showcase about a dozen standalone interactives that we've authored."
poster: poster-interactives-at-ctl.jpg
poster_source: ""
poster_sourceurl: ""
tags: ["webpack", "javascript", "html5", "interactives"]
title: "Announcing... Interactives@CTL"
topics:
- Projects
type: post
---

This summer, we revisited the client-side interactives that we built for two online-learning projects—[MATCH](https://match.ctl.columbia.edu/) and [PASS](https://pass.ctl.columbia.edu/)—and bundled them using [Webpack](http://webpack.github.io/) as JavaScript packages for open and wider distribution. We are proud to announce that we now have a portfolio site, __[Interactives@CTL](https://interactives.ctl.columbia.edu/)__, to showcase about a dozen standalone interactives that we've authored so far. These interactives are modular, reusable, and can be embedded anywhere using the `iframe` code that we provide.

Here is an example of an interactive from the portfolio, embedded easily in this post:

<iframe src="https://interactives.ctl.columbia.edu/lib/speechassessment/" frameborder="0" width="690" height="600" style="border: 1px solid #ccc; margin: 10px 0 20px 0;">
</iframe>

At CTL, we often develop JavaScript interactives for richer and active engagement in many of of our online learning applications. These interactives are implemented in our own content management tool, [Pagetree](https://github.com/ccnmtl/django-pagetree), a Django-based framework written in Python. Even though most of them can run independently, they are often used in context of the learning applications and require user authentication. Our clients often want use these activities on other platforms such as blogs, wikis, LMS, and even MOOCs.

In May, CTL developer [Susan Dreher](https://ctl.columbia.edu/about/team/dreher/) began to package the interactives for MATCH and PASS, two online learning websites for pediatric dentists and pre-doctoral dental students. The bundled JavaScript activities are accessible on these sites and on Interactives@CTL.

The following CompilED blog posts by Susan detail the research and development behind packaging and testing these standalone interactives:

1. [Packaging JavaScript Interactives](/articles/standalone-interactives/)
2. [Testing JavaScript Interactives](/articles/standalone-interactives-testing/)

Interactives@CTL is part of our effort to build interactive widgets with a minimal technology stack. These interactives are implemented without database or backend engine, and requires no more than a webserver.

We hope to showcase more of our work on Interactives@CTL in the future, and share our experience with a wider audience.
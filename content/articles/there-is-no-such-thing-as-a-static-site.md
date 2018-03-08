---
author_name: "Anders Pearson"
author_url: https://thraxil.org/
date: 2017-01-24
lede: "The expectation that all basic webservers will behave similarly with the same static content has some limitations. Between Apache, Nginx, and S3/Cloudfront, there are plenty of opportunities to discover discrepancies around directory indexing, authentication, 404 handling, compression, and caching. Static site generators are a tool, not a silver bullet."
poster: poster-no-such-thing-static.jpg
poster_source: "Sean McGrath"
poster_sourceurl: "https://www.flickr.com/photos/mcgraths/235112299/"
tags: ["hugo", "static"]
title: There Is No Such Thing as a Static Site
topics:
- Research and Development
type: post
---

There really is no such thing as a "static" site.

I know that static site generators like [Jekyll](https://jekyllrb.com/),
[Hugo](https://gohugo.io), etc. are getting a lot of attention in general, and
here at the Center as well. This blog that you are reading right now is
[built with Hugo](https://compiled.ctl.columbia.edu/articles/rebuilding-compiled/) and
it's become one of our go-to tools. So don't interpret this as me being
anti-static site. I've just been writing a few things lately and wanted to
include a similar digression about the terminology in each of them so I decided
to spin it off into its own post.

Even without getting into how client-side scripting can enable quite a bit of
"dynamic" behavior, what we think of and refer to as "static" is always a bit
of a lie. Maybe not a full-scale "alternative fact", but at least slightly
misleading.

In order for a web page or image or file to make it to the user's browser, some
code has to execute on a web server somewhere. There is software running that
is listening on the port, gets the request from the browser, parses it,
generates a response, and sends that response back to the browser.

When we talk about "static" sites, we mostly just mean that the "generates a
response" step in the above sequence is very, very simple. Generally, it is
something along the lines of "look for a file in a particular directory that
matches the path that the browser requested and read it off the disk". In
contrast a "dynamic" site running [Django](https://djangoproject.com/) or
[Drupal](https://www.drupal.org/) might execute a few stages of Python or PHP
code, make some database queries, use the results of those queries to update
some other tables in the database, then fill in some templates with more values
from the database and finally return that HTML that it generated.

When we build "static" sites, we just take advantage of the fact that basic
webserver software like [Apache](https://www.apache.org/) or
[Nginx](https://www.nginx.com/) has a default, built-in behavior of "look for a
file in a particular directory that matches the path that the browser requested
and read it off the disk". So if everything is pre-generated and written out to
the right place, we can just use that out of the box functionality and not have
to have anything custom running there. It also means that we could easily move
that content to another webserver and be fairly confident that the default
behavior there is going to be the same. This allows us to shift some of the
hosting responsibility away to a commodity service. In particular, Amazon's
[S3](https://aws.amazon.com/s3/) and
[Cloudfront](https://aws.amazon.com/cloudfront/) can provide that functionality
for us reliably and inexpensively. Once the content has been generated and
placed in the right spot, there aren't many moving parts, so there's not much
that can break.

The expectation that we have that all basic webservers will behave similarly
with the same static content has limits though. Between just Apache, Nginx, and
S3/Cloudfront, you have plenty of opportunities to discover discrepancies
around directory indexing, authentication, 404 handling, compression, and
caching. For a simple site, those are likely not going to be an issue, but I've
run into every single one of them at one point or another.

Again, I'm not against static sites, but I would like to remind everyone that
static site generators are a tool, not a silver bullet.

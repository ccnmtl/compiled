---
author_name: "Nik Nyby"
author_url: https://ctl.columbia.edu/about/team/nyby/
date: 2017-04-12
lede: "I mentioned in a previous post that we're working on interactive e-book for the Women on the Road to Health project. Here I'll outline a simple system for authoring ePub 3 content."
poster: 
poster_source: ""
poster_sourceurl: ""
tags: ["epub", "working notes"]
title: Outline of an ePub authoring system
topics:
- Research and Development
type: post
---

I mentioned in
a [previous post](/articles/sequenced-activies-in-javascript/) that
we're working on interactive e-book for the Women on the Road to
Health project. Here I'll outline a simple system for authoring ePub 3
content.

There are plenty of tools you can use to help you make an ePub 3
bundle. Here's a list of some of them:
http://www.daisy.org/daisypedia/tools-creating-epub-3-files

As I mentioned in the post linked above, I've been solving problems in
the most basic way possible and then working up from there. Now that I
need to deal with about 50 pages of content in our ePub, I imagined
that a script in the style of a static site generator would be
useful. There are two reasons for this: In an ePub, the table of
contents needs to be in sync with the content, and each page in an
ePub has its own xhtml file.

[build_tree.py](https://github.com/ccnmtl/worth3/blob/master/scripts/build_tree.py)
reads the data in
[tree.json](https://github.com/ccnmtl/worth3/blob/master/scripts/tree.json) 
and applies this to the templates in the
[templates/](https://github.com/ccnmtl/worth3/tree/master/scripts/templates) 
directory, then writes the rendered templates into the EPUB
directory. Right now, the "template rendering" process is just a
string replace:

    newpage.write(page_t.replace('TITLE', page['title']))
    
Currently, tree.json only contains the structure of the book and the
title of each page. I'm expecting to adapt the data model to our
content, with the ability to specify video pages, interactives,
etc. The ePub we're making doesn't actually contain many pages of
multi-paragraph text, but this system could definitely work for more
traditional ePubs like that.

As I work through the [EPUB 3 Best Practices book](http://shop.oreilly.com/product/0636920024897.do)
I'll be adding improvements along the way.

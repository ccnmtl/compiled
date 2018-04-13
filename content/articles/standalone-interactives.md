---
author_name: "Susan Dreher"
author_url: https://ctl.columbia.edu/about/team/dreher/
date: 2016-05-31
lede: "At CTL, client-side interactives enrich many of our serial-learning web applications. These discrete JavaScript blocks challenge students with quizzes, animations, case studies, calculators and games. Many of our interactives carry enough context to stand on their own statelessly. We recently explored ways to package these interactives for wider distribution."
poster: poster-webpack.jpg
poster_source: 10 Cats on YouTube
poster_sourceurl: https://www.youtube.com/watch?v=hq2jVB9OGRo
tags: ["javascript", "html5", "testing"]
title: Packaging JavaScript Interactives 
topics:
- Research and Development
type: post
---

## Background
At CTL, client-side interactives enrich many of our serial-learning web applications. These discrete JavaScript blocks challenge students with quizzes, animations, case studies, calculators and games. The goal is to transform a passive reading exercise into an active learning experience. The interactives encourage students to use higher-order skills to deepen understanding and aid retention.

Our in-house content management tool [Pagetree](https://github.com/ccnmtl/django-pagetree) provides the framework for our interactives. The JavaScript blocks hook into the content hierarchy using well-known patterns. The Pagetree infrastructure is a powerful and cost-effective approach when user data must be collected and analyzed. But, many of our interactives carry enough context to stand on their own statelessly. Our clients often want to make this class of content available in blogs, wikis and social media. Our developers began exploring a way to make this happen years ago, but failed to find a reasonable solution. I was recently re-tasked with finding a way to make this happen.

## Research
Luckily, we're now not the only ones who want to organize, share and reuse JavaScript code. JavaScript build and release tools have matured and proliferated. [npm](https://npmjs.org) organizes code into packages, and offers a [repository](http://npmjs.org) for those packages. On install, npm downloads the package code and its dependencies. [Webpack](http://webpack.github.io/) is a module bundler that can package both scripts and other assets such as stylesheets and images. [Browserify](http://browserify.org/), [Require.js](http://requirejs.org/), [jspm.io](http://jspm.io/), [rollup.js](http://rollupjs.org/) are similar module bundlers. The [Web Components standard](http://webcomponents.org/presentations/web-components-the-future-is-here/) offers a way "to create reusable web components that include both HTML and JavaScript." The choices are now overwhelming. Here are just a few comparisons to review: [1](http://www.slant.co/topics/1089/compare/~webpack_vs_browserify_vs_requirejs), [2](https://webpack.github.io/docs/comparison.html), [3](https://medium.com/@housecor/browserify-vs-webpack-b3d7ca08a0a9#.142du03jv).

In considering the options, I decided the Webpack module bundler was the best fit due to these winning features:

1. Custom loaders. Our interactives need static data, images, stylesheets and clientside templates. The interactives rely on libraries like [jQuery](jquery.org), [Backbone.js](http://backbonejs.org/) and [Bootstrap](http://getbootstrap.com/). Webpack's custom loaders integrate all these things. A single line of code loads a json blob into a Backbone collection. Another line applies styles to the document. Easy.

2. Development server. Webpack includes a local server with hot reload capabilities. The bundle is rebuilt and reloaded in the web page as code and assets change.

3. One tool. Other tools require ancillary tools such as Grunt, Gulp, Bower and Babel to do all the things Webpack does. Dealing with just a single tool is quite appealing.

## Implementation
My [first implementation](https://github.com/ccnmtl/supportservices-pack) targeted an existing interactive in [PASS](http://pass.ccnmtl.columbia.edu), a website to educate pre-doctoral dental students about patient populations. The interactive demonstrates support services commonly available to older adults.

The code, templates and static assets transferred over directly. The [src/index.js](https://github.com/ccnmtl/supportservices-pack/blob/master/src/index.js) loads the required libraries based, applies the stylesheet and creates the view. The [webpack.config.js](https://github.com/ccnmtl/supportservices-pack/blob/master/webpack.config.js) governs how the various file types are loaded. 

### Package Structure
npm and Webpack do not dictate a standard package structure. [After a little research](http://stackoverflow.com/questions/5178334/folder-structure-for-a-node-js-project), I came up with this based on our needs.

```
  project  
  |-- dist  
  |   |-- bundle.js  
  |   |-- *.svg, *.eot, *.woff*, *.ttf  
  |-- node_modules  
  |-- src  
  |   |-- index.js  
  |   |-- app-specific.js  
  |-- static  
  |   |-- css  
  |   |-- img  
  |   |-- json  
  |-- test  
  |   |-- test.webpack.config.js  
  |   |-- model-test.js  
  |   |-- view-test.js  
  |   |-- view-test.html  
  |-- Makefile  
  |-- index.html  
  |-- package.json  
  |-- webpack.config.js  
```

### Makefile
[Anders](https://thraxil.org/), a senior developer here, composed Makefiles for our Django projects. I wanted to do the same here for consistency. The pack's [Makefile](https://github.com/ccnmtl/supportservices-pack/blob/master/Makefile) can build the bundle, run the dev server and publish the project. Per our team's standards, jshint and jscs are also run.

### Static Data
Many of our interactives rely on a database for static data. That data is usually fetched directly from the server and loaded into a Backbone collection. To replicate this flow, I generated a json file via Django's [dumpdata](https://docs.djangoproject.com/en/1.9/ref/django-admin/#dumpdata) method. The json file was then loaded into the Backbone collection.

## Summary
The interactive migration coalesced into a [published package](https://www.npmjs.com/package/supportservices-pack) with minimal pain. Our long-term goal is to create an interactives gallery to allow our work to be reviewed and embedded. For now, I'm on to a [more complex interactive migration](https://github.com/ccnmtl/dentalvisitactivity-pack) to validate this approach.

Look for a [second post](/articles/standalone-interactives-testing/) on composing and running unit tests and browser tests for a Webpack.

---
author_name: "Nik Nyby"
author_url: http://ctl.columbia.edu/about/team/nyby/
date: 2017-02-03
lede: "When I've found it necessary to make changes to the npm libraries I'm using in React, the process isn't well-documented and I've found some guidelines through trial and error."
poster: poster-react-branch.jpg
poster_source: ""
poster_sourceurl: ""
tags: ["javascript", "react"]
title: How to Branch React Libraries
topics:
- Research and Development
type: post
---

When I've found it necessary to make changes to the npm libraries I'm
using in React, the process isn't well-documented and I've found some
guidelines through trial and error. To start, note that npm parses
github repositories in `package.json`, and you can specify a branch with
`#`, like this:

    "react-grid-layout": "ccnmtl/react-grid-layout#dev",
    "react-player": "ccnmtl/react-player#new-vimeo-api",

Start with that, and then solve the problems as they come up. If you
get errors saying the module isn't found, it probably needs to be
built. Each node module is allowed to define its own build process,
and can rely on any number of dependencies and build tools, like
webpack, broccoli, babel, etc. I've been dealing with this in my own
Makefile:

    $(JS_SENTINAL): package.json
        rm -rf $(NODE_MODULES)
        npm install
        cd $(NODE_MODULES)/react-grid-layout && npm install && make build-js
        cd $(NODE_MODULES)/react-player && npm install && npm run build:webpack
        touch $(JS_SENTINAL)

So any time my dependencies get installed, we go through each forked
library's custom build process. I've found this pattern to be reliable
so far.

I'll admit that this configuration seems a little redundant. I'm
expecting things to change, either as the inevitable pace of
JavaScript/node.js progress sweeps along, or as I learn more about the
npm ecosystem. For example, could this be simpler if I was using yarn
instead of npm?

---
author_name: "Nik Nyby"
author_url: https://ctl.columbia.edu/about/team/nyby/
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

I'll admit that this configuration seems a little ad hoc. I'm
expecting things to change, either as the inevitable pace of
JavaScript/node.js progress sweeps along, or as I learn more about the
npm ecosystem. For example, could this be simpler if I was using yarn
instead of npm?

If your build is still failing, you might also need to give the
library's `.npmignore` file some attention. Library authors tend to add
the library's source directory to their `.npmignore` because it's not
necessary to distribute the sources when using pre-built dist
files. I've made the choice to build these libraries along with the
package that's using them, but you could just as well pre-build the
distribution files and commit the compiled code. I like to leave that
step up to the library authors, though, and it also creates unwieldy
diffs.

In react-player I have to remove `src` and `webpack.config.*.js` from its
`.npmignore`, and in react-grid-layout I've had to remove the `lib`
directory. Again, these are ad hoc solutions to a problem that's not
yet fully solved. The npm team gives a good overview of the state of
things, at least, as it was in 2014, in their blog post:
[npm and front-end packaging](http://blog.npmjs.org/post/101775448305/npm-and-front-end-packaging).

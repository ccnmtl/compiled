---
author_name: "Nik Nyby"
author_url: "https://ctl.columbia.edu/about/team/nyby/"
date: "2016-05-23"
lede: "In the past few years, a web standard called Content Security Policy has come up that allows web developers to restrict how media and code can be accessed on their website depending on where the assets are being served. GitHub and Mozilla both have further explanations of CSP."
poster: "poster-mediathread-extension.jpg"
topics: 
- Research and Development
tags: ["javascript", "browser-extensions", "mediathread"]
title: "Migrating Mediathread\u2019s Collection Bookmarklet to Browser Extensions"
type: "post"
---

In the past few years, a web standard called
[Content Security Policy](https://en.wikipedia.org/wiki/Content_Security_Policy)
has come up that allows web developers to restrict how media and code
can be accessed on their website depending on where the assets are
being served.
[GitHub](https://github.com/blog/1477-content-security-policy) and
[Mozilla](https://bugzilla.mozilla.org/show_bug.cgi?id=866522) both
have further explanations of CSP.

Part of our [Mediathread](http://mediathread.info/) application
involves collecting images, audio, and video files from around the web
and bringing them in to Mediathread for annotation or use in
compositions. We accomplished this by providing a bookmarklet that
looks for media on the user's web page and imports it into Mediathread
when the user selects it. As web sites implement CSP mechanisms, site
developers are given the choice, often chosen, of preventing external
JavaScript from getting executed, which disables our
bookmarklet. Flickr, Dropbox, and GitHub have already implemented
these mechanisms, preventing our collection bookmarklet from working
on these sites. The issue could theoretically be fixed if each of
these sites added Mediathread to their CSP whitelist. But that's too
much to expect, and they would also need to add a whitelist entry for
each Mediathread instance outside of Columbia University.

Bookmarklets have some [history](https://en.wikipedia.org/wiki/Bookmarklet#History)
on the web, and they've been around since the early 2000s. Sites like
[Delicious](http://del.icio.us/) and
[Instapaper](https://www.instapaper.com/) have used bookmarklets
as central tools to their services.

We decided to develop browser extensions for Chrome, Firefox, and
Safari to replace the bookmarklet. The JavaScript that runs in browser
extensions is considered privileged code that can't be disabled
outright via CSP.

The bookmarklet's code contains intricate logic for collecting
assets in site-specific ways. The bookmarklet's behavior can be
recreated in the extension using content
scripts. [Chrome](https://developer.chrome.com/extensions/content_scripts),
[Firefox](https://developer.mozilla.org/en-US/Add-ons/SDK/Guides/Content_Scripts),
and
[Safari](https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/InjectingScripts/InjectingScripts.html)
all have mechanisms for content scripts. Safari calls them injected
scripts. Because content scripts have access to the DOM, just like the
old bookmarklet code expects, I was able to adapt the existing
codebase to an "extension-compatible" version, and our three Mediathread
extensions all share the core common code. I adapted this core code
for the extensions into the
[mediathread-collect](https://github.com/ccnmtl/mediathread-collect)
repository. Last November I wrote about some options we have around
[Managing Common Code in a Multi-Browser Extension](http://www.columbia.edu/~njn2118/journal/2015/11/13.html).

Mozilla is working on a project called
[WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions)
in an effort to standardize some APIs available to browser extensions,
and make it easier to port Chrome extensions to Firefox. So
cross-browser extensions may become simpler in the future, but there
will still be plenty of kinks to work out, especially for Safari and
Microsoft Edge compatibility.

We've received positive feedback about the extension, and it's simpler
to install than the bookmarklet. We'll be maintaining these extensions
along with Mediathread, and I'll continue to look for ways to simplify
the process of working with the cross-browser codebase.

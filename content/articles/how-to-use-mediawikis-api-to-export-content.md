---
title: "How to Use Mediawiki\u2019s API to Export Content"
date: 2018-05-07
type: "post"
author_name: "Nik Nyby"
author_url: "https://ctl.columbia.edu/about/team/nyby/"
lede: "MediaWiki\u2019s API has been around since before REST APIs were commonplace. So it\u2019s a little idiosyncratic, but still useful and flexible."
poster: "poster-mediawiki-api-export.jpg"
socmediaimg: "socmediaimg-mediawiki-api-export.jpg"
topics:
- Sysadmin
tags: ["mediawiki"]
---

In 2011, I was working at a media agency in San Francisco, developing
an e-commerce application in PHP. I was the sole, “lead” developer
and all of the code had been written by the agency’s resourceful
creative director. I needed to add some new features to the platform,
like product reviews, payment system improvements, product
variations, and who knows, even a public API? This was really
“learning by doing,” one of the many aspects of progressive education
that we promote at the CTL. I used
[MediaWiki’s API](https://www.mediawiki.org/wiki/API:Main_page)
to learn about how APIs work in web applications, including related themes like
rate limits, data formats, authentication, etc. I put together an
over-engineered API in our PHP application (called QubixCart) that
never actually saw any use, but the process was fun and educational.

Seven years later, I’ve found a reason to actually use MediaWiki’s
API. You can use it to make a lightweight text archive of parts of
your wiki. I’ve made this
[mediawiki-export](https://github.com/nikolas/mediawiki-export)
script to get a tree of text files from your wiki, based on a list of
categories.

MediaWiki’s API was designed a while ago, and doesn’t look or act like
the more user-friendly APIs that have since been developed at sites
like Twitter and GitHub. To find out the details of the requests I
needed, I used
[MediaWiki’s API Sandbox](https://www.mediawiki.org/wiki/Special:ApiSandbox)
— pretty much a trial-and-error process until I got data that looked right,
then parameterized this and put it in my wiki-export script.

Finally, if your wiki is private, you’ll have to take that into
account when running `wiki-export.py`. Here are two options you have:

1. Set up oAuth authentication in `mediawiki-export.py`.
2. Run `mediawiki-export.py` on the same server as your wiki, and authenticate by
whitelisting localhost via the
  [NetworkAuth](https://www.mediawiki.org/wiki/Extension:NetworkAuth)
  extension.

In my scenario, I went with the second option.

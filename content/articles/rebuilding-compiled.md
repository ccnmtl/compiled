---
author_name: "Zarina Mustapha"
author_url: https://ctl.columbia.edu/about/team/mustapha/
date: 2016-06-27
lede: "We moved CompilED to Hugo, a general-purpose static site generator, to test this framework\u2019s flexibility and durability to accommodate our blog\u2019s requirements and workflow. This post outlines how we converted CompilED from Movable Type, streamlined its user experience, and optimized the site for accessibility, responsive design, and searchability."
poster: poster-rebuilding-compiled.jpg
tags: ["hugo","html5","accessibility", "a11y","responsive design","structured data","microdata"]
title: "Rebuilding CompilED"
topics:
- Process
type: post
---

*"We can rebuild [it]. We have the technology."*  
— Oscar Goldman, *The Six Million Dollar Man*

Earlier in March we decided to move our previous blog to a different platform, with a fresh design in hope to breathe new life into it, and keep it going painlessly.

CompilED has been online since 2009 built in the erstwhile gratis and open-source [Movable Type](https://en.wikipedia.org/wiki/Movable_Type) (MT), a weblog publishing system developed by the company Six Apart. Over the years, it became increasingly difficult to upgrade and maintain the Movable Type platform in our server. When Six Apart changed its business model and terminated the open source licensing, we ceased to upgrade the platform and began looking for other options that would meet our changing requirements for static publishing tools at the Center.

For the new publishing engine, we would like to: 

- Separate content and templates for better workflow,
- Use version control tools to track changes to the content and codes, and allow rollbacks,
- Store the source on Github and use its interface for content editing,
- Have control over functionalities we can develop for the site,
- Have clean codes,
- Have a framework that is lightweight and easy to maintain or upgrade, at little or no cost.

In addition to meeting these requirements, the new CompilED now:

- has much more streamlined UI/UX,
- is optimized for responsive design, readability, and accessibility,
- is structured, searchable, and shareable.

## Conversion and infrastructure

{{< figure src="/img/assets/hugo-logo.png" class="pull-right" alt="Hugo logo" link="http://gohugo.io" >}}

[Anders](https://thraxil.org/), a senior developer at CTL, has been testing and evaluating static site generators for the Center, and recommended [Hugo](http://gohugo.io) for sites that we published on Movable Type. Hugo is a general-purpose static site generator that renders HTML files as output from content files and layout templates. It doesn’t rely on a database; all the content is in simple text files with Markdown or limited HTML formatting that can be revised using any text editing tool. Hugo meets the requirements we’ve set earlier, and we’ve used it for the [Film Language Glossary](https://filmglossary.ccnmtl.columbia.edu) and the [Case Consortium](https://casestudies.ccnmtl.columbia.edu) in 2015. It seemed to be an ideal fit for CompilED, and we wanted to explore this framework's flexibility and durability.

Anders wrote a [Python scraper](http://docs.python-guide.org/en/latest/scenarios/scrape/) that took all the content from the previous CompilED and converted it into the formatting suited for Hugo. Then, he set up the [`compiled` repository](https://github.com/ccnmtl/compiled) on Github, as well as the continuous integration server, Jenkins, to deploy the site to staging and production. CompilED is published to and hosted on Amazon Simple Storage Service (Amazon S3).

## Architecture, theming, and skinning

Initially, the conversion preserved the original directory structure from Movable Type. Each article post lived in its respective topic directory: 

```
.
├── content
│   ├── events
│   │   ├── article-post-files
│   ├── process
│   │   ├── article-post-files
│   ├── projects
│   │   ├── article-post-files
│   ├── etcetera...
│   │   ├── article-post-files
```

This structure made it difficult for me to use the existing Hugo list of content templates, layout template assignments, and other functionality such as global pagination. It also complicated the editorial process where contributors would have to drop their posts in a topic directory and move the files around if the topic changed.

To simplify content and template management, I eliminated the topic directories, and turned the topics iconto taxonomies that are defined in each article's front matter. Here, an article's topic can be edited, deleted, or created at any time without moving the file between directories. All posts are now in one directory, `articles`. This is the new content structure:

```
.
├── content
│   ├── articles
│   │   ├── article-post-files
```

Here's a snippet of an article's front matter:

```
---
author_name: "Zarina Mustapha"
date: 2016-06-27
title: "Rebuilding CompilED"
topics:
- Process
type: post
---
```

I used the [Bootstrap framework](http://getbootstrap.com) to develop the skin. For CompilED, I implemented the site design in `layouts/` instead of creating a shareable skin in `themes/`. While this will limit the reuse of the the skin in another Hugo site, converting the design into a theme for future use will not be difficult.

<div class="row">
<div class="col-sm-6">{{< figure src="/img/assets/before-main-desktop.jpg" class="text-center" alt="Homepage, before (on desktop)" caption="Homepage, before (on desktop)" >}}</div>
<div class="col-sm-6 text-center">{{< figure src="/img/assets/after-main-desktop.jpg" class="text-center" alt="Homepage, after (on desktop)" caption="Homepage, after (on desktop)" >}}</div>
</div>

<div class="row">
<div class="col-sm-6">{{< figure src="/img/assets/before-article-desktop.jpg" class="text-center" alt="Article page, before (on desktop)" caption="Article page, before (on desktop)" >}}</div>
<div class="col-sm-6 text-center">{{< figure src="/img/assets/after-article-desktop.jpg" class="text-center" alt="Article page, after (on desktop)" caption="Article page, after (on desktop)" >}}</div>
</div>

## Access and accessibility

The older CompilED site was designed and developed with little accommodations for mobile devices or assistive technology (AT) for web accessibility. One of my goals is to make the site accessible to everyone, independent of the devices they use. For the new CompilED, I set out to implement comprehensive responsive design, from mobile to desktop, using the [Bootstrap framework](http://getbootstrap.com). 

<div class="row">
<div class="col-sm-6">{{< figure src="/img/assets/before-phone-desktop.jpg" class="text-center" alt="Article page, before (on iPhone 6)" caption="Article page, before (on iPhone 6)" >}}</div>
<div class="col-sm-6 text-center">{{< figure src="/img/assets/after-phone-desktop.jpg" class="text-center" alt="Article page, after (on iPhone 6)" caption="Article page, after (on iPhone 6)" >}}</div>
</div>

In addition to this, I adhered closely to common web standards (HTML5, semantic elements) so that the site is [accessible](https://www.w3.org/standards/webdesign/accessibility) to those using assistive technologies. While my experience in developing and designing fully accessible sites is in the early stages, I put in a good faith effort to make CompilED work with [VoiceOver](http://www.apple.com/accessibility/osx/voiceover/) for OSX and [TalkBack](https://support.google.com/accessibility/android/) for Android tablets. The site passed reasonably well when tested with WebAIM's [web accessibility evaluation tool](http://wave.webaim.org), where the errors the site encountered are from yet-to-be-improved functionalities.

As always, the development and design of CompilED is an iterative process. There is a bit more to be done, for example, the search functionality has to be optimized for accessibility.

More will be written soon about what I've learned in making sites for access and accessibility.

## Structure, search, and share

Hugo, similar to Movable Type v4.x,  doesn't come with search functionality. We could have set up a Google custom site search like we did in the old CompilED, but, according to Anders, "that would've limited our ability to customize the display and integration of search results and there would always be a delay between changes to content being made and Google re-indexing the site."

Anders implemented [lunr.js](http://lunrjs.com), client-side full text and faceted search engine. lunr.js loads a JSON file containing all of the content for the entire site and runs the search algorithm directly in the browser rather than back on a server. At the moment, the scale of content in CompilED is small enough for us to use lunr.js.

The content in CompilED is [highly structured](https://developers.google.com/search/docs/guides/intro-structured-data) using the [schema.org](http://schema.org) vocabulary, so that it can be recognized, organized and displayed accordingly by search engines. Social media sharing of articles is markedly improved also in the new site. This blog also provides [RSS feed](https://compiled.ctl.columbia.edu/index.xml) for readers to follow with any reader they choose.

## What's the deal with the kitties?

We write about educational technology and projects that are largely used on the web, that require internet access. The internet is [made of cats](https://en.wikipedia.org/wiki/Cats_and_the_Internet). It is only logical to include cats in our posts, and the [404 error page](/404.html).

---
date: "2018-04-02"
type: "post"
author_name: "Nick Buonincontri"
author_url: "https://github.com/nbuonin/"
lede: "In-place editing with Perl"
poster: ""
poster_sourceurl: ""
poster_source: ""
topics: 
- Projects
tags: ["unix", "perl", "regex", "perl", "html", "scraping"]
title: "Better Sed with Perl"
---

Though sed has facilities to manage multi-line operations, they can be hard to understand initially. Perl can offer an easier set of tools.

<!--more-->

A few weeks ago, working on migrating a static versions of Pathology Lab and Histology Lab to a Hugo site, I had the task of swapping the position of an image and a subsequent div across 100+ Markdown files. Initially I thought that sed would be the right tool for the job an in-place edit, but I found it confusing to manage what essentially is a multi-line regex.

To give some context, I generated the Markdown files using the very capable [Scrapy](https://scrapy.org/) framework. I used Scrapy's stock html parser to fill in my front matter and simply dumped html markup in to the body of each Markdown file.  I knew that I would want to leverage some of the existing class names for layout, so I didn't want to convert everything to straight Markdown.

So given all these Markdown files, though filled with HTML, my first thought was to use sed's in-place edit capabilities:
```
sed -i.bak -E 's/match/replace/g'
```
The `-i` flag makes sed create a backup file with the extension given, in this case `.bak`. The extension is required on MacOS. The `-E` flag tells sed to use extended regular expressions rather than basic RE's.

This works great for a few words but on its own doesn't work with multiple lines. The default behavior of sed is to match up to the new line.  To approximate a multi-line match you have to copy input from the pattern space to a hold space, and then read it back out. Its [a lot to deal with](https://www.gnu.org/software/sed/manual/html_node/Multiline-techniques.html#Multiline-techniques).

So where does Perl fit into this? First, there's little mystery about which flavor of regex Perl [uses](https://www.pcre.org/), and there's plenty of tools out there to work out the regex first, [Regex101](https://regex101.com/) being my favorite. 

But wait, you ask, isn't Perl a language, not some unix command? Perl has a few ways of reading in programs, one being [line-by-line](http://perldoc.perl.org/perlrun.html) on the command line using `-e`. Adding `-p` makes Perl behave like sed, looping over the input fed to it, and print out the result. But we don't want Perl to behave exactly like sed, or else we're back to matching line-by-line. Perlrun has a way to set a switch to modify how Perl ["slurps in"](http://perldoc.perl.org/perlrun.html#Command-Switches) files. In this case, the convention is to `-0777` to slurp in files whole.

Putting this all together, piped with in with find, looks like this:
```
find . -name "*.md" | perl -0777 -i.bak -pe 's/<regex>/<replacement>/<flags>'
```

If all goes well, you'll have matching backup files next to the modified files. Given that backup files are named `*.bak`, you can use find and xargs to cleanup (or find -exec if so inclined): `find . *.bak | xargs rm`

One important thing to note: though regex's are quite useful, if you're familiar with the [Chomsky hierarchy](https://en.wikipedia.org/wiki/Chomsky_hierarchy) of languages, you know that their power is limited. Particularly, regexes can't parse HTML, as evidenced by [this well known Stack Overflow post](https://stackoverflow.com/questions/1732348/regex-match-open-tags-except-xhtml-self-contained-tags/1732454#1732454). If your match pattern extends over a variable number of nested tags, then it might be worth looking at other tools to parse the markup before moving it around. If Python is your thing, [Beautiful Soup](https://www.crummy.com/software/BeautifulSoup/) is great place to start.

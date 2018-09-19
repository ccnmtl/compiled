---
title: "Considerations for Search"
date: "2018-09-19"
type: "post"
author_name:  "Zarina Mustapha"
author_url: "https://ctl.columbia.edu/about/team/mustapha/"
lede: "Search functionality requires a thoughtful deliberation so that the
model, UI, and UX can best serve the users’ needs. This post lists some useful
guiding questions for that feature."
poster: "poster-searching-1.jpg"
socmediaimg: "socmediaimg-searching-1.jpg"
poster_sourceurl: ""
poster_source: ""
topics: 
- User Experience
tags: ["UI","search"]
---

When I get asked to add a search functionality to a web-based project, my
immediate answer in the form of a question is, “What are you considering for
searching?”

Let me tell you a story, an amalgamation of true stories while growing up.
Let’s call the story “Green Notebook Quest.” I was a young kid, in a hurry to
go to school (almost always), and I couldn’t find my school notebook (almost
always).  And the exchange between me and my mother went something like this
(almost always):

__Me:__ Ma, I can’t find my notebook!  
__Mom:__ Which notebook?  
__Me:__ The green notebook. I had it on the desk by the computer.  
__Mom:__ I tidied your desk. It was so messy. I put the books on the shelves in
your room. Look there.  
__Me:__ Which shelf? I’m looking and I can’t find it!  
__Mom:__ The shelf next to the cabinet. I put it next to your textbooks.  
__Me:__ (_frustrated_) That’s not the green notebook. It’s green, but not the
one I’m looking for! A smaller book. And it has a cat sticker on it. I need it
for my Math homework.  
__Mom:__ There are two shelves. Check the other shelf!  
__Me:__ (_flipped through books on the other shelf_) I am, and I still can’t
find it!  
__Mom:__ (_walks into my room_) Did you look everywhere on the shelf?  
__Me:__ Yes!  
__Mom:__ (_reached for a green notebook with cat sticker, on the shelf_) Is
this the notebook?  
__Me:__ It wasn’t there when I went through that shelf. I swear I checked it!
It wasn’t there a minute ago!  
__Mom:__ (_held it up to my face_) That’s because you’ve been looking for it
with your nose.

We all know this story, we’ve experienced this at least a few times in our
lives, and it is to show that many Moms (or Dads) are the best search and
analytics engine. So why am I telling you this story?

Search functionality can be complex, and search UI can be complicated. To help
design and develop the search feature, we need user stories and diagrams, and
to lead us to these deliverables, we should ask a few guiding questions. Let’s
consider that universal story again to help us deconstruct and reassemble our
approach to search functionality.

### Who am I: Who is the user? ###
The persona of the user will guide us in deciding what the
[principle of least astonishment is](https://en.wikipedia.org/wiki/Principle_of_least_astonishment)
for the sets of users, and inform us how we should design the UI for the search
functionality. What can we assume about their experience with web searching?
What is the basis of our assumptions? What devices do they use? Will, or should
search be available on all devices? Knowing the user will lead us to __what__,
__where__, and __how__ they would want to search for things.

### What is the user searching for? ###
To put simply, the user is searching for an object. But what attributes define
the object? Are there relationships with other objects? Are these relationships
relevant to the search? In the “Green Notebook Quest” story, the object that I
was looking for can initially be broken down as follows:  
`type: notebook`  
`color: green`

And as it turned out, there was more than one green notebook.

<div class="row">
<div class="col-sm-3">
<img src="/img/assets/notebook-lg.png">
</div>
<div class="col-sm-3">
<img src="/img/assets/notebook-md.png">
</div>
</div>

But then, in the midst of frustration, I expanded my query to include other
attributes, such as the object’s dimensions (“smaller”), what it’s being used
for, or title, (“Math”), and tags (“cat sticker”): 

<div class="row">
<div class="col-sm-4 text-center">
<img src="/img/assets/notebook-lg.png">
<p><i class="fa fa-times-circle fa-3x text-muted" aria-hidden="false"></i></p>
</div>
<div class="col-sm-8">
<code>
type: "notebook"<br />
color: "green"<br />
title: "English Comp"<br />
tag: <br />
size: "large"<br />
width: 9in<br />
height: 14in
</code>
</div>
</div>
<hr />
<div class="row">
<div class="col-sm-4 text-center">
<img src="/img/assets/notebook-md.png">
<p><i class="fa fa-check-circle fa-3x text-success"
aria-hidden="false"></i></p>
</div>
<div class="col-sm-8">
<code>
type: "notebook"<br />
color: "green"<br />
title: "Math"<br />
tag: "cat"<br />
size: "small"<br />
width: 7in<br />
height: 11in
</code>
</div>
</div>

From this example, we see that it is helpful to understand the definition of
the object the user is searching for, in any given application, so that we can model
the object better and design intuitive UI and UX for that search.

### What does the user need search functionality for? ###
What are the conditions for this functionality: quick search or deeper search?
Should it be available everywhere on the site? How does search fit into the
overall experience of the site? How does it add to, or impede the user’s
learning experience? Is the search functionality a solution to poor information
architecture, or a way to address a complex site model? Do we need to track the
search patterns? This set of questions can provide insights on what the search
should do, anticipate user search patters, and shape the expected UX around it.

### How is search being done? ###
When we have user stories and requirements written on the search feature, we
can now think about how to implement them. What search engines will we use?
CompilED, for example, uses [lunr.js](https://lunrjs.com) because this blog is
a Hugo-generated static site with a small dataset, and we decided that full-text
search is good enough. For the mapping project
_[Writ Large](https://writlarge.ctl.columbia.edu/map/)_,
a Django project with a manageable size of dataset, we use Django PostgreSQL
search tools. We decided to go with
[Solr](http://lucene.apache.org/solr/) for
[Footprints](https://footprints.ccnmtl.columbia.edu/search/) because there are
thousands of records to go through, using much more robust faceted search.

However, considerations for search don’t simply stop with the technology.
Let’s go back to the “Green Notebook Quest.” The search was a two-step process.
Initially I did a simple search, then I filtered the results with certain
parameters.

```
Initial query "green notebook"
---------------
Filter by:
    size: "small"
    tag: "cat"
    use: "math"
```

But wait, the initial query can still be broken down to a two-step process:

```
Initial query:
    q1:
        type: "notebook"
    q2:
        color: "green"
---------------
Filter by:
    size: "small"
    tag: "cat"
    use: "math"
```

So now, we have to decide how to design the UI and UX around this simple search
pattern. Can we assume that the user has a certain knowledge of superuser
searches so we can condense everything into one search field, i.e.
`type:notebook AND color:green AND size:"small"` etc? Or should we design an
elegant search interface that appeals more to the user’s intuition? We did the
latter for [Footprints](https://footprints.ccnmtl.columbia.edu/search/) search.

### Where is the user searching? ###
There may be instances where we set limits to user searches (search only
published or public records if user is not an admin, for example). What fields
or attributes are being exposed to the user search? The users may want to set
their own limits to the search as well. The latter case can also be thought as
a facet of the search. The areas of search in “Green Notebook Quest,” for
example, were “shelves by the cabinet in my room”

Why is this important? As always, for UI, and UX.

### Who can see what the user is looking for? ###
Sometimes, we want to hide certain search results based on user roles.
Only editors will see unpublished articles, for example. This type of decision
needs to be included in testing so we can be certain that a zero match is
indeed an intended match.

### How can the user see what the user looking for? ###
We ask this question so we can design the search result page. Should the
results page be separate? For
[Footprints](https://footprints.ccnmtl.columbia.edu/search/), we decided to
show all records at first, and then show only records that match the search
queries. This blog’s simple search displays matching posts in a pop-up panel. In
_[Writ Large](https://writlarge.ctl.columbia.edu/map/)_, all pins that don’t
match the search criteria are dimmed instead of hidden.

### The result from the user’s search, does it match what the user is looking for? ###
The search implementation is incomplete without this verification, and we do
this through testing. Write a test. We set up a search against a known set of
data. We test using different search parameters. We test it against different
user permission levels. Test, verify, and so on.

### To summarize... ###
The search feature is not just about the engines looking for things in the
database. Search begins with the user’s intention, and it revolves around the
user’s expectations in searching. The search experience should be intuitive,
and informative. I hope he questions here can serve as a starting guide to a 
better search design.

So, what does the “Green Notebook Quest” look like in context of search
functionality?

The model for anything on the shelf in my room is defined by `type  `, `color`,
`title`, `tag`, `size`, `width`, and `height`.

The users are:
```
user1: "Mom"
        permission: "Admin", "User"
user1: "Me"
        permission: "User"

```

The search is the following:
```
Initial query:
    q1:
        type: "notebook"
    q2:
        color: "green"
------------------------------
Filter by:
    size: "small"
    tag: "cat"
    use: "math"
------------------------------
Areas of search: shelf1 by cabinet, shelf2 by cabinet
------------------------------
Test & verify: Momtest
Exception thrown: "Don't find things with your nose"
```


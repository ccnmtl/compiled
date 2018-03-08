---
author_name: "Anders Pearson"
author_url: https://thraxil.org/
date: 2016-08-23
lede: "Go, a systems programming language developed and open sourced by Google, has emerged as a very important language for interesting infrastructure projects such as Docker and Prometheus. It's worth keeping a close eye on the Go community to stay updated on those kinds of projects. This post outlines how, where, and why we use Go at CTL."
poster: poster-go-at-ctl.jpg
poster_source: "Basil Farrow at La Carmina"
poster_sourceurl: "http://lacarmina.com/basilfarrow/2013/01/scottish-fold-kitten-standing-up-on-hind-legs-cat-magazine-photoshoot-folded-eared-kitty-photos/"
tags: ["golang"]
title: Go at CTL
topics:
- Events
type: post
---

I recently attended
[The Golang UK Conference](http://golanguk.com/). Rather than my usual
dump of notes and links, I thought I'd just write a bit about how and why we use
Go at CTL. (Although, I can't resist at least linking to Dave Cheney's
keynote on [SOLID Go Design](http://dave.cheney.net/2016/08/20/solid-go-design)).

At CTL, we try to limit the programming languages, frameworks,
operating systems, and deployment environments that we use for the
sake of developer sanity. Our code tends to stick around for quite a
while and we can only keep up with so much. So we've standardized on
Python and Django as our preferred web development framework for
custom apps, with Javascript as a necessary addition for rich clients,
plus Drupal/Wordpress/PHP for projects that fit into a certain
category. VITAL was our last Java application, and that's been gone
for years. After we shut down the old PMT a few years ago, we no
longer have Perl code in production. There's some shell script here
and there gluing things together and I've been known to go in and
tweak some of the C and C++ libraries that our other tools build upon,
but by and large, we are a Python shop.

As useful as it is proving to standardize our tools, we never want to
completely stagnate and fall too far behind the rest of the world. If
a fresh challenge requires, or even could be much better solved with a
different language or framework, we need to be free to use it (just
keeping in mind the potential maintenance costs of introducing
something new). Eg, we experimented with
[NetLogo](https://ccl.northwestern.edu/netlogo/) for the Capsim
project prototype in to enable better collaboration with a client who
was more comfortable with that tool, found it fairly useful for that
purpose, but ultimately switched development back to Python.

One new language that I've been using more and more and growing quite
fond of over the last few years is Go, a systems programming language
developed and open sourced by Google. The rest of this post summarizes
why I think Go is interesting, what I've been doing with it, both at
the Center and on some related side projects, and where I see things
going in the future.

## Background and Overview of Go

Go was developed internally at Google and publicly released as an open
source project in 2011. Google has long advocated a similar focus on
their toolset and had a well known public policy of only developing in
C++, Java, and Python (plus the inevitable Javascript and Shell
glue). Go was designed and implemented by Ken Thompson (one of the
originators of the C programming language and Unix), Rob Pike (creator
of UTF8, the Plan 9 operating system) and Robert Griesemer (developer
of the V8 Javascript engine that Chrome and Node.js rely on). They
designed Go in response to the failings of the three sanctioned
languages when working at the scale of Google's servers:

<blockquote>One had to choose either efficient compilation, efficient
execution, or ease of programming; all three were not available in the
same mainstream language. Programmers who could were choosing ease
over safety and efficiency by moving to dynamically typed languages
such as Python and JavaScript rather than C++ or, to a lesser extent,
Java. (from <a href="http://talks.golang.org/2012/splash.article">Go
at Google</a>)
</blockquote>

Anecdotally, much of the early work on Go was done while waiting on 45
minute compile cycles for a large Google application written in C++.

Go's aim was to be the ideal language for writing networked servers in
the internet age, and at Google's scale, both in terms of performance
requirements and team size.

The result is a language that lands somewhere in between C and Python,
with a number of unique aspects. The basic syntax is C-style and
immediately familiar looking to most programmers with experience
anywhere in the C, C++, Java, C#, Javascript spectrum. It is
statically typed and compiled like C/C++ (though it has some basic
type-inference). Like Java it is garbage collected and uses modules
rather than includes. Like Python, it has fairly rich built in types
(maps, slices, first-class functions), multiple return values, and
loop syntax that makes it easy to iterate over a container.

Go has objects but not classes or inheritance, instead using
interfaces and pushing programmers towards
[composition rather than inheritance](http://en.wikipedia.org/wiki/Composition_over_inheritance).

Go then truly differentiates itself from the other languages it
borrows from by introducing support for concurrency at the language
level. Go uses a lightweight thread model (calling them "goroutines")
and provides channels for communication rather than relying on
concurrent access to shared memory. This is a theoretically sound
approach to avoiding many of the traps of concurrent programming
(based on Hoare's
[Communicating Sequential Processes](http://en.wikipedia.org/wiki/Communicating_sequential_processes))
and proves relatively straightforward to work with in practice. Go's
concurrency support is really where it places itself into territory
that Java, C++, and Python can't really compete with it. IMO, only
other languages built for similar purposes and with a similar
underlying concurrency mechanism (such as Erlang) reach an equivalent
point of concurrent performance and ease of programming.

Go's overall design emphasizes simplicity, practicality, and ease of
comprehension over pretty much all else. The entire language
specification is very small and the developers tend to reject new
features by default, only adding complexity to the language when it's
clearly required. The result is that the language is relatively easy
to learn, and the simplicity has enabled very sophisticated and
powerful tools to be developed around the language. Eg, even large Go
programs typically compile in a matter of milliseconds, making the
development workflow *feel* much more like working in an interpreted
language like Python than a compiled language, since you are never
waiting for the compiler. Go includes a formatting tool that
automatically rewrites Go source code into a standardized style,
enforcing uniform readability on par with Python and effectively
ending the debates over where to place ones braces or whether to use
tabs or spaces to indent, etc.

Go includes a package manager similar to pip, npm, or ruby gems, for
pulling third party packages into your environment. The difference is
that it always fetches them as source directly from their repository
(instead of relying on an intermediate package format and distribution
system like
PyPI). [Note that this has been controversial within the Go community
and there are a number of competing vendoring approaches and tools
being developed that challenge this approach, but none of them
have yet emerged as the clear winner]. Go
then always compiles programs to statically linked binaries, with all
the required dependencies included. This means that a program written
in Go can always be deployed to a server by just compiling and testing
locally and then copying a single file over. That program is then
immune to the perpetual churn of shared libraries across distributions
or global conflicts with other tools that require different
versions. This is something that has been an issue for us with all of
the interpreted languages we've used and I've spent enormous amounts
of time and effort over the year on getting our deployment processes
and requirements management to be reliable and kept up to date.

To summarize the strengths of Go:

* First-class support for concurrency. A Go program can easily have
  hundreds of thousands of concurrent threads running, takes good
  advantage of multi-core machines, and the channels support patterns
  for doing concurrency *correctly*, avoiding many of the dangerous
  traps that regular threaded programming will get you into. This
  really makes Go one of the few good choices available for writing
  any network software that has to handle a lot of simultaneous
  connections in a single process.
* Performance, even without concurrency, is close to C++ or Java. Go
  programs are resource lean and start up instantaneously compared to
  Python. This makes Go nice for writing command-line utilities since
  there is no interpreter start-up overhead.
* Nevertheless, it feels like a productive language to develop
  in. Most Python programmers will tell you that Python feels
  somewhere between twice to ten times as fast to develop in as a
  language like Java (super verbose) or C++ (tricky memory management
  issues). Go isn't quite as productive as Python, but gets much
  closer to that end of the spectrum. I'd say that I find Python about
  10% more productive than Go (for anything where an existing
  library/framework isn't doing most of the heavy lifting). I
  regularly switch back and forth between Python and Go and find it
  very comfortable.
* Static typing makes refactoring very straightforward. I feel like I
  can make sweeping changes to a Go codebase and, once I get
  everything passing the compiler again, I have a pretty strong sense
  that I didn't break anything. Go includes a syntax aware rewriting
  tool ("go fix"), a static analysis tool ("go vet"), a testing
  framework ("go test"), sophisticated channel-aware profiling
  library, and even a data race condition detecting tool.
* Very high quality standard library. Python's standard library is
  notorious for being "batteries included" but with a lot of low
  quality, crufty code that the community generally recommends against
  actually using (but that they can't seem to get rid of or clean up
  because of backwards compatibility). All the code in Go's standard
  library is well designed, well written, and very useful. One of the
  best ways to learn to write good, idiomatic Go code is to study the
  source in the standard library. It's surprising how much many useful
  applications can be written in Go using only the standard library
  and no third-party packages.
* Static binary deployment. No worries about dependencies needing to
  be managed on production systems.

Some weaknesses:

* No REPL. This makes a certain kind of exploratory programming a bit
  more difficult.
* Static typing makes working with certain kinds of external data
  formats more verbose. Eg, Go makes it very easy to map a particular
  structure of JSON or XML document to a Go struct if you know the
  structure ahead of time. Dealing with arbitrary JSON or XML with
  flexible structures is much more difficult. Similarly, it appears
  that a generic framework for something like an ORM or a runtime
  pluggable application is also not as straightforward in Go.
* As a result of the above as well as just the smaller community, Go
  really doesn't have any full application web frameworks anywhere
  near the completeness and maturity of Django. There are some ORMs
  available, but none have really gained traction.

Some percieved weaknesses that I've found to not be an issue in practice:

* No generics. Any online discussion of Go quickly ends up
  here. Programmers coming from Java, C++, or C# see that Go doesn't
  have support for generic data types and freak out. The Go developers
  have stated that they aren't against generics per se, but don't find
  them essential given the rest of the language's design and haven't
  figured out any way to add generics without making other aspects of
  the language harder to use. I think they're right. In my experience,
  I've only had a couple of experiences where I've thought "if Go had
  generics I could've done this in a more reusable way" and when I
  look closely at those instances, it seems that support for generics
  would only have saved me a few dozen lines of straightforward if
  slightly boilerplate code out of a large codebase.
* No dynamic linking. Static linking makes large binaries. No doubt
  they could be made smaller if Go dynamically linked things. Still, I
  think the price paid is well worth the benefits of having an
  entirely self-contained binary that won't break when you upgrade
  something else on the same server. Maybe if I were targeting very
  tight embedded platforms, I'd feel differently.
* No exceptions. Go doesn't have try/catch or an equivalent. Instead
  there's a strong convention around using the multiple return types
  to return an error value and to check and handle that error at the
  point it occurs. This does make for more verbose code at times and
  it can be slower going to write code when you have to think about
  what to do in case of an error at every single step. Once again
  though, the end result seems to be code that is overall simpler and
  more robust.
* No compiler warnings. Go's compiler either successfully compiles
  your program or gives you an error and halts. Go has no notion of
  "warnings" from the compiler. It's like always running with a strict
  flake8 setup. This is a little frustrating at first, but frankly, I
  love it. Go's compiler will even halt if you import a package and
  don't use it. This is annoying at first, but eventually I discovered
  the [goimports](https://github.com/bradfitz/goimports) package and
  configured emacs to use it. Now, when I save, it automatically
  rewrites the import section of my code automatically adding or
  removing import statements as necessary. So what started as an
  annoying strictness now actually makes code even faster to write.

When you look at where and how Go tends to be used in the community,
it lines up with and reinforces those strengths and weaknesses. Rather
than full, consumer facing web applications, Go tends to be used for
SOA endpoints (taking advantage of the good concurrency, high
performance, and low overhead) or middleware that back user facing
Rails, Django, or PHP apps. The Devops world also appears to love Go
and it's become a tool of choice for orchestration, containers, and
monitoring ([Docker](https://www.docker.com/),
[Rocket](https://coreos.com/blog/rocket/),
[etcd](https://coreos.com/etcd/), [Consul](https://www.consul.io/),
[Terraform](https://www.terraform.io/),
[Kubernetes](http://kubernetes.io/),
[Prometheus](https://prometheus.io/), etc).

## What I've been building with Go (at CTL)

### Dagon

I think the first Go app I wrote for CTL was
[Dagon](https://github.com/ccnmtl/dagon).

It's a very simple commandline tool that does a basic LDAP lookup
against CU's public LDAP service and returns the results in JSON. All
of our Django apps that allow users to login via CAS generally do
a single LDAP query for the user the first time they log in to get
their full name (since CAS only gives us a UNI). The problem has
always been that Python's LDAP library is an absolute maintenance
nightmare. It requires a whole slew of C libraries that have to get
compiled in and gives us endless issues with different OS versions and
system updates breaking things in subtle ways that we only detect
later when a new user logs in. I had attempted to deal with this issue
once before by creating the 'CDAP' service which was a simple REST
service that we ran that responded to a GET request by doing the LDAP
query and returning JSON. Then all the other applications that needed
to do LDAP queries could just use that REST service and not have to
have LDAP dependencies compiled in. This improved things somewhat, but
became a single point of failure (when CDAP was down, a lot of other
applications would break), and we eventually moved back to just
including `python-ldap` everywhere and dealing with the pain.

When I started playing with Go and realized that I could do LDAP
queries with it and build it into a static binary that would run on
any of our servers, I wrote Dagon. The idea was that [djangowind](https://github.com/ccnmtl/djangowind/) would
just include the dagon binary (or we could Salt it onto our servers)
and shell out to it instead of using LDAP directly or relying on a
CDAP service to be running). I still think this is a good idea, I've
just never gotten around to hacking it into djangowind.

(Ultimately, a combination of standardizing our server setups with
[Salt](https://saltstack.com/) and Python's improved handling of
binary libraries via [wheels](http://pythonwheels.com/) made it
"painless enough" that we've stuck with doing LDAP stuff in Python. I
do still use dagon directly on the commandline frequently though
rather than go search the web directory for a coworker's contact
info.)

### Windsock

When Websockets really started to become something that we needed to
investigate more seriously, I quickly realized that it necessitated a
fundamentally different server architecture to what we use for Django
or PHP applications. Websockets requires many, many simultaneous
connections to be held open indefinitely. That means you need either
an evented/epoll type server (Node.js, gevent, Tornado, Twisted, or
similar) or something with lightweight processes/threads (Erlang or
Go). I decided to prototype some stuff with Go.

I made a
[proof of concept IRC to websockets bridge](https://github.com/thraxil/fitor). It would log into our IRC channel and communicate back and forth with
browsers via websockets.

Then I refactored it mercilessly and extracted a generic authenticated
websockets server and broker architecture decoupled via [ZeroMQ](http://zeromq.org/). The
code ended up [here](https://github.com/thraxil/windsock).

This time, I was really impressed with Go. I was making heavy use of
the concurrency features and found them very powerful. I deployed the
broker and websockets server to our production Django servers to back
a simple chat application. They used negligable memory and CPU, were
deployable via Salt as two static binaries, and I was always impressed
to load the application every few months and find that they were still
just silently running, despite all the other churn on the servers.

### statsd-go

LITO set up Graphite for monitoring and gave us access to it. An
almost necessary complement to Graphite is a stats collection service
that runs on each host, collecting metrics, summarizing them and
forwarding them to Graphite. Etsy has 'statsd', which is written with
Node.js and basically became the standard. The basic protocol is very
simple though and there are numerous ports to other languages. I find
Node.js applications kind of annoying to deploy on our servers
(especially at the time when we had no other Node dependencies),
requiring a lot of runtime library support. I also wanted to be able
to configure default metric prefixes per server (since we shared a
Graphite server with LITO and want to prefix all of *our* metrics with
`ccnmtl.` but don't want to have to repeat that through every
application we write) and the Etsy statsd didn't support that. I found
a Go implementation of statsd,
[forked it](https://github.com/thraxil/statsd-go), hacked in our
metric prefix support, and tested it out. It worked, so I deployed it
to our servers (again, very simple Salting of a static executable that
could just be checked into the git repo). Again, it proved to be
resource light and rock solid, running for years without
issue. (Though we've since replaced it with
[Heka](https://hekad.readthedocs.io/en/v0.10.0/), which is also
written in Go, includes the same functionality and some additional
features to boot).

### Chimney

Once we started adding smoketests to our Django apps, I began to want
a service to periodically monitor them and report the results to
Graphite. I wrote [Chimney](https://github.com/thraxil/chimney) to do this.

It runs on one of our servers and just wakes up every few minutes and
goes down a long list of our Django applications, hitting the
smoketest URL, parsing the results, and submitting them to
Graphite. It's a lot of HTTP requests to make on each pass, none of
which depend on each other. This is a classic [embarrassingly
parallel](https://en.wikipedia.org/wiki/Embarrassingly_parallel) problem. Go made it very straightforward and again, the
service was dead simple to deploy and has proven to be reliable and
polite in terms of resources.

### Houston

Once we were centralizing our metrics with Graphite rather than Munin,
I started wanting a simple dashboard that would show the current
status of all our servers and applications on one
page. [Houston](https://github.com/thraxil/houston) was my first
attempt at it. It was a user facing web application, but had no
state. It just took the list of metrics from a config file and
constructed the right URLs for graphs to be served by the Graphite
server.

### Hound

Houston worked well for what it was, but once I also wanted email
alerts based on metrics, I realized that I could get alerts and a
dashboard both out of one application and it would be better than
either separately.  So, [Hound](https://github.com/ccnmtl/hound) does
that. Hound implements the strategy of alerting entirely off
metrics. So, instead of directly monitoring various servers and
applications, Hound only knows how to read metrics from Graphite and
alert if those metrics cross a threshold. This means that any time you
get an alert, you have a history of that metric to compare it to,
which gives you a good baseline to see what's actually going on. It
also means that Hound never has to be changed to support additional
kinds of servers or applications. Those just need to be able to put
metrics into Graphite and Hound will be able to deal with it. It also
lets us easily make a simple web dashboard showing the current status
of all the metrics Hound watches along with daily and weekly trend
graphs. CTL's hound dashboard is here: https://hound.ccnmtl.columbia.edu/

At the top is a summary view. If all the boxes are green, everything
is good. Any red ones indicate a problem and you can click on them to
see the graph. Right now, Hound monitors 224 metrics for us, including
basic load average and disk usage across all of our servers, all
of the smoketest results that Chimney collects, and a couple
miscellaneous metrics.

### Mediacheck

Our pipeline for deploying static files (CSS, JS, images) has gotten
more complicated over the years, with
[LESS](http://lesscss.org/)/[SASS](http://sass-lang.com/) for easier
CSS authoring,
[webpack](https://webpack.github.io/)/[babel](https://babeljs.io/) to
bundle and transcode JS files, and
[django-compressor](http://django-compressor.readthedocs.io/en/latest/)
to compress everything and upload it to S3/Cloudfront on each
deploy. With all of those pieces, there's a lot that can break.

I wrote [mediacheck](https://github.com/thraxil/mediacheck/) as a
simple tool for sanity checking our static files after each
deploy. All it does is fetch a page, parse out a list of images, CSS
and JS files that are used to render that page, and check that each of
those actually exists. It returns an error code if any give a 403, 404
or 500, if any take more than a specified timeout to load, or if there
are mixed-content HTTP/HTTPS issues. It's not perfect, but with
mediacheck running as the last step of a deploy, we have some
assurance that the deploy didn't completely break the JS/CSS on the
site.

Since a page usually has a dozen or more media URLs that need to be
checked, and that needs to (should, at least) happen in parallel, but
all with a timeout around it, that looked like a win for Go (and made
good use of Go's [context](https://blog.golang.org/context) library).

## What I've been building with Go (on the side)

Most of the larger scale Go projects I've been building have been on
my own outside the Center though. For projects that I'm running on my
own personal servers, keeping resource usage low and minimizing
deployment and maintenance pain has been extremely important. For the
most part now, unless I *really* need Django for something, new side
projects that I build I tend to do in Go, even if it takes a little
longer to get going than Python. In the long term, I feel like the
things I've written in Go, once written, seem to just run reliably in
the background and don't require much attention afterwards.

### Cyclo

Go's simple syntax makes parsing it very easy, and the standard
library includes the parsing/lexing libraries that Go's included tools
(like the formatter) use. I'd gotten used to
[flake8](http://flake8.pycqa.org/en/latest/) from Python and a basic
refactoring workflow where I use it to limit (and ratchet down) the
[cyclomatic complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity)
of a codebase, forcing myself to write simpler, cleaner code. Go has
very good tooling, but no cyclomatic complexity tool, so I
[wrote my own](https://github.com/thraxil/cyclo).

### Intweet

I like Twitter, but I tend to just use it as a lightweight news
aggregater rather than a conversational medium. I already have a
centralized RSS feed reader though and most of my information comes in
through that. Keeping up on that and Twitter seemed like pointless
duplication. So I wrote [Intweet](https://github.com/thraxil/intweet)
as a simple gateway that would expose my Twitter stream as an Atom
feed, which I could then drop into my feed reader.

Figuring out Twitter's API was a bit of work, but the rest of the
application was pretty straightforward. It runs as a single process
with a webserver and a background thread that wakes up every few
minutes and fetches the latest tweets for me. As usual, lightweight
and utterly reliable. If it ever runs into a problem with Twitter, it
just tries again a few minutes later. I've been using it without issue
for several years now.

### Augend

More and more comfortable with Go, I expanded into a much more
complicated web
application. [Augend](https://github.com/thraxil/augend) is a "fact
database". It lets me quickly record simple facts, including links to
the source and tags for easy organization. I have a bookmarklet that lets me
select text from a web page and easily import that as a fact in
Augend. So I use that as my way of "taking notes" as I read things on
the web (probably similar to how many people use Evernote, but not
tied to proprietary desktop software).

For Augend, I implemented a full user model with authentication,
registration, and session management. All the bells and whistles that
I'd expect from Django. Still a bit more code, but it turned out to
not be *that* much more.

In the course of developing Augend, I also missed the nice
pagination support from Django, so I [ported that to Go as a reusable
library](https://github.com/thraxil/paginate).

### Finch

Recently, I wanted something kind of like Twitter for microblogging,
but with the ability to create separate categories of "tweets", so
someone could presumably subscribe to only a subset of what I post.

So I wrote [Finch](https://github.com/thraxil/finch) as a Go web
app. Reused a lot of the user management functionality from
Augend. This time, I wanted to decouple the datastore from the rest of
the application (essentially using a Repository pattern), so I could
potentially back it with different databases. I started on this one by
implementing a simple SQLite backend. It worked nicely and is insanely
fast.

### cbp

Fault tolerance and high availability distributed systems are kind of
a personal obsession of mine, so I implemented a
[circuit-breaker TCP proxy in Go](https://thraxil.org/users/anders/posts/2015/07/23/Circuit-Breaker-TCP-Proxy/).

### Mountwatch

At home I have a couple USB drive bays (for playing around with stuff
mentioned below). They're cheap, commodity drives so not totally
reliable. Sometimes they get themselves into a weird state where they
just return "I/O Error" when you try to access them. The drives just
need to be remounted and then everything's fine
again. [Mountwatch](https://github.com/thraxil/mountwatch) is a simple
program to check a list of drives on a regular basis and log a
success/fail to graphite so I can set up a Hound alert to let me know
if one of the bays goes offline. Mountwatch is about 80 lines of code
and uses nothing outside the Go standard library. It runs as a simple
service with one config file so it has a very small ops footprint.

### Reticulum

My *main* Go based side project though is
[Reticulum](http://thraxil.github.io/reticulum/). Reticulum is a
distributed image storage and thumbnailing server. It's one of my
favorite applications I've ever written.

Handling images in web applications over the years has always had a
number of issues. When users are allowed to upload images, they will
upload images. Lots of them. In all different sizes. You need to store
them somewhere, and you probably need to automatically resize them to
multiple sizes (and possibly crop them). Usually the webserver where
your (Django/Drupal/etc) server is running is a bad place to store
potentially large user uploads. You want to be able to dump them onto
another machine that has a bunch of disk and bandwidth dedicated for
it. The webserver is an even worse place to be resizing large images,
severely impacting site performance while imagemagick consumes all the
CPU and disk IO. Resizing the images can either happen at the time the
user uploads the image, or on the fly as the page with the scaled
image is requested (how sorl-thumbnail does it). The former approach
requires that you know ahead of time all the sizes and dimensions that
you will want images resized to so they can be pre-generated. This
limits the flexibility of designers. The latter approach is much
harder to pull off when your images aren't stored and resized on the
webserver. With Django, it also means that the PIL libraries have to
be compiled in, adding an annoying deployment time dependency which
has frequently caused us trouble.

So Reticulum is designed to run on multiple low powered machines, each
with a big disk. Your application POSTs an image to it and it stores N
replicas of the image across the nodes, routing based on a SHA1 hash
of the image content and a distributed hashtable. Then it returns the
hash to your application, which can store that in a database. Images
can then be retrieved from any node in the Reticulum cluster via their
hash along with a string in the URL that specifies the size to scale
the image to. The node handling the request can use the distributed
hash table to figure out which node(s) have copies of the image and
get it from them, resizing it on the fly, and caching the scaled
versions as it goes. Addressing images by hash makes it simple for
Reticulum to detect disk corruption issues and a background thread on
each node periodically walks the entire storage directory checking for
corruption, automatically repairing by pulling down good copies from
other nodes, and checking that the images are stored on the right
nodes (moving things around to deal with nodes being added or removed
from the cluster). Reticulum nodes monitor each other with a simple
Gossip protocol, expanding and contracting the cluster automatically
without manual administration.

I wrote an early version of Reticulum using Django, and using a
RabbitMQ and Celery setup to offload image resizing jobs, gossiping,
and verification work. It worked well as a proof of concept, but
proved to be very resource heavy and a pain to deploy and manage with
all those moving parts. The Go version once again gets deployed as a
single binary file (plus a config file), with everything self
contained. It runs quietly in the background using very little memory
and never crashing. I can lose a hard-drive, replace it, spin up a new
Reticulum node on it, and never lose an image.

All of my personal applications that handle images now use Reticulum
to store and serve them. None of them need any image libraries
included any more. They just store a short string in the database for
each image and generate a URL with that string and a size
specification to put in the IMG src.

Eg,
[here's one of my drawings](http://reticulum.thraxil.org/image/8eea061e63a726facfdcf477cb89457032cc096e/960w960h/1029.jpg). You
can get a small square thumbnail just by changing part of the URL to:
["100s"](http://reticulum.thraxil.org/image/8eea061e63a726facfdcf477cb89457032cc096e/100s/1029.jpg)
or setting any other height or width you want. The image resizing is
specified in [this](https://github.com/thraxil/resize) Go library.

While I was working on Reticulum, I also needed to extract some info
from the EXIF headers in jpgs. Go didn't have a library for that yet,
so I pulled up the EXIF specs, dusted the cobwebs off the part of my
brain that knew how to parse binary files, and
[wrote one](https://github.com/thraxil/exifgo). It looks a lot like C
code, but probably has fewer memory leaks than it would if I'd written
it in C.

### Cask

Finally, my current labour of love on the side is called
[Cask](https://github.com/thraxil/cask). Cask is an extraction of the
non-image specific parts of Reticulum. It is a basic REST accessible
[Content-Addressed Storage](https://en.wikipedia.org/wiki/Content-addressable_storage) cluster.

Like Reticulum, you run a bunch of nodes, each with their own storage
attached. The nodes gossip and form a cluster. You can POST a file to
it and it stores N replicas across the cluster using a
[DHT](https://en.wikipedia.org/wiki/Distributed_hash_table),
addressing by the hash of the file contents. It stores no metadata at
all, just the raw bytes of the file. An active anti-entropy thread
runs in the background on each node, repairing corruption and
rebalancing files across the cluster as necessary to maintain the
desired replication rates. The storage backend is designed to be
pluggable. I started with plain disk backed storage and added S3 and
Dropbox backends and might expand to Google Drive or other cloud
storage services.

When it's a little farther along, Cask will become the layer that
Reticulum builds on top of. I've also replaced my personal
[Tahoe](https://tahoe-lafs.org/trac/tahoe-lafs) cluster (which housed
my music collection, RAW photos, DVD rips, and years of personal
backups) with a service on top of Cask (chunking large files first so
only smaller chunks get stored in Cask).

### Hakmes

[Hakmes](https://github.com/thraxil/hakmes) (means "cleaver" in Dutch)
is that service on top of Cask for handling large file uploads. Cask
is inherently inefficient if you give it very large files. It prefers
to have lots of small files that can be more easily transferred
between servers, etc. Multi-GB files are difficult to move around or
verify efficiently. Hakmes handles the uploading of a large file,
splitting it into manageable chunks, uploading those chunks to Cask,
and storing the list of chunk keys in a small database, giving the
client a "master" key for retrieving from hakmes. The retrieval then
pulls all of those chunks back out of Cask and reconstitutes the
original file on the fly.

## Conclusions and Future Directions

I'm not about to drop Django and start rewriting all of the Center's
applications in Go. The full stack, pluggable application framework
approach is just too good a match for the custom user-facing
application software that we develop.

That said, I do see Go continuing to be a useful tool for
infrastructure, for low level performance sensitive network services
(like the websockets stuff), and for commandline tools that we can
deploy to our servers without worrying about dependencies.

As Go has emerged as a very important language for interesting
infrastructure projects (Docker, Kubernetes, Prometheus, Bosun,
etc. etc.), I also feel like it's worth keeping a close eye on the Go
community to stay updated on those kinds of projects.

I would strongly encourage other developers with any interest in those
areas to invest some time in learning Go. I haven't really discussed
it much, but spending time in a "lower level" systems language where
you have to think a little harder about the problem you are solving is
just good exercise for the programmer mind. Switching back and forth
between Python and Go has proven to be painless and I feel like the
languages complement each other nicely.

## Resources

* A good place to start to learn more about Go is the
  [Go Tour](https://tour.golang.org/list). It uses an interactive web
  environment (essentially a runnable pastebin, that you will
  encounter and use frequently as you spend more time with Go) to
  introduce you to the language.
* [How to Write Go](https://golang.org/doc/code.html) covers the
  basics of setting up a Go development environment, fetching third
  party packages, etc.
* [The Go FAQ](https://golang.org/doc/faq)
* [Effective Go](https://golang.org/doc/effective_go.html) goes deeper
  into the language and introduces idioms and best practices.
* [Go Documentation](https://golang.org/doc/) the central
  documentation hub for Go
* [5 minutes of Go in Emacs](https://www.youtube.com/watch?v=5wipWZKvNSo). screencast
  showing how powerful Go tooling is when you set it up with emacs.
* [Go Koans](https://github.com/cdarwin/go-koans) a fun way to learn Go

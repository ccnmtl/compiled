---
author_name: "Anders Pearson"
author_url: "https://thraxil.org/"
lede: "As an experiment, Anders has ported the ReliefSim application to Google's AppEngine and gotten it running on the free version at reliefsim.appspot.com (the source code for this application has been released on github: github.com/ccnmtl/reliefsim)"
date: "2013-02-09"
topics: 
- Research and Development
tags: ["gae", "googleappengine", "simulation", "turbogears"]
title: "ReliefSim on Google App Engine"
type: "post"
---

As an experiment, <a href="https://thraxil.org/">Anders</a> has ported the <a href="http://ccnmtl.columbia.edu/portfolio/medicine_and_health/reliefsim.html">ReliefSim</a> application to Google's <a href="https://developers.google.com/appengine/">AppEngine</a> and gotten it running on the free version at <a href="http://reliefsim.appspot.com/">reliefsim.appspot.com</a> (the source code for this application has been released on github: <a href="https://github.com/ccnmtl/reliefsim">github.com/ccnmtl/reliefsim</a>).

<!--more-->

## Brief Technical History of ReliefSim

<p>Eric Mattes wrote the original version of ReliefSim as a text-based unix console application. It would run on an account on one of our servers that users could ssh or telnet to and interact with via keyboard commands. ReliefSim has a very detailed model underneath it but has a very simple turn-based interaction model. Each turn, the user assigns each of their "workers" a task, which will take one or more turns to complete. Those tasks involve either gathering information (doing different types of health surveys, etc.) on the camp's population, or working to improve camp conditions in some way (improving food/water supply, giving vaccinations, etc). </p>

<p>The original text-based version was completely stateful. The simulation maintained everything in memory and was shut down when the user disconnected.</p>

<p>A few years back, <span class="caps">CCNMTL </span>contracted an external company to build a web interface to ReliefSim. Our technology stack at the time was TurboGears, so the app was built on that framework. In order to minimize the amount of work involved in the port, the web application was structured in a way that would involve the fewest changes to the underlying simulation as possible. Essentially, the main objects that held the game state were serialized (with Python's built-in 'pickle' capabilities) on each turn and stored in TurboGears' in-memory session storage. Since TG runs as a single, long-lived process, it meant that game state could be maintained for as long as the server process was running, but would be lost on a restart. This wasn't ideal, but saved us so much work that it was deemed an acceptable compromise.</p>

<p>Of course, for the last few years, TurboGears has not been our preferred development/deployment platform and has become increasingly difficult for us to deal with. We've kept our stable of TG apps running but try to treat them as legacy systems.</p>

<p>ReliefSim, in particular, being built on <span class="caps">TG, </span>and not having any active clients at Columbia making use of it is hard to justify spending much developer time on. Nevertheless, we are proud of our little simulation and would like to keep it around in some form, at least for demonstration purposes.</p>

<p>We've also been looking at various external application/platform hosting services as ways to reduce our sysadmin load, and to give external organizations an easier path towards running their own instances of our web applications.</p>

<p>Since the actual "web application" part of ReliefSim is quite small, and the expected traffic is very low, I felt that it made an interesting candidate for attempting to get it running on Google App Engine (GAE). </p>

## Existing Architecture

<p>ReliefSim consists of a simulation module (contained in <a href="https://github.com/ccnmtl/reliefsim/blob/master/simulation.py">simulation.py</a>), which exposes Simulation and WebUI classes, respectively containing the main game logic and helpers for adapting game state to the web framework. The TG component exposes "/", "/new", "/turn", "/execute", "/data" and "/quit", "/game_over", and "/loadData" URLs. Typical flow through the application is that the user visits "/", is prompted to begin a new game, which they initiate by a <span class="caps">POST </span>request to "/new". That creates  new Simulation and WebUI objects, saves them to the built-in user session store, then redirects the user to "/turn". "/turn" just renders an <span class="caps">HTML </span>template and control is handed off to some Javascript libraries which handle the user-interaction of the game. As the user performs actions in the game, Javascript makes <span class="caps">POST </span>requests to "/execute", which retrieves the simulation/ui from the user's session, processes the actions performed, and returns data to the javascript to update the user interface. Eventually, the user "dies" or quits the game and gets sent to the "/game_over" or "/quit" page, both of which just display a message and offer to let the user download their data in csv format (via "/data"). Meanwhile, during game play, if the user turns on contextual help, hovering over a game element triggers a <span class="caps">GET </span>request to "/loadData" to retrieve information about that element which is stored in an <span class="caps">XML </span>file.</p>

## Porting

<p>Porting to <span class="caps">GAE </span>involved replacing only the TG component of ReliefSim. The Simulation module, the Javascript and (most) of the <span class="caps">HTML </span>templates were left unchanged.</p>

<p><span class="caps">GAE'</span>s webapp2 framework makes it very straightforward to associate a class/method with a <span class="caps">URL, </span>so making dummy views to respond to "/", "/new", "/turn", "/execute", etc was very simple.</p>

<p>Things got more interesting quickly when it came time to actually persist game state between <span class="caps">HTTP </span>requests. This is where TG and <span class="caps">GAE </span>start to have fundamentally different world-views. Where we could be sure that our TG app ran as a single process and all threads had access to the same shared session store, <span class="caps">GAE </span>explicitly does <span class="caps">NOT </span>make that same guarantee. Since it is designed to run on Google's big farms of servers, it's very clear that any application state set up in one request will not be accessible on subsequent requests since it will possibly (or probably, even) not be the same process or even the same server handling each request. <span class="caps">GAE </span>doesn't even provide a session store out of the box. webapp2 has one available in an extensions module, but that stores everything in cookies, which is unacceptable for serializations of large game state objects.</p>

<p>Instead, I had to take a more direct route and use the <span class="caps">GAE </span>datastore to store serialized game state objects in the database, effectively implementing my own little database backed session store. When the user hits "/new", a new id is generated, a game started, serialized, and stored to a state object in the datastore as a binary blob under that id. The id is tucked away in a cookie and used to retrieve the state object from the datastore on subsequent hits.</p>

<p>The next issue I hit was that <span class="caps">GAE </span>has a hard limit of 1MB on the request size for any operation, including saving data to the datastore. I quickly discovered that the game state for ReliefSim when pickled as we'd been doing it is in the 4-8MB range. I experimented a bit and found that with zlib, I could compress it down to around 750k, and squeeze it into the datastore.</p>

<p>Templates were then fairly simple to port. I pulled in jinja2 and stripped out the .kid xml-isms and replaced them with a very simple block/extends structure that should be familiar to our django apps. There were actually only one or two places where variables in templates were handled with kid and had to be ported to jinja2. Most of the page manipulation is done through javascript and was left untouched.</p>

<p>The only other not-completely-straightforward thing I had to do to get it working was that <span class="caps">GAE, </span>for whatever reason (probably security restrictions), refused to let me parse the help information <span class="caps">XML </span>file directly off disk. It was a fairly small <span class="caps">XML </span>file though, so I just dropped it inline as a string directly in the Python source and was done with it.</p>

<p>I completed the port, up to the point documented here in about 8 hours total development time. In fairness, a couple of those hours were spent doing a flake8 cleanup of the simulation module to get it in line with our other codebases, and this work was not strictly necessary for the port. The code for the <span class="caps">GAE </span>version is up on our <span class="caps">CCNMTL </span>github account: <a href="https://github.com/ccnmtl/reliefsim">github.com/ccnmtl/reliefsim</a></p>

## Concerns

<p>From a bit of informal testing, everything seems to work the same, and performs about as well on <span class="caps">GAE</span>/appspot as the TG version does on our server.</p>

<p>However, we haven't tested the code rigorously through an entire long game. The game state might get larger after many turns and could exceed the <span class="caps">GAE </span>request size limit. At that point, since the client/server interactions are only happening in javascript, behind the scenes, to a user, it will just appear to fail silently, which will be particularly obnoxious if it happens towards the end of a game that they've invested quite a bit of time on. Clearly more testing is needed here to figure out if/how much game state grows as the game goes on.</p>

<p>Second, now that the game state is actually stored in the datastore rather than in ephemeral memory, it can accumulate. And at 750k+ for each game, that can add up quickly and exceed <span class="caps">GAE'</span>s limits for free apps. To deal with this we should probably write a "scheduled task" (essentially a cron) to clear out game states that are more than a day old. I'm also not sure what kinds of limits <span class="caps">GAE </span>puts on memory usage on a per-request basis. Even though the state can be serialized and zipped down to under 1MB, when it is processing each turn, that has to get expanded out in memory to the full game object, which must be back in the 4-8MB range. Watching the memory usage on our servers while ReliefSim is running, it's definitely a substantial memory load. I haven't triggered any throttling or errors on <span class="caps">GAE </span>yet with my testing, but it wouldn't surprise me too much.</p>

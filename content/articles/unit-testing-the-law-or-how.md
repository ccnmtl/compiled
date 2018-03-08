---
author_name: "Anders Pearson"
author_url: "https://thraxil.org/"
date: "2006-11-30"
topics: 
- Projects
tags: ["n3", "python", "semantic web"]
title: "Unit testing the law or \u201Chow I ended up with an n3 to sql compiler\u201D"
type: "post"
---

<p>The light at the end of the tunnel seems to actually be visible now for the Collateral Consequences project. There's still a formidable amount of manual data entry to be done, but we've got a part-timer on that, so it's not my primary concern. The difficult work is now out of the way. If you've been following the development at all, you know that we've basically got a system worked out and running. There were plenty of tricky problems to solve to get there and I've written about some of them here.</p>

<!--more-->

<p>The last big "how on earth are we going to do that?" problem that I kept putting off solving was verification. This project involves law and even though we have big disclaimers plastered over everything, none of us really wanted to release this application to be used without being really confident that it's not going to give people wrong results. The problem, as I've explained before, is that the inherent complexity makes it really difficult to verify. You could change a single line of N3 code somewhere and potentially affect all the consequences on all the charges. It just isn't feasible to predict exactly what repercussions a change will have without running it for all the charges and manually inspecting the results.</p>

<p>The first step towards coming up with a solution for the verification stuff was to acknowledge that part of the problem is insurmountable. To have confidence in the system, at some point, the lawyers need to just go through the list of charges one by one and check that the consequences are sane. There's just no way around it. Automated verification at least needs that baseline to exist.</p>

<p>To at least make that step not too tedious for them, I added a 'snapshot' functionality to the application which just goes down the list of charges and generates the consequences for each and every one of them and dumps them into a single (big) report that looks like this. As you can see there, we still have a lot of data entry work to do. Checking that report is still going to be a big job once it's all filled in, but it at least saves the law folks the tedium of going through every pulldown menu on the site and waiting for the results page to load for each, etc.</p>

<p>That's probably fine to handle a single release of the application. But part of the purpose of the application in general and our approach of using N3 to model the logic behind the law and the consequences in particular is to keep it easy to update it in the future as the various laws and statutes change. If the entire thing has to be re-verified every time, that kind of kills those advantages.</p>

<p>So the next step was realizing that once we have these snapshots, comparing them is relatively easy and we can produce reports showing just the charges whose consequences changed between two snapshots. Then, the verifiers can focus on just those ones and make sure that the changes are sane looking. It's not foolproof (eg, they still need to be able to recognize situations where charges should have been affected by a change but aren't showing up in the comparison), but it ought to save a lot of time over complete re-verifications. A sample of this report is here. It's pretty much the same as the full report, except it only shows the rows that changed between the two snapshots and displays the old version of the row under the new version so it's easy to see exactly what's different. In that sample report, the only real difference is that the old snapshot was missing the housing related consequences entirely.</p>

<p>Having all of these snapshots archived and available I think will also help provide a sense of transparency on the project that will make it more appealing to the judges and lawyers that need to be convinced of its usefulness. They might not understand the technology that's generating the results, but being able to verify things for themselves should make them a little more comfortable with it.</p>

<p>The snapshots, once a baseline is verified, will also serve as a really powerful unit test for the python side of the application. If I'm changing the code that processes the <span class="caps">N3, </span>eg to improve performance, it will be really nice to compare before and after snapshots and make sure that I haven't inadvertently broken some particular edge case.</p>

<p>That's the overview of how verification is being done. I'd also like to mention a few technical details since I think there are some pretty cool things going on at that level.</p>

<p>N3 is powerful and expressive, but it is a little sluggish. It's not too noticeable on a single query or two, but the full list of charges will be 500 or so. With just a fraction of those, it already takes about 3 minutes to calculate the consequences for all of them. So the first thing that I had to do with generating the reports was to figure out a way to cache them. We want to archive them anyway for comparison purposes, so some kind of serialization was necessary.</p>

<p>What I did was to create a simple database schema for the charges and consequences and a corresponding <span class="caps">SQLO</span>bject model. Since it's a turbogears project, the scaffolding was already in place for that and just wasn't being used. The only slightly unusual approach I took was to use <span class="caps">SQL</span>ite as the underlying database instead of my usual PostgreSQL. <span class="caps">SQL</span>ite is a simple embedded database. It stores all its data in a single file and runs within the python process instead of having a separate database process and communicating with sockets. It doesn't support the full set of <span class="caps">SQL </span>operations, but it supports enough for the simple purpose here. <span class="caps">SQL</span>ite also doesn't deal that well with lots of concurrent reads and writes (since it doesn't have its own managing process, it has to do a lot of locking to prevent bad things from happening when multiple processes are accessing the file at the same time). But the approach here is that a snapshot is generated by processing all the N3 and dumping the output into the database in a batch operation that happens very rarely. Everything else would just be read-only. So concurrency just isn't an issue here.</p>

<p>I started with <span class="caps">SQL</span>ite just because it's so simple to set up. But once I had it, I realized that since the database was just a file, it could be checked into subversion and pushed to production along with the rest of the code. That meant that I could generate the snapshots on my dev machine and push them to production and they'd be viewable there. Querying <span class="caps">SQL</span>ite's also significantly faster than processing <span class="caps">N3, </span>so we can now use the most recent snapshot in the database as a cache. My plan is to have the app, when deployed to production, always just get results from the snapshot and really never even touch the N3 directly.</p>

<p>So basically, what it's doing when I make a snapshot on my dev machine is compiling the N3 down to <span class="caps">SQL </span>and the production server will just be running off the compiled version. Hence the title of this post.</p>

<p>The other interesting bit of technology used was Python's <a href="http://docs.python.org/lib/types-set.html">sets</a> for doing the diffs. Sets were just an incredibly useful datastructure for doing this sort of comparison work. If you have sets consequences1 and consequences2, you can get a list of the consequences that are in 1 and not 2 just with:</p>

<p>      new = consequences1 - consequences2</p>

<p>the ones in 2 that aren't in one:</p>

<p>      removed = consequences2 - consequences1</p>

<p>and the ones that are in both with:</p>

<p>      intersection = consequences1 &amp; consequences2</p>

<p>Much easier than looping over hash keys and doing a ton of comparisons and faster too.</p>

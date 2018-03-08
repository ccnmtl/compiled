---
author_name: "Anders Pearson"
author_url: "https://thraxil.org/"
date: "2009-10-23"
topics: 
- Sysadmin
tags: ["bots", "irc", "python"]
title: "Encouraging the robot takeover"
type: "post"
---

<p>I subscribe to a lot of programming oriented newsfeeds so I seem to have a steady stream of links coming in that I find interesting and like to share with the rest of the dev team. I usually post the links in our IRC channel as a nice way of informally spreading them around to the other developers who might be interested in them. It's nice and simple. Just copy and paste the URL into my IRC client, maybe followup with a line explaining what the link is, and then the other developers will see it and can check it out and we can discuss it. </p>

<!--more-->

<p>For the use case of "share a link with a small community and then discuss", I think it's much easier than sending an email, and really even easier than twitter (plus no obnoxious URL shorteners obfuscating things). </p>

<p>The downside is that not everyone's in the IRC channel all the time. We have a bot that logs the channel, but I don't think many of us rigorously check the IRC logs every time we've been out of the channel for a bit. So sometimes I have a link sitting in a tab in my browser that I want to share with the group but I know that one of the developers who would be particularly interested in it happens to be offline at the moment. So I frequently end up accumulating tabs in my browser until there's sort of a quorum of developers in the channel. That feels like a step back. I might as well be sending a message to a mailing list. What is this, 2003?</p>

<p>This hit me particularly acutely last Friday when it happened that about half the dev team was out that day, and I had some particularly juicy links I wanted to share. I started pondering the problem and came to the conclusion that what I wanted was for the links I (and anyone else) post in the IRC channel to be automatically collected and aggregated into an RSS feed that we could all then subscribe to. So anyone who misses a link in the IRC channel would have a good chance of noticing it come up in their newsreader of choice when they come back. </p>

<p>The most sensible way to accomplish that was probably an IRC bot that would sit in the channel, look for URLs and then re-post them to a Delicious account created specifically for that purpose. </p>

<p>Sky, the reigning IRC bot expert (having set up our ops-keeping and logging bots) was out that day so I couldn't ask him about it. Ethan, one of the few developers in that day, suggested checking out <a href="http://inamidst.com/phenny/">phenny</a>, which is a relatively simple IRC bot written in Python. </p>

<p>Phenny seemed to be just what I needed. I got a phenny-bot running in a couple minutes and started to poke at it to see how it worked. It's built on top of Python's asyncore and async_chat libraries, which are not the most intuitive libraries ever, but are efficient and reliable, and it appeared that Phenny had actually done a good job of making a much more intuitive API accessible. So I could add functionality to Phenny without having to really deal with any of the asyncore madness which surely would've turned my brain into mush on a Friday afternoon. </p>

<p>Even I was impressed when, about ten minutes and an 'import <a href="http://code.google.com/p/pydelicious/">pydelicious</a>' later, I had my own IRC bot that would post URLs up to a delicious account. All I had to write:</p>

<pre><code>from pydelicious import DeliciousAPI
from datetime import datetime

def saveurl(phenny, input):
    """ logs a url so others can check it out"""
    parts = input.split(" ")
    url = parts[1].strip()
    title = " ".join(parts[2:]).strip()
    # the simplest of sanity checks
    if not url.startswith("http://") or not title:
        return

    poster = input.nick
    now = datetime.now()
    comment_url = ("http://quimby.ccnmtl.columbia.edu/ircbot/web/" 
        "?y=%04d&amp;m=%02d&amp;d=" 
        "%02d#%04d%02d%02d%02d%02d%02d" % (now.year,now.month,now.day,
                                           now.year,now.month,now.day,
                                            now.hour,now.minute,now.second))

    a = DeliciousAPI('phennyccnmtl','nottherealpassword')
    a.posts_add(url,title,"posted by %s: %s" % (poster,comment_url))

saveurl.commands = ["url"]
saveurl.example = ".url http://www.example.com/ Title For Link"
</code></pre>

<p>That gets dropped into phenny's 'modules' directory and it's done. When a user in the channel types ".url http://www.example.com/ Title For Link", Phenny will notice the pattern and post that link up to its Delicious account.</p>

<p>Now I feel like I have a bit more of an idea of why the zombie botnets all use hidden IRC channels as their control mechanism. If you're comfortable learning a couple basic commands, you can easily control a whole army of these bots. IRC's built-in distributed, scalable, relatively reliable architecture is proven and tested and you get it pretty much for free when you create a channel. </p>

<p>Phenny gets the job done, but it's far from perfect. To add a new command to Phenny, you have to put it into the 'modules' directory in Phenny's source directory. There's no real API for registering plugins beyond that. It literally does an opendir('modules') and tries to import each .py file it finds there. This means that to add a custom command, you <em>have</em> to fork Phenny. If there's ever a security update to Phenny or something, we're on our own to merge it in. </p>

<p>I'll live with it though. I have a fondness for simple tools that just get the job done without making things more complicated than they need to be.</p>

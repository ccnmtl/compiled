---
author_name: "Anders Pearson"
author_url: https://thraxil.org/
date: 2016-12-01
lede: "How I use a daily checklist."
poster: 
poster_source: ""
poster_sourceurl: ""
tags: ["checklists", "devops"]
title: My Daily Checklist
topics:
- Process
type: post
---

Anyone wandering into the `#devteam` channel in our Slack is likely to see something like this:

![slack screenshot](/img/slack_checklist.png)

Without any context, it's probably a little puzzling.

A while back, I read the [Checklist Manifesto](https://www.amazon.com/Checklist-Manifesto-How-Things-Right/dp/0312430000/) by Atul Gawande.
I have to say that it's one of my favorite recent (non-fiction) reads.
Gawande really makes a good case for the humble checklist as a tool for drastically improving quality and reliability in our processes and team communication.
It's relatively short, inexpensive, and easy to read.
I can't recommend it highly enough.

It's one of those books that is nearly impossible to read and not start thinking about ways to apply it to one's own work.
Ever since, I've been using and advocating checklists all over the place.
The screenshot above is just one of the more visible manifestations of this.

What you see there is my morning work routine turned into a checklist.
It's how I start my work day. I've woken up, fed the cat, gotten some coffee, and settled in at my desk to start working (I work from home, so no commute).
Running through this checklist publicly in Slack is my little ritual to get my day going.
The whole process takes me about 5-10 minutes and then I can start on the rest of my tasks.

Let me go through each of the items on my checklist and explain what I'm doing and why it's there.

### 0. Say Hi to the rest of the team

I work remotely from London while the rest of our team is in NYC.
Any remote worker will tell you that they need to put a little extra effort into remaining visible and in contact with the rest of the team. 

Running through my checklist publicly in the Slack channel is one of the ways I try to do this.
It also keeps me honest and accountable.
If I skip the checklist some day, I hope that someone else will call me out on it.

### 1. Am I caught up on slack?

This is the first item largely because I obviously *already* have slack up.
I'm a few timezones off, so I take a minute or two to read any conversations that may have gone on while I was sleeping.
Usually there isn't much.

It's also the first item on the list because it leads directly to...

### 2. Are there any ongoing incidents?

We have an `#incidents` channel that we use for handling incidents: production outages, security issues, etc.
Anything time-sensitive, potentially public-facing, and important.
Our approach is basically modelled on [Heroku's](https://blog.heroku.com/incident-response-at-heroku).

We are a *very* small team though, with just a couple of developers. We don't have the staff to do 24/7 coverage.
We really don't even have any notion of "on-call".
We just don't have the resources available for that.
We try very hard to keep everything running (and I would argue that we actually have an excellent track-record in this area considering the size of our team), but ultimately, if something breaks outside of normal working hours, no one is *obligated* to do anything about it.

Anyway, if the rest of the team was dealing with an incident but had to go home and leave it unresolved, my highest priority will likely be taking over on that incident (since I'm in London and my work day starts five or six hours before everyone else).

### 3. Is Hound clear?

[Hound](https://github.com/ccnmtl/hound/) is our basic alerting system.
It monitors a whole bunch of metrics on all of our servers and applications and sends out an email if any of them cross a threshold indicating a problem.
It also provides a very basic dashboard showing the current status of all those alerts.
If everything is functioning properly, that dashboard should show all green.

During a normal work day, if Hound sends out an alert, one of us will see it and look into it pretty quickly.

Overnight though, since none of us are on-call, alerts may go unnoticed.
So one of the first things I do is just quickly load that dashboard and verify that everything is green.
It's a faster check than even looking through my email INBOX for alerts.

It also ensures that at least once a day someone (me) has verified that Hound itself is up and running properly.
Hound is pretty reliable, but it gets its data from Graphite, which occasionally has some issues of its own.
If Graphite or Hound are down, we obviously would not get alerts on anything else.

### 4. Is there any new activity in Sentry?

Most of our applications log exceptions to [Sentry](https://sentry.io/).
We've been using Sentry for years and love it.
If there's an exception in a production app, we get an email and a nice stacktrace to help debug it.
If the same exception gets raised a bunch of times, Sentry is smart enough to only send the one email the first time so our INBOXes aren't flooded.

That's a great feature, but it also means that it's easy to miss some significant issues.
If you get the email on the first exception, decide that it's not a high priority to deal with and go about your business, you might not notice if that same error is coming up over and over indicating a serious problem.

So, every morning, I hit the Sentry dashboard and see if there are any new exceptions or if any currently unresolved exceptions in there have had a spike in activity.

### 5. Are all the Jenkins builds healthy?

We practice [Continuous Deployment](https://www.agilealliance.org/glossary/continuous-deployment/) for most of our applications.
CD builds on top of [Continuous Integration](https://www.thoughtworks.com/continuous-integration) and we have a [Jenkins](https://jenkins.io/) server that does all of our CI builds.

One very important rule of CI is "[Fix Broken Builds Immediately](http://martinfowler.com/articles/continuousIntegration.html#FixBrokenBuildsImmediately)".
If a build is broken, everyone is blocked, and the longer it is broken, the trickier it can get to fix.

So, I load the dashboard on our Jenkins server and just very quickly check that every build is in a healthy state, so everyone will be able to hit the ground running when they start their day.
As a side effect, this also ensures that the Jenkins server is healthy and available.

### 6. Are there any urgent emails in my INBOX?

Next, I just scan through my email INBOX to see if there are any messages that look like they might require immediate attention.
Internally, we try to discourage email for urgent tasks, but there might be, eg, email from students or faculty who are having an issue, or from the IT department letting us know that something is going on.

### 7. Are there any resolved PMTs to verify?

The [PMT](https://github.com/ccnmtl/dmt/) is our internal project management tool.
You can basically think of it as a big issue tracker, or kanban system.
Bugs and action items go in there and are assigned to staff.

One of the keys to how it functions is a system of checks and balances around verifying that bugs are fixed or action items completed.
So, as a developer, if I mark an action item as "resolved", the person who originally assigned that action item to me is then responsible for verifying that I've done what they asked me.
This catches numerous miscommunications and misunderstandings.

One thing we've learned over the years though is that resolved items that aren't verified (or re-opened) quickly tend to massively slow down the entire development process.
As a developer, it drives me nuts when I resolve an item only to have it pop back up weeks or months later with some issue that needs to be addressed.
By then, I've probably forgotten all the context involved and moved on to other projects, so it becomes a major hassle to go back to it.

I am forever exhorting others to verify their resolved PMTs quickly, so the least I can do is take care of my own. With this as part of my checklist, no one should ever have to wait more than a work day for me to verify the bugs and action items I've assigned to them.

### 8. Are my PMT hours up to date?

Another important function of the PMT is tracking our hours.
We do a lot of grant funded projects and we have to account for the money spent so we know if we are within budget on each project.
No one likes tracking their hours.
I sure don't.
But I understand why it's important that we do it.
I have also learned that it's *much* easier to keep track of the hours spent on each project when I do it regularly.
You might not like brushing and flossing daily, but once you've gone through an expensive, painful dental procedure or two, you begin to appreciate the benefits.
Likewise, taking a minute or two each morning to just make sure that my hours for the week are updated means that at most, I have to recall what I worked on the previous day and enter that data.

### 9. Do I have any potentially disruptive work planned?

At this point, I simply call out any work that I'm planning on doing during the day that might be disruptive to my coworkers.
Eg, if I expect to have to take a database down for a few minutes during some infrastructure work or if I'm going to upgrade the Jenkins server or something.
Basically anything that they ought to be aware of and might want to plan their own workday around.

### 10. Do I have any planned unavailability?

I also mention whether I expect to be unavailable at any point during the day.
Eg, if I need to run out for a couple hours to take the cat to the vet, or go deal with some Kafka-esque British government bureaucracy.
This is just so everyone knows that if they need to talk to me about something, they should take that into account.

### 11. Do I have any meetings planned?

Really just a continuation of the previous, but this also forces me to explicitly load my calendar and see if I have any meetings scheduled.
It's not entirely uncommon for me to hit this item in the checklist and actually notice an upcoming meeting that had been scheduled a long time ago and I'd totally forgotten about.

### 12. Have I created my TODO list for the day?

Finally, now that I've gone through everything that's likely to be critical or urgent, I take a minute to roughly plan out my work for the day.
I just collect five or six of the highest priority tasks and put them into a TODO list in my notebook so they're right there and visible to me for the rest of the day.
They may be tasks that carried over from the previous day, or new things that have come to my attention due to one of the earlier checklist items.
I may get through some, all, or none of them during the course of the day, but I have at least started with a fairly reasonable, condensed list of the most important things to tackle.

On non-workdays, I often run through an abbreviated version of the checklist, up through item #6.
Again, since I'm not offically on-call, I'm under no obligation to do that, but if I'm at the computer anyway, I don't mind spending a couple minutes basically just checking that nothing is on fire.
I also find that it's easier to build and maintain a habit if I do it every single day.

That's my current checklist.
I've modified it a few times, removing less useful items and adding new items and, I will continue to do that as our systems and team changes.
It only takes five or ten minutes each morning, which isn't much of a burden, and I feel like it does a good job of setting me up for the rest of the day.

I definitely recommend reading the Checklist Manifesto and thinking about whether a similar kind of daily checklist might help you.

---
author_name: "Nick Buonincontri"
author_url: https://ctl.columbia.edu/about/team/buonincontri/
date: 2016-08-26
poster: poster-dev-sys-ops-admin-p1.jpg
poster_source: "Zarina Mustapha"
poster_sourceurl: "https://www.flickr.com/photos/zmustapha/28625321154/"
tags: ["salt", "deployment", "imaging"]
title: "Dev-sys-ops-admin? Part 1"
topics: 
- Sysadmin
type: post
---

At the CTL we have about two dozen utility machines spread over 6 physical locations, as well as another three dozen or so staff laptops.  Managing updates, user accounts, and printers for all these machines is not only a big job, but also one of many small repetitive steps—which makes it ripe for automation.  Having been exposed to DevOps practices at the CTL, I wanted to find a way to corral all these machines in a sustainable way.<!--more-->  The plan consists of three ‘legs’: using [Deploy Studio](http://www.deploystudio.com) to provide the base image, [Salt](https://saltstack.com) to manage configuration, and [Munki](https://www.munki.org) to manage applications.

Deploy Studio is used to provide ‘thin’ base images for these machines.  The image consists of the base OS, a single user, and it is Salt installed.  Using a smaller image permits faster imaging.  It also decreases the complexity of the images, thus increasing their shelf-life.  Creating images is a time-consuming process, and I want to get the most out of each one.

Having Salt preinstalled helps me control the machine once it’s up and running.  The use of a configuration management tool allows placing the config under version control which brings another layer of sanity to the process.  Salt is used to ensure that specific user accounts and credentials are present, and other system config such as power settings and which desktop image to use.

Configuration management tools are really meant for servers, and so, there are some friction points when using Salt for user-oriented machines.  For example, OSX doesn’t have a package manager built in.  Because of this, Salt is used to make sure that Munki is installed by checking if its packages are present.  If not, Salt will download them and install.

Munki—the third leg of the stool—is a tool specifically meant for deploying applications to OSX machines.  This allows me to push out new applications to specific or groups of machines.

Finally, when a new machine is imaged, Salt and Munki do all the heavy lifting for me in a consistent and repeatable way.

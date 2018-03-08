---
author_name: "Anders Pearson"
author_url: "https://thraxil.org/"
date: "2010-07-23"
topics: 
- Sysadmin
tags: ["cloud", "EC2", "hosting", "rackspace", "slicehost", "vps", "xen"]
title: "A Survey of the Clouds"
type: "post"

---

<p>Nothing like having to spend time in a noisy, cold, cramped server
room doing upgrades on hardware to make you appreciate the virtues of
the cloud. </p>

<!--more-->

<p>Here at CCNMTL, we have a pretty diversified setup when it comes to
servers and hosting. <a href="http://www.columbia.edu/cuit/">CUIT</a>
provides a lot of resources for us: a very solid network
infrastructure, DNS, email, file serving, databases, course management
systems, centralized authentication services, backups, and Java and LAMP
app servers. CUIT is tasked with serving the entire University though
so they tend to be a bit more conservative and in their deployments
than an organization like ours, whose mission involves keeping up with
the cutting edge, sometimes needs. So we run a few of our own servers,
using Debian, Ubuntu, and a Xen Hypervisor setup. This lets us run
Django, Plone, TurboGears, PostgreSQL, and experiment freely with
anything else that comes along that we see potential value in, or even
just make sure our applications run with newer versions of software
than what CUIT has deployed. </p>

<p>Our Xen setup has saved us some major headaches over the last few
years and I wouldn&#8217;t go back to a bare OS on hardware setup for our
Linux machines unless you put a gun to my head, but, speaking as the
one who ends up handling most of the administration tasks, hardware
still sucks. Keeping things really reliable and available involves a
lot of redundancy and infrastructure and planning. More than we&#8217;d
really like to spend our time on. We&#8217;re a small organization, we don&#8217;t
have a huge budget for hardware and we don&#8217;t have a full-time
sysadmin. We&#8217;ve got a few programmers who do the sysadmin work on the
side and (I think I can speak for all of us) we really prefer
programming to babysitting server upgrades and losing sleep about what
will happen if a NIC fails or a RAID volume gets corrupted or a power
supply blows up or (like we had to deal with in December) the chilled
water supply to all the server rooms on campus goes offline for a week
for maintenance. </p>

<p>So we&#8217;ve kept a close eye on and dipped our toes into external hosting
solutions in a variety of ways. We have applications and services
hosted externally with mixed results. We&#8217;ve also had a couple virtual
servers running at <a href="http://slicehost.com/">Slicehost</a> for a
few years. </p>

<p>Slicehost saved our chassis during that chilled water affair since we
were able to allocate some more space there and move our highest
priority applications to Slicehost so they wouldn&#8217;t be affected by the
issues on campus. </p>

<p>This latest round of dealing with our servers has re-affirmed for us
that we&#8217;d like to be moving away from running our own server
hardware as much as possible and prompted a fresh surveying of the
virtual server hosting landscape.</p>

<p>When we first signed up to Slicehost, they were far and away the best
deal and one of the most highly regarded VPS hosts. That was a few
years ago though and the hosting world doesn&#8217;t sit still. Now there&#8217;s
a lot more competition to look at just in the Xen VPS hosting world
plus interesting options of a different nature such as Amazon EC2 and
Rackspace Cloud Servers.</p>

<p>We thought it might be edifying for us to share our research. No one
else out there is likely to be in exactly the same situation as us, so
this won&#8217;t be directly applicable to anyone else, but perhaps the
approach we take to research and evaluation might be helpful to
share. </p>

<p>Unfortunately, there are such a multitude of options out there that we
can&#8217;t directly address everything, so this summary will be limited. In
particular, it will really only cover full server hosting. There&#8217;s
very interesting stuff going on with application hosting like Google
App Engine, various cloud file storage (S3, etc.) and cloud database
services, but for now we&#8217;re just looking at services that could be
considered a fairly straightforward replacement for our Ubuntu virtual
machines (both our locally hosted and Slicehost hosted ones). Those
other topics could make for interesting future posts, perhaps. </p>

<p>First, a summary of our current situation as a baseline. We have three
slices on Slicehost, two 512MB and one 256MB. We pay a total of about
$96/month for that. Slicehost includes bandwidth up to 300GB/month for
the larger slices (150GB/month for the smaller) in that price and
charges per GB after that, but we&#8217;ve never even come remotely close to
using our bandwidth allotment. It&#8217;s hard to tell our exact bandwidth
usage from Slicehost&#8217;s admin tools, but it seems to be on the order of
just a couple GB per month.</p>

<p>In part, this is because we have essentially free bandwidth on campus
and we&#8217;ve specifically chosen so far to only move applications that we
know wouldn&#8217;t be very bandwidth intensive offsite. But, aside from the
video related work we do, which will probably stay local for longer
than other things, most of our applications shouldn&#8217;t need tons of
bandwidth. At CCNMTL, we typically deal with applications that serve a
relatively small audience (often a class or two at a time) and don&#8217;t
have particularly high bandwidth or CPU requirements on their own. The
catch is that we build and deploy a lot of these, they have to be
available very reliably, and we have to keep them around for years and
years (we have projects that have been active for over a decade now). </p>

<p>The main division in our set of options is VPS vs Cloud. There is
overlap but the two have slightly different aims. For our purposes,
&#8220;VPS hosts&#8221; pretty much all follow the same model as Slicehost. You
get a virtual server with a certain amount of RAM, disk, bandwidth,
and guaranteed CPU cycles for a fixed monthly rate. Typically you can
allocate new servers on demand through a web interface and
decommission old ones. Instances are persistent and when you allocate
a new one, you get a clean base install to start with. Their primary
use-case is someone who wants root on one or more servers for
relatively long-term, stable usage and just doesn&#8217;t want to have to
deal with hardware. &#8220;Cloud Services&#8221; offer virtual servers at an hourly
rate and have programmatic APIs for making new instances, shutting old
ones down, etc. You are billed only for the actual hours that the
server is using CPU cycles. The primary Cloud use-case is someone who
needs burstable capacity. Ie, they occasionally need a lot of CPU or
bandwidth but don&#8217;t want to pay the overhead of having all of it
running all the time.</p>

<h2>VPS Hosting</h2>

<p>Let&#8217;s look at the current VPS world first. There are tons of VPS hosts
now, most of them looking pretty much the same. It would take forever
to look at all of them, so I&#8217;m narrowing it down to a couple that seem
to be the major players and that keep coming up in conversations with
people. <a href="http://slicehost.com/">Slicehost</a>, <a
href="http://linode.com/">linode.com</a>, and <a
href="http://prgrmr.com/">prgrmr.com</a>. All of them
have pretty solid reputations for uptime and reliability. They all
support Ubuntu 10.04 Lucid servers (both 32 and 64 bit). There are
others out there but they all pretty much line up with one or the
other of those.</p>

<p>Slicehost is obviously the one we&#8217;re most familiar with. It offers
slices with the following configurations:</p>

<pre><code>            RAM     DISK    BW      PRICE
256 slice   256MB   10GB    150GB   $20 
384 slice   384MB   15GB    225GB   $25 
512 slice   512MB   20GB    300GB   $38 
768 slice   768MB   30GB    450GB   $49 
1GB slice   1024MB  40GB    600GB   $70 
1.5GB slice 1536MB  60GB    900GB   $100
2GB slice   2048MB  80GB    1200GB  $130
3GB slice   3072MB  120GB   1800GB  $190
4GB slice   4096MB  160GB   2500GB  $250
8GB slice   8192MB  320GB   2500GB  $450
15.5GB slic 15872MB 620GB   2500GB  $800
</code></pre>

<p>Linode&#8217;s offerings:</p>

<pre><code>             RAM     DISK   BW      PRICE
Linode 512   512MB   16GB   200GB   $20
Linode 768   768MB   24GB   300GB   $30
Linode 1024  1024MB  32GB   400GB   $40
Linode 1536  1536MB  48GB   600GB   $60
Linode 2048  2048MB  64GB   800GB   $80
Linode 4096  4096MB  128GB  1600GB  $160
</code></pre>

<p>Prgrmr (who are currently at capacity and not taking new customers,
but&#8230;)</p>

<pre><code>             RAM     DISK    BW     PRICE
             64MB    1.5GB   10GB   $5
             128MB   3GB     20GB   $6
             256MB   6GB     40GB   $8
             512MB   12GB    80GB   $12
             1024MB  24GB   160GB   $20
             2048MB  48GB   320GB   $36
             4096MB  96GB   640GB   $68
</code></pre>

<h2>VPS Conclusions</h2>

<p>Benchmarking VPS hosts is a difficult task (since they all do
burstable CPU and IO, meaning that while you are guaranteed a certain
base level of performance, if the physical machine a virtual server on
is not under much load, you&#8217;ll get even more resources). Benchmarks
pop up all the time and often claim contradictory results so I won&#8217;t
put much stock in them. <a
href="http://journal.uggedal.com/vps-performance-comparison">This
one</a> is typical. It&#8217;s pretty thorough, but doesn&#8217;t really avoid the
fundamental difficulty of accurately benchmarking virtual server. </p>

<p>Linode doesn&#8217;t offer anything smaller than 512MB. This is too bad
since I&#8217;ve found that 256MB seems to be more than enough for running
quite a few relatively low traffic web applications. We have 512MB
slices on Slicehost currently and don&#8217;t come anywhere near using the
memory or disk available on them (one slice runs our Project
Management Tool, Movable Type, and some other misc stuff while the
other runs some TurboGears apps).  On the other hand, Linode&#8217;s 512MB
option is priced the same as Slicehost&#8217;s 256MB slice. Generally,
Slicehost appears to be significantly pricier than its
competition. One may observe that Slicehost hasn&#8217;t adjusted their
pricing since we started using them several years ago. They&#8217;ve made
more larger slice options available, but a 256MB slice a couple years
ago was $20 and it&#8217;s still $20 now. </p>

<p>Prgmr is very barebones. They have a solid reputation but are clearly
aimed at people who know what they&#8217;re doing and don&#8217;t need a shiny
control panel. Their founders are authors of a book on Xen and are
involved in that community. They&#8217;re obviously cheapest, but it&#8217;s also
interesting that they scale down the furthest to 64MB servers. That&#8217;s
probably less than we would be comfortable running a
Django/Apache/PostgreSQL type setup on, but there might be a use case
for it somewhere (irc bots or monitoring or something?). They do seem
to have a problem provisioning equipment though. Whether it&#8217;s because
they are getting customers too quickly or if they are specifically
limiting themselves and trying to stay small is hard to
tell. Slicehost went through some of the same things back when we
started with them where you had to get on a waiting list for a new
slice. Anyway, it means that it&#8217;s a little riskier as far as not being
able to fire up new servers as needed there. Anyway, the fact that
they&#8217;re currently (as of July 2010) out of space makes them a
non-starter for us. We&#8217;ll include them in future searches, but we&#8217;ve
got to count them out this time.</p>

<p>Now, with a sense of the state of VPS hosting, we can look at Cloud
hosting.</p>

<h2>Cloud Hosting</h2>

<p>The two main players here are <a
href="http://aws.amazon.com/ec2/">Amazon EC2</a> and <a
href="rackspacecloud.com/cloud_hosting_products/servers">Rackspace
Cloud</a>. Amazon practically invented the field and continues to be a
primary innovator. Rackspace have been a major hosting and colo
provider for a long time, recently purchased Slicehost and appear to
be aggressively entering Cloud hosting territory as well. Presumably,
they want to have all the options covered. There are others like
Ubuntu Enterprise Cloud but nothing with the weight behind it of those
two.</p>

<p>Pricing with Cloud hosting is much more complicated so it becomes
difficult to compare directly. However, since we&#8217;re looking at it as a
potential replacement for VPS hosting, we can ignore a lot of things
(though the increased flexibility is still something we might want to
think about in the future and having it available is nice). Eg, Amazon
makes disk persistence and static IP addresses (both things we need)
available via separate services (<a
href="http://aws.amazon.com/ebs/">Elastic Block Storage</a> and Elastic IP
Addresses) with their own price structures.</p>

<p>Let&#8217;s start with EC2. </p>

<p>Amazon offers Standard, High-CPU, and High-Memory options. Each of
those is then available as Small, Large, or Extra-Large sizes. Our
web-apps don&#8217;t tend to be particularly CPU or Memory bound so we
probably only are interested in the Standard options. Those look like:</p>

<pre><code>Small        1.7GB  160GB    $0.085 per hour
Large        7.5GB  850GB    $0.34 per hour
Extra Large  15GB   1.6TB    $0.68 per hour
</code></pre>

<p>Prices drop if you sign up for a full year term (or 3 years, but given
how quickly things change, I don&#8217;t think we&#8217;d want to tie down our
hosting that far into the future). For reserved instances, you pay a
one-time fee up front and then a much lower hourly rate. For the
standard options,</p>

<pre><code>             UP FRONT   HOURLY
Small        $227.50    $0.03/hr 
Large        $910       $0.12/hr
Extra Large  $1820      $0.24/hr
</code></pre>

<p>Amazon charges per GB for bandwidth to and from your machines, but
it&#8217;s only $0.15 or so per GB and for our purposes would be pennies
to a few dollars a month. It is something we do need to keep in mind
if we find ourselves wanting to deploy services in the future that
have higher bandwidth requirements though. </p>

<p>To persist your EC2 instances between boots, you need to set them up
to mount EBS volumes. EBS costs $0.10 per GB per month. So, for a
Small EC2 instance with 160GB disk, that&#8217;s $16/month. (EBS also
charges you $0.10 per million I/O requests, but that&#8217;s going to be
pretty negligable). Also, if we don&#8217;t actually need the full 160GB, we
can make it smaller and pay proportionally less.</p>

<p>Static IP addresses are also extra but are priced so that they&#8217;re
practically free except you pay more if the IP address is allocated
but not actually being used. I.e., they just try to keep people from
hoarding more IP addresses than they actually need.</p>

<p>If you just needed a machine for a few hours to run a compute
intensive task, obviously EC2 is a great deal since you can just pay a
couple bucks for a few hours instead of committing to entire months at
a time.</p>

<p>We&#8217;re looking at keeping servers running more or less 24/7 and wanting
to persist between reboots, so converting to hourly rates is probably
the most sensible way to compare.</p>

<p>Since we can probably commit to a year at a time, reserved instances
make sense for us. So, with EBS storage figured in:</p>

<pre><code>             RAM        DISK      PRICE
Small        1.7GB      160GB     $56/month
Large        7.5GB      850GB     $248/month
Extra Large  15GB       1.6TB     $486/month
</code></pre>

<p>If we don&#8217;t need the full size of those disks to persist and limit it
to, say, 20GB, those prices drop to $42, $177, and $328, respectively.</p>

<p>Now we can easily see that their &#8220;Small&#8221; instance is actually priced
competitively with Linode (and even gives you quite a bit more disk)
and significantly cheaper than Slicehost&#8217;s 1.5GB slice. </p>

<p>There&#8217;s more work involved in setting up an EC2 instance as far as learning
Amazon&#8217;s tools and APIs and building an AMI, but the flip side of that
is that once we&#8217;ve done that work we&#8217;re closer to being able to do
really fancy things like automatic scaling (a server detects that it&#8217;s
under heavy load and spawns another EC2 instance to help out) plus we
get to make use of other parts of Amazon&#8217;s infrastructure like <a
href="http://aws.amazon.com/sqs/">SQS</a>, 
S3, <a href="http://aws.amazon.com/elasticmapreduce/">Elastic
MapReduce</a>, 
<a href="http://aws.amazon.com/elasticloadbalancing/">Elastic Load
Balancing</a>, 
<a href="http://aws.amazon.com/simpledb/">SimpleDB</a>, <a
href="http://aws.amazon.com/cloudfront/">CloudFront</a>, 
<a href="http://aws.amazon.com/sns/">SNS</a>, <a
href="http://aws.amazon.com/cloudwatch/">CloudWatch</a>, <a
href="http://aws.amazon.com/rds/">RDS</a>,
etc. Pre-built EC2 images (AMIs) are also becoming 
available as appliances. Furthermore, there is a lot of mindshare
around the AWS APIs with nice Python libraries available and ream upon
ream of tutorials written on how to build your apps around them.</p>

<p>Our primary issue with EC2 is that it doesn&#8217;t currently scale <em>down</em> as
far as we&#8217;d like. A machine with 1.7GB of RAM is overkill for a lot of
our needs but that&#8217;s as small as you can provision through EC2. </p>

<p>We really like to keep things very granular and compartmentalized e.g.,
by keeping Django apps on a separate server from TurboGears apps from
LAMP apps from Plone apps. That lets us do updates with fewer worries
about complex dependencies and breaking things that are seemingly
unrelated. This means that we strongly prefer running multiple smaller
virtual servers that each have a very specific purpose to running one
large one with a bunch of different things. With VPS hosts, we can do
that with 256MB servers (or even 512MB) at $20 or less per
server. With EC2, it&#8217;s pretty much $40 - $60 each so that adds up quickly.</p>

<p>The other small issue with EC2 is that EC2 instances are 32-bit until
you get into the Large or Extra Large size. It&#8217;s not a big deal, but
our current Python oriented servers and dev environments are 64-bit
and it occasionally requires some tweaking to deployment scripts or
repackaging of eggs to deal with more than one type of platform.</p>

<p>With that in mind, let&#8217;s look at RackSpace Cloud.</p>

<p>Their offerings:</p>

<pre><code>RAM        DISK     HOURLY   PER-MONTH
256 MB     10 GB    1.5¢    $10.95
512 MB     20 GB    3¢  $21.90
1024 MB    40 GB    6¢  $43.80
2048 MB    80 GB    12¢     $87.60
4096 MB    160 GB   24¢     $175.20
8192 MB    320 GB   48¢     $350.40
15872 MB   620 GB   96¢     $700.80
</code></pre>

<p>Definitely some appeal there. Disk is a bit less and they don&#8217;t offer
all the additional services that Amazon does and there aren&#8217;t as many
third party libraries, etc to deal with their API, but it appears to
be a pretty simple, sane REST + JSON (or XML if you prefer) sort of
deal, so it shouldn&#8217;t be too bad. Rackspace also does the more
VPS-like burstable CPU while EC2 gives you more explicitly limited
CPU. EC2 is extremely predictable in terms of performance, but
Rackspace has that &#8220;you usually get more than you pay for&#8221; appeal. </p>

<p>Obviously, it&#8217;s also notable that Rackspace Cloud <em>does</em> scale
down the the 256MB level, which is something we care about.</p>

<p>Ian Bicking&#8217;s <a href="http://cloudsilverlining.org/">Silver
Lining</a> project, which is sort of Google App Engine meets
<a href="http://github.com/ccnmtl/ccnmtldjango/">ccnmtldjango</a>
meets pre-built AMI is currently focused on 
deploying to Rackspace Cloud. I&#8217;m not in a big hurry to jump on Silver
Lining, but it&#8217;s interesting to note.</p>

<h2>Overall Conclusions</h2>

<p>To recap, here&#8217;s a very rough comparison of all the options at (or as
close to as is available) the 512MB size:</p>

<pre><code> Host          RAM    Disk   BW          Cost
 Slicehost     512MB  20GB   300GB free  $38
 Linode        512MB  16GB   200GB free  $20
 Prgrmr        512MB  12GB   80GB free   $12
 EC2           1.7GB  20GB   $.15/GB     $42
 Rackspace     512MB  20GB   $.22/GB     $22
</code></pre>

<p>Slicehost is seriously looking like the least attractive option at the
moment. What they have going for them is that we are already on
Slicehost and we haven&#8217;t really had any major issues with them. As far
as expanding our external hosting though, it doesn&#8217;t seem to be where
we want to be going. Even without moving to Cloud hosting, it looks
like we ought to test out Linode for future VPSes. Prgrmr is
interesting but if they can&#8217;t provide new images quickly, that&#8217;s
pretty limiting.</p>

<p>Whether we want to test the waters of EC2 or Rackspace Cloud is a more
strategic question. Scaling on demand is something that we so far
haven&#8217;t needed all that much in the past. On the other hand, we&#8217;ve
been developing for years with it always in the back of our heads that
we just <em>can&#8217;t</em> scale on demand. E.g., when a situation pops up that we
really could use more resources for a short time (the <a href="http://ccnmtl.columbia.edu/portfolio/social_sciences/millennium_village_s.html">Millennium Village Simulation</a> or <a href="http://ccnmtl.columbia.edu/portfolio/law/collateral_consequen.html">Collateral
Consequences</a> launches come to mind), we just haven&#8217;t been in a
position to dynamically add a new machine and load balance to it so
we&#8217;ve concentrated instead on making due with what&#8217;s there and keeping
things hobbling along until traffic decreases. Investing the time in
getting comfortable with these Cloud hosting services could change
that and we could find that we start developing and deploying
differently. Amazon&#8217;s offerings are particularly intriguing in that
respect. They pretty much encourage you to decentralize, load balance,
and overall structure things in very flexible, reliable ways.</p>

<p>Rackspace Cloud has a bit more of a VPS feel to it and is worth
checking out for that reason. It kind of feels like a Cloud/VPS hybrid
and I think that might be what we want. I.e., it&#8217;s kind of like
Slicehost but cheaper and with an API that we can use to load our own
images on demand (none of the VPS hosts let you upload your own image;
you have to use one of their supported options. EC2 and Rackspace both
have pretty specific requirements on their images, but you are able to
download them to keep your own backups, clone new images off old ones,
etc).</p>

<p>Rackspace Cloud is probably the lowest risk Cloud hosting option for
us to check out while EC2 has a potentially higher payoff in terms of
access to the whole AWS ecosystem. With Amazon and Rackspace we also
have the option of only paying by the hour for our experiments so it&#8217;s
mostly a matter of how much programmer time we can spare. </p>

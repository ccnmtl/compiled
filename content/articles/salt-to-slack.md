---
author_name: "Anders Pearson"
author_url: http://ctl.columbia.edu/about/team/pearson/
date: 2016-05-25
lede: "It's extremely helpful to know what's going on with our systems at a glance. One area where we lacked visibility and occasionally ran into conflicts were configuration management runs. We use Salt for our configuration management and orchestration, and here is how we make Salt operations visible to our team in Slack."
tags: ["salt", "slack", "chatops"]
title: Salt to Slack
topics:
- Sysadmin
type: post
---

While we aren't entirely on the
[chatops](https://www.pagerduty.com/blog/what-is-chatops/) bandwagon
at CTL (yet), I do believe that visibility is important to
operations. It's often extremely helpful to know what's going on with
our systems at a glance. We have a `#monitoring`
[Slack](https://slack.com/) channel that [Github](https://github.com/)
and [Travis CI](https://travis-ci.org/) as well as our internal
[Jenkins](https://jenkins.io/) server publish into so we can quickly
see when pull requests come in or are merged, when tests fail, and
when deployments are running. If you're working on an application, you
may see a pull request go by that looks like it might conflict with
what you're working on and you can back out some changes before you
get too far. Or if you're thinking of deploying some code, but you see
that there are already a bunch of deployments happening, you might
decide to hold off for a bit.

One area where we lacked visibility and occasionally ran into
conflicts were configuration management runs. We use
[Salt](https://saltstack.com/) for all of our configuration management
and orchestration. With Salt, like most other CM systems, you edit
files to define the overall configuration of your infrastructure, then
you run a command with basically says "update the servers to match the
config". In Salt's case, that is done by running a
"[highstate](https://docs.saltstack.com/en/latest/ref/modules/all/salt.modules.state.html#salt.modules.state.highstate)"
command on the Salt master server. That works fine as long as only one
person is making changes and running highstates. If two people are
trying to do it at the same time without coordinating, it gets
confusing fast. It's also the sort of thing that you'd like to know
about if you're deploying applications. In the course of a highstate,
Salt may install packages and restart services left and right. This
can cause deployments to fail in strange ways and you can spend a lot
of time debugging if you didn't know that a highstate happened while
you were deploying.

Running a highstate also sometimes has unintended consequences. A typo
in a config file might break something for a different application in
a non-obvious way. Our monitoring systems *should* detect that, but
there can be a delay and we still have large gaps in our
monitoring. The Slack state files are tracked in git so we have a nice
history and audit trail there, but you still don't know exactly when
the changes you see in git were applied via a highstate, so post-facto
debugging can still be a chore. Salt also lets you run arbitrary
commands across machines, which is handy for, eg, restarting a service
that's acting up. Those commands can change the state of the servers
and further complicate debugging.

So I really wanted to make Salt highstates and commands visible in our
Slack channel to provide a basic audit log and improve coordination.

To implement this, I made use of Salt's
[Reactor System](https://docs.saltstack.com/en/latest/topics/reactor/index.html). The
reactor system lets you trigger arbitrary commands from Salt's
internal [events](https://docs.saltstack.com/en/latest/topics/event/index.html).

You configure Salt Reactor by putting an `/etc/salt/master.d/reactor.conf` file on the
salt master that tells it to map classes of events to handler. We use
reactors for a few other things as well, but the part that's relevant
here looks like:

```
reactor:
  - 'salt/job/*/new':
    - /srv/reactor/slack.sls
```

That tells Salt to pass every new job event (basically anything that
is run manually) to the `slack.sls` reactor. The reactor is a bit
trickier with an ugly mix of YAML and Jinja syntax:

```
{% if data['fun'] == 'state.highstate' %}
slack-highstate:
  local.cmd.run:
    - tgt: saltmaster
    - arg:
      - /usr/local/bin/salt_slack {{data['tgt']}} {{data['tgt_type']}} {{data['fun']}} {{data['arg']}}
{% endif %}

{% if data['fun'] == 'state.sls' %}
slack-state:
  local.cmd.run:
    - tgt: saltmaster
    - arg:
      - /usr/local/bin/salt_slack {{data['tgt']}} {{data['tgt_type']}} {{data['fun']}} {{data['arg']}}
{% endif %}

{% if data['fun'] == 'cmd.run' and data['tgt'] != 'saltmaster' %}
slack-highstate:
  local.cmd.run:
    - tgt: saltmaster
    - arg:
      - /usr/local/bin/salt_slack {{data['tgt']}} {{data['tgt_type']}} {{data['fun']}} {{data['arg']}}
{% endif %}
```

The three event subtypes that we want to handle are `state.highstate`,
`state.sls`, and `cmd.run`. Whenever one of those is seen, it pulls
out a few fields of data from the event and runs a `salt_slack`
command on the salt master with those fields as arguments. The
`cmd.run` stanza has a very important conditional on it (`data['tgt']
!= 'saltmaster'`). That tells it to ignore `cmd.run` events running on
the salt master itself. That's important because the `salt_slack`
command is run via `cmd.run`. Triggering another `cmd.run` every time
it sees a `cmd.run` would cause a nice infinite loop. I can tell you
from experience, an infinite loop on your salt master is not a fun
time.

Finally, the `salt_slack` command is a little Python script that turns
the data from the events back into something intelligible and sends it
to Slack's webhook:

```
#!/usr/bin/env python
import requests
import json
import sys

ENDPOINT = "https://hooks.slack.com/services/<slack token goes here>"

channel = "#monitoring"
emoji = ":computer:"

target = sys.argv[1]
target_type = sys.argv[2]
fun = sys.argv[3]
args = ""
if len(sys.argv) > 4:
    args = sys.argv[4]

args = args.strip("[]")

def deformat(target, target_type):
    if target_type == "glob":
        return target
    if target_type == "grain":
        return "-G " + target
    return target

command = "salt %s %s %s" % (deformat(target, target_type), fun, args)

payload = dict(
    channel=channel,
    mrkdwn=True,
    username="salt-bot",
    icon_emoji=emoji,
    attachments=[
        {
            "mrkdwn_in": ["text", "fallback"],
            "fallback": command,
            "text": "`" + command + "`",
            "color": "#F35A00"
        }
    ]
)

data = dict(
    payload=json.dumps(payload)
)

r = requests.post(ENDPOINT, data=data)
```

Now, when someone runs `salt '*' state.highstate`, `salt -G
roles:postgresql state.sls`, or `salt -G roles:nginx cmd.run 'nginx
restart'`, those commands are immediately posted to our Slack channel
for everyone to see.


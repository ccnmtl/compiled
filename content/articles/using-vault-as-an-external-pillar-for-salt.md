---
author_name: "Anders Pearson"
author_url: http://ctl.columbia.edu/about/team/pearson/
date: 2017-05-22
lede: "A few tricks for storing configuration secrets in Vault"
poster: 
poster_source: ""
poster_sourceurl: ""
tags: ["devops", "salt", "vault"]
title: Using Vault as an external pillar for Salt
topics:
- sysadmin
type: post
---

We've been trying to up our security game lately.
One of the areas we identified as needing improvement was storage of credentials, keys, and passwords that our configuration management uses.

We use [Salt](https://saltstack.com/) as our configuration management tool of choice. Salt already lets you separate your setup into 'states' and the 'pillar' where states describe how various components are deployed and configured and the pillar is a relatively simple data structure of values that can be plugged into the states when they are run.
At a very high level, you can think of Salt states as functions and the pillar data as the parameters that are passed to those functions.

It's already a best practice to keep the states and pillar data in separate git repos and to keep sensitive data out of the state definitions.
Even if the pillar repo isn't any more secure than the states repo, that simplifies basic tasks like changing passwords or rotating credentials.

But, we still ended up with the pillar repo containing more sensitive information unencrypted in one location than we were really comfortable with.

The solution we've come up with for this is using Hashicorp's [Vault](https://www.vaultproject.io/) as an "external pillar" for Salt.
They rhyme, so they *must* work well together, right?

Vault is a fantastic project.
Vault is the swiss army knife of secret management and security.
If you're dealing with sensitive data at all, it's worth checking out.
It's well designed and relatively simple to work with.
So far, we are only making use of a tiny fraction of Vault's functionality, but I can see it working its way into more and more of our infrastructure.

Salt has a [module for using Vault as an external pillar source](https://docs.saltstack.com/en/latest/ref/pillar/all/salt.pillar.vault.html).
Documentation is a bit thin though.
That page with the basic API description and a few examples is about all I could find.

We hadn't used any external pillars with Salt before, so it took a bit of research to even work out exactly what that is and how it works.
This article on [using Consul as an external pillar source](https://opencredo.com/saltstack-using-consul-as-an-external-pillar-source/) was the most useful resource that I found and it cleared a lot up for me.
I was able to go from there to work out how to do the same thing with the Vault external pillar.

I did run into a few additional tricky bits though so I thought it would be good to explain a little more about how to make this combination work.

First, I'm going to assume that if you are reading this that you already have a Salt setup that works for you and that you have a working Vault setup and that you understand the basic concepts of each individual tool.
There are an abundance of tutorials for those online already.
No need for me to repeat it all here.

With Vault (and security in general), granularity is key. We use Vault for other things besides just Salt integration (eg, as our basic shared password manager for admins), so the first step is to split off a bit of Vault's path hierarchy for Salt to use and set up a policy giving Salt the bare minimum amount of access to Vault to allow it to read only what it needs to be able to read and nothing else.

I made a `salt.hcl` policy file for vault:

```
path "sys/*" {
  policy = "deny"
}
   
path "secret/salt/*" {
  policy = "read"
}
```

The first stanza is actually redundant as Vault uses a whitelist approach and denies access by default.
But `sys/` is Vault's internal configuration path and I like to always explicitly deny access to that section.
The second stanza just lets it read from under `secret/salt/` and that's it.
There's no reason for Salt to be able to write anything to Vault or to read from anywhere else.
That gets loaded in:

    $ vault policy-write salt salt.hcl

And then we create a token that Salt will be able to use to access Vault:

    $ vault token-create -policy=salt

In the `/etc/salt/master` config for Salt, we point it at the Vault server and give it that token by adding a couple little bits at the end:

```
   vault_config:
     vault.host: <vault host>
     vault.port: 8200
     vault.scheme: http
     vault.token: <token>
   
   ext_pillar:
    - vault: vault_config path=secret/salt/pillar_data
```

To test it out, I authenticate as a vault admin and write out some data:

    $ vault write secret/salt/pillar_data foo=bar
    Success! Data written to: secret/salt/pillar_data

Refresh the pillar data:

    $ salt master saltutil.refresh_pillar

And read it:

    $ salt master pillar.item foo
    master:
       ----------
       foo:
           bar

This is a working setup.
Salt is accessing pillar data that is securely stored in Vault.
From here out, I just want to make some clarifications and suggest some improvements.

One thing that caught me by surprise was that Salt uses a single Vault entry to store all the data for the external pillar rather than making use of the hierarchical path structure that Vault provides.
You can set up multiple external pillars by adding additional `- vault: vault_config path=secret/salt/pillar_data` lines to the config and changing the path.
This is particularly useful if different groups of admins might be responsible for different areas and you want to be able to further segregate and limit access.
Adding those requires changing the Salt config and restarting the Salt master each time, so you probably don't want to have to explicitly configure different paths for every secret that Vault is storing.
From the Salt side, it's much more convenient to let it use one or two paths for everything.

That gets annoying from the Vault side though.
Vault has some nice features for outputting complicated data in JSON or YAML but editing an entry with complex data is not so simple.
We have dozens of secrets stored in ours in a nested structure (Django server secrets, AWS credential pairs, database passwords, etc.).
Editing the `pillar_data` entry involves writing the data out to a JSON file, extracting the `data` key from that, editing the contents of that key, saving that new JSON object to a file, then writing it back to vault:

    $ vault read -format=json secret/salt/pillar_data > data.json
    $ emacs data.json
	# ... do a bunch of complicated edits to raw JSON ...
	$ vault write secret/salt/pillar_data @data.json

JSON is not exactly a friendly format for editing by hand.
It's way too easy to mess it up and it can be very difficult to see the structure when there are more than a few entries.
Vault can output data in YAML format, which is much nicer to work with, but can't read it back in as YAML.
You need an extra conversion step.
I worry that if that's the process admins have to go through every time they want to add a credential to the pillar data, they'll eventually start taking shortcuts and we'll end up with those secrets winding up in unencrypted pillars or state definitions.

With that workflow, it's also *way* too easy to forget to delete the `data.json` file afterwards.
If you accidentally leave that sitting around in plaintext, it kind of defeats the purpose of storing your data in Vault.

To make this process simple, I wrote a little wrapper script:

<script
src="https://gist.github.com/thraxil/44e9ca72bd160e9a385206c07335e455.js"></script>


It calls Vault to write the entry out to a temp file as YAML, and invokes your `$EDITOR` (defaulting to emacs) on it.
You make your changes, save and exit, then it reads the YAML, writes it back out as JSON, and finally writes that back out to Vault.
Python's `tempfile` library ensures that those files are deleted immediately after we're done with them.

There's still an important danger here. Vault uses a very simple "last write wins" strategy for dealing with concurrent writes.
What that means is that if more than one admin is editing the pillar data, only the writes from the last one will be saved.
Earlier ones will be overwritten without any warning.

We only have a couple developers who might be updating pillar data so we deal with this in a low-tech fashion. We have a `#sysadmin` channel on our Slack and we announce there when we're about to update the pillar and when we're done, effectively doing a manual mutex operation.
If you have more admins doing more frequent changes, I would recommend adding an actual locking mechanism to the script above, perhaps connecting it to something like [Consul](https://consul.io/) or [etcd](https://github.com/coreos/etcd) to make sure there can never be concurrent edits.

Finally, for something integrated this deeply into our infrastructure, I like to know what happens when it fails.
If Vault is down, inaccessible to Salt, or if Vault has become [sealed](https://www.vaultproject.io/docs/concepts/seal.html), what happens to Salt?
Does the salt master crash immediately?
Does it fail to update states, or does it do something terrible like using empty values for pillar data that it can't read from Vault (resulting in invalid application configs).
What kind of error messages and logs show up?

I could probably find the answers to those questions by reading lots of Salt documentation and source code.
But that's no fun.
Instead, I found a nice window during off hours and spent some time playing [Chaos Monkey](https://blog.codinghorror.com/working-with-the-chaos-monkey/).

I opened a bunch of terminals tailing relevant log files and shut off Vault.
There was no immediate reaction from Salt.
Basic commands like `test.ping` continued to work.
Running a highstate failed though with output like:

```
[INFO    ] Loading fresh modules for state activity
local:
    Data failed to compile:
----------
    Pillar failed to render with the following messages:
----------
    Failed to load ext_pillar vault: [Errno 111] Connection refused
```

Interestingly, `saltutil.refresh_pillar` didn't explicitly throw an error, but it did result in an entry in the salt master log:

```
2017-05-18 04:51:21,824 [salt.pillar      ][CRITICAL][22506] Pillar render error: Failed to load ext_pillar vault: [Errno 111] Connection refused
```

Overall, though, I was happy to see that Salt won't run a highstate if it can't talk to Vault.

I restarted Vault.
Vault always starts up sealed, so Salt still shouldn't be able to read data from it although it can connect to the service.
The results weren't particularly surprising.
`saltutil.refresh_pillar` again doesn't complain, but results in some error messages in the logs:

```
2017-05-18 04:54:05,728 [salt.utils.vault ][ERROR   ][22511] HTTP 503: Service Unavailable
2017-05-18 04:54:05,728 [salt.pillar      ][CRITICAL][22511] Pillar render error: Failed to load ext_pillar vault: HTTP 503: Service Unavailable
```

And highstate fails with a slightly different error message:

```
[INFO    ] Loading fresh modules for state activity
local:
    Data failed to compile:
----------
    Pillar failed to render with the following messages:
----------
    Failed to load ext_pillar vault: HTTP 503: Service Unavailable
```

Unsealing Vault immediately fixed the issues without requiring any other action.

I also verified that the Salt master could be started even if Vault was down or sealed (ie, it doesn't attempt to connect to Vault when it starts up; we don't have to be too careful about starting them in a particular order).

I put those error messages into our internal documentation so anyone who encounters them in the future will be able to quickly understand that the problem is that Vault is down, inaccessible, or sealed.


---
title: "How to use your own Linux kernel"
date: "2018-07-30"
type: "post"
author_name:  "Nik Nyby"
author_url: "https://ctl.columbia.edu/about/team/nyby/"
lede: "If you're using Linux, using your own Linux kernel has benefits that
might be helpful to you. And once things are set up on your system,
keeping up to date is as straightforward as doing a periodic
sudo apt upgrade."
poster: "filename"
socmediaimg: "filename"
poster_sourceurl: ""
poster_source: ""
topics: 
- Sysadmin
tags: ["linux"]
---

If you're using Linux, using your own Linux kernel has benefits that
might be helpful to you. And once things are set up on your system,
keeping up to date is as straightforward as doing a periodic
`sudo apt upgrade`.

If you're using a newer laptop, updating your kernel can solve lots of
issues because the hardware is still new, and kernel developers are
still figuring out how to work with the new hardware. If your touchpad
or wireless card is acting weird on a newer laptop, sometimes just
trying the newest kernel solves the problem.

Most distributions have their own version of the kernel maintained by
the distribution. Ubuntu and Red Hat fork a major kernel version like
4.9, and stick with that for some version of their distribution,
applying security updates while that distribution release is
supported. That doesn't mean you can't use a newer kernel with that
distribution. Kernel updates have all sorts of driver updates and
internal changes, but they're careful not to break existing
functionality with userspace.

Cloning the kernel repository downloads a few gigabytes of data. If
you're just planning on making the kernel as a one-time thing, or for
any reason don't need the whole git repo, just download one of the
kernel tarballs from [kernel.org](https://www.kernel.org/), and follow
the process below without the git commands.

[git.kernel.org](https://git.kernel.org/) has a bunch of different
forks of the kernel. You probably just want the main "stable" one
[here](https://git.kernel.org/pub/scm/linux/kernel/git/stable/linux.git/).

```
git clone git://git.kernel.org/pub/scm/linux/kernel/git/stable/linux.git linux-stable
cd linux-stable
```

That repository follows the latest "mainline" version on
kernel.org. You can also follow an even more well-tested version than
that by following one of the branches, like linux-4.17.y:

```
git checkout linux-4.17.y
```

So now that you have the repository cloned, here's how you can set up
the kernel configuration. This is an essential step that makes it work
on your system. The easiest way to do this is just base your
configuration off of the one that's already working on the kernel
you're running. Some distributions rely on different kernel options
than others.

Find your running kernel configuration. Some distributions put this in
`/boot`, and some kernels have this available in their `/proc` filesystem
at `/proc/config.gz`.

* Does `ls /boot/config*` return anything?
* `ls /proc/config*`

Sometimes the kernel's config can be extracted from the kernel file
with `scripts/extract-ikconfig`. I've never used this but you can find
info about it somewhere. Once you've found your configuration, copy
the config to your repository's kernel config:

```
cp /boot/config-4.16.0-2-amd64 .config
```

Take a look at this file if you want with `less` — it's just a bunch of
CONFIG settings mostly set to "y", "m", or "n". No one edits this
manually — you would use some tool like make nconfig to make changes
to this, but you don't need to do that yet.

Kernel config options are added and removed with each kernel release,
so these options won't match up exactly, but they're fine to start
with and there's the `make oldconfig` target that's used to smooth out
the differences and make any relatively recent config compatible with
the current one.

```
make oldconfig
```

If there are new config options available, `make oldconfig` will ask you
what you want to do. You can probably always just choose the default
answer, by pressing Enter at each prompt.

At this point you can make the kernel and install it.

```
make -j2
```

If you have an 8-core processor or something (check that with `less /proc/cpuinfo`)
you can change this to `make -j8`, or `make -j6` if you
don't want the compile operation to slow down whatever you're doing.

Once that's done, you can install the kernel:

```
sudo make modules_install install
```

`make modules_install` makes a directory for this kernel version in
`/lib/modules/` and copies the module files there. `make install` copies
the main kernel file — vmlinuz — to `/boot`, and maybe some others as
well. It also updates your grub configuration to point to this new
kernel. This part of the guide is probably biased towards
Debian/Ubuntu. I'm not sure how different things work here on other
distributions.

Now you can reboot, and see how things are working.

If you're curious, you can look at all the config options in the
kernel with `make nconfig`. This is an ncurses interface that updates
the `.config` file on the Save (F6) command. You exit with F9 or ctrl-C,
navigate around the options with the arrow keys, and you can search
config strings with F8. Press y, m, or n on an option to enable it,
compile it as a module, or disable it. Pressing ? on a config option
shows its help. Some of these docs are more helpful than others.

If you're on a laptop, one good option to change is CPU Frequency
Scaling. Go into Power Management, then CPU Frequency Scaling, then
update Default CPUFreq Governor to conservative. That makes the
laptop's battery last longer.

The kernel's Makefile contains more commands you might be interested
in. Run `make help` to see them all.

To stay up to date, go into your `linux-stable` directory and run a
few commands:

```
git pull
make oldconfig
make -j2
sudo make modules_install install
```

[KernelNewbies](https://kernelnewbies.org/) is a good site with some
general info about all this. They have a similar guide you can use as
a supplement to this one at their
[KernelBuild](https://kernelnewbies.org/KernelBuild) page.
Their [LinuxChanges](https://kernelnewbies.org/LinuxChanges) page
summarizes the kernel changelog into something nice and readable, but
it's not always up to date with the latest release.
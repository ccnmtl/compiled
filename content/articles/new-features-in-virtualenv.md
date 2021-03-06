---
author_name: "Ethan Jucovy"
author_url: "https://github.com/ejucovy/"
date: "2011-04-11"
topics: 
- Projects
tags: ["deployment", "process", "python"]
title: "Python Deployment Chronicles: New features in virtualenv"
type: "post"
---

<p>Earlier this week, I wrote about <a
href="http://ccnmtl.columbia.edu/compiled/process/pinning_setuptools_and_pip_vir.html">how
to make virtualenv install pip and setuptools from local source
distributions</a>, instead of fetching unpinned copies of them from
the Internet, which it does (somewhat silently) by default.  The
approach relied on a somewhat buried feature of virtualenv: looking
for appropriate distributions in a <code>virtualenv_support</code>
directory before downloading them.</p><p>In a future release of
virtualenv, this will be easier, and also more apparent. &nbsp;I
submitted patches for two new features which were accepted by
virtualenv's maintainers:</p><p></p><ul><li>An <a
href="https://github.com/pypa/virtualenv/pull/114"><code>--extra-search-dir=/path/to/directory</code>
command-line argument</a>, which lets you put
pip/setuptools/distribute distributions wherever you want on the
filesystem.</li><li>A <a
href="https://github.com/pypa/virtualenv/pull/117"><code>--never-download</code>
flag, which will cause virtualenv.py to fail during installation</a>
if local distributions aren't found, instead of downloading packages
from the Internet; useful if you want to be alerted early and loudly
if your deployments have inadvertent Internet
dependencies.</li></ul><div>These new features are documented in the
source <a
href="https://github.com/pypa/virtualenv/blob/develop/docs/index.txt#L280">here</a>. &nbsp;If
you want to start using them now, you can fetch a copy of
<code>virtualenv.py</code> from the "develop" branch:&nbsp;<a
href="https://github.com/pypa/virtualenv/raw/develop/virtualenv.py">https://github.com/pypa/virtualenv/raw/develop/virtualenv.py</a></div><meta
http-equiv="content-type" content="text/html; charset=utf-8"><p></p>

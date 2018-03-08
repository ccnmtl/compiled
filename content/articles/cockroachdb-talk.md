---
author_name: "Anders Pearson"
author_url: https://thraxil.org/
date: 2016-06-10
lede: "These are notes from a talk by Stephen Kimball about a promising new open source database. While ambitious in its priorities, it seems like CockroachDB developers have chosen a solid set of design goals and have a workable strategy for achieving them."
poster: "poster-cockroachdb.jpg"
tags: ["cockroachdb", "databases", "distributed systems"]
title: CockroachDB Talk Notes
topics:
- Events
type: post
---

Working remotely, I'm always looking for good excuses to get out and
actually interact with other developers in person. So when I saw that
[Pivotal](http://pivotal.io/) was hosting a lunchtime talk on
[CockroachDB](https://www.cockroachlabs.com/), I hopped on the train
across town to Shoreditch to catch it. I took fairly detailed notes,
but much of the talk involved walkthroughs of various scenarios and
code paths that would be hard to describe here, so I'm going to very
loosely summarize the content and try to convey the general ideas.

### Background

The talk was given by Spencer Kimball. As an undergrad at Stanford
back in the 90's Spencer had been one of the original developers of
[the GIMP](https://www.gimp.org/). He then spent most of his career
working on databases. First at startups that focused on enabling very
large MySQL and PostgreSQL deployments using various sharding and
replication approaches. Then he worked at Google for years on MySQL,
BigTable, and Spanner. Now he is the co-founder and CEO of
[Cockroach Labs](https://www.cockroachlabs.com/), the company behind
CockroachDB.

### Design Goals

CockroachDB is a database that aims to nail the "4 S's":

* Scalable
* Survivable
* Strong Consistency
* SQL

Once a dataset gets larger than what can easily fit on a single
database server, traditional SQL databases become unwieldy at
best. The most common approach is to
[shard](https://en.wikipedia.org/wiki/Shard_\(database_architecture\))
the data. That allows the database to scale out horizontally but
places a high burden on application developers and limits the types of
queries the database can make (you can't do joins across shards on
different servers).

Once you've scaled a database out to multiple servers with shards, you
also have more chances for servers to crash or corrupt data, lowering
your overall availability. You need a robust approach to replication,
failover, and backups to achieve reasonable levels of availability and
durability. This quickly becomes a huge operations and maintenance
load.

Facebook has over 10,000 MySQL server shards. EBay apparently has
around 600 "large" Oracle shards for their main database (Oracle
charges per CPU, so that must cost a lot).

These are the problems that drove the evolution of the "NoSQL"
ecosystem. [DynamoDB](https://aws.amazon.com/dynamodb/) from Amazon
(and databases based on its ideas like
[Riak](http://basho.com/products/)),
[BigTable](https://cloud.google.com/bigtable/) at Google,
[Cassandra](http://cassandra.apache.org/),
[MongoDB](https://www.mongodb.com/), etc. all were fundamentally
designed to allow the database to scale out to very large datasets
across many servers.

This scalability was achieved by making tradeoffs. Most of the NoSQL
databases expose only a simpler key-value store type
interface. Sometimes with a bit more flexible querying interface, but
nothing as flexible as SQL for making arbitrarily complex queries. The
burden of maintaining indices was pushed out to application developers
instead of being handled automatically by the database. Most NoSQL
databases also achieve their scalability and availability by relaxing
consistency guarantees and giving up on providing
[ACID transactions](https://en.wikipedia.org/wiki/ACID), again
shifting the burden out to the application developers.

After years of experience with BigTable, Google eventually concluded
that these tradeoffs were not worth it in many cases. Even very smart
developers had a difficult time reasoning about relaxed consistency
models, resulting in data loss and corruption.

As a result, Google built
[Spanner](http://research.google.com/archive/spanner.html) and has
internally mandated its use for all new applications by
default. Spanner is a distributed transactional database with a SQL
interface. Famously, Spanner relies on a network of synchronized
atomic clocks that allows it to achieve distributed transactions
within tight time limits. That may be a solution for Google, but
clearly is out of the reach of most of the rest of us.

CockroachDB's goal is to be Spanner for those of us outside Google. It
tries to bridge scalability and flexibility with consistent
transactional semantics and a familiar SQL interface. Obviously,
without atomic clocks, some different techniques are required, but the
end goal is roughly the same.

With years of experience operating various databases, they are also
sensitive to the operational overhead involved in running a database
server and how that overhead and effort scales with the number of
servers deployed. CockroachDB is designed from the ground up to be as
simple as possible to configure, deploy, and run, tolerating storage,
server, and network failures with minimal performance disruption and
no manual intervention.

### Architecture

CockroachDB is designed around four levels of abstractions, each built
on top of the previous layer:

* a replication layer
* a single, monolithic sorted map
* a key-value store
* a SQL interface

Physically, a CockroachDB cluster consists of Nodes, Stores, and
Ranges. A Node is an instance of the CockroachDB server and you would
typically have one Node per physical server. Each Node hosts one or
more Stores, which are local key-value storage units. There would
typically be one Store per physical storage device (so a server with
five disks would run one Node that contains five Stores). Each Store
contains potentially many Ranges.

Nodes use a gossip protocol to discover each other and broadcast to
each other which Ranges each node in the cluster is storing. Each
Range is maintained on N replicas across the cluster (typically N=3,
but that's configurable) to achieve availability in the face of
hardware failure. The distribution of the Range replicas is
coordinated with the
[Raft consensus algorithm](https://raftconsensus.github.io/). Replicas
of each Range are organized into their own Raft group and coordinate
to keep the replicas consistent with each other as data is written and
updated.

These Ranges and Stores form a low level key-value store that
guarantees a certain level of replication and basic
consistency. CockroachDB then layers a set of indices and metadata on
top of that basic key-value store. The highest level index is
relatively small and is replicated to every Node in the cluster via
the gossip protocol.

The SQL Layer is then implemented on top of this key-value store.

### Implementation

CockroachDB is written in Go and distributed as a single (currently
35MB) binary executable.

Ranges are 64MB in size (configurable, but they found that to be a
good default; large enough to amortize read/write costs but small enough
to replicate quickly). They are persisted locally with
[RocksDB](http://rocksdb.org/), an embedded key-value store.

CockroachDB uses the Raft implementation from
[etcd](https://github.com/coreos/etcd). This has been working well for
them, although they may someday switch to an
[EPaxos](http://dsrg.pdos.csail.mit.edu/2014/01/10/epaxos/)
implementation, which might be a better match for their workload.

Communication between the nodes is handled with
[Protocol Buffers](https://developers.google.com/protocol-buffers/).

Most of the implementation complexity is around updating indices in
the face of potentially conflicting transactions.

CockroachDB allows you to specify--per-transaction--the level of
serialization and isolation that you want. For full serializability,
all operations in a transaction must go through a full Raft consensus
round. That provides very strong guarantees, but has a high
performance cost associated with it. So you can also mark transactions
as snapshot isolation (they point out that for many years, what Oracle
documented as "serializable" mode in their database was merely
snapshot isolation).

Snapshot isolation provides
[MVCC](https://en.wikipedia.org/wiki/Multiversion_concurrency_control)
semantics and is implemented with optimistic locking via provisional
writes that they call "intents" in a write-ahead transaction log
that's replicated by Raft.

When a transaction starts, the transaction record is marked as
pending. Data is written, but marked with intents that point back to
the transaction record. When the transaction completes, the
transaction record is marked as completed and replicated via
Raft. Afterwards, the nodes clean up the data and remove the intents.

When reading, if it doesn't encounter an intent, it can continue
without risk. If it encounters an intent, it must check the
transaction record for the status. If the transaction is marked as
comitted, it just means that the intent hasn't been cleaned up yet and
again, it may continue safely. If the transaction is still marked as
pending, it can simply read the previous version of the data (thus,
snapshot isolation).

When writing data, if an intent is encountered and the transaction is
checked and is still pending, one or the other transaction must be
aborted and retried (giving the non-aborted one the chance to
complete). CockroachDB gives each transaction a priority and the lower
priority transaction gets aborted when there's a write
conflict. Whenever a transaction is aborted and retries, its priority
increases. So eventually, either the the transaction that was blocking
it will finish, or its priority will raise above the blocking
transaction's, giving it the right to progress.

### Summary

CockroachDB is still considered "beta" and they don't recommend using
it for production yet. They run large clusters and dogfood it for all
of their own needs, but expect that there will still be API changes
and stability improvements to come.

The SQL Layer is also not yet finished. Basic SQL works, but many
advanced features are not there yet (like joins).

Correctness and data safety have been their highest priorities,
driving the design and implementation. They've been periodically
testing with [Jepsen](http://jepsen.io/) to verify the distributed
transaction semantics and have found and fixed many bugs as a result.

Performance tuning has also not really been started yet. Currently,
it's within about 2X of PostgreSQL on most operations on a single
node, but there is a lot of write amplification that they plan to
eliminate (possibly by replacing RocksDB with more special purpose
code).

Overall, while it doesn't sound like we'll be wanting to use it right
away, I'm quite impressed with CockroachDB and optimistic for its
future. Having spent many years working with SQL databases and also
dabbling in distributed NoSQL databases, I think their analysis of the
strengths and weaknesses of those systems is accurate. CockroachDB is
ambitious, but it seems like they've chosen a solid set of design
goals and have a workable strategy for achieving them.

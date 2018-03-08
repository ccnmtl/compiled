---
title: "Creating a flexible authorization system"
date: 2018-03-08
draft: true
type: post
author_name: "Susan Dreher"
author_url: http://ctl.columbia.edu/about/team/sdreher/
lede: "Implementing complex authorization rules for a Django-based application
was simplified by the framework's permission & authorization classes at the
class-level. Instance-level permissioning proved to be more complicated."
poster: poster-footprints-authorization.jpg
poster_source: ""
poster_sourceurl: ""
tags: ["python", "django", "authorization"]
topics:
- Research and Development
- Projects
---

## Background

Our collaborators from the [Footprints](https://footprints.ccnmtl.columbia.edu)
project often present our development team with challenging requirements. We've
taken on and solved complex issues such as storing fragmentary data and sorting
uncertain and approximate dates.

Another challenging request from our partners was motivated by the desire to
expand our contributor pool. From the project's inception, adding Footprints
and related metadata simply required authentication, but only the core team
were given login credentials. The team decided to expand editor access,
carefully.

Here's the dream list of user roles:

* Creator: Add and edit own Footprints, Imprints & Literary Works. Connect
Footprints to Imprints & Literary Works.
* Contributor: Creator, plus ability to edit all Footprints, Imprints &
Literary Works.
* Moderator: Contributor, plus access to the moderation interface.
* SuperModerator: Moderator, plus batch import, plus delete permissions, plus
user role administration.

## Implementation

Authorizing access at the model/class level was straightforward. The
implementation relies heavily on the
[Django Permission & Authorization](https://docs.djangoproject.com/en/2.0/topics/auth/default/#topic-authorization)
classes to control CRUD operations.

Four Django groups were created: Creator, Contributor, Moderator,
Supermoderator. Creators and Contributors can add and change the core
`footprints.main.models`. Moderators get those permissions plus a custom
`can_moderate` permission. SuperModerators get all that plus delete
permissions. New users are automatically added as Creators, and are given
additional privileges as they gain experience with the system.

These groups and permissions were then used to control access at the view and
REST API level.

* Mixins derived from
[PermissionRequiredMixin](https://docs.djangoproject.com/en/2.0/topics/auth/default/#the-permissionrequiredmixin-mixin)
were used to enforce the rules at the view level. For example, the
[AddChangeAccessMixin](https://github.com/ccnmtl/footprints/blob/master/footprints/mixins.py#L76)
requires add and change permissions to the core `footprints.main.models`.
Access could be granted more granularly, i.e. a view that changes only the
Place model could require only the `add_place`, `change_place` permissions. But
at this point, the more granular access seems overly complicated and
unnecessary.

* Access to the REST API was easily added via the Django REST Framework's
[DjangoModelPermissionsOrAnonReadOnly](http://www.django-rest-framework.org/api-guide/permissions/#djangomodelpermissionsoranonreadonly)
class. This class was added as Footprint's `DEFAULT_PERMISSION_CLASS`.

## Instance-level access

The Django permission model is excellent, but does not handle instance-level
permissioning. Limiting the Creator role's edit ability to their own
Footprints, Imprints and Written Works was more difficult and is still less
than elegant. Each model instance now holds a `created_by` attribute that
stores the `request.user` at creation time. A `can_edit` template variable
shows/hides edit controls based on the user's role. I'm still thinking through
a better way to handle this requirement. The
[django-guardian library](https://github.com/django-guardian/django-guardian)
does offer instance-level permissioning and needs a closer look.

## Outcome
Since implemented, this authorization solution has hummed along with few
issues. We have almost 70 creators and contributors. And, we're celebrating the
5,000 Footprint in our system.

## The Project
The [Footprints project](http://footprints.ccnmtl.columbia.edu/about/)
is a collaboration among Dr. Marjorie Lehman, associate professor at the Jewish
Theological Seminary (JTS); Michelle Chesner, Jewish Studies Librarian at
Columbia University; Dr. Adam Shear, associate professor at the University of
Pittsburgh; Dr. Joshua Teplitsky, assistant professor at Stony Brook
University; and the Columbia Center for Teaching and Learning (CTL). The
product of this collaboration is a website designed to trace the movements of
early modern Jewish books by way of analyzing evidence of provenance from
around the world. CTL designed and developed a pilot database, administrative
interface, and front-end browsing interface for the Footprints website, in
partnership with the research team.

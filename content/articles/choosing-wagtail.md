---
title: "Choosing Wagtail: A Story of Process"
date: "2018-06-17"
type: "post"
author_name:  "Zarina Mustapha"
author_url: "https://ctl.columbia.edu/about/team/mustapha/"
lede: "The DevTeam at the CTL continuously research and evaluate existing and
new software for possible uses in developing educational technologies at
Columbia University. This post describes the evaluation process that led us to
choosing Wagtail, an open source CMS written in Python on the Django framework,
as one of the tools for us to use at the CTL."
poster: "poster-choosing-wagtail.jpg"
poster_sourceurl: ""
poster_source: ""
topics: 
- Research and Development
tags: [wagtail, django, python]
---


On June 14, 2018, I presented at the Wagtail Space US 2018 conference in
Philadelphia the process the DevTeam went through that led us to choosing
Wagtail CMS as one of the tools for us to use at the Center for Teaching and
Learning (CTL). This post is based on that talk. You can also
[download the slide here](/docs/wagtailspace-20180614.pdf), in PDF format.

We the DevTeam at the CTL continuously research and evaluate existing and new
software for possible uses in developing educational technologies at Columbia
University. In building tools and digital environments for classrooms and
online learning, our approach is grounded in the
[CTL’s mission](https://ctl.columbia.edu/about/),
which is to support and promote the _practice_ and _culture_ of _teaching_ and
_learning_.

Our projects always begin with an educational hypothesis, one that imagines
ways that software or digital tools can promote learner-centered objectives. We
help faculty in supporting the tools they choose, and also explore the
frontiers of educational technologies that engages students towards better
scholarship. Our research can also lead us to create novel solutions for
these pedagogical goals.

We work closely with the faculty to understand the learner-centered objectives
within the projects, and from there, we use the goals as the primary basis of
the user stories. Based on the sets of user stories, we recommend the best
approach to adopt. These are three of the most common approaches we have proposed
to the faculty clients:

<ol style="list-style: none; margin: 0; padding: 0;">
	<li style="background: url('/img/assets/icon-tool.png') no-repeat left 15px; min-height: 50px; padding: 10px 0 10px 65px;"><i>Custom web-based applications:</i></br />
	We develop these tools as solutions to complex learning environment.<br />
	Examples: <a href="http://mediathread.info">Mediathread</a>, <a href="https://econpractice.ctl.columbia.edu">EconPractice</a>, <a href="https://writlarge.ctl.columbia.edu">Writ Large</a></li>
	<li style="background: url('/img/assets/icon-static.png') no-repeat left 15px; min-height: 50px; padding: 10px 0 10px 65px;"><i>“Static” websites:</i><br />
	These sites hold content that doesn’t have frequent editing cycle, and has simple data model.<br />
	Examples: <a href="https://filmglossary.ccnmtl.columbia.edu">The Film Language Glossary</a></li>
	<li style="background: url('/img/assets/icon-hybrid.png') no-repeat left 15px; min-height: 50px; padding: 10px 0 20px 65px;"><i>Hybrid solutions:</i><br />
	The environment of this type has content provided and edited by faculty clients, and tools developed and maintained by CTL.<br />
	Example: <a href="https://pass.ctl.columbia.edu">PASS</a> and <a href="https://match.ctl.columbia.edu">MATCH</a></li>
</ol>

Our primary framework at CTL is Python-based
[Django](https://www.djangoproject.com/) and it works very well in our
development of custom web-based applications. However, Django admin UI is not
quite a CMS UI that can be used easily by content managers and providers.

## The need for a CMS

For the projects that fall under “static website” or “hybrid solution”, faculty
clients work closely with us, as primary content providers, and would be editing and
managing the content independently. Many are non-developers, and have a range
of experience with many content management systems. Popular CMS frameworks like Drupal and
WordPress have WYSIWYG text editing tool, a lightweight word processing tool,
and offer ways to upload and manage media content effectively. Django admin UI
lacks these features. We are mindful of these requirements from the content
developers, and at the same time, we developers have our own set of features we
would like to see in a particular technology.

## Criteria for CMS

We came up with a list of combined criteria, and compared/contrasted a few CMS
frameworks for Django written in Python ([Django-CMS](https://www.django-cms.org),
[Wagtail](https://wagtail.io)),
and other known frameworks (static website generator [Hugo](https://gohugo.io),
[CampusPress](https://campuspress.com)–WordPress for education,
[Drupal](http://www.drupal.com)).

The criteria are:

* How much __control__ do we have in shaping and implementing the data model,
code, templates, content?
* Does the CMS allow __versioning__ of all the code and content? Can we
rollback?
* Does the __UI for CMS__ have WYSIWYG editor? Can content of all types be
managed through the web interface? Is it easy to use?
* Can the framework be integrated with Columbia University
__[CAS Authentication](https://cuit.columbia.edu/cas-authentication)__. How
vulnerable are the frameworks?
* Can we integrate the framework into __CTL configurations and workflow__ (CI,
Github, code reviews)

<table class="table table-bordered">
    <thead>
        <tr>
            <th>
            Criteria
            </th>
            <th>
            Django
            </th>
            <th>
            Django CMS
            <th>
            Wagtail
            </th>
            <th>
            Hugo
            </th>
            <th>
            CampusPress (WordPress)
            </th>
            <th>
            Drupal
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
            <b>Control</b><br />
            (model, code, template, content)
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i>
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i>
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i>
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i>
            </td>
            <td class="text-center">
            <i class="far fa-lg fa-circle" aria-label="No" style="color: #999;"></i>
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-circle" aria-label="Somewhat" style="color: #999;"></i>
            </td>
        </tr>
        <tr>
            <td>
            <b>Versioning</b><br />
            (code, content)
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i>
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i>
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i>
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i>
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-circle" aria-label="Somewhat" style="color: #999;"></i>
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-circle" aria-label="Somewhat" style="color: #999;"></i>
            </td>
        </tr>
        <tr>
            <td>
            <b>UI for CMS</b><br />
            (editing, management, media uploads)
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-circle" aria-label="Somewhat" style="color: #999;"></i>
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i>
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i>
            </td>
            <td class="text-center">
            <i class="far fa-lg fa-circle" aria-label="No" style="color: #999;"></i>
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i>
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i>
            </td>
        </tr>
        <tr>
            <td>
            <b>Authentication and security</b><br />
            (Columbia integration)
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i>
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i>
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i>
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i>
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i>
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i>
            </td>
        <tr>
            <td>
            <b>CTL&nbsp;integration</b><br />
            (config, workflow)
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i>
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i>
            </td>
            <td class="text-center">
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i>
            </td>
            <td class="text-center">
            <span style="color: #999;"><small>No need</small></span>
            </td>
            <td class="text-center">
            <span style="color: #999;"><small>No need</small></span>
            </td>
            <td class="text-center">
            <span style="color: #999;"><small>No need</small></span>
            </td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
            <td colspan="7">
              <i class="fas fa-sm fa-check-circle" aria-label="yes" style="color: #0c0;"></i> =  <small>Yes</small> | 
              <i class="fas fa-sm fa-circle" aria-label="Somewhat" style="color: #999;"></i> =  <small>Somewhat</small> | 
              <i class="far fa-sm fa-circle" aria-label="No" style="color: #999;"></i> = <small>No</small>
              
            </td>
        </tr>
    </tfoot>
</table>

Django CMS and Wagtail are the two CMS frameworks that met all of our combined
requirements. So, we compared how each against another set of developer-centric
criteria:

* Can the CMS __exist with other applications__ in a Django project?
* How __flexible__ is the framework? Can the data model, and the CMS model be
__extended__?
* How __simple__ is it to implement, and to use?
* Is the CMS UI device agnostic (__responsive__)?
* Can we integrate a search engine?
* What is the extend of __support and documentation__? How active is the
__community__ around the CMS framework?
* How easy is it to __learn to use__ the CMS framework?

<table class="table table-bordered">
    <thead>
        <tr>
            <th style="width: 20%;">
            Criteria
            </th>
            <th class="text-center" style="width: 40%;">
            <img src="/img/assets/thumb-djcms.png" style="width: 150px" alt="Django CMS" title="Django CMS" aria-label="Django CMS" />
            </th>
            <th class="text-center" style="width: 40%;">
            <img src="/img/assets/thumb-wagtail.png" style="width: 150px" alt="Wagtail" title="Wagtail" aria-label="Wagtail" />
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
            <b>Multiple applications in one project</b>
            </td>
            <td>
            <small>CMS UI uses Django admin code, can’t separate admin and CMS UI. More of a standalone product.</small>
            </td>
            <td>
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i> <small>Non-invasive Django Wagtail app. Admin for Wagtail is separate from Django admin. Can still manage applications code in the same project without using Wagtail CMS.</small>
            </td>
        </tr>
        <tr>
            <td>
            <b>Flexible and extendable model/CMS UI</b>
            </td>
            <td>
            <small>Since it uses Django admin code, it is not easy to extend or be customized.</small>
            </td>
            <td>
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i> <small>Very flexible and customizable. Data model is extendable, and can be shaped according to our requirements. Has more third party plugins in GitHub.</small>
            </td>
        </tr>
        <tr>
            <td>
            <b>Simplicity</b>
            </td>
            <td>
            <small>UI design is complex from start, and because it is not easily customizable, it can’t be simplified.</small>
            </td>
            <td>
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i> <small>Base CMS is simple, but functional. We can shape the CMS from scratch, according to our own requirements.</small>
            </td>
        </tr>
        <tr>
            <td>
            <b>Responsive design</b>
            </td>
            <td>
            <small>None.</small>
            </td>
            <td>
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i> <small>Yes</small>
            </td>
        </tr>
        <tr>
            <td>
            <b>Search integration</b>
            </td>
            <td>
            <small>Haystack integration is suggested.</small>
            </td>
            <td>
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i> <small>Elasticsearch 6 support is standard. Can also use the database and PostgreSQL search.</small>
            </td>
        </tr>
        <tr>
            <td>
            <b>Documentation and community</b>
            </td>
            <td colspan="2">
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i> <small>Documentations, support, tutorials and community are robust for both systems.</small>
            </td>
        </tr>
        <tr>
            <td>
            <b>Learning curve</b>
            </td>
            <td>
            <small>We didn’t launch a sample to experiment with content providers.</small>
            </td>
            <td>
            <i class="fas fa-lg fa-check-circle" aria-label="yes" style="color: #0c0;"></i> <small>It takes a bit of time in the beginning to set up a model. The complexity or simplicity of the CMS is dependent on how well we design the data the model. We have control over its usability.</small>
            </td>
        </tr>
    </tbody>
</table>


## We chose Wagtail CMS

Wagtail meets many, if not, all of the aforementioned criteria for what we want
from a CMS frameworks. We were persuaded to experiment with Wagtail CMS on the
forthcoming CTL Portfolio project to see how well it works in a collaborative
environment. The team—developer, designer, and client (content managers)—worked
together to draft out user stories, design the website’s UI, and developed the
data model for the site. The CMS was implemented according to the model, and
here is an overall look of how the CMS mapped out to the website’s interface.

{{< figure src="/img/assets/wagtail-portfolio.jpg" class="text-center centered responsive" alt="overall look of how the CMS mapped out to the CTL Portfolio interface" >}}

We are pleased with the Wagtail CMS in this project. Some of our (additional)
shared reasons are:

* Wagtail’s flexible and extendable framework lends itself to product design.
The designer and the client are not constrained by the CMS to shape the UX for
the product website.
* The client, who is also the content manager/editor, can work with the
developer to design a CMS UI that fits the editor’s needs, instead of trying to
adjust the needs into an inflexible CMS.
* Wagtail’s framework provides ample space for the team members to be creative
in designing an intuitive CMS UI that works for everyone.

## Some considerations with Wagtail

* Wagtail’s base CMS functionality is minimal. Thus, to reach a full set-up, a
team will need some time to design and implement a data model. Still, time
investment in the beginning will yield a very good CMS further in the design
process.
* A Django-Wagtail project requires a developer to begin, and to maintain in
the long run.
* Everything on a site made with Wagtail is defined in the data model.
Therefore, additional features, or tweaks will require some thought and
development time.

At the CTL, we’re working on identifying future projects that can be built with
Wagtail, and we are looking forward to trying out the additional features that
Wagtail has to offer (StreamField, migration, searching). We’re also looking
forward to contributing back to the Wagtail development community by sharing
our experience and best practices.

---
author_name: "Zarina Mustapha"
author_url: https://ctl.columbia.edu/about/team/mustapha/
date: 2016-10-04T12:16:58-04:00
lede: "In this first of a three-part summary, we recount the circumstances that drove the decision to migrate two dental school projects, MATCH and PASS, to an open and sustainable framework. We also listed a few questions that we must address before moving forward with the implementation."
poster: poster-match-pass01.jpg
poster_source: ""
poster_sourceurl: ""
tags: ["hugo", "webpack", "javascript", "html5"]
title: "Massing and Patching of MATCH and PASS: Towards Sustainability"
topics:
- Process
type: post
---

*This is the first of a three-part summary on the sustainability project of MATCH and PASS.*

In 2011, the Center for Teaching and Learning (then Columbia Center for New
Media Teaching and Learning (CCNMTL)) began collaborating with Drs.
[Burton Edelstein](https://www.dental.columbia.edu/profiles/burton-l-edelstein-mph)
and Courtney Chinn of the Columbia University
[College of Dental Medicine](http://dental.columbia.edu)
(CDM) to develop two self-paced, web-based interactive learning environments,
MATCH and PASS.

{{< figure src="/img/assets/post-match-screen.jpg" class="text-center grey-border" alt="This is a screenshot of MATCH website." >}}

Multidisciplinary Approaches to Children’s Oral Health (MATCH) is a set of five
training modules for practicing and future pediatric dentists to learn how they
can work with other healthcare professionals to ensure a child’s oral health
and overall well-being. Children’s oral health is determined by social,
behavioral, genetic, nutritional, and educational factors—as well as by dental
care. MATCH is an innovative effort to demonstrate how partnering with experts
from these fields can enhance a dentist’s practice and help children and their
families obtain the highest levels of oral health.

{{< figure src="/img/assets/post-pass-screen.jpg" class="text-center grey-border" alt="This is a screenshot of PASS website." >}}

Population-Based Approach to Patient Service and Professional Success (PASS) is
a series of learning modules designed to teach pre-doctoral dental students to
consider patient populations and their oral health needs when deciding where
and how to build a successful practice. PASS modules address five specific
vulnerable populations, their oral health needs and options, and opportunities
to address their care. Second-year students at CDM study the site as part of
the *Oral Health Care Delivery* course.

Both projects provide learners with case studies, videos of exemplar
interviews, quizzes, and rich JavaScript-based interactive activities designed
to augment the online learning experience. MATCH and PASS were funded by a
five-year grant respectively, beginning in 2011, from the Health Resources and
Services Administration (HRSA) for the training of post- and pre-doctoral
dentists.

MATCH and PASS were implemented in the CTL’s content management tool
[Pagetree](https://github.com/ccnmtl/django-pagetree).
The Pagetree architecture is based on
[Django](https://www.djangoproject.com),
a high-level Python Web framework, backed by a Postgres data store. The
Pagetree infrastructure proved a powerful and cost-effective choice for these
projects, and met several client requirements through an extensible
infrastructure. Pagetree allowed for sequential page access, guiding the user
through a scaffolded learning experience. The custom JavaScript interactives
were designed and hooked in easily as each module implementation was unveiled.

The learning modules were placed behind Columbia and custom user authentication
so that faculty clients could track students’ progress through the sites.
Faculty could also download students’ responses to quizzes and activities
for further assessment.

{{< figure src="/img/assets/pagetree-match-pass.png" class="text-center" alt="A diagram representing the components that made up the content of MATCH and PASS." >}}

As these two projects reached the final year of the HRSA grant funding, the
clients would like to keep the site content and interactives stateless, and
publicly available to reach a broader audience, at minimum maintenance cost.
The goal was not to redesign or re-envision the original pedagogical objectives
of these projects, but rather to migrate these sites into an open ecosystem and
make some amendments when necessary. The content will rarely be updated henceforth.

The sites will be offered as free and open educational resources through the
[TrainingFinder Real-time Affiliate Integrated Network](https://www.train.org) 
(TRAIN) platform, or other LMS such as
[Canvas](https://www.canvaslms.com).
In this new publicly open ecology, no user data will be collected and no reports
will be generated in MATCH and PASS. All user assessment will be conducted
within the LMS environments.

During this phase, we would explore ways to make the JavaScript interactive
content modular, reusable, and stateless so that they can be embedded in other
platforms such as blogs, wikis, LMS, and even MOOCs.

Moreover, the framework for this effort needed to be:

* a (server-side) static content infrastructure;
* a stable and sustainable framework;
* of minimal technology stack;
* low-maintenance and lightweight; and 
* easily customized and updated.

With this new set of requirements towards sustainability came a new set of
questions and challenges. We needed to address these issues before moving
forward with implementation:

* What is “open”, and what are the corollaries of this “openness”?
* Is “openness” equivalent to “transparent”?
* How will this affect user stories?
* What is “static content”?
* What will be the extent of modularity for the JavaScript interactives and videos?
* How will student feedback change in this stateless environment?
* What will the hosting requirements be?
* What will be the binding copyrights and licensing of content and codes?

In the second part of this summary,
“[Migration Process ](/articles/match-pass-migration-02/)”,
we’ll outline our efforts in shaping, mending, and migrating MATCH and PASS into
their new digital adobe.
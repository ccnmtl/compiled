---
author_name: "Schuyler Duveen"
author_url: "https://github.com/schuyler1d/"
date: "2009-01-22"
topics: 
- Projects
tags: ["countryx", "simulations", "visualization"]
title: "Visualizing multi-player simulation rules"
type: "post"
---

<p>I've been largely an outside observer to our <a href="http://ccnmtl.columbia.edu/portfolio/political_science_and_social_policy/country_x.html">Country X project</a>.  CountryX is a simulation used for International Policy students studying what scenarios lead to genocide.  In the early stages, the rules of the 'game.' converged on:</p>

<!--more-->

<p>1. Four players, each in a specified role, starting with a watershed moment in an imaginary country.<br />
2. The four roles are President, First-world Envoy, Regional Representative, and an Opposition Leader. (I immediately abbreviated these in my notes to 'P','E','R','O')<br />
3. The game has four turns. In each turn, each of the four players decides on a context-specific list of three choices for their particular role. This is like playing a 'trick' in Bridge or Hearts.</p>

<p>When I first heard of the project, Jonah was working with the others on the project to specify the rules, for all of the contexts, in each of the states. He described an elaborate forest of paper Mark, our client, had on the walls of his office. How were we the programmers going to get him to describe the rules?</p>

<p>The problem is that most rule-making devices, besides pure programming code, already have a domain and the conceptual framework of how outcomes result. That is, we can narrow the possibilities of an outcome based on some global rules or variables, which the author can specify. But we did not know the framework yet.</p>

<p>So every turn had 3*3*3*3=81 (four players, three choices each) possible outcomes. This would diverge into a set of states for the next turn, and then for <span class="caps">EACH </span>state, 81 combinations would then diverge into the possible states for the next turn.</p>

<p>I understand my first contribution, as suggesting that if there were no general rules, then the only choice was to give him a <a href="http://en.wikipedia.org/wiki/Truth_table">truth table</a> of 81 rows, each listing the state of that combination for the players. Eventually, it turned out that there were 28 states (with 8 on the last turn), so poor Mark had to fill in 81*20=1620 rows.</p>

<p>Impressively, Mark came through, and brought order to the possible outcomes (one of them genocide). Then <a href="https://ctl.columbia.edu/about/team/dreher/">Susan Dreher</a> wowed us all with one of her first contributions to <span class="caps">CCNMTL </span>as bringing Mark's rules into a data model and environment for the game to be played.</p>

<p>What were all of these rules though? We know they had been specified, but it was a gloss of 1620 rows. In the data, you can see some notes Mark makes along the margins, to keep some of it straight himself. But as outsiders, it was difficult to understand certain things. For example:<br />
1. Game balance: how much do certain players affect the outcome from turn to turn?<br />
2. Given Mark's rules, how can genocide be averted? Who is 'responsible'?</p>

<p>Susan used some sophisticated tools (e.g. <a href="http://www.graphviz.org/">GraphViz</a> which produced <a href="http://ccnmtl.columbia.edu/compiled/images/Graphviz_states.jpg">this image</a>) as a first pass, but mostly, it shows just how complicated the rules are.</p>

<p>With a bit of time here and there, I was interested in finding a better solution. All the more because it seems like we might have more projects like this. There are still a couple ideas not-yet-implemented, but one that I think puts a little order to the madness is described below (If you're still reading, that is!)</p>

<p>The idea is inspired by <a href="http://en.wikipedia.org/wiki/Karnaugh_map">Karnaugh maps</a> -which generally handle binary data Truth table data in two dimensions instead of the one long list of combinations, so it's easier to see some rules. </p>

<p><span class="caps">XKCD </span>has covered karnaugh maps a <a href="http://xkcd.com/195/">couple</a> <a href="http://www.xkcd.org/62/">times</a></p>

<p>The disadvantage is it takes a little longer to explain! Karnaugh maps have binary possibilities for each input. We have three possibilities for each of the four players. The real way to think of it is instead of an 81×1 list of rows we make it a 9×9 grid with two players on each side.</p>

<p>Each of the roles have three choices. Here we see where to look for each role for their influence.</p>

<p><img alt="123-opposition.png" src="http://ccnmtl.columbia.edu/compiled/images/123-opposition.png" width="450" height="238" class="mt-image-none" /></p>

<p><img alt="123-president.png" src="http://ccnmtl.columbia.edu/compiled/images/123-president.png" width="449" height="240" class="mt-image-none" /></p>

<p><img alt="123-envoy.png" src="http://ccnmtl.columbia.edu/compiled/images/123-envoy.png" width="447" height="240" class="mt-image-none" /></p>

<p><img alt="123-regional.png" src="http://ccnmtl.columbia.edu/compiled/images/123-regional.png" width="450" height="241" class="mt-image-none" /></p>

<p>Here are two examples presenting a single state's combinations in the two ways. There is a different color for each resulting state. First here's an example where the rules are moderately simple:</p>

<p><img alt="simple-linear.png" src="http://ccnmtl.columbia.edu/compiled/images/simple-linear.png" width="116" height="582" class="mt-image-none" />	</p>

<p><img alt="simple-karnaugh.png" src="http://ccnmtl.columbia.edu/compiled/images/simple-karnaugh.png" width="300" height="199" class="mt-image-none" /></p>


<p>At first it feels like, despite being a little more verbose, we can get the same understanding from looking at the linear version. Here's a more complicated set of rules. In the long version, you have to take an extra step of grouping the separated colors to figure out the rule.</p>

<p><img alt="complicated-linear.png" src="http://ccnmtl.columbia.edu/compiled/images/complicated-linear.png" width="116" height="585" class="mt-image-none" /></p>

<p><img alt="complicated-karnaugh.png" src="http://ccnmtl.columbia.edu/compiled/images/complicated-karnaugh.png" width="299" height="196" class="mt-image-none" /></p>

<p>It takes a bit of practice, before one can start seeing and understanding the 'rules' that these maps are explaining.  We need to keep the full representation under wraps, so students don't use it to cheat.  You can get the idea though, by examining this fake state sequence:</p>

<p><img alt="3 karnaugh maps for 3 fake states; Turn X: Violence, Mediation; Turn Y: Negotiation" src="http://ccnmtl.columbia.edu/compiled/blog-fakeexample.png"  class="mt-image-none" /></p>

<p>The easiest way to get a sense of what it all means is to try and verbalize what the rules mean. For example, in Turn X, from the state 'Mediation,' the TO grid shows thick horizontal bars. If we look to the <span class="caps">KEY, </span>the first two horizontal rows correspond to president decisions. Thus, we can start to tell the story from here that the major outcomes depend on the president's decision. The thin vertical horizontal bars in the bottom row (again by the <span class="caps">KEY</span>) correspond to the Opposition Leader's choice. Thus, we can tell the story that when the President chooses (3), the Opposition Leader can change the outcome. Besides that, from the 'Mediation' state, no other player can influence the outcome.</p>

<p>Work still to be done, should we decide this is a good direction, would be:<br />
1. Make it more intuitive through interactive links. On mouse overs we can see what the choices are, and highlight the state in the next turn.<br />
2. We could make this an authoring environment. However difficult, it should be easier than manually entering 1620 rows!<br />
3. Another direction I'm still thinking about is a waterfall-cascade view which may be explained or shown in another post.</p>

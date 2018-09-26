---
title: "Making the Map"
date: "2018-09-25"
type: "post"
author_name:  "Susan Dreher"
author_url: "https://ctl.columbia.edu/about/team/dreher/"
lede: "Mapping visualizations have been a core component of many of our custom
digital learning applications. The geographical interactives have promoted a
significantly richer experience, deepening understanding and encouraging
exploration and discovery. My understanding of how to build these applications
has iteratively improved through collaboration with our clients, the talented
faculty and students who form the basis of our audience."
poster: "poster-writlarge-map.jpg"
socmediaimg: "socmediaimg-writlarge-map.jpg"
poster_sourceurl: ""
poster_source: ""
topics: 
- Research and Development
tags: [django, python, maps]
---

_Mapping visualizations have been a core component of many of our custom
digital learning applications. The geographical interactivity has promoted a
significantly richer experience, deepening understanding and encouraging
exploration and discovery. My understanding of how to build these applications
has iteratively improved through collaboration with our clients, the talented
faculty and students who form the basis of our audience._

## Where to start?
The primary stack that underpins these applications is:
[Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/tutorial)
paired with
[GeoDjango](https://docs.djangoproject.com/en/2.1/ref/contrib/gis/tutorial/)
and the 
[PostGis spatial backend](https://docs.djangoproject.com/en/2.1/ref/contrib/gis/install/postgis/).
All are well-documented and well-supported. Google Map alternatives include
[Open Street Map](https://www.openstreetmap.org/#map=5/38.007/-95.844) and
[Leaflet](https://leafletjs.com/).

## Geo-who-what?
Our partners generally want to show *something* on the map: a location in a
forest, a site of teaching & learning, a place where a book was printed. I
first walk them through the mechanics of
[geocoding](https://en.wikipedia.org/wiki/Geocoding) and
[reverse geocoding](https://en.wikipedia.org/wiki/Reverse_geocoding).

Geocoding uses address components to retrieve the latitude and longitude of a
location. Reverse geocoding or address lookup provides a description of a given
latitude and longitude.

```
116th St & Broadway, New York, NY 10027, United States
geocodes to 40.8075° N, 73.9626° W

40.8075° N, 73.9626° W reverse geocodes to
116th St & Broadway, New York, NY 10027, United States
```

## “OK” or “ZERO_RESULTS”
Obtaining geocodes through geocoding a _modern_ set of _well-formed_ addresses
is usually straightforward. A batch process can call the Google API for each
address then stash the results.
[Call the API slowly if you don’t want to incur charges…](https://developers.google.com/maps/documentation/geocoding/usage-and-billing)

Problems can arise in a few situations. The
[Virtual Forest Initiative](https://blackrock.ccnmtl.columbia.edu)
supports research and
education at [Black Rock Forest](https://blackrockforest.org). Scientists
wanted to visually locate experiments and studies that took place in remote
areas. Reverse geocoding wasn’t possible here. Instead, locations were geocoded
through an admin interface. Editors dropped pins on a map to specify a latitude
and longitude. Luckily, the data set was fairly small making this solution
workable.

[Footprints](https://footprints.ccnmtl.columbia.edu) is an application that
traces the path of physical book copies through time and space for the
[early modern period](https://en.wikipedia.org/wiki/Early_modern_period), roughly
1500-1800. We obviously could not rely on a geocoding service due to historical
location descriptions. Initially, we’ve relied on a manual process to geocode
the locations. We were then able to optimize this process by drawing in
geocoded data from our existing data set.

## What’s the address?
We use reverse geocoding, a.k.a. address lookup, in our applications to allow
users to specify an address by dropping a pin on a map.
[WritLargeNYC](https://writlarge.ccnmtl.columbia.edu) is an application that locates
sites of teaching and learning in neighborhoods around New York City. Editors
drop a pin at a given location, which automatically kicks off a reverse geocode
operation.

{{< figure src="/img/assets/writlargelocation.png"
class="text-center grey-border responsive"
alt="This is a screenshot of the location selection interface at the Writ Large website." >}}

The reverse geocoding operation returns an array of
[address components](https://developers.google.com/maps/documentation/javascript/geocoding#GeocodingAddressTypes).
Usually the results make sense, but look out
for inconsistencies as you pick and choose your address components. In
[WritLargeNYC](https://writlarge.ccnmtl.columbia.edu), I simply use the full address
result directly. For [Footprints](https://footprints.ccnmtl.columbia.edu),
determining the type or components that equal city and country took a little
work. I’ve ended up pulling out the `locality` and `country` from the full
address components manually for display purposes, as my first choice the
`locality` type did not always exist. But, this can get a little wonky too. If
you drop a pin near Oxford, England, you might end up with England, United
Kingdom. I should probably revisit that behavior.

## Display & Interaction
Once the *things* you want to display are geocoded, the fun begins. Here’s a
quick look at each of the display and feature choices we made for our most
recent mapping applications.

### [Virtual Forest Initiative](https://blackrock.ccnmtl.columbia.edu)
* Satellite
* Clickable icons with popup infowindows.
* KML overlays with points of interest
* "Search Nearby" feature takes advantage of the
[GeoDjango](https://docs.djangoproject.com/en/2.1/ref/contrib/gis/tutorial/)
backend
[distance lookups](https://docs.djangoproject.com/en/2.1/ref/contrib/gis/db-api/#distance-lookups)


{{< figure
src="/img/assets/blackrockmap.png"
class="text-center grey-border responsive"
alt="This is a screenshot of the Virtual Forest Initiative interactive map." >}}

### [Footprints](https://footprints.ccnmtl.columbia.edu) ([GitHubrepo](https://github.com/ccnmtl/footprints/))
* Roadmap
* Clickable icons with popup infowindows.
* [Overlapping Marker Spiderfier](https://github.com/jawj/OverlappingMarkerSpiderfier) to handle
situations where many data points where at the same latitude and longitude. 

{{< figure src="/img/assets/footprintsmap.png"
class="text-center grey-border responsive"
alt="This is a screenshot of the Footprints interactive map." >}}

### [Writ LargeNYC](https://writlarge.ccnmtl.columbia.edu) 
* Styled map using [Snazzy Maps](https://snazzymaps.com/style/151/ultra-light-with-labels)
* Map overlays from [New York Public Library's Map Warper tool](http://maps.nypl.org/warper/)
* Clickable icons with overlay infowindows
* Custom icons

{{< figure
src="/img/assets/writlargemap.png"
class="text-center grey-border responsive"
alt="This is a screenshot of the Writ Large interactive map." >}}

## Big Ideas
We're continuing to iterate on our mapping applications and have some big ideas
on where to go next. One big idea that we haven’t realized yet for both
Footprints and Writ Large. We’d like to add the ability to “play” our locations
over time. Something like what [TimeMapper](http://timemapper.okfnlabs.org/)
does but with a greater focus on the map rather than the accompanying details.

## Code
* The [Virtual Forest Initiative](https://blackrock.ccnmtl.columbia.edu) ([GitHub repo](https://github.com/ccnmtl/blackrock/))
* [Footprints](https://footprints.ccnmtl.columbia.edu) ([GitHub repo](https://github.com/ccnmtl/footprints/))
* [Writ Large](https://writlarge.ccnmtl.columbia.edu) ([GitHub repo](https://github.com/ccnmtl/writlarge/))


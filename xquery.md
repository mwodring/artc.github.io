'''
title: XQuery notes
layout: post 
'''
* Table of Contents
{:toc}

# XQuery Notes
## Path Expressions

### Access everything called Results in the database

    blast//Results

### Access all Results by path

    blast/BlastXML2/BlastOutput2/Report/Results

### Access all BlastOutput2 children of outmermost path

    blast/*/BlastOutput2
	
### Filter (predicates)

The @ indicates that query-title is an attribute, not a child element.

    blast//Search[@query-title="My title"]

With a number, it becomes an index, e.g. the second Search element in the database.

    blast//Search[2]

## FLWORs

### for, let, where, order by, return

```html
for $search in blast//Search
where $search/@query-title = "My title"
order by $search/Statistics/db-num
return $search/Statistics/db-num
```

Note that 'order by' isn't possible in simple path expressions.

### With let

```html
for $search in blast//Search
let $num := $search/db-num
where $search/@query-title = "My title"
order by $num
return $num 
```

## Enclosed Expressions

### Wrapping in an html unordered list:

```html
<ul>{
for $search in blast//Search
where $search/@query-title = "My title"
order by $search/Statistics/db-num
return $search/Statistics/db-num  }
```

Not inside braces is returned as is:

```html
<h1>There are {count(blast//Search)} queries.</h1>
```

### Wrapping just one part:

```html
<ul>{
for $search in blast//Search
where $search/@query-title = "My title"
order by $search/Statistics/db-num
return <li>$search/Statistics/db-num</li>
}</ul>
```

### Only data, without the element info:

    data($search/Statistics/db-num)

### Attributes:

```html
<ul>
for $search in blast//Search
where $search/@query-title = "My title"
order by $search/Statistics/db-num
return <li class="$search/Statistics/@hsp-len">$search/Statistics/db-num</li>
```

## Aggregrating and Grouping

A nonsense sum of db-num here as an example.

```html
xquery version="3.1"
for $search in blast//Search
let $species := $search/hits/HitDescr/@id
group by $species
order by $species
return <species name="{$species}" totQuantity="{sum($search/Statistics/db-num)}"/>
```

## Namespaces

The database namespace is statically bound as 'blast' in Basex. They can be declared in the preamble.
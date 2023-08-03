---
layout: post 
---
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
These namespaces can prefix other variables with a :, including in $variables.
If not prefixed, they are not associated with any namespace.

## Comments

XQuery comments are between : and :. They are not present in the outputted document.

```html 
<!-- XML comments will appear in the final document -->
```

## If-Then-Else

```html
if ($x < 12 and $y > 0)
then $x + $y
else $x - $y
```

```html
for $search in (db:open('blast')//Search)
return if ($search/Statistics/db-num > 10)
	   then <len>{data($search/Statistics/hsp-len)}</len>
	   else <otherLen>{data($search/query-len)}</otherLen>
```

If you're returning multiple expressions, they need to be concatenated using a [sequence constructor](#multiple).

Additional parentheses may be used in expressions to make the evaluation order more obvious or even change it.

```html
if (($x <12) and ($y >0))
then ($x + $y)
else ($x - $y)
```

This is the same as the above.

Else is required, but can simply be (), which is the empty expression.

## Switch Expressions

```html
switch ($search/HitDescr/taxid)
	case 9606 return "Human"
	case 9989 return "rodentia"
	case 2 return "bacteria"
	case 10239 return "virus"
	default return "other"
```
The () empty expression is a possible return value for default.

Multiple cases can return the same value:

```html 
switch ($search/HitDescr/taxid)
	case 9906
	case 9989 return "Mammal"
	case 2 return "bacteria"
	default return "other"
```

The switch operand expression and case operand expressions (in parentheses) must evaluate to a single value, not a sequence. 
Any number of any kind of items are permitted to be RETURNED however.

```html
	xquery version "3.1";
	for $search in db:open('blast')//Search
	return switch ($search/HitDescr/taxid)
		case 9906
		case 9989 return "Mammal"
		case 2 return "bacteria"
		default return $search/HitDescr/id
```
	
<a name="multiple"></a>
## Using parentheses to return multiple elements

```html
if (not($prod))
then (<empty/>)
else (<num>{data($search/Statistics/db-num)}</num>,
	  <species>{data($search/HitDescr/id)}</species>)
```

This makes sure species is included in the if-then-else expression.

At the top level of a query, no parentheses are needed, you just use commas. 

```html
db:open('blast')//Search, db:open('blast')//Results
```

## Multi-comparison

The following returns true if the species is equal to Cat OR Dog.

```html
db:open('blast')//Search/HitDescr[@id = ("Cat", "Dog")]
```
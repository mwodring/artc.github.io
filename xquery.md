---
layout: post 
---
* Table of Contents
{:toc}

# XQuery Notes

Note that while sometimes I use @id and such as example attributes, the XML2 blast output has no attributes.
This is in fact a preferred choice for pure .xml files from some developers.

## Path Expressions

### Basics

#### Access everything called Results in the database

    blast//Results

#### Access all Results by path

    blast/BlastXML2/BlastOutput2/Report/Results

#### Access all BlastOutput2 children of outmermost path

```html
blast/*/BlastOutput2
```
	
#### Access all id attributes of search elements

	db:open('blast')//Search/@id
	
#### Access all child elements of BlastXML2

```html
db:open('blast')/BlastXML2/*
```

#### All grandchildren of Search that are taxid

```html
$search/*/taxid
```

Path expressions return nodes in document order, i.e. the same order as they appear in the document.
	
## Filter (predicates)

The @ indicates that query-title is an attribute, not a child element.

```html
blast//Search[@query-title="My title"]
```

With a number, it becomes an index, e.g. the second Search element in the database.

```html
blast//Search[2]
```

### Multiple predicates

```html
$search/HitDescr[id = "Cyanobacteria"][taxid = 2]
```

Is equivalent to:

```html 
$search/HitDescr[id = "Cyanobacteria" and taxid = 2]
```

The order matters:

```html
$search/HitDescr[2][@taxid = 2]
```

Is the second child of HitDescr if its taxid attribute is 2.

```html
$search/HitDescr[@taxid = 2][2]
```

Is the second child that has a taxid attribute of 2, which may not be the second.

### Using functions etc.

All HitDescr that have an attribute containing "virus":

```html
$search/HitDescr[contains(@id, "virus")]
```

Filter on a variable only if it's true:

```html
//BlastXML2/Results/Search/[if ($hits) then $hits/@id else false()]
```

Return if it has at least one child other than Statistics:

```html
$search/[* except Statistics]
```

You can also have predicates within predicates. This returns every animal whose third element is stripes:

```html
doc("animals.xml")/animals/animal[*[3][self::stripes]
```

An attribute if it exists, else 0:

```html
(@bit-score, 0.0)[1]
```

## Context

Context can be set by the query start:

```html
db:open('blast')/BlastXML2
```

db:open is Basex specific and returns the node of the database, which becomes the context item.
When the context item is a node (as opposed to <div class="tooltip">anatomic value<span class="tooltiptext">"a simple data value with no markup associated with it" i.e. no tags</span></div>) it is called the context node.

Variables such as $search also set context, of zero or more nodes.

Steps evaluate relative to the previous step. So cat/kittens evaluates kittens in the context of the cat.

Lastly, context can be evaluated relative to the current context node, which must have been previously determined outside of the expression. The processor may do this outside the scope of the query, or an outer expression can do so.

### Axes and Steps

| Axis/Step                    | Notes                                                                                   | Equivalent                   |
|------------------------------|-----------------------------------------------------------------------------------------|------------------------------|
| self::                       |                                                                                         |                              |
| child::                      |                                                                                         |                              |
| descendant::                 | All descendants of the context node.                                                    |                              |
| descendant-or-self::         | All descendants of context node plus context node.                                      | //                           |
| descendant::Search           |                                                                                         | .//Search                    |
| child::Search/descendant::id |                                                                                         | Search//id                   |
| attribute::                  | All attributes of the context node, if any.                                             | @ (for a specific attribute) |
| following::                  | All nodes following context node in the document, minus the context node's descendants. |                              |
| following-sibling::          | All siblings of the context node that follow it.                                        |                              |
| parent::                     |                                                                                         | ../HitDescr                  |
| parent::node()/HitDescr      |                                                                                         |                              |
| ancestor::                   |                                                                                         |                              |
| ancestor-or-self::           |                                                                                         |                              |
| preceding::                  |                                                                                         |                              |
| preceding-sibling::          |                                                                                         |                              |
| self::node()                 | All nodes of self.                                                                      | .                            |
| parent::node()               | All nodes of the parent.                                                                | ..                           |

#### Node tests

child::HitDescr only selects only HitDescr element children of the context node. This is a name test.

#### Referencing the context node

```html
//HitDescr/id[starts-with(., "Fish")]
```

Some functions default to the context node if no arguments are passed, such as string-length().

### Wildcards

```html
child::*  
````

Selects all children. This specifically can be abbreviated to just an asterisk.

```html
@*
attribute::*
```

Selects all attributes regardless of name.

```html
species:*
```

Selects all child elements in the namesapce bound to the prefix species.

The step:

```html
*:HitDescr
```

Selects all HitDescr child elements that are in any namespace or no namespace.

### Other types of Step

    db:open('blast)//Search/HitDescr/(id | taxid)
	
Picks both id and taxid from the element, where | acts as a union operator.

Note that if an expression step has a precendent lower than the forward slash it needs to be in parentheses, like above.

```html
//HitDescr/(* except id)
```

Description if it exists, else taxid:

```html 
//HitDescr/(if (desc) then desc else taxid)
```

Returns xs:string values that are substrings of ids.

```html
//HitDescr/substring(id, 1, 30)
```

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

## Returning values and constructors

### Enclosed Expressions

#### Wrapping in an html unordered list:

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

Note that if you return an element, its children are included too.

#### Wrapping just one part:

```html
<ul>{
for $search in blast//Search
where $search/@query-title = "My title"
order by $search/Statistics/db-num
return <li>$search/Statistics/db-num</li>
}</ul>
```

#### Only data (atomic values), without the element info:

    data($search/Statistics/db-num)

#### Attributes:

```html
<ul>
for $search in blast//Search
where $search/@query-title = "My title"
order by $search/Statistics/db-num
return <li class="$search/Statistics/@hsp-len">$search/Statistics/db-num</li>
```

#### Aggregrating and Grouping

A nonsense sum of db-num here as an example.

```html
xquery version="3.1"
for $search in blast//Search
let $species := $search/hits/HitDescr/@id
group by $species
order by $species
return <species name="{$species}" totQuantity="{sum($search/Statistics/db-num)}"/>
```

### Direct Element Constructors

These return xml, like those above, by specifying the element and optionally its attributes.

### Computed Constructors


## Namespaces

The database namespace is statically bound as 'blast' in Basex. They can be declared in the preamble.
These namespaces can prefix other variables with a :, including in $variables.
If not prefixed, they are not associated with any namespace.
A namespace declaration if in scope if it appears in an outer element or the query prologue. 
They can be prefixed or unprefixed. Prefixed names must be bound to a namespace using a namespace declaration:

```html
declare namespace foo = "http://foobar.com/bat"
```

If it's unprefixed and there's an in-scope default namespace, it is considered to be in that namespace, otherwise, it has none.
Attribute names are NOT affected by default namespace declarations.

[From datypic.com](http://datypic.com/prod):

```
The main purpose of a namespace is not to point to a location where a resource resides. Instead, it is intended to provide a unique name that can be associated with a particular person or organization, much like Java package names. Therefore, namespace names are not required to be dereferencable. That is, there does not necessarily need to be an HTML page or other resource that can be accessed at this URL. The namespace name could point to a schema, an HTML page, a directory of resources, or nothing at all.
```

## Comments

XQuery comments are between : and :. They are not present in the outputted document.

```html 
<!-- XML comments will appear in the final document -->
```

## Comparisons

### If-Then-Else

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

#### Evaluation order 

If you're returning multiple expressions, they need to be concatenated using a [sequence constructor](#multiple).

Additional parentheses may be used in expressions to make the evaluation order more obvious or even change it.

```html
if (($x <12) and ($y >0))
then ($x + $y)
else ($x - $y)
```

This is the same as the above.

    $x < 12 and $y > 15
	
The above doesn't need parentheses as logical operators (and, or) have lower precedence than comparison operators.

Else is required, but can simply be (), which is the empty expression.

#### One-liners

They can also be one-liners:

```html
if ($isBig and $cm > 200) then "huge" else "pretty large"
```

Empty strings, 0, NaN, the empty sequence and false all evaluate to false. 
For example, BlastOutput2/Search returns false if there are no entries and true if there are.

### Switch Expressions

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
### Using parentheses to return multiple elements

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

### Multi-comparison

The following returns true if the species is equal to Cat OR Dog.

```html
db:open('blast')//Search/HitDescr[@id = ("Cat", "Dog")]
```

### Not

These are false:

    not(true())
	
or
   
    not(12 > 0)

If there ARE hits:
   
    not($search/hits) 
   
And these return true:

    not ( () )
	
or
   
    not("")
   
Not is a function, slightly different from !=. For example:

    $search/@id != "Fish"

Returns false if search doesn't have an id attribute. not() will return true in this case, because if the sequence returned is empty, the comparison evuluates to false. not() negates this.
	
## Simple Map operator

Maps a function to a returned value.

```html
//HitDescr/id/substring(., 1, 5) ! lower-case(.)
```

Returns substring of the first five letters of each id (which are now atomic values) in lowercase.

This is useful because the slash only works on nodes, not atomic values; the expression on the right hand side can only evaluate to such if it's the last step in the path.

The ! operator lets either side of the operator evaluate to zero or more items.

The path operator always removes duplicates and returns in document order. The ! operator does neither.

# Basex

## Dynamic inputs

Look for search term in all ids:

```html
db:open('blast')//*[name() = id][. = $searchTerm]
```

In Basex, this and more complex paths are the use case of the xquery:eval and related functions.

To bind a value.

```
-b<args> Binds external variables to XQuery expressions. This flag may be specified multiple times. Variables names and their values are delimited by equality signs (=).
``` 

Example binding the search term Nepovirus to blastQuery.xq before execution:

    -b searchTerm="Nepovirus" blastQuery.xq
   
Couples with the following in blastQuery.xq to bind searchTerm to a string (default) with virus as a default:

```html 
declare variable $searchTerm external := "virus";
```
If the query specifies a data type, the passed on value will be cast to that type.

```html
declare variable $bitscore as xs:int external := 50;
```

You can also skip the file for simple queries using the -q flag:

```html
-b searchTerm="Nepovirus" -q "declare variable $searchTerm external; $searchTerm"
```

## CSV

### Method 1, Using return

Declaring options in the prologue:

```html
declare option output:method "csv";
declare option output:csv "header=yes, separator=comma";
```

Generic output format using xml constructors, allowing empty entries:

```html
for $y in //Data allowing empty in $x/Info
return 
<csv>
  <record>
    <Header1>{$y/Fact1/data()}</Header1>
    <Header2>{$y/Fact2/data()}</Header2>
  </record>
</csv>
```

The record and csv tags are necessary for the processor/serialisation to function.
Each record is a line in the outputted csv file.

### Method 2, using file:write

Declare options in a map in the prologue:

```html
let $options := map { 
					 'format' : 'xquery',
					 'header': true(),
					 'separator': 'comma',
					 'method' : 'csv'
					 }	
```

Call Basex's file:write function using csv:serialize on a variable $data to tmp/output.csv:

```html
return file:write(
  '/tmp/output.csv',
  csv:serialize($data, $options)
		   )
```

Maps and arrays use less memory than xml nodes so may be a better choice for high memory processes.

To generate an example $data similar to the xml above:

```html
let $data := map {
  'headers': [
    'Header1', 'Header2'
  ],
  'records': (
    for $y in $x/Info
    return [
      string($y/Fact1),
      string($y/Fact2)
    ]
  )
}
```
Tumbling windows can help with very big memory usage. See the [SO thread this segment is adapted from](https://stackoverflow.com/questions/66353741/basex-xquery-out-of-memory-when-writing-results-to-csv-file) for more.
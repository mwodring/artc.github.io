---
layout: post 
---

{% include toc.html html=content class="collapsible" item_class="collapsible" %}

# XQuery Notes

Adapted mostly from XQuery by Priscilla Walmsley, with some additions adapted from Basex talk, W3Schools and Stack Overflow.
Note that while sometimes I use @id and such as example attributes, the XML2 blast output has no attributes.
This is in fact a preferred choice for pure .xml files from some developers.

## Path Expressions

### Basics

#### Access everything called Results in context

    //Results

#### Access all Results by path

    /BlastXML2/BlastOutput2/Report/Results

#### Access all BlastOutput2 children of outermost path

```html
/*/BlastOutput2
```
	
#### Access all id attributes of search elements

	//Search/@id
	
#### Access all child elements of BlastXML2


    /BlastXML2/*


#### All grandchildren of Search that are taxid

```html
//Search/*/taxid
```

Path expressions return nodes in document order, i.e. the same order as they appear in the document.

## Comments

XQuery comments are between : and :. They are not present in the outputted document.

```html 
<!-- XML comments will appear in the final document -->
```

## Filter (predicates)

The @ indicates that query-title is an attribute, not a child element. This isn't the case in the real xml, this is just an example.

```html
//Search[@query-title="My title"]
```

With a number, it becomes an index, e.g. the second Search element in the database.

```html
//Search[2]
```

### Multiple predicates

```html
//Search//HitDescr[id = "Cyanobacteria"][taxid = 2]
```

Is equivalent to:

```html 
//Search//HitDescr[id = "Cyanobacteria" and taxid = 2]
```

The order matters:

```html
//Search//HitDescr[2][@taxid = 2]
```

Is the second child of HitDescr if its taxid attribute is 2.

```html
//Search//HitDescr[@taxid = 2][2]
```

Is the second child that has a taxid attribute of 2, which may not be the second.

### Using functions etc.

All HitDescr that have an id attribute containing "virus":

```html
//Search//HitDescr[contains(@id, "virus")]
```

Filter on a variable only if it's true:

```html
//BlastXML2/Results/Search/[if ($hits) then $hits/Hit else false()]
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

## Comparisons 

Returns true if any bitscore children have a value greater than 10:

```html
$hit//*:bit-score > 10
```

Returns true if there is only one item returned by the expression, and its value is greater than 10. If more than one item is returned, an error occurs:

```html
$hit//*:bit-score > 10
```

## Distinct Values

The function selects distinct atomic values from a sequence. e.g. a series of those distinct values. For example if your BlastXML query has thirty hits but 28 of them are "Fish", one is "Cat" and one is "Dog":

```html
distinct-values(//*:title)
```

Returns ("Cat", "Dog", "Fish").

###Combinations

Because distinct-values only takes one argument you need to split it up:

```html
let $searches := //*:Search
for $species in distinct-values($searches//*:title)
	$id in distinct-values($searches//*:id)
return <result species="{$species} id="{$id}"/>
```

## Context

Context can be set by the query start:

```html
/BlastXML2
```

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

```html
//Search/HitDescr/(id | taxid)
```
	
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
for $search in //Search
where $search/query-title = "My title"
order by $search/Statistics/db-num
return $search/Statistics/db-num
```

Note that 'order by' isn't possible in simple path expressions as it is here.
The for clause is similar to loops in procedural programming languages, but XQuery is functional. The iterations are considered to be in no particular order and as a result, counting using a variable is not possible, nor can a person continuously append to a string which each iteration. The upside is that XQuery is fast for its intended purpose.

#### a note on equality

XQuery considers type when checking equality using =. Unless using a schema, entries are untyped and values are compared as strings.
Only numeric types consider equivalent numbers the same, e.g. as a string 05 and 5 are different, but as a numeric they are the same.

### Range Expressions

```html
for $i in 1 to 3
return <oneEval>{$1}</oneEval>
```

Parenthesised expressions:

    for $i in (1 to 3, 8 to 10)

Using variables:

    for $i in 1 to $range_end
	
If the first integer is greater than the second, such as 3 to 1, or if either operand is the empty sequence the expression evaluates to the empty sequence.

Descending:

    for $i in reverse(1 to 3)
	
Incrementing other than 1:

```html
for $i in (1 to 100)[. mod 2 = 0]
```

### With let

```html
for $search in //Search
let $num := $search/db-num
where $search/@query-title = "My title"
order by $num
return $num 
```

A for clause results in iteration, while a let clause binds the whole sequence to a variable. (It's called the binding sequence with the for X in Y.)
This means that 'for' statements cause the rest of the FLWOR to be evaluated multiple times. A 'let' statement creates a series.

After binding a variable with let, you can then proceed to iterate over it with for, and multiple lets can be assigned in one line using commas. 

### Multiple for clauses

```html
for $i in (1,2)
for $j in ("a", "b")
return <oneEval>i is {$i} and j is {$j}</oneEval>
```

This can also be specified in one line, using commas:

```html
for $i in (1,2), $j in ("a", "b")
```

This is similar to a nested loop in other languages. The order matters; it takes the first value is $i and it iterates over the values of $j. Then takes the second value of $i to iterate over the second value of $j, etc.

### Inside function calls

```html 
max(for $hsp in //Search//hsps
	return xs:integer($hsp/bit-score))
```

### at, as, allowing empty

#### at: positions

#### as: type declarations

#### allowing empty: outer joins

FLWORs default to inner joins, which leads to:

### Joins

#### Inner joins

This joins data from multiple sources, e.g. different xml documents - say if you have a custom database, you could combine your BlastXML2 with a .xml mapping the ''accessions'' which are now just in number order back to the actual accession, if your database is a subset of NCBI's GenBank.

```html
for $num in doc("blast.xml")//accession
	$entry in doc("database_info.xml")//entry[number = $num]
return <number = "{$num}",
		accession = "{"$entry/accession"}"/>
```

You can also use a where clause instead of a predicate to achieve the same thing.
Joins can have three or potentially more sources, too. 

#### Outer joins

Add 'allowing empty' to force a return clause to evaluate once even if there is no matching element (e.g. results in an empty sequence) between the two sources, rather than zero times.

## Ordering

Paths and FLWORs default to document order. FLWORs can change this like so:

```html
for $hit in //*:Hit
order by $hit//*:bit-score
return $hit
```

All of the values returned by a single ordering expression must have the same type. Numeric types can be compared with one another, like integers and decimals. Untyped values are treated like strings.
You can sort by anything as long as it returns just one value.

#### Sorting with if else

```html
order by (if ($fur/@colour) then $fur/@colour else "hairless")
```

### Parameterising the key

```html
order by $hsp/@*[name()=$param]
```

### Modifiers

- ascending
- descending 
- *empty greatest* and *empty least* put empty sequences/NaN first and last respectively. This does not apply to zero length strings, which always sort before other strings.
- [collation](#collation)

### Multiple

Separate by commas, and XQuery will return them ordered in the order you pass the specifications in. Such as by query-title, then by hit title.

### stable

Determines what happens when sorting and two values are the same if you don't want the implementation to decide that for you.

    stable order by $hsp/bit-score
	
Returns them in the order the for clause returns them in, which is usually document order.

### Specifying in the prologue

    declare default order empty greatest;

### sort function (3.1 only)

Return bit-scores sorted by their contents:

```html
sort(//*:bit-score)
```
Return searches sorted by their query-title child:

```html
sort(//*:Search, function($search) {$search//*:query-title})
```

### Comparisons 

Compare if an item precedes or follows another in document order (in document order, parents precede children):

```html
<< and >>
```

### Unordered (often faster)

Enclose the expression in a call to unordered(), or use the unordered expression.
The difference is that the unordered expression affects embedded expressions, not just the main expression passed as an argument. Enclosed in curly brackets instead:

   unordered {}
   
You can override this using the ordered expression inside, for when sub-sections of the query do care about order.

You can also declare this as an option in the prologue for the entire query:

    declare ordering unordered;

### Avoiding re-sorting in document order

If you assign a sorted variable then later access it with a for/in, it will be returned in document order again unless you specify the order.

## Grouping (3.0 and greater)

This changes the iteration of the FLWOR expression. It will iterate and return once for every group of items.
It also changes the binding. Before the group by clause, your $i variable is bound to one element at a time. After grouping it is bound to a sequence of one or more items at a time based on the current group.
Group by can use one or more grouping clauses separated by commas, each of which is a grouping variable name ($) followed by an optional expression and an optional collation specification. You can also use as to cast the group to a type. Collations are used to compare strings for equality.
As before, multiple grouping clauses can be included, separated by commas, such as by query-id and by title. There is no limit to the number.

#### Variable shortcut

  group by $species := $HitDescr/title
  order by $species

The grouping variable must be bound to a single atomic value, called the grouping key. In this case this only works if each HitDescr has only one title item.

### More complex specifications

Group based on the boolean of if bit-score is over 50:

```html
group by $n := $hit/hsps/Hsp[1]/bit-score > 50
```

Grouping on a range of values:

```html
group by $g := $query/num - ($query/num mod 100)
return <group querynumrange="{$g}-{$g+99}" count=£{count{$item}}"/>
```

## Aggregation 

These are a group of functions to summarise and aggregate returned values. 

- count 
- sum
- min (treats zero length strings as the minimum. A function would be needed to ignore them.)
- max 
- avg (mean) (ignores empty values. You'd need to write a function to count empty values as zero.)

### Aggregating on multiple values

Add another grouping specification:

```html
group by $s := $query//*:title[1], $b := $query/Hit/hsps/Hsp[1]/bit-score
order by $s, $b
return <group species = "{$s}" bitscore="{$b}" best="{max($b)}" total="{count($s)}"/>
```

### Constraining and sorting

```html
where max($bitscore) gt 1
order by count($species)
```

## Returning values and constructors

### Enclosed Expressions

#### Wrapping in an html unordered list:

```html
<ul>{
for $search in //Search
where $search/@query-title = "My title"
order by $search/Statistics/db-num
return $search/Statistics/db-num  }
```

Not inside braces is returned as is:

```html
<h1>There are {count(//Search)} queries.</h1>
```

Note that if you return an element, its children are included too.

#### Wrapping just one part:

```html
<ul>{
for $search in //Search
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
for $search in //Search
where $search/@query-title = "My title"
order by $search/Statistics/db-num
return <li class="$search/Statistics/@hsp-len">$search/Statistics/db-num</li>
```

<a name="windowing"></a>
## Windowing

A window clause, like group by, creates an iteration over a sequence of items. It creates a window based on starting and ending conditions, and evaluates the return clause once per window.
With windows, the original order of the items is preserved, and in groups, they're arranged into those groups. Because the order is retained you can put constraints on items that come before and after the start and end of the window. For example, starting a window if a value changes compared to the previous item.

Even numbers:

```html
for tumbling window $w in (1, 4, 3, 12, 5, 13, 8)
	start $s when $s mod 2 = 0
return <window>{$w}</window>
```

Results in three windows of (4, 3), (12, 5, 13) and (8).

## Namespaces

Basex defaults to a static namespace for the presently opened database.

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

## Comparisons

### If-Then-Else

```html
if ($x < 12 and $y > 0)
then $x + $y
else $x - $y
```

```html
for $search in //Search
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
switch ($search/hits/Hit/HitDescr/taxid)
	case 9606 return "Human"
	case 9989 return "rodentia"
	case 2 return "bacteria"
	case 10239 return "virus"
	default return "other"
```
The () empty expression is a possible return value for default.

Multiple cases can return the same value:

```html 
switch ($search/HitDescr/hits/Hit/HitDescr/taxid)
	case 9906
	case 9989 return "Mammal"
	case 2 return "bacteria"
	default return "other"
```

The switch operand expression and case operand expressions (in parentheses) must evaluate to a single value, not a sequence. 
Any number of any kind of items are permitted to be RETURNED however.

```html
	xquery version "3.1";
	for $search in //Search
	return switch ($search//HitDescr/taxid)
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
	  <species>{data($search//HitDescr/id)}</species>)
```

This makes sure species is included in the if-then-else expression.

At the top level of a query, no parentheses are needed, you just use commas. 

```html
//Search, //Results
```

### Multi-comparison

The following returns true if the species is equal to Cat OR Dog.

```html
//HitDescr[id = ("Cat", "Dog")]
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

## Quantified expressions

These always evaluate to booleans. They are:

- every
- some

To make it into an expression using the quantifier, a binding (in) clause, and satisfies containing the test expression:

```html
every $hsp in //*:hsps 
satisfies ($hsp/bit-score > 50)
```

As above, multiple variables can be bound by separating them with commas:

```html
some $i in (1 to 3), $j in (10,11)
satisfies $j - $i = 7
```

## Functions

There is no context item inside function bodies.

### User-defined syntax 

Can be in the prologue or in an external library:

```html
declare function local:myFunc(
	$var1 as xs:decimal?,
	$var2 as xs:integer?) as xs:decimal?
	{
	let $var1 := $var1, $var2 @= $var2
	return $var2 - $var1
	};
```

### Signatures 

#### Occurence indicators

- ? for zero or one items
- \* for zero, one or more items
- + for one or more items
- No indicator (expects one and only one)

There is no difference between an item, and a sequence that contains only one item. XQuery also has conversion rules for casting when a different type is passed as an argument than what it expects, such as integer to decimal.

The type after the parameters is the return type of the function.

A function can have multiple signatures. 

### Arrow Operator

    "abc"==>upper-case()

Is equivalent to:

    upper-case("abc")
	
This is useful for chaining function calls like with piping. Before:

    tokenize(normalize-space(replace($string, 'a' 'b')), "\s")
   
 After:
 
     $string==>replace('a', 'b')==>normalize-space()==>tokenize("\s")

# Basex

## Dynamic inputs

Look for search term in all nodes with a given name:

```html
//*[name() = $searchNode][. = $searchTerm]
```

In Basex, this and more complex paths are the use case of the xquery:eval and related functions.

To bind a value.

```
-b<args> Binds external variables to XQuery expressions. This flag may be specified multiple times. Variables names and their values are delimited by equality signs (=).
``` 

Example binding the search term Nepovirus:

    basex -b searchTerm="Nepovirus"
   
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
  'names': [
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
[Tumbling windows](#windowing) can help with very big memory usage. See the [SO thread this segment is adapted from](https://stackoverflow.com/questions/66353741/basex-xquery-out-of-memory-when-writing-results-to-csv-file) for more.

### Method 3: string-join and write-text-lines

For each record, generate one line:

    string-join($record/descendant::text(),',')
	
With write-text-lines:

    file:write-text-lines('/tmp/output.csv',for $record in $data return string-join($record/descendant::text(),','))
	
This requires column mapping to be exact but bypasses csv serialisation if you need that.
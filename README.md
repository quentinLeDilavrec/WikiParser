# WikiParser
a wiki parser in typescript/nodeJs

## Feed a database

my way out of this was to start with a general purpose table that show up links between elements in wikipages;

|         Parent          |                Child                   |     Location     |
|-------------------------|----------------------------------------|------------------|
| /wiki/Materials_science | /wiki/Materials_science#External_links | Materials_science|
|      ...                |                ...                     |     ...          |

## Just parse a page or get the intermediate format

the itermediate format is in json, it's nearly the same as the table
but here data in shown in a tree.

Like this:

```ts
export interface Noeud {
    name: string;
    child?: Noeud[];
}
```

But we are in a dynamic language so for now there is 2 hidden members,
type and content respectively a string and an any

They are used for describing data that can't be put in the hierarchical table.
Later I will think about a way to implement those more cleanly.

## How it works?

### easy first, the json (tree) to sql (table) converter

The basics are just a recursive function that for each node in the tree return an array that associate the current node name to each one of his children

```ts
let rec = (n:Noeud) => n.child.map(x=>
    (x.name != undefined) ? [n.name,x.name].concat(rec(x)) : rec(x)
).reduce((acc, x) => (acc.concat(x)), [])
```

### The parser

It uses cheerio to create the DOM,
then get the get the first relevant element,
then give it (the pointer) to the main recursive function that will build the tree.
To describe this function we can say that it behave like this:
* just return the curent element if the current element is hierachicaly equal or higher
* add to child all the element given by the recursive call that take the next element and the level+1 then concat to the another recursive call if the current element is lower by one
* process the current element with an auxiliary function if the current element isn't a hierachical element

### The database feeding

Nearly just a big promise that will pick some links in your table then parse and finally put the new data in the table
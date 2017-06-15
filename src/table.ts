/// <reference path="../node_modules/@types/node/index.d.ts" />
import * as fs from "fs";
import * as $ from "cheerio";
import { Noeud } from "./html2tree";
import * as $elements from "./elements";


declare global {
    interface Array<T> {
        log(str?: any): this;
        exe(f: any): this;
    }
    interface String {
        log(str?: any): this;
        exe(f: any): this;
    }
}
Array.prototype.log = function (str: any = this) {
    console.log(str)
    return this
};
String.prototype.log = function (str: any = this) {
    console.log(str)
    return this
};

export interface t<T> {//td & th
    r: number
    c: number
    e: elem<T>

}
export interface elem<T> { id: number, e: T }

/**
 * 
 * @param a     données
 * @param prec  cases prisent
 */


let TabbleNormalizer = <T extends CheerioElement>(a: t<T>[][], prec: t<T>[][]): t<T>[][] => {// !! attention au row ou a ne doit pas se faire égrainer

    // [[],[],[],[]]


    if (a.length == 0) return []
    let a_tmp = a.shift()
    let ind_a = 0
    let res: t<T>[] = []

    for (let i = 0; i < prec.length; i++) {

        if (prec[i].length != 0) {

            res.push(prec[i].shift())
        } else {

            if (ind_a >= a_tmp.length) {//handle it properly
                ((x: CheerioElement) => { $(x).after('<td></td>'); a_tmp.push({ r: undefined, c: undefined, e: { id: -1, e: x.nextSibling as T } }) })(a_tmp[a_tmp.length - 1].e.e as any)

            }
            Array((x => (x == undefined) ? 1 : parseInt((x as any) as string))(a_tmp[ind_a].c))
                .fill(a_tmp[ind_a])
                .forEach((element, j) => {

                    res.push(element)
                    Array((x => (x == undefined) ? 1 : parseInt((x as any) as string))(a_tmp[ind_a].r) - 1)
                        .fill(a_tmp[ind_a])
                        .forEach(element => {

                            prec[i + j].unshift(element)

                        });
                })
            i += (x => (x == undefined) ? 1 : parseInt((x as any) as string))(a_tmp[ind_a].c) - 1;
            ind_a++
        }


    }
    return [res].concat(TabbleNormalizer(a, prec))
}
/*
let e = []
 
let a_tmp = a.shift()
let i = 0
 
let prec_tmp = prec.shift();
 
console.log('------0000000---------');
console.dir(prec_tmp);
console.dir(prec);
console.log('------0000000---------');
 
if (prec.length == 0) prec = Array(prec_tmp.length).fill([])
for (let j = 0; j < prec_tmp.length; j++) {//  ----> dans prec
    console.log('e');
 
    if (prec_tmp[j] == []) {
        for (let k = j; k < (a_tmp[i].c | 0); k++) {
            console.log('e');
            prec_tmp[k] = a_tmp[i].e
            for (let l = 0; l < (a_tmp[i].r | 0) - 1; l++) { // ||v||
                console.log('******' + l + '     ' + (a_tmp[i].r | 0));
                if (prec.length < a_tmp[i].r) { prec.push([]) }
                prec[l] = a_tmp[i].e
                console.log('!!!!!!!!!!!!!!')
            }
        }
        i += (a_tmp[i].c | 0);
    }
}
 
//console.log(i)
 
console.log('---------------');
console.log(prec_tmp);
console.log(prec);
console.log('---------------');
 
return [prec_tmp].concat(aaa(a, prec))
}
 
*/


function isObject(obj) {
    return obj && (typeof obj === "object");
}

function isArray(obj) {
    return isObject(obj) && (obj instanceof Array);
}



let deepCopy = <T>(x: T | T[]): T | T[] =>

    (isArray(x)) ?
        (x as any[]).map(x => deepCopy(x)) as T[] :
        ((isObject(x)) ?
            OjectCopy(x as T) :
            x)
let OjectCopy = <T>(item: T): T => {
    let obj: T = <T>{}
    for (var k in item) {
        obj[k] = deepCopy(item[k]) as any;
    }
    return obj
}

/*
let deepEqual = <T>(x: T | T[], y: T | T[]): boolean =>
    (isArray(x)) ?
        ((isArray(y))?(x as any).every(x => deepEqual(x,y)) as T : false) :
        ((isObject(x)) ?
            OjectEqual(x) :
            x)

let OjectEqual = <T>(item: T,other:T): boolean => {
    for (var k in item) {
        obj[k] = deepEqual(item[k]);
    }
    return obj
}
*/
/*
var out = arr.
    for(var i = 0, len = arr.length; i < len; i++) {
    var item = arr[i];
    var obj = {};
    for (var k in item) {
        obj[k] = item[k];
    }
    out.push(obj);
}
return out;*/




//console.dir(aaa([[<t>{ e: 1, r: 1, c: 1 }, <t>{ e: 2, r: 1, c: 1 }, <t>{ e: 3, r: 1, c: 1 }], [<t>{ e: 4, r: 1, c: 1 }, <t>{ e: 5, r: 1, c: 1 }, <t>{ e: 6, r: 1, c: 1 }]], [[], [], []]))
/*
let _id = 0
let rowIgnored = 1
let $table = $.load(fs.readFileSync('test.1.html').toString())('table').toArray()[0].children.filter(x => x.name == 'tr')
let tbody = $table.slice(rowIgnored).map(x => x.children.filter(x => x.name == 'th' || x.name == 'td').map(x => <t<string>>{ e: { id: _id++, e: x.name }, r: x.attribs['rowspan'], c: x.attribs['colspan'] }))
let tholo = $table.slice(0, rowIgnored).map(x => x.children.filter(x => x.name == 'th' || x.name == 'td').map(x => []))[0]//non stable
let thead = $table.slice(0, rowIgnored).map(x => x.children.filter(x => x.name == 'th' || x.name == 'td').map(x => <t<string>>{ e: { id: _id++, e: x.name }, r: x.attribs['rowspan'], c: x.attribs['colspan'] }))//non stable




//let d = aaa(tbody, thead_holo)
//let _tbody = deepCopy(tbody)//deepCopy(tbody)
//_tbody[0][0].c = tbody[0][0].c
let a = TabbleNormalizer(tbody, tholo)*/
console.dir(
    //fs.readFileSync('test.1.html').toString()
    //tbody.map(x => x.name).length
    //table
    //thead
    //a
    //d
    //tbody
)


//tbody == ancien tbody a cause de la fct


/*console.dir(
    aaa(
        [
            [<t>{ e: 1, r: 2, c: 2 }, <t>{ e: 3, r: 1, c: 1 }],
            [<t>{ e: 5, r: 1, c: 1 }]
        ],
        [[], [], []])
)*/

interface arbre<T> {
    val: T
    child: arbre<T>[]
}

let noSuite = <T>(col: elem<T>[]): elem<T>[] =>
    col.reduce((acc, x, i) => (i > 0 && x.id == acc[acc.length - 1].id) ? acc : ((acc, x) => { acc.push(x); return acc })(acc, x), ([] as elem<T>[]))

let table2tree = <T>(nodes: arbre<elem<T>>[], selectCol: t<T>[][]): arbre<elem<T>>[] => nodes.map(
    x => <arbre<elem<T>>>{
        val: x.val,
        child: selectCol
            .filter(y => y[0].e.id == x.val.id).map(x => x.slice(1).filter((x, i, l) => i == 0 || x.e.id != l[i - 1].e.id).map(x => <arbre<elem<T>>>{ val: x.e, child: [] }))
            .reduce((acc, x) => acc.concat(x))

    });
[1, 2, 3, 4, 5].map(x => x)
/*
console.dir(
    '-----------------------'
)
console.dir(
    //noSuite(a.map(x => x[0].e))//.map(x => <arbre<elem>>{ val: x, child: [] })
    a.map(x => x.map(x => x.e))
)
console.log(
    JSON.stringify(
        table2tree(
            noSuite(a.map(x => x[0].e)).map(x => <arbre<elem>>{ val: x, child: [] }),
            a)
        , undefined, '')
)

*/


let toNoeud = (a: arbre<elem<Noeud[]>>[]): Noeud[] =>
    a.map(x => (x.child.length == 0) ?
        x.val.e :
        [(y =>
            (y.child == undefined) ?
                { name: y.name, child: toNoeud(x.child) } :
                { name: y.name, child: y.child.concat(toNoeud(x.child)) }
        )(x.val.e[0])]).reduce((acc, x) => acc.concat(x))


/**
 * attention au table avec une premiere ligne de tbody bizar
 * fonctionne de gauche à droite donc undefined =< bigCol < col
 * @param tbody 
 * @param col 
 * @param treatement 
 * @param bigCol 
 */
export let table2noeud = (tbody: CheerioElement[], col: number[] = [], $treatement: (e: CheerioElement, col: number) => Noeud[], bigCol: number = 0, _id = 0): Noeud[] =>//col todo

    (
        x => { /*console.log(JSON.stringify(x, undefined, '\t'));*/ return toNoeud(x) }
    )(

        (x => (col.length == 0) ?
            x.map(x => x[0].e).map(x => <arbre<elem<Noeud[]>>>{ val: x, child: [] }) :
            table2tree(
                noSuite(x.map(x => x[0].e)).map(x => <arbre<elem<Noeud[]>>>{ val: x, child: [] }),
                x/*.map(([_, ...x]) => x)*/)

        )(

            (x => { return x })(TabbleNormalizer(
                tbody.map(x => x.children.filter((x) => x.name == 'th' || x.name == 'td')
                    .map(x => <t<CheerioElement>>{ e: { id: _id++, e: x }, r: x.attribs['rowspan'], c: x.attribs['colspan'] }))
                ,
                tbody[0].children.filter(x => x.name == 'th' || x.name == 'td').map(x => [])

            )).map(x => [x[bigCol], ...col.map(i => x[i])].map((x, i) => ({ ...x, e: { ...x.e, e: $treatement(x.e.e, i) } })))));



            /*
    (x => toNoeud(x))
        ((x =>
            table2tree(
                noSuite(x.map(x => x[0].e)).map(x => <arbre<elem>>{ val: x, child: [] }),
                x)
        )
            (
            (x =>

                TabbleNormalizer(
                    x.map(x => x.children.filter((x, i) => x.name == 'th' || x.name == 'td')
                        .map(x => <t>{ e: { id: _id++, e: $treatement[x.name](x) }, r: x.attribs['rowspan'], c: x.attribs['colspan'] }))
                    ,
                    x.map(x => x.children.filter(x => x.name == 'th' || x.name == 'td').map(x => []))[0]
                ).map(x => x.filter((_, i) => i == col || i == bigCol))

            )(tbody)//la liste des tr    ...   $table
            ));

*/

/*(x =>
    table2tree(
        noSuite(x.map(x => x[0].e)).map(x => <arbre<elem>>{ val: x, child: [] }),
        x)
)
    (
    (x =>

        TabbleNormalizer(
            x.map(x => x.children.filter(x => x.name == 'th' || x.name == 'td')
                .map(x => <t>{ e: { id: _id++, e: $treatement['x.name'](x) }, r: x.attribs['rowspan'], c: x.attribs['colspan'] }))
            ,
            x.slice(0, rowIgnored).map(x => x.children.filter(x => x.name == 'th' || x.name == 'td').map(x => []))[0]
        )

    )($.load('<table>' + tbody + '<table>')('table').toArray()[0].children.filter(x => x.name == 'tr'))//la liste des tr    ...   $table
    );*///cas 2 colonne avec la 1ere la mere
/*
console.log($elements.treatFct('Lists_of_box_office_number_one_films')('th').toString());

fs.appendFileSync(
    'restesttable.json',
    JSON.stringify(
        table2noeud(
            $.load(fs.readFileSync('test.1.html').toString())('table')
                .toArray()[0].children.filter(x => x.name == 'tr').slice(1),
            1,
            $elements.treatFct('Lists_of_box_office_number_one_films'),
            0)
        , undefined, '')
)*/
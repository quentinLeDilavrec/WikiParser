/// <reference path="../node_modules/@types/node/index.d.ts" />
import * as fs from "fs";
import * as $ from "cheerio";
import * as he from "he";
import * as table from './table';
import { Noeud } from './html2tree';

function bbb() {
    this.ul = (e: number) => (5 as any) as Noeud[]
    this.ol = this.ul
}

let aaaa = new Map<string, (e: CheerioElement) => Noeud[]>([
    ['ul', (e: CheerioElement) => (5 as any) as Noeud[]],
    ['ol', this.ul]
]);
console.log((new bbb).ol(7))

//console.log(he.decode(decodeURIComponent("/wiki/Pratt_%26_Whitney_R-985_Wasp_Junior")))
let dec = (s: string) => he.decode(decodeURI(s)).replace(/["]/g, "%22").replace(/%26/g, "&")

class aaa {
    bbb(a?: string, b?: boolean): string;
    bbb(a: string): string;
    bbb(undefiened, b: boolean): string;
    bbb(a, b?): string { return 'a' }
}

/*function getOrElse<T, U>(r: T, défaut: U, siOui: (r:U)=>U= r=>r, compa = x => x == undefined || x == null): U {
    return (compa(r)) ? défaut : siOui(r)
} */
function myApply<T, U>(v: T, f: (x: T) => U): U { return f(v) }


declare global {
    interface String {
        normal(): string;
        fixedPoint(f: (s: string) => string): string;
    }
}
String.prototype.fixedPoint = function (f: (s: string) => string): string {
    let res = f(this)
    return (res == this) ? res : res.fixedPoint(f);
}
String.prototype.normal = function (): string {
    return this.trim().replace(/[\n|\r|\t]/g, '').fixedPoint((x: string) => x.replace('  ', ' '));
};

let linameOld = (e: CheerioElement) =>
    (e.children.some(x => x.name == 'a')) ?
        dec(e.children.find(x => x.name == 'a').attribs['href']) :
        (e.children.some(x => x.name == 'span')) ?
            dec(e.children.find(x => x.name == 'span').children.find(x => x.name == 'a').attribs['href']) :

            (
                e => (e.children.some(x => x.name == 'a')) ?
                    dec(e.children.find(x => x.name == 'a').attribs['href']) :
                    (x => (x == undefined) ? undefined : (x.nodeValue + '').trim())(e.children[0])
            )(rmIB(e))

let liname = (e: CheerioElement) =>
    (x => (x == undefined) ? $(e).text().trim() :
        (x.name == 'i' || x.name == 'b') ? (x => (y => (y == undefined) ? (x => (x == undefined) ? undefined : (x.nodeValue + '').trim())(x.children[0]) : dec(y.attribs['href']))(x.children.find(x => x.name == 'a')))(rmIB(x)) :
            (x.name == 'a') ? dec(x.attribs['href']) :
                (x.name == 'span') ? dec(x.children.find(x => x.name == 'a').attribs['href']) :
                    (x.name == 'cite') ? liname(x) :
                        (
                            x => (x == undefined) ?
                                (x => (x == undefined) ? undefined : (x.nodeValue + '').trim())(e.children[0]) :
                                x.attribs['href']
                        )(e.children.find(x => x.name == 'a'))
    )(e.children.find(x => ['a', 'span', 'i', 'b', 'cite'].some(y => y == x.name)))

let ul2noeud = (e: CheerioElement): Noeud[] =>
    e.children.filter(x => x.name == 'li' && x.attribs['class'] != 'mw-empty-elt')
        .map(x => (x.children.some(x => x.name == 'ul' || x.name == 'ol')) ?
            new Noeud((x => (x == undefined) ? '' : x)(liname(x)),
                ul2noeud(x.children.find(x => x.name == 'ul' || x.name == 'ol'))) :
            new Noeud(liname(x))
        )
let ul2noeudBig = (fNode: (e: CheerioElement) => string = liname, fLeef: (e: CheerioElement) => Noeud = x => new Noeud(liname(x))) =>
    (e: CheerioElement): Noeud[] =>
        e.children.filter(x => x.name == 'li' && x.attribs['class'] != 'mw-empty-elt')
            .map(x => (x.children.some(x => x.name == 'ul' || x.name == 'ol')) ?
                new Noeud(
                    (x => (x == undefined) ? '' : x)(fNode(x)),
                    ul2noeudBig(fNode, fLeef)(x.children.find(x => x.name == 'ul' || x.name == 'ol'))) :
                fLeef(x)
            )

let rmIB = (e: CheerioElement): CheerioElement => (e.children.some(x => x.name == 'i' || x.name == 'b')) ? rmIB(e.children.find(x => x.name == 'i' || x.name == 'b')) : e;

/*
    .map(x =>
        (y =>
            (y == undefined) ?
                new Noeud((x => (x == undefined) ? 'li pas normal' : x.attribs['href'])(x.children.find(x => x.name == 'a'))) :
                new Noeud(
                    (x => (x == undefined) ? 'li pas normal' : x.attribs['href'])(x.children.find(x => x.name == 'a')),
                    ul2noeud(y.children.filter(x => x.name == 'ul')[0]))
        )(x.children.filter(x => x.name == 'li')[0]));
*/


let fct = {
    ...{//replace % par ç et - par _

        /*
        Aç26M_Records: {
            li: (e: CheerioElement) => new Noeud(e.children.filter(x => x.name == 'a')[0].attribs['href'])
        },
        */

        /*Lists_of_films: {
            div_spe: (e: CheerioElement) => [new Noeud('aa')]
     
        },*/
        List_of_engineering_branches: {
            ...(x => { return Array<Function>(6).fill(undefined).reduce((acc, _, i) => { acc['t' + i] = x; return acc }, {}) }
            )(
                (e: CheerioElement, col: number): Noeud[] =>
                    (col == 0) ?
                        ((e => (e.children.some(x => x.name == 'a')) ?
                            e.children.filter(x => x.name == 'a').map(x => (new Noeud(he.decode(x.attribs['href']).replace(/["]/g, "%22")))) :
                            (e.children.some(x => x.type == 'tag' && (x => (x == undefined) ? '' : x as string)(x.attribs['style']).indexOf('display:none') > -1)) ?
                                [new Noeud(e.children.filter(x => x.type == 'tag' && (x => (x == undefined) ? '' : x as string)(x.attribs['style']).indexOf('display:none') == -1).map(x => $(x).text()).join('\n'))] :
                                [new Noeud($(e).text().trim())])(rmIB(e))) :
                        (col == 1) ?
                            (x => (x == undefined) ? (x => (x == '') ? [] : [new Noeud(x)])($(e).text()) : ul2noeud(x))(e.children.find(x => x.name == 'ul')) : []
                )
        },
        Category_Lists_of_books: {},//-------------------------------------------------
        List_of_2014_box_office_number_one_films_in_Spain: {
            t0: (e: CheerioElement, col: number): Noeud[] =>
                (col == 0) ?
                    [new Noeud((e => (e.children.some(x => x.name == 'a')) ? he.decode(e.children.find(x => x.name == 'a').attribs['href']).replace(/["]/g, "%22") : $(e).text())(rmIB(e)))] :
                    (col == 1) ?
                        [({ type: 'Gross in US dollars', content: $(e).text() } as any) as Noeud] :
                        (col == 2) ?
                            [({
                                type: 'Release in cinema',
                                content: e.children.filter(x => x.type == 'tag' && (x => (x == undefined) ? '' : x as string)(x.attribs['style']).indexOf('display:none') == -1)
                                    .map(x => $(x).text()).join('\n')
                            } as any) as Noeud] : [],

            t1: (e: CheerioElement, col: number): Noeud[] =>
                (col == 0) ?
                    [new Noeud((e => (e.children.some(x => x.name == 'a')) ? he.decode(e.children.find(x => x.name == 'a').attribs['href']).replace(/["]/g, "%22") : $(e).text())(rmIB(e)))] :
                    (col == 1) ?
                        [({ type: 'Gross in US dollars', content: $(e).text() } as any) as Noeud] :
                        (col == 2) ?
                            [new Noeud((e => (e.children.some(x => x.name == 'a')) ? he.decode(e.children.find(x => x.name == 'a').attribs['href']).replace(/["]/g, "%22") : $(e).text())(rmIB(e)))] :
                            (col == 3) ?
                                e.children.filter(x => x.name == 'a').map(x => (new Noeud(he.decode(x.attribs['href']).replace(/["]/g, "%22")))) : [],
        },
        Aviation_lists: {
            t0: (e: CheerioElement) =>
                (e.children.some(x => x.name == 'a')) ?
                    e.children.filter(x => x.name == 'a').map(x => new Noeud(he.decode(x.attribs['href']).replace(/["]/g, "%22"))) :
                    (x => (x == '-') ?
                        [] :
                        [new Noeud(x)]
                    )($(e).text())
        },
        Lists_of_military_aircraft_by_nation: {
            t0: (e: CheerioElement) =>
                (e.children.some(x => x.name == 'a')) ?
                    e.children.filter(x => x.name == 'a').map(x => new Noeud(he.decode(x.attribs['href']).replace(/["]/g, "%22"))) :
                    (x => (x == '-') ?
                        [] :
                        [new Noeud(x)])($(e).text())
        },

        Air_Navigation_and_Transport_Act: {
            li: (e: CheerioElement) => [new Noeud(e.children
                .map(x => (x.name !== 'sup') ? $(x).text() + ' ' : '')
                .join('').normal())]
        },
        /*Lists_of_Armenians: {
            li: (e: CheerioElement) => new Noeud(e.children.filter(x => x.name == 'a')[0].attribs['href'])
        },*/
        Lists_of_cities_by_country: {
            ul_spe: (e: CheerioElement) =>
                e.children.filter(x => x.name == 'li')
                    .map(x => fct['Lists_of_cities_by_country'].li_spe2(x)),

            li_spe2: (e: CheerioElement) => (x => {
                console.log('                              ' + $(e).text().substr(0, 3));
                return x
            })($(e).text().substr(0, 3) == 'See') ? new Noeud('a') :
                new Noeud(he.decode(decodeURI($(e).find('a').attr('href'))).replace(/["]/g, "%22")),

            li_spe: (e: CheerioElement) => [(
                e.children.some(x => x.name == 'b') && !e.children.some(x => x.name == 'a')) ?
                new Noeud(e.children.filter(x => x.name == 'b')[0]
                    .children.filter(x => x.name == 'a')[0].attribs['href']) :
                ((e.children.some(x => x.name == 'i') && !e.children.some(x => x.name == 'span')) ?
                    new Noeud((x => (x.some(x => x.name == 'i')) ?
                        x.filter(x => x.name == 'b')[0].children :
                        x)
                        ((x => { console.log('rrrrrrr' + x.map(x => x.name)); return x })(e.children).filter(x => x.name == 'i')[0].children).filter(x => x.name == 'a')[0].attribs['href']) ://TODO cause erreureur b dans i != span b a
                    new Noeud((x => { console.log(x.map(x => $(x).text())); return x })(e.children).filter(x => x.name == 'a')[0].attribs['href'],
                        [new Noeud(
                            (e.children.some(x => x.name == 'b')) ?
                                e.children
                                    .filter(x => x.name == 'b')[0].children
                                    .filter(x => x.name == 'a')[0].attribs['href'] :
                                ((e.children.some(x => x.name == 'i')) ?
                                    e.children
                                        .filter(x => x.name == 'i')[0].children
                                        .filter(x => x.name == 'b')[0].children
                                        .filter(x => x.name == 'a')[0].attribs['href'] ://1
                                    e.children
                                        .filter(x => x.name == 'a')[0].attribs['href'])),
                        new Noeud(e.children
                            .filter(x => x.name == 'span')[0].children
                            .filter(x => x.name == 'a')[0].children
                            .filter(x => x.name == 'img')[0].attribs['src'])]))]
        },
        //-----------------------------------------------------------------------------------------------------------
        List_of_highest_grossing_films: {
            h2: (e: CheerioElement) => [new Noeud('#' + e.children.filter(x => x.name == 'span')[0].attribs['id'])]
        },
        Lists_of_box_office_number_one_films: {
            /*
            table: (e: CheerioElement) => table.table2noeud(e.children.filter(x => x.name == 'tr').slice(1), [1],
                treatFct('Lists_of_box_office_number_one_films')('t0'), 0),
                */

            t0: (e: CheerioElement) => (e.name == 'th') ?
                [new Noeud(e.children.find(x => x.name == 'a').attribs['href'])] :
                [new Noeud(e.children
                    .filter(x => x.name == 'span')[2].children
                    .filter(x => x.name == 'a')[0].attribs['href'])]
        }/*,
    List_of_programming_languages_by_type: {
        h2_: (e: CheerioElement) =>
            (e.name == 'ul') ? ul2noeud(e) :
                (e.attribs['role'] == 'note') ?
                    [({ type: e.children[0].nodeValue, content: myApply(e.children.find(x => x.name == 'a'), x => (x == undefined) ? ({ attribs: $(e).text() } as any) as CheerioElement : x).attribs['href'] } as any) as Noeud] :

                    (e.children.find(x => x.name == 'ul')) ? ul2noeud(e.children.find(x => x.name == 'ul')) :

                        [({ type: e.name + myApply(e.attribs['class'] as string, x => (x == undefined) ? '' : '-' + x), content: $(e).text() } as any) as Noeud]
    }*/
    }
};

let h = (e: CheerioElement) => [new Noeud(
    (e.children.length == 1) ?
        he.decode($(e).html()).replace(/["]/g, "%22") :
        (x => (x == null) ? he.decode(e.children[0].children[0].children[0].nodeValue).replace(/["]/g, "%22") : '#' + x
        )(e.children[0].attribs['id']))]

const def = {
    table: (e: CheerioElement) => [{
        type: 'table',
        content: e.children.
            filter(x => x.name == 'tr' && x.children.every(x => x.type != 'tag' || x.name == 'th'))
            .map(x => $(x).html().split('<th>').slice(1).map(x => /([^<]*)\<\/\s*th\s*\>/.exec(x)[1].trim()))
    } as any],//[new Noeud('@@@@', [new Noeud('faire table ' + $(e).html().replace(/["]/g, "%22"))])],
    //li: (e: CheerioElement) => [new Noeud(this.a(e.children.filter(x => x.name == 'a')[0]))],
    ul: (e: CheerioElement) => ul2noeud(e),
    ol: (e: CheerioElement) => ul2noeud(e),
    navigation: (e: CheerioElement) => ul2noeudBig(undefined, x => new Noeud(he.decode(x.children.filter(x => x.name == 'span')[1].children.find(x => x.name == 'a').attribs['href']).replace(/["]/g, "%22")))(e.children.find(x => x.name == 'ul')),
    //def['a'](e.children.find(x => x.name == 'ul').children.find(x => x.name == 'li').children.filter(x => x.name == 'span')[1].children.find(x => x.name == 'a')),
    td: (e: CheerioElement, col: number): Noeud[] =>
        (e => (e.children.some(x => x.name == 'a')) ?
            e.children.filter(x => x.name == 'a').map(x => (new Noeud(he.decode(x.attribs['href']).replace(/["]/g, "%22")))) :
            (e.children.some(x => x.type == 'tag' && (x => (x == undefined) ? '' : x as string)(x.attribs['style']).indexOf('display:none') > -1)) ?
                [new Noeud(e.children.filter(x => x.type == 'tag' && (x => (x == undefined) ? '' : x as string)(x.attribs['style']).indexOf('display:none') == -1).map(x => $(x).text()).join('\n'))] :
                [new Noeud($(e).text())])(rmIB(e)),
    th: (e: CheerioElement) => [new Noeud(
        (e.children.some(x => x.name == 'a')) ?
            (
                x => (x == null) ? $(e).text() : he.decode(x).replace(/["]/g, "%22")
            )($(e).find('a').attr['href']) :
            $(e).text())],
    dt: (e: CheerioElement) => (x => (x == undefined) ? [new Noeud('aaaaaaaaaaaaa')] : def['a'](x))(e.children.find(x => x.name == 'a')),
    dd: (e: CheerioElement) => (x => (x == undefined) ? [new Noeud('aaaaaaaaaaaaa')] : def['a'](x))(e.children.find(x => x.name == 'a')),
    dl: (e: CheerioElement) => (//TODO cas dl > dt et rien d'autre traiter comme un h sinon si seulement dd comme une description de l'élément sup si dt et dd  en meme temps faire comme suit
        x => (x === undefined) ?
            e.children.filter(x => x.name == 'dd').map(x => def['dd'](x)).reduce((acc, x) => acc.concat(x), []) :
            [new Noeud(he.decode(x.children.find(x => x.name == 'a').attribs['href']).replace(/["]/g, "%22"), e.children.filter(x => x.name == 'dd').map(x => def['dd'](x)).reduce((acc, x) => acc.concat(x), []))]
    )(e.children.find(x => x.name == 'dt')),
    div: (e: CheerioElement) => [new Noeud('(ç(faire div)ç) ' + $(e).html())],
    p: (e: CheerioElement) => ($(e).text() == '') ? [] : [({ type: e.name + myApply(e.attribs['class'] as string, x => (x == undefined) ? '' : '-' + x), content: $(e).text() } as any) as Noeud],
    note: (e: CheerioElement) => (
        x => (x.length == 0) ? [{
            type: 'note',
            content: $(e).text()
        }] :
            (x.length == 1) ? [{
                type: e.children[0].nodeValue,
                content: x[0].attribs['href']
            }] :
                [{
                    type: 'big note',
                    content: $(e).text()
                }]
    )(e.children.filter(x => x.name == 'a')),
    hatnote: (e: CheerioElement): Noeud[] => [({
        type: e.children[0].nodeValue,
        content: myApply(e.children.find(x => x.name == 'a'), x => (x == undefined) ? $(e).text() : x.attribs['href'])
    } as any) as Noeud],
    a: (e: CheerioElement) => [new Noeud(he.decode(e.attribs['href']).replace(/["]/g, "%22"))],
    h1: h, h2: h, h3: h, h4: h, h5: h,
    h6: h, h7: h, h8: h, h9: h, h10: h,
};

//*****************ul ol******************
/*
//--/wiki/A%26M_Records-- if li     pour (a b) et (c)
(e: CheerioElement) => new Noeud(e.children.filter(x => x.name == 'a')[0].attribs['href']);


//--/wiki/Air_Navigation_and_Transport_Act-- if li pour (c c1 c2) et (a b)
(e: CheerioElement) => new Noeud(e.children
    .map(x => (x.name !== 'sup') ? $(x).text() + ' ' : '')
    .join('').normal());

//------/wiki/Lists_of_Armenians pour d et e

(e: CheerioElement) => new Noeud(e.children.filter(x => x.name == 'a')[0].attribs['href']);

//-------------/wiki/Lists_of_cities_by_country pour f

(e: CheerioElement) => new Noeud(e.children
    .filter(x => x.name == 'a')[0].attribs['href'],
    [new Noeud(e.children
        .filter(x => x.name == 'b')[0].children
        .filter(x => x.name == 'a')[0].attribs['href'])]);

//********************************* h2
//--/wiki/List_of_highest-grossing_films-- if h2 pour g
(e: CheerioElement) => new Noeud(e.children.filter(x => x.name == 'span')[0].attribs['id']);

//***************** tr **************

//--/wiki/Lists_of_box_office_number-one_films.html-- if th pour h j
(e: CheerioElement) => new Noeud(e.children.filter(x => x.name == 'a')[0].attribs['href']);

//--/wiki/Lists_of_box_office_number-one_films.html-- if td pour i k l
(e: CheerioElement) => new Noeud(e.children
    .filter(x => x.name == 'span')[2].children
    .filter(x => x.name == 'a')[0].attribs['href']);

//--/wiki/List_of_lists_of_lists.html-- if li
(e: CheerioElement) => new Noeud(e.children
    .filter(x => x.name == 'a')[0].attribs['href'],
    ul2noeud(e.children
        .filter(x => x.name == 'ul')[0]));
*/





if ((x => x)(false)) {
    let page = $.load(fs.readFileSync('elements.html').toString())('html')
        .toArray()[0]
        .children.filter(x => x.name != undefined)

    console.log(page.map(x => x.name))
    let i = 0
    //in reference-------------------/wiki/A%26M_Records--------

    console.log(page[i++].children.filter(x => x.name == 'a')[0].attribs['href'])
    console.log(page[i++].children.filter(x => x.name == 'a')[0].attribs['href'])

    //----------------------------/wiki/Air_Navigation_and_Transport_Act //.....................................rel="nofollow"
    //les liens externes à wikipedia
    console.log('-------------')
    console.log(page[i].children.filter(x => x.name == 'a')[0].attribs['href'])
    console.log(page[i].children//best sol° !!!!!!!!!!!!!!!!
        .map(x => (x.name !== 'sup') ? $(x).text() + ' ' : '').join('').normal());
    console.dir($(page[i]).text().normal())
    console.log(page[i].children.filter(x => x.name == 'a')[1].attribs['href'])
    console.log(page[i].children//best sol° !!!!!!!!!!!!!!!!
        .map(x => (x.name !== 'sup') ? $(x).text() + ' ' : '').join('').normal());
    console.log($(page[i++]).text().normal())

    console.log(page[i].children[0].nodeValue.trim())//c1
    console.log(page[i++].children
        .map(x => (x.name !== 'sup') ? $(x).text() + ' ' : '').join('').normal());
    console.log(page[i].children[0].nodeValue.trim())//c2
    console.log(page[i++].children//best sol° !!!!!!!!!!!!!!!!
        .map(x => (x.name !== 'sup') ? $(x).text() + ' ' : '').join('').normal());
    console.log('---------------------------------');


    //------/wiki/Lists_of_Armenians

    console.log(page[i++].children.filter(x => x.name == 'a')[0].attribs['href'])//d
    console.log(page[i++].children.filter(x => x.name == 'a')[0].attribs['href'])//e

    //--------------/wiki/Aaron_Gervais { "name": "#Awards" }, { "name": "#See_also"//Wtf }, { "name": "#External_links" }, {"name": "#See_also_2" } //-----------lists of cities by country


    console.log(page[i].children
        .filter(x => x.name == 'b')[0].children
        .filter(x => x.name == 'a')[0].attribs['href'])
    /*console.log(((page[i].children.some(x => x.name == 'b')) ? page[i] :
    page[i].children.filter(x => x.name == 'b')[0]).children
    .filter(x => x.name == 'a')[0].attribs['href'])*/
    console.log(new Noeud(page[i].children
        .filter(x => x.name == 'a')[0].attribs['href'],
        [new Noeud(page[i].children
            .filter(x => x.name == 'b')[0].children
            .filter(x => x.name == 'a')[0].attribs['href'])]))
    console.log(page[i++].children
        .filter(x => x.name == 'a')[0].attribs['href'])

    //-----------------------/wiki/List_of_highest-grossing_films //------- '#' + $(h2).children('span').first().attribs('id')

    console.log(page[i++].children.filter(x => x.name == 'span')[0].attribs['id'])

    //----------------------------Lists_of_box_office_number-one_films.html //---------------
    //------- $(th).children('a').first().attribs('href')
    //------- $(td).children('span').eq(2).children('a').first().attribs('href')


    console.log(page[i++].children.filter(x => x.name == 'a')[0].attribs['href'])

    console.log(page[i++].children
        .filter(x => x.name == 'span')[2].children
        .filter(x => x.name == 'a')[0].attribs['href'])

    //-----------------------------------

    console.log(page[i++].children.filter(x => x.name == 'a')[0].attribs['href'])

    console.log(page[i++].children
        .filter(x => x.name == 'span')[2].children
        .filter(x => x.name == 'a')[0].attribs['href'])


    //----------------------

    console.log(page[i++].children
        .filter(x => x.name == 'span')[2].children
        .filter(x => x.name == 'a')[0].attribs['href'])


    //list of list of list
    console.log(page[i++].children.filter(x => x.name == 'ul').map(x => 1))

} else if ((x => x)(false)) {
    //----------------utilisation du dico
    let elem = $.load(fs.readFileSync('elements.html').toString())('#f')//select l'élement à trad
        .toArray()[0]
    let page = 'Lists_of_cities_by_country'  //page de elem
    let balise = elem.name           //nom balise de elem
    console.log(((fct[page] != undefined && fct[page][balise] != undefined) ? fct[page][balise] : def[balise])(elem))
}


export let treatFct = (page: string) => (balise: string): (e: CheerioElement) => Noeud[] =>
    (fct[page] != undefined && fct[page][balise] != undefined) ? fct[page][balise] : def[balise]
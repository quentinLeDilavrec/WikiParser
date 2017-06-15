/// <reference path="../node_modules/@types/node/index.d.ts" />
import * as fs from "fs";
import * as $ from "cheerio";
import * as he from "he";
import * as table from './table';
import * as tree from './html2tree';


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

//console.log(he.decode(decodeURIComponent("/wiki/Pratt_%26_Whitney_R-985_Wasp_Junior")))
let dec = (s: string) => he.decode(decodeURI(s)).replace(/["]/g, "%22").replace(/%26/g, "&")

function myApply<T, U>(v: T, f: (x: T) => U): U { return f(v) }

let liname = (e: CheerioElement) =>
    (e.children.some(x => x.name == 'a')) ?
        dec(e.children.find(x => x.name == 'a').attribs['href']) :
        (x => (x == undefined) ? 'a dans li est undefined' : (x.nodeValue + '').trim())(e.children[0])

let ul2noeud = (e: CheerioElement): tree.Noeud[] =>
    e.children.filter(x => x.name == 'li')
        .map(x => (x.children.some(x => x.name == 'ul' || x.name == 'ol')) ?
            new tree.Noeud(liname(x),
                ul2noeud(x.children.find(x => x.name == 'ul' || x.name == 'ol'))) :
            new tree.Noeud(liname(x))
        )

let h = (e: CheerioElement) => [new tree.Noeud(
    (e.children.length == 1) ?
        he.decode($(e).html()).replace(/["]/g, "%22") :
        (x => (x == null) ? he.decode(e.children[0].children[0].children[0].nodeValue).replace(/["]/g, "%22") : '#' + x
        )(e.children[0].attribs['id']))]


type Handler = { [a: string]: (e: CheerioElement) => tree.Noeud[] }
interface BasicHandlers extends Object {
    table(e: CheerioElement): tree.Noeud[];
    dl(e: CheerioElement): tree.Noeud[];
    ul(e: CheerioElement): tree.Noeud[];
    ol(e: CheerioElement): tree.Noeud[];
    div(e: CheerioElement): tree.Noeud[];
    p(e: CheerioElement): tree.Noeud[];
    note(e: CheerioElement): tree.Noeud[];
    a(e: CheerioElement): tree.Noeud[];
    h(e: CheerioElement): tree.Noeud[];
    h1(e: CheerioElement): tree.Noeud[];
    h2(e: CheerioElement): tree.Noeud[];
    h3(e: CheerioElement): tree.Noeud[];
    h4(e: CheerioElement): tree.Noeud[];
    h5(e: CheerioElement): tree.Noeud[];
    h6(e: CheerioElement): tree.Noeud[];
    h7(e: CheerioElement): tree.Noeud[];
    h8(e: CheerioElement): tree.Noeud[];
    h9(e: CheerioElement): tree.Noeud[];
    h10(e: CheerioElement): tree.Noeud[];
}
class CBasicHandlers {
    static dd(e: CheerioElement): tree.Noeud {
        return undefined
    }
    static table(e) {
        return [new tree.Noeud('(ç(faire table)ç) ' + $(e).html().substr(0, 1000))]//[new tree.Noeud('@@@@', [new tree.Noeud('faire table ' + $(e).html().replace(/["]/g, "%22"))])]
    }
    static dl(e: CheerioElement): tree.Noeud[] {
        return (x => (x === undefined) ? e.children.filter(x => x.name == 'dd').map(x => CBasicHandlers.dd(x)) : [new tree.Noeud('(ç(faire dl)ç) ' + $(e).html())])(e.children.find(x => x.name == 'dl'))
    }
    static ul(e: CheerioElement): tree.Noeud[] {
        return (x => (x === undefined) ? e.children.filter(x => x.name == 'dd').map(x => CBasicHandlers.dd(x)) : [new tree.Noeud('(ç(faire dl)ç) ' + $(e).html())])(e.children.find(x => x.name == 'dl'))
    }
    static div(e: CheerioElement): tree.Noeud[] {
        return (x => (x === undefined) ? e.children.filter(x => x.name == 'dd').map(x => CBasicHandlers.dd(x)) : [new tree.Noeud('(ç(faire dl)ç) ' + $(e).html())])(e.children.find(x => x.name == 'dl'))
    }
    static p(e: CheerioElement): tree.Noeud[] {
        return (x => (x === undefined) ? e.children.filter(x => x.name == 'dd').map(x => CBasicHandlers.dd(x)) : [new tree.Noeud('(ç(faire dl)ç) ' + $(e).html())])(e.children.find(x => x.name == 'dl'))
    }
    static note(e: CheerioElement): tree.Noeud[] {
        return (x => (x === undefined) ? e.children.filter(x => x.name == 'dd').map(x => CBasicHandlers.dd(x)) : [new tree.Noeud('(ç(faire dl)ç) ' + $(e).html())])(e.children.find(x => x.name == 'dl'))
    }
    static a(e: CheerioElement): tree.Noeud[] {
        return (x => (x === undefined) ? e.children.filter(x => x.name == 'dd').map(x => CBasicHandlers.dd(x)) : [new tree.Noeud('(ç(faire dl)ç) ' + $(e).html())])(e.children.find(x => x.name == 'dl'))
    }
    static h(e: CheerioElement) {
        return [new tree.Noeud(
            (e.children.length == 1) ?
                he.decode($(e).html()).replace(/["]/g, "%22") :
                (x => (x == null) ? he.decode(e.children[0].children[0].children[0].nodeValue).replace(/["]/g, "%22") : '#' + x
                )(e.children[0].attribs['id']))]
    }
}

const def: BasicHandlers = {
    h: (e: CheerioElement) => [new tree.Noeud(
        (e.children.length == 1) ?
            he.decode($(e).html()).replace(/["]/g, "%22") :
            (x => (x == null) ? he.decode(e.children[0].children[0].children[0].nodeValue).replace(/["]/g, "%22") : '#' + x
            )(e.children[0].attribs['id']))],
    table: (e: CheerioElement) => [new tree.Noeud('(ç(faire table)ç) ' + $(e).html().substr(0, 1000))],//[new tree.Noeud('@@@@', [new tree.Noeud('faire table ' + $(e).html().replace(/["]/g, "%22"))])],
    //li: (e: CheerioElement) => [new tree.Noeud(this.a(e.children.filter(x => x.name == 'a')[0]))],
    ul: ul2noeud,
    ol: ul2noeud,
    /*td: (e: CheerioElement) => [new tree.Noeud(
        (e.children.filter(x => x.name == 'a') == []) ?
            (x => (x == null) ? $(e).text() : he.decode(x).replace(/["]/g, "%22"))($(e).find('a').attr['href']) :
            e.children.filter(x => x.name == 'a')[0].attribs['href'])],
    th: this.td,*/

    dl: (e: CheerioElement) => (x => (x === undefined) ? e.children.filter(x => x.name == 'dd').map(x => CBasicHandlers.dd(x)) : [new tree.Noeud('(ç(faire dl)ç) ' + $(e).html())])(e.children.find(x => x.name == 'dl')),
    div: (e: CheerioElement) => [new tree.Noeud('(ç(faire div)ç) ' + $(e).html())],
    p: (e: CheerioElement) => ($(e).text() == '') ? [] : [({ type: e.name + myApply(e.attribs['class'] as string, x => (x == undefined) ? '' : '-' + x), content: $(e).text() } as any) as tree.Noeud],
    note: (e: CheerioElement) => [({ type: e.children[0].nodeValue, content: myApply(e.children.find(x => x.name == 'a'), x => (x == undefined) ? ({ attribs: $(e).text() } as any) as CheerioElement : x).attribs['href'] } as any) as tree.Noeud],
    a: (e: CheerioElement) => [new tree.Noeud(he.decode(e.attribs['href']).replace(/["]/g, "%22"))],
    h1: h, h2: h, h3: h, h4: h, h5: h,
    h6: h, h7: h, h8: h, h9: h, h10: h,
};

let BasicHandlersMap = new Map<string, (e: CheerioElement) => tree.Noeud[]>()
BasicHandlersMap
    .set('table', CBasicHandlers.table)
    .set('dl', CBasicHandlers.dl)
    .set('ul', CBasicHandlers.ul)
    .set('ol', CBasicHandlers.ul)
    .set('div', CBasicHandlers.div)
    .set('p', CBasicHandlers.p)
    .set('note', CBasicHandlers.note)
    .set('a', CBasicHandlers.a)
    .set('h1', CBasicHandlers.h)
    .set('h2', CBasicHandlers.h)
    .set('h3', CBasicHandlers.h)
    .set('h4', CBasicHandlers.h)
    .set('h5', CBasicHandlers.h)
    .set('h6', CBasicHandlers.h)
    .set('h7', CBasicHandlers.h)
    .set('h8', CBasicHandlers.h)
    .set('h9', CBasicHandlers.h)
    .set('h10', CBasicHandlers.h)
console.log(BasicHandlersMap)

let fct = {//replace % par ç et - par _

    /*
    Aç26M_Records: {
        li: (e: CheerioElement) => new tree.Noeud(e.children.filter(x => x.name == 'a')[0].attribs['href'])
    },
    */

    Lists_of_films: {
        div_spe: (e: CheerioElement) => [new tree.Noeud('aa')]

    },

    Category_Lists_of_books: {},//-------------------------------------------------

    Air_Navigation_and_Transport_Act: {
        li: (e: CheerioElement) => [new tree.Noeud(e.children
            .map(x => (x.name !== 'sup') ? $(x).text() + ' ' : '')
            .join('').normal())]
    },
    /*Lists_of_Armenians: {
        li: (e: CheerioElement) => new tree.Noeud(e.children.filter(x => x.name == 'a')[0].attribs['href'])
    },*/
    Lists_of_cities_by_country: {
        ul_spe: (e: CheerioElement) =>
            e.children.filter(x => x.name == 'li')
                .map(x => fct['Lists_of_cities_by_country'].li_spe2(x)),

        li_spe2: (e: CheerioElement) => (x => {
            console.log('                              ' + $(e).text().substr(0, 3));
            return x
        })($(e).text().substr(0, 3) == 'See') ? new tree.Noeud('a') :
            new tree.Noeud(he.decode(decodeURI($(e).find('a').attr('href'))).replace(/["]/g, "%22")),

        li_spe: (e: CheerioElement) => [(
            e.children.some(x => x.name == 'b') && !e.children.some(x => x.name == 'a')) ?
            new tree.Noeud(e.children.filter(x => x.name == 'b')[0]
                .children.filter(x => x.name == 'a')[0].attribs['href']) :
            ((e.children.some(x => x.name == 'i') && !e.children.some(x => x.name == 'span')) ?
                new tree.Noeud((x => (x.some(x => x.name == 'i')) ?
                    x.filter(x => x.name == 'b')[0].children :
                    x)
                    ((x => { console.log('rrrrrrr' + x.map(x => x.name)); return x })(e.children).filter(x => x.name == 'i')[0].children).filter(x => x.name == 'a')[0].attribs['href']) ://TODO cause erreureur b dans i != span b a
                new tree.Noeud((x => { console.log(x.map(x => $(x).text())); return x })(e.children).filter(x => x.name == 'a')[0].attribs['href'],
                    [new tree.Noeud(
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
                    new tree.Noeud(e.children
                        .filter(x => x.name == 'span')[0].children
                        .filter(x => x.name == 'a')[0].children
                        .filter(x => x.name == 'img')[0].attribs['src'])]))]
    },
    //-----------------------------------------------------------------------------------------------------------
    List_of_highest_grossing_films: {
        h2: (e: CheerioElement) => [new tree.Noeud('#' + e.children.filter(x => x.name == 'span')[0].attribs['id'])]
    },
    Lists_of_box_office_number_one_films: {
        table: (e: CheerioElement) => table.table2noeud(e.children.filter(x => x.name == 'tr').slice(1), 1,
            fct['Lists_of_box_office_number_one_films'], 0),

        th: (e: CheerioElement) => [new tree.Noeud(e.children.filter(x => x.name == 'a')[0].attribs['href'])],

        td: (e: CheerioElement) => [new tree.Noeud(e.children
            .filter(x => x.name == 'span')[2].children
            .filter(x => x.name == 'a')[0].attribs['href'])]
    },
    List_of_programming_languages_by_type: {
        h2_: (e: CheerioElement) =>
            (e.name == 'ul') ? ul2noeud(e) :
                (e.attribs['role'] == 'note') ?
                    [({ type: e.children[0].nodeValue, content: myApply(e.children.find(x => x.name == 'a'), x => (x == undefined) ? ({ attribs: $(e).text() } as any) as CheerioElement : x).attribs['href'] } as any) as tree.Noeud] :

                    (e.children.find(x => x.name == 'ul')) ? ul2noeud(e.children.find(x => x.name == 'ul')) :

                        [({ type: e.name + myApply(e.attribs['class'] as string, x => (x == undefined) ? '' : '-' + x), content: $(e).text() } as any) as tree.Noeud]
    }
};




export let treatFct = (page: string) => (handlerKey: string): (e: CheerioElement) => tree.Noeud[] =>
    (fct[page] != undefined && fct[page][handlerKey] != undefined) ? fct[page][handlerKey] : BasicHandlersMap.get(handlerKey)


let zz = { ['zr-è@%~▩~:']: 5 }
console.log(zz)
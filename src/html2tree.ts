/// <reference path="D:\acquiBD\node_modules\@types\node\index.d.ts" />
import * as $ from "cheerio";
import * as $elements from "./elements";
import * as tree from './html2tree';
import * as table from './table';

// cheerio for html
// then noeud for tree
/*

            Le codde qui suit permet de transformer une liste délement en un arbre selon des critères définie
            avec des fonctions

*/
let log = (msg) => <T>(x: T): T => { console.log(msg); return x }
let logwtf = log('???')

export interface Noeud {
    name: string;
    child?: Noeud[];
}

export class Noeud {
    constructor(public name: string, public child?: Noeud[]) { }
}

interface Paire<K, V> {
    fst: K,
    snd: V
}
class Paire<K, V>{
    constructor(public fst: K, public snd: V) { }
}
/**
 * Les paramètres de fonctionnement du parser
 */
export interface TreeOptions {
    /**
     * l'url de la page que l'on traite
     **/
    url: string;
    //xmlMode: boolean;
    /**
     * la fonction qui permet de se placer au bon endroit pour commencer à démaré le parsing
     * @param elem la balise 'html' de la page
     *  return la permière balise h2 ou autre que l'on va traiter
     **/
    debut: (elem: CheerioStatic) => CheerioElement;
    /**
     * permet de detecter le cas d'arrêts
     * @param elem une balise
     *  return true si on doit s'arrêter 
     *         false sinon
     **/
    ending: (elem: CheerioElement) => boolean;
    /**
     * permet de detecter les balises à ignorer
     * @param elem une balise
     *  return true si on doit ignorer
     *         false sinon
     **/
    ignor: (elem: CheerioElement) => boolean;
    /**
     * permet récupe un h
     * @param elem une balise h (autre?)
     *  return le noeud représentant le h
     **/
    hi2noeud: (balise: string) => (elem: CheerioElement) => Noeud[];
    /**
     * permet de detecter les balises à traiter dans in2noeud seul le premier est pris
     * @param elem une balise != h
     *  return true si on doit traiter la balise avec in2noeud
     *         false sinon
     **/
    contentBalises: (elem: CheerioElement) => boolean;
    /**
     * context dependant statement ex: #citation -> the function the will treat corectly the tag
     * @param nom
     * @param elem
     */
    spé: (elem: CheerioElement) => (e: CheerioElement) => Noeud[];
    /**
     * treat tags != h
     * @param elem a tag != h
     * @param opt the options
     * @param spé the context dependent fct 
     *  return true if we must treat the tag with in2noeud
     *         false else
     **/
    in2Noeud: (elem: CheerioElement, opt: TreeOptions, spé?: (elem: CheerioElement) => Noeud[]) => Noeud[];

    /**
     * comment traiter les tables
     */
    tables: { col: number[], Bigcol: number, ignoredRows: number }[]

    //endingchild?: (elem: CheerioElement, niv:number) => boolean;
    //content?: (elem: CheerioElement) => boolean;

}


export interface Tree {
    option?: TreeOptions;
    noeudify(page: string): Noeud[];
}

//=============================== utilitaires ===================================

let noVoid = (elem: CheerioElement): CheerioElement => next(elem)

let next =
    (
        elem: CheerioElement,
        stop = (x: CheerioElement) => x == null || x.name == undefined,
        conti = (x: CheerioElement) => true
    ): CheerioElement =>
        (stop(elem)) ?
            elem :
            (conti(elem)) ?
                next(elem.next, stop, conti) :
                elem


function range(from: number, to: number): number[] {
    let res = []
    for (var i = from; i <= to; i++) {
        res.push(i);
    }
    return res
}//console.log(range(0, 10));

//----------------------------------------------------


let _debut2 = (page: CheerioStatic): CheerioElement =>

    next(page('#mw-content-text').children().toArray()[0],
        x => x == null,
        x => x.name == 'h2'
            || x.name == 'ul'
            || x.name == 'table'
            || (x.name == 'div'
                && (x.attribs['class'] == "mw-category-generated"
                    || x.attribs['class'] == "mf-section-0"
                    || x.attribs['class'] == "div-col columns column-width")))

let _ending = (elem: CheerioElement): boolean =>
    elem.name == 'noscript'

let _contentBalise = (elem: CheerioElement): boolean =>
    ['div', 'ul', 'ol', 'p', 'table', 'dl'].some(x => elem.name == x)// elem.name == 'div'|| elem.name == 'ul'|| elem.name == 'ol'|| elem.name == 'p'|| elem.name == 'table'


let _ignoring = (elem: CheerioElement): boolean =>

    ((elem.name == 'div'
        && (/*elem.attribs['role'] == "navigation"
            || */elem.attribs['style'] == "clear:both;"
            || elem.attribs['class'] == "thumb tright"
            || elem.attribs['class'] == "vertical-navbox nowraplinks hlist"
            || elem.attribs['id'] == "toc"))
        || (elem.name == 'table'
            && (elem.attribs['class'] == "vertical-navbox nowraplinks hlist"
                || elem.attribs['id'] == "toc"
                || elem.attribs['role'] == "presentation"
                || elem.attribs['class'] == "infobox"))
        || (elem.name == 'a' && (elem.attribs['id'] == "top"))
        || elem.type == 'text'
        || elem.type == 'comment'
        || elem.name == 'blockquote')



let _ignoringInt = (elem: CheerioElement): boolean =>

    ((elem.name == 'div'
        && (elem.attribs['role'] == "navigation"
            || elem.attribs['style'] == "clear:both;"
            || elem.attribs['class'] == "thumb tright"
            || elem.attribs['class'] == "vertical-navbox nowraplinks hlist"
            || elem.attribs['id'] == "toc"))
        || (elem.name == 'table'
            && (elem.attribs['class'] == "vertical-navbox nowraplinks hlist"
                || elem.attribs['id'] == "toc"
                || elem.attribs['class'] == "infobox"))
        || (elem.name == 'a' && (elem.attribs['id'] == "top"))
        || elem.type == 'text'
        || elem.type == 'comment'
        || elem.name == 'blockquote')








//================================================ gestion des elements divers et complexes =====================================================

let _spé = (elem: CheerioElement) =>

    (['#See_also', '#External_links', "#References"].some(x => x == elem.attribs['id'])) ?
        undefined : $elements.treatFct('Lists_of_cities_by_country')('ul_spe');


import * as he from "he";
/*
function _hi2str(elem: CheerioElement): string {//TODO
    new Noeud((elem.children.length == 1) ? he.decode($(elem).html()).replace(/["]/g, "%22") :
        (x => (x == null) ? decodeURIComponent(elem.children[0].children[0].children[0].nodeValue).replace(/["]/g, "%22") : '#' + x)(elem.children[0].attribs['id']));


    let tmp
    if (elem.children.length == 1) return he.decode($(elem).html()).replace(/["]/g, "%22")//TODO integré au noeud pour faire ça dans pairify
    else tmp = elem.children[0].attribs['id']
    if (tmp == null) tmp = decodeURIComponent(elem.children[0].children[0].children[0].nodeValue).replace(/["]/g, "%22")
    else tmp = '#' + tmp
    return tmp
}
*/


//----------------------------------------------------

//declare function unescape(s: string): string;

/**
     * treat tags != h
     * @param elem a tag != h
     * @param opt the options
     * @param spé the context dependent fct 
     *  return true if we must treat the tag with in2noeud
     *         false else
     **/
function _in2Noeud(elem: CheerioElement, opt: TreeOptions, spé: (e: CheerioElement) => Noeud[] = undefined): Noeud[] {
    if (spé != undefined) return spé(elem);//
    let res: Noeud[];

    switch (elem.name) {
        case 'ol':
            res = opt.treat('ol')(elem)
        case 'ul':
            console.log($(elem).text() + 'a')
            //console.log('::::::::::::::' + ghj++)
            res = opt.treat('ul')(elem)
            // return elem.children.filter(x => x.name == 'li').map(x => opt.treat('li')(x) as Noeud);
            //return opt.treat(elem.name)(elem) as Noeud[];
            break;
        case 'div':
            if (elem.attribs['role'] == 'note') return opt.treat('note')(elem)
            if ((x => (x == undefined) ? '' : x as string)(elem.attribs['class']).indexOf('hatnote') > -1) return opt.treat('hatnote')(elem)
            console.log(3)
            if (elem.attribs['aria-labelledby'] != undefined) return [({ type: 'navbox', content: elem.attribs['aria-labelledby'] } as any) as Noeud]
            console.log(4)
            console.log($(elem).text())
            console.log(elem.attribs['role'])
            if (elem.attribs['role'] == 'navigation' && elem.attribs['aria-label'] != 'Navbox') return opt.treat('navigation')(elem)
            if (elem.attribs['class'] == 'toc plainlinks hlist') {
                console.log(elem.attribs['class'])
                return opt.treat('ul')(elem.children.find(x => x.name == 'ul'))
            }
            if (elem.attribs['class'] == 'hlist') {
                return opt.treat('dl')(elem.children.find(x => x.name == 'dl'))
            }
            if (elem.children.find(x => x.name == 'table' && x.attribs['class'] == 'multicol')) {
                //console.log($(elem).children('table').children('tr').children('td').toArray().map(x => _noeudify(x.children[0], 2, opt, undefined).snd))
                //console.log(_noeudify($(elem).children('table').children('tr').children('td').children('*').toArray()[1], 2, opt, spé))
                return $(elem).children('table').children('tr').children('td').toArray().map(x => _noeudify(x.children[0], 2, opt, undefined).snd).reduce((acc, x) => acc.concat(x))
            }
            if (elem == undefined || elem.children.filter(x => x.name != undefined && !_ignoring(x))[0] == undefined) res = [];
            else if (elem.children.some(x => x.name == 'h3')) {
                res = _noeudify(elem.children[0], 2, opt, undefined).snd
            }
            else res = opt.treat('note')(elem)
            /*, ((spé == undefined) ?
                opt.spé(elem.name, elem) :
                spé));*/
            break;
        case 'table':
            res = (opt.tables.length == 0) ? opt.treat('table')($(elem).clone().toArray()[0]) :
                table.table2noeud(
                    $(elem).clone().toArray()[0].children.filter(x => x.name == 'tr').slice(opt.tables[opt.counter].ignoredRows),
                    opt.tables[opt.counter].col,
                    (x => { console.log(x); return (x == undefined) ? opt.treat('td') : x })(opt.treat('t' + opt.counter)),
                    opt.tables[opt.counter++].Bigcol);
            //Lists_of_military_aircraft_by_nation
            break;
        case 'p':
            res = opt.treat('p')(elem);//_in2Noeud(elem.children.filter(x => x.name != undefined && !_ignoring(x))[0], opt, spé);
            break;
        case 'dl':
            if (elem.name == 'dl' && elem.children.some(x => x.name == 'dt') && !elem.children.some(x => x.name == 'dd'))
                return [{ type: 'un dt sauvage tout seul', content: $(elem).text().trim() } as any]
            if (!elem.children.some(x => x.name == 'dt'))
                return elem.children.filter(x => x.name == 'dd').map(x => opt.treat('note')(x)).reduce((acc, x) => acc.concat(x), [])
            console.log(1111111)
            console.log($(elem).text())
            res = opt.treat('dl')(elem.children.find(x => x.name == 'dt' || x.name == 'dd'));
            break;
        default:
            res = [new Noeud('(à(pas de prise en compte de ' + elem.name + ' )à)')];
            break;
    }
    return res
}



//================================================================= coeur de la fête

/**
 * la noeudifycation d'une page wiki... pour l'instant ^^
 * ! Attention pile d'appels augmente avec la profondeur de l'arbre (pas tail recursif)
 * 
 * @param eleme l'élement de départ
 * @param niv le niveau courant
 * @param opt les options de la noeudification
 * @param spécial le spécial courant
 */
function _noeudify(eleme: CheerioElement, niv: number, opt: TreeOptions, spécial: any = undefined): Paire<CheerioElement, Noeud[]> {

    let elem = next(eleme, (x) => x == null, (x) => (opt.ignor(x)))
    if (elem == undefined || elem == null || opt.ending(elem)) return new Paire<CheerioElement, Noeud[]>(elem, []); // cas d arret
    if (elem.name == 'h' + (niv + 2)) console.error("indentation incorrect de la page"); // bug

    //console.log(elem.attribs)
    if (elem.name == 'h' + (niv + 1)) {// la recursion child et suivante (cas d'une balise fille)
        let noeud = opt.hi2noeud(elem.name)(elem)[0]
        //recursion child
        let child: Paire<CheerioElement, Noeud[]> = _noeudify(elem.next, niv + 1, opt, opt.spé(elem));//on arriveras soit dans le else soit en h?

        noeud.child = child.snd

        // recursion suivant
        let arrayNoeud = _noeudify(child.fst, niv, opt);//spé pour géré quelque chose qui suit?

        arrayNoeud.snd.unshift(noeud)// on append noeud et noeudify(next h?)

        return arrayNoeud
    }
    else if (range(0, niv).map(x => 'h' + x).some(x => elem.name == x) // elem.name == 'h' + (niv)|| elem.name == 'h' + (niv - 1)|| elem.name == 'h' + (niv - 2)|| elem.name == 'h' + (niv - 3)|| elem.name == 'h' + (niv - 4)
    ) {// cas d'arret des sous arbres
        return new Paire<CheerioElement, Noeud[]>(elem, [])
    }

    /*
    else if (elem.name == 'dl' && elem.children.some(x => x.name == 'dt') && !elem.children.some(x => x.name == 'dd')) {//TODO dt sauvage
        let noeud = opt.hi2noeud(elem.name)(elem)[0]
        //recursion child
        let child: Paire<CheerioElement, Noeud[]> = _noeudify(elem.next, niv + 1, opt, opt.spé(elem));//on arriveras soit dans le else soit en h?

        noeud.child = child.snd

        // recursion suivant
        let arrayNoeud = _noeudify(child.fst, niv, opt);//spé pour géré quelque chose qui suit?

        arrayNoeud.snd.unshift(noeud)// on append noeud et noeudify(next h?)

        return arrayNoeud
    }*/


    //TODO cas arret template fin de page
    else if (opt.contentBalises(elem)) {

        if (elem.attribs['class'] == 'toc plainlinks hlist') console.log(1)

        if (elem == undefined) throw '88'

        let my_courant = opt.in2Noeud(elem, opt, ((spécial == undefined) ?
            opt.spé(elem) :
            spécial))

        if (my_courant == undefined) { console.log($(elem).text()); throw '*******' }
        let rec = _noeudify(elem.next, niv, opt, spécial)
        my_courant.reverse().forEach(x => rec.snd.unshift(x))



        return rec
    }
    else {
        console.error("!!!!!!!!!<<<<<<<<<<<<<<<<<<<<<<<<<!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.dir(elem.name)
        console.dir(elem.type)
        console.error("!!!!!!!!!>>>>>>>>>>>>>>>>>>>>>>>>>!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        return _noeudify(elem.next, niv, opt);
    }
}






export class TreeOptions {
    constructor(
        public url: string,
        //public xmlMode = false, 
        public debut = _debut2,
        public ending = _ending, public ignor = _ignoring,
        public spé: (elem: CheerioElement) => (e: CheerioElement) => Noeud[] = (elem: CheerioElement) => undefined,
        public contentBalises = _contentBalise, public in2Noeud = _in2Noeud, public tables = [] as { col: number[], Bigcol: number, ignoredRows: number }[],
        public treat = $elements.treatFct(url.slice(6).replace('-', '_').replace('%', 'ç')), public hi2noeud = $elements.treatFct(url.slice(6).replace('-', '_').replace('%', 'ç')),
        public counter = 0
    ) {

        if (url == "/wiki/Lists_of_cities_by_country") {
            this.spé = _spé
        }
        else if (url == "/wiki/Lists_of_films") {
            this.spé = (elem?: CheerioElement) =>
                (elem.name == 'div' && elem.attribs['class'] == 'toc plainlinks hlist') ?
                    this.treat('div_spe') : undefined;
        } else if (url == "/wiki/List_of_programming_languages_by_type") {
            this.spé = (elem?: CheerioElement) =>
                ((elem.name == 'h2' || elem.name == 'h3' || elem.name == 'h4')
                    && !['See_also', 'References', 'External_links']
                        .some(x => x == elem.children.find(x => x.name == "span" && x.attribs['class'] == 'mw-headline').attribs['id'])) ?
                    this.treat('h2_') : undefined;
        } else if (url == "/wiki/Lists_of_military_aircraft_by_nation") {
            this.tables = [{ col: [1, 2, 3, 4], Bigcol: 0, ignoredRows: 1 }]
        } else if (url == "/wiki/Aviation_lists") {
            this.tables = [{ col: [1, 2, 3, 4], Bigcol: 0, ignoredRows: 1 }]
        } else if (url == "/wiki/Lists_of_box_office_number-one_films") {
            this.tables = [{ col: [1], Bigcol: 0, ignoredRows: 1 }]
        } else if (url == "/wiki/List_of_2014_box_office_number-one_films_in_Spain") {
            this.tables = [{ col: [4, 1], Bigcol: 2, ignoredRows: 1 }, { col: [6, 2, 3], Bigcol: 1, ignoredRows: 1 }]
        } else if (url == "/wiki/List_of_film_and_television_occupations") {
            this.tables = [{ col: [], Bigcol: 0, ignoredRows: 1 }, { col: [], Bigcol: 0, ignoredRows: 1 }, { col: [], Bigcol: 0, ignoredRows: 1 }]
            //équivalent à Array(3).fill({ col: [], Bigcol: 0, ignoredRows: 1 })
        } else if (url == "/wiki/List_of_engineering_branches") {
            this.tables = Array(6).fill({ col: [2], Bigcol: 0, ignoredRows: 1 })
        } else if (url == "/wiki/Materials_science") {
            this.tables = [{ col: [], Bigcol: 0, ignoredRows: 1 }]
        }
        /* else if (url == "/wiki/Lists_of_100_best_books") {
                    this.colTable = [1, 1, 1, 1, 1]
                } else if (url == "/wiki/Lists_of_box_office_number-one_films") {
                    this.colTable = [1]
                } else if (url == "/wiki/Lists_of_100_best_books") {
                    this.colTable = [1, 1, 1, 1, 1]
                }*/
    }
}
//import * as fs from 'fs'
export class Tree {
    option?: TreeOptions;
    constructor(option: TreeOptions) {
        this.option = option
    }
    noeudify(serialized: string): Noeud[] {
        console.log(this.option.url);
        //fs.appendFileSync('./computed/log.txt', this.option.url)

        let page = $.load(serialized)
        let start = this.option.debut(page)

        let tmp = _noeudify(start, 1, this.option).snd
        //fs.appendFileSync('./computed/log.txt', tmp)
        return tmp
    }
}





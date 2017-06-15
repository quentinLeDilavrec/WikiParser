import { Noeud } from './html2tree';
import * as _ from 'underscore'
declare global {
    interface String {
        log(str?: any): this;
        exe(f: () => any): this;
    }
    interface Array<T> {
        log(str?: any): this;
        exe(f: any): this;
    }
}
String.prototype.log = function (str: any = this) {
    console.log(str)
    return this
};
String.prototype.exe = function (f: (x) => any = undefined) {
    f(this)
    return this
};
Array.prototype.log = function (str: any = this) {
    console.log(str)
    return this
};
Array.prototype.exe = function (f: () => any = undefined) {
    f()
    return this
};


let assert = (given, expected) => {
    if (_.isEqual(given, expected)) console.log('.')
    else {
        process.stdout.write('expected  ')
        console.log(expected)
        process.stdout.write("but given ")
        console.log(given)

    }
}







export interface Tree2uplet {
    option?: Object;
    pairify(n: Noeud): string[];
    pairify(n: Noeud, f?: (x: string[]) => string): string[];
}

export class Tree2uplet {
    constructor(option?: Tree2upletOptions) { }

    pairify(n: Noeud,
        f: (x: string[], y: string) => string = ((x, y) => '("' + x[0] + '", "' + x[1] + '", "' + y + x[2] + '")')): string[] {
        let nonU = {}
        return _pairify(n, n.name, nonU).map(y => f(y, n.name.substr(6)))
    }

    pairifyArray(n: Noeud[],
        f: (x: string[], y: string) => string = ((x, y) => '("' + x[0] + '", "' + x[1] + '", "' + y + x[2] + '")')): string[][] {
        let nonUArr = n.map(x => { return {} })
        return n.map((x, i) => _pairify(x, x.name, nonUArr[i]).map(y => f(y, x.name.substr(6))))
    }

}

let _pairify = (n: Noeud, LastU: string, nonU: {}, lastHash: string = ""): string[][] =>

    (n.child == undefined) ?
        [] :
        ((!/^(http(s|):[/][/]|[#]|[/])/.test(n.name)) ?
            // les non unique
            n.child.map(
                x => ((x.name != undefined) ?
                    [[LastU, unique(x.name, LastU, nonU), lastHash]]
                        .concat(_pairify(x, unique2(x.name, LastU, nonU), nonU, lastHash)) :
                    _pairify(x, LastU, nonU, lastHash))) :

            (/^[#].+$/.test(n.name)) ?
                //les #blabla
                n.child.map(
                    x => (x.name != undefined) ?
                        [[LastU, unique(x.name, LastU, nonU), lastHash]]
                            .concat(_pairify(x, unique2(n.name, LastU, nonU), nonU, n.name)) :
                        _pairify(x, LastU, nonU, n.name)) :
                //les /wiki\/ http(s)
                n.child.map(
                    x => (x.name != undefined) ?
                        [[n.name, unique(x.name, LastU, nonU), lastHash]]
                            .concat(_pairify(x, unique2(x.name, LastU, nonU), nonU, lastHash)) :
                        _pairify(x, LastU, nonU, lastHash)))
            .reduce((acc, x) => (acc.concat(x)), [])



'http://'; 'https://'; '/' // ~~Unique
'/wiki/%#%'//unique

let unique = (name: string, LastU: string, u: {}) =>
    (/^(http(s|):[/][/]|[/])/.test(name)) ?
        name :
        ((name[0] == '#') ?
            before(LastU, '#') + name :
            before(LastU, '#') + '@' + name +
            ((u[name] == null) ? ''.exe(() => u[name] = 0) : '~'.exe(() => u[name] += 1) + u[name] + ''))

let unique2 = (name: string, LastU: string, u: {}) =>
    (/^(http(s|):[/][/]|[/])/.test(name)) ?
        name :
        ((name[0] == '#') ?
            before(LastU, '#') + name :
            before(LastU, '#') + '@' + name +
            ((u[name] == null || u[name] == 0) ? '' : '~' + u[name]))


let before = (str: string, c: string) => (str.length == 0 || str[0] == c[0]) ? '' : str[0] + before(str.substring(1), c)
//console.log(before('/wiki/test', '#'))//gg
/*
assert(
    _pairify(new Noeud('/wiki/test', [new Noeud('/wiki/testA', [])]), '/wiki/test', {})
    ,
    [['/wiki/test', '/wiki/testA']])
assert(
    _pairify(new Noeud('/wiki/test', [new Noeud('#testA', [])]), '/wiki/test', {})
    ,
    [['/wiki/test', '/wiki/test#testA']])
assert(
    _pairify(new Noeud('/wiki/test', [new Noeud('http://testA.com/aaa#d', [])]), '/wiki/test', {})
    ,
    [['/wiki/test', 'http://testA.com/aaa#d']])
assert(
    _pairify(new Noeud('http://testA.com/aaa#d', [new Noeud('#d', [])]), '/wiki/test', {})
    ,
    [['http://testA.com/aaa#d', '/wiki/test#d']])
assert(
    _pairify(new Noeud('#a', [new Noeud('#d', [])]), '/wiki/test#a', {})
    ,
    [['/wiki/test#a', '/wiki/test#d']])
assert(
    _pairify(new Noeud('#a', [new Noeud('d', [])]), '/wiki/test#a', {})
    ,
    [['/wiki/test#a', '/wiki/test#a#d~0']])
assert(
    _pairify(new Noeud('a', [new Noeud('d', [])]), '/wiki/test#a~0', {})
    ,
    [['/wiki/test#a~0', '/wiki/test#a~0#d~0']])
assert(
    _pairify(new Noeud('a', [new Noeud('d', [])]), '/wiki/test#a', {})
    ,
    [['/wiki/test#a~1000', '/wiki/test#a~1000#d~0']])
assert(
    _pairify(new Noeud('a', [new Noeud('d', [new Noeud('e', []), new Noeud('e', [new Noeud('f', [])])])]), '/wiki/test#a', {})
    ,
    [['/wiki/test#a~10', '/wiki/test#a~10#d~0'],
    ['/wiki/test#a~10#d~0', '/wiki/test#a~10#d~0#e~0'],
    ['/wiki/test#a~10#d~0', '/wiki/test#a~10#d~0#e~1'],
    ['/wiki/test#a~10#d~0#e~1', '/wiki/test#a~10#d~0#e~1#f~0']])
assert(
    _pairify(new Noeud('a', [new Noeud('d', [new Noeud('e', []), new Noeud('#b', [new Noeud('f', [])])])]), '/wiki/test#a', {})
    ,
    [['/wiki/test#a~10', '/wiki/test#a~10#d~0'],
    ['/wiki/test#a~10#d~0', '/wiki/test#a~10#d~0#e~0'],
    ['/wiki/test#a~10#d~0', '/wiki/test#b'],
    ['/wiki/test#b', '/wiki/test#b#f~0']])
assert(
    _pairify(new Noeud('a', [new Noeud('#d', [])]), '/wiki/test#a', {})
    ,
    [['/wiki/test#a~1000', '/wiki/test#d']])
assert(
    _pairify(new Noeud('/wiki/test', [new Noeud('d', [new Noeud('e', [])]), new Noeud('d', [new Noeud('e', [])])]), '/wiki/test', {})
    ,
    [['/wiki/test', '/wiki/test#d~0'],
    ['/wiki/test#d~0', '/wiki/test#d~0#e~0'],
    ['/wiki/test', '/wiki/test#d~1'],
    ['/wiki/test#d~1', '/wiki/test#d~1#e~0']])
assert(
    _pairify(new Noeud('/wiki/test', [new Noeud('sub', [new Noeud('A', [])]), new Noeud('pg', [<Noeud>{}, new Noeud('G', [])])]), '/wiki/test', {})
    ,
    [['/wiki/test', '/wiki/test#sub~0'],
    ['/wiki/test#sub~0', '/wiki/test#sub~0#A~0'],
    ['/wiki/test', '/wiki/test#pg~1'],
    ['/wiki/test#pg~0', '/wiki/test#sub~0#A~0']])
    */
/*assert(

    ,
    [['/wiki/test', 'http://testA.com/aaa#d']])*/

interface Tree2upletOptions {
    SQL?: boolean;
    excel?: boolean;
}

class Tree2upletOptions {
    SQL?: boolean = true;
    excel?: boolean = false;
}

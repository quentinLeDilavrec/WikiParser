/// <reference path="../node_modules/@types/node/index.d.ts" />
import * as tree from './html2tree';
import * as uplet from './tree2uplet';
import * as https from "https"
import * as fs from "fs";
import * as mysql from 'promise-mysql'
import * as rp from 'request-promise-native'
import * as stream from 'stream'


export const enum BDType {
    sql, excel, treebd, xml, csv
}

//TODO voir doù vient le #top
export interface Web2bdOptions {
    outputType: BDType,
    deepness: number,
    outputDir: string,
    dataBase: mysql.IConnectionConfig,
    compute(url: string): this
}

export class Web2bdOptions {

    constructor(
        public deepness = 1,
        public outputDir = './computed/',
        public dataBase = <mysql.IConnectionConfig>{
            port: 3306,
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'projetDSB'
        },
        public outputType = BDType.sql,
        public pref = ['/wiki/%'],
        public limite = 20
    ) { }
}

export interface Web2bd {
    option: Web2bdOptions
    compute(url: string): this
    get(type?: BDType): string
    save(chemin: string, type?: BDType): this
}

class RowDataPacket { Fille: string }

export class Web2bd {
    res: tree.Noeud[]

    constructor(public option = new Web2bdOptions()) {
        this.res = []
    }

    //compute(page) -> this // res += un arbre des élements dans la page d'url page
    compute(page: string): this {
        console.log('traitement de ' + page);

        if (!fs.existsSync('./fetch/' + page.substring(6).replace(/[:]/g, '_') + ".html")) {
            rp('https://en.wikipedia.org' + page)
                .then(x => fs.writeFileSync('./fetch/' + page.substring(6).replace(/[:]/g, '_') + ".html", x))
                .then(() => { if (this.res.unshift(_compute(page, this.option)) > 2) this.res.pop() })
                .catch(console.error)
        } else if (this.res.unshift(_compute(page, this.option)) > 2) this.res.pop()
        return this
    }
    //build() -> this // construit la table pris dans option
    build(): this {
        let loopRequest = (a: Promise<mysql.IConnection>): Promise<any> => {
            let conn;
            return a
                .then((co) => conn = co)
                .then(() => console.log("SELECT DISTINCT Fille FROM pages WHERE Fille NOT LIKE '/wiki/%#%' AND Fille NOT LIKE '/wiki/%@%' AND Fille LIKE '/wiki/%' AND (" + this.option.pref.map(x => "FILLE LIKE " + conn.escape(x)).join(" OR ") + ") AND Fille NOT IN (SELECT Page FROM PagesComplete) ORDER BY Fille"))
                .then(() =>
                    conn.query('SELECT DISTINCT Fille FROM pages WHERE Fille NOT LIKE "/wiki/%#%" AND Fille NOT LIKE "/wiki/%@%" AND Fille LIKE "/wiki/%" AND (' + this.option.pref.map(x => 'FILLE LIKE ' + conn.escape(x)).join(' OR ') + ') AND Fille NOT IN (SELECT Page FROM PagesComplete) ORDER BY Fille'))
                .then((res: Object[]) => {
                    console.log(res)
                    return (res.length > this.option.limite) ? res.slice(0, this.option.limite) : res
                })
                .then((res: RowDataPacket[]) => {
                    console.log(res)
                    Promise.all(res.map(({ Fille }) =>
                        (!(fs.existsSync('./fetch/' + Fille.substring(6).replace(/[:]/g, '_') + ".html")) ?
                            rp('https://en.wikipedia.org' + Fille)
                                .then((x: string) => {
                                    console.log(Fille)
                                    fs.writeFileSync('./fetch/' + Fille.substring(6).replace(/[:]/g, '_') + '.html', x);
                                    console.log(Fille.substring(6) + "---saved");
                                    return x
                                }) :
                            new Promise((resolve: (x: string) => string, reject) => {
                                fs.readFile('./fetch/' + Fille.substring(6).replace(/[:]/g, '_') + '.html', function (err, data) {
                                    if (err) reject(err);
                                    else resolve(data.toString());
                                }, )
                            })
                        )
                            .then(x => { return new tree.Noeud(Fille, new tree.Tree(new tree.TreeOptions(Fille)).noeudify(x)) })
                            .then((x: tree.Noeud) => {
                                fs.writeFileSync('./fetchResult/' + Fille.substring(6).replace(/[:]/g, '_') + '.json', JSON.stringify(x, Object.keys(x).sort().reverse(), "\t"));
                                console.log(Fille.substring(6) + "---result saved");
                                return x
                            })
                    ))
                        .then(noeuds => {
                            console.log("aaaa")
                            return noeuds
                        })
                        .then((noeuds: tree.Noeud[]) => noeuds.sort((a: tree.Noeud, b: tree.Noeud) => a.name.localeCompare(b.name)))
                        .then((noeuds: tree.Noeud[]) => {
                            console.log("------------------------ttttttttttttttt------------\n", noeuds.map(({ name }) => name))
                            return noeuds
                        })
                        .then(noeuds => {
                            let tmp = (new uplet.Tree2uplet()).pairifyArray(noeuds, (x => '(' + conn.escape(x[0]) + ', ' + conn.escape(x[1]) + ')'))
                            noeuds
                                .map((x, i) =>
                                    JSON.stringify(x, Object.keys(x).sort().reverse(), "\t")
                                        .concat("#########################################################\n" + tmp[i].join(',\n'))
                                ).forEach(x => fs.appendFileSync(
                                    './computed/log.txt',
                                    "\n---------------------------------------------------------------------------------------\n" +
                                    x +
                                    "\n---------------------------------------------------------------------------------------\n"))
                            return noeuds

                        })
                        .then(noeuds =>
                            conn.query('INSERT IGNORE INTO Pages (Mere, Fille, lieuDuParsing) \n' + 'VALUES '
                                + (new uplet.Tree2uplet()).pairifyArray(noeuds, ((x, y) => '(' + conn.escape(x[0]) + ', ' + conn.escape(x[1]) + ', ' + conn.escape(y) + ')')).reduce((acc, x) => acc.concat(x), []).join(',\n')
                                + ';').catch(console.error)
                        ).then(() => {
                            conn.query('INSERT IGNORE INTO PagesComplete (Page) \n' + 'VALUES '
                                + res.map(x => '(' + conn.escape(x['Fille']) + ')').join(',\n')
                                + ';').catch(console.error)
                            return res
                        })
                        .then(() => conn.end()).catch(console.error)
                }).catch(console.error)
        }
        /*
                                .then(noeuds =>
                                    mysql.createConnection(this.option.dataBase).then((x) => {
        
                                        x.query('INSERT IGNORE INTO Pages (Mere, Fille) \n' + 'VALUES '
                                            + (new uplet.Tree2uplet()).pairifyArray(noeuds, (x => '(' + conn.escape(x[0]) + ', ' + conn.escape(x[1]) + ')')).reduce((acc, x) => acc.concat(x), []).join(',\n')
                                            + ';').catch(console.error)
                                        return x
                                    }).then((x) => x.end()).catch(console.error)
                                ).catch(err => { console.error(err) })
                            return res
                        })
        
                        .then((res: Object[]) => {
                            conn.query('INSERT IGNORE INTO PagesComplete (Page) \n' + 'VALUES '
                                + res.map(x => '(' + conn.escape(x['Fille']) + ')').join(',\n')
                                + ';').catch(console.error)
                            return res
                        })
        
                        .then(() => conn.end()).catch(console.error)
                }
        */
        //Array(this.option.deepness).fill(1).map((_, i) => setTimeout(() => loopRequest(mysql.createConnection(this.option.dataBase)), 1000))
        loop(this.option.deepness, () => loopRequest(mysql.createConnection(this.option.dataBase)))

        return this
    }




    get(type?: BDType): string {
        if (this.res.length == 0) throw "aucun résultat calculé"
        if (typeof type === 'undefined') {
            return JSON.stringify(this.res[0], Object.keys(this.res[0]).sort().reverse(), "\t")

        } else if (BDType.sql === type) {
            return 'INSERT INTO Pages (Mere, Fille)\n' + 'VALUES '
                + (new uplet.Tree2uplet()).pairify(this.res[0], (x => '("' + x[0] + '", "' + x[1] + '")')).join(',\n')
                + ';'
        } else if (BDType.csv === type) {
            return 'Mere, Fille\n' +
                (new uplet.Tree2uplet()).pairify(this.res[0], (x => x[0] + ', ' + x[1])).join('\n') +
                ';'
        } else {
            return "bug"

        }
    }
    save(chemin: string, type?: BDType): this {
        if (typeof type === 'undefined') {
            fs.createWriteStream(this.option.outputDir + chemin + '.json').write(JSON.stringify(this.res[0], Object.keys(this.res[0]).sort().reverse(), "\t"))
        } else if (BDType.sql === type) {
            console.log("---sql saving---");
            fs.createWriteStream(this.option.outputDir + chemin + '.sql').write(this.get(type))
        } else if (BDType.excel === type) {
            console.log("save excel not yet implemented");
        } else if (BDType.treebd === type) {
            console.log("save treebd not yet implemented");
        } else if (BDType.xml === type) {
            console.log("save xml not yet implemented");
            fs.createWriteStream(chemin + '.xml').write("xml")
        } else if (BDType.csv === type) {
            console.log("---csv save---");
            fs.createWriteStream(this.option.outputDir + chemin + '.csv').write(this.get(type))
        } else {
            console.log("bug");
        }
        return this
    }
}

function _compute(url: string, opt: Web2bdOptions): tree.Noeud {

    let tmp = new tree.Noeud(url,
        new tree.Tree(new tree.TreeOptions(url))
            .noeudify(fs.readFileSync('./fetch/' + url.substring(6) + ".html").toString()))

    fs.writeFileSync('./fetchResult/' + url.substring(6).replace(/[:]/g, '_') + '.json',
        JSON.stringify(tmp, Object.keys(tmp).sort().reverse().concat(['type', 'content']), "\t"));
    fs.writeFileSync('./fetchResult/' + url.substring(6).replace(/[:]/g, '_') + '.sql',
        'INSERT INTO Pages (Mere, Fille, Lieu) \n' + 'VALUES '
        + (new uplet.Tree2uplet()).pairify(tmp).join(',\n')
        + ';');
    return tmp

}




let loop = (n: number, f: () => Promise<any>): Promise<any> =>
    (n > 1) ?
        f()
            .then(() => loop(n - 1, f)) :
        f().catch(console.error)
/*
import * as https from "https"
let content: string = ""
https.get('https://en.wikipedia.org/wiki/List_of_lists_of_lists', (res) => {
    res.setEncoding('utf8');
    res.on('data', function (body) {
        console.log(body)
        content += body
    }); res.on("end", function () {
    }); res.on("error", function (error) {
        console.log(error)
    });
}).end();
console.log("aaaaa" + content);*/


/*

feuille
noeud
unreachable nodes
rm a parsed table from pages and page complete
    ? + remove all the liked child that are not pointed by other elements
    then reparse the page and add it to the tables










*/
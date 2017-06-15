/// <reference path="../node_modules/@types/node/index.d.ts" />
import * as fs from 'fs'
import * as fse from 'fs-extra'

import * as https from 'https'
import * as stream from 'stream'
import * as rp from 'request-promise-native'

let last = (s: string, i: number, l: number = s.length) => s.substr(l - i - 1, l - 1)


let classify = (x: string) =>/*
    let res: string[] = [], tmp = '',
        opcro = 0, oprec = 0, opdq = 0, opq = 0,
        esc = false, content = false
    for (let ind = 0; ind < x.length; ind++) {
        let e = x[ind]
        tmp += e

        if (esc) { esc = false; continue; }
        if (e == '\\') { esc = true; continue; }

        switch (e) {
            case '{': opcro++
                break;
            case '[': oprec++
                break;
            case '"':
                if (opdq == 1) opdq--
                else if (opdq == 0) opdq++
                else throw 'bug'
                break;
            case '}':
                if (oprec == 0) opcro--
                else console.log('bug')
                break;
            case ']':
                if (opcro == 0) oprec--
                else console.log('bug')
                break;
            default: 1
                break;
        }
        //console.log(e)

        if (opcro == 0 && oprec == 0 && opdq == 0) {
            //console.log(tmp)
            if (res.length > 0) {
                console.log(tmp)
                if (/__\n\n$/.test(tmp)) { res.push(111111111 + tmp); tmp = '' }
                else if (/[^}=]\n\n$/.test(tmp) && ind + 1 < x.length && x[ind + 1] != '=') { res.push(''); res.push(tmp); tmp = ''; console.log(1111) }
            }
            else if (/[^}=]\n\n$/.test(tmp)) {
                console.log(tmp)
                res.push(res.length + 'aaaaaaaaa' + tmp); tmp = ''; content = true; console.log(2222)
            }

            /[^}=]\n\n$/
        }

    }
    //res.push(tmp)
    return res
    */
    ((first, last) => {
        console.log(x.substring(first, last))
        return {
            head: x.substring(0, first),
            content: x.substring(first, last).split('\n').reduce((acc, x) =>
                (/^[=]{2,}(.*)[=]{2,}$/.test(x)) ?
                    (y => { y.push([x]); console.log(x); return y })(acc) :
                    (y => { y[y.length - 1].push(x); return y })(acc),
                [[]]),
            bottom: x.substring(last),
        }
    })(x.indexOf('\n\n'), x.lastIndexOf('\n\n'))

let page = '/wiki/Lists_of_cities_by_country?action=raw'
//console.log(page.substr(5));

//rp('https://en.wikipedia.org' + page)
fse.readFile(page.substr(6).replace('?', '+') + '.txt')
    .then(
    x => (x =>
        '+++++++++++++++head+++++++++++++++++++\n' +
        x.head +
        '\n+++++++++++end head+++++++++++++++++++\n' +
        '+++++++++++content+++++++++++++++++++\n' +
        x.content.map(x => x.join('\n')).join('\n-------------\n') +
        '\n+++++++++++end content+++++++++++++++++++\n' +
        '+++++++++++bottom+++++++++++++++++++\n' +
        x.bottom +
        '\n++++++++++++end bottom++++++++++++++++++\n'

    )(classify(x.toString()))
    )
    //.then((x) => fse.writeFileSync(page.substr(6).replace('?', '+') + '.txt', x))
    .then(x => fse.writeFileSync(page.substr(6).replace('?', '+') + '.res.txt', x))
    .catch(console.error)


/*
rp('https://en.wikipedia.org' + page)
//fse.readFile(page.substr(6).replace('?', '+') + '.txt')
    //.then(x => classify(x.toString()).map(x => x.join('\n')).join('\n-------------\n'))
    .then((x) => fse.writeFileSync(page.substr(6).replace('?', '+') + '.txt', x))
    //.then((x) => fse.writeFileSync(page.substr(6).replace('?', '+') + '.res.txt', 'aa' + x))
    .catch(console.error)
*/
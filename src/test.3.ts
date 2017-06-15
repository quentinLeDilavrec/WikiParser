/// <reference path="../node_modules/@types/node/index.d.ts" />
import * as fs from 'fs'

import * as https from 'https'
import * as rp from 'request-promise-native'

let page = 'https://en.wikipedia.org/w/api.php?action=query&list=categorymembers&cmtitle=Category:Sports&format=json'



function doRequests(acc: any[], url: string, callback = console.log, conti = '') {
    rp(url + '&cmcontinue=' + conti).then(x => {
        let tmp = JSON.parse(x);
        (tmp.continue == undefined) ?
            callback(acc.concat(tmp.query.categorymembers)) :
            doRequests(acc.concat(tmp.query.categorymembers), url, callback, tmp.continue.cmcontinue)
    }).catch(console.error)
}

let affichage = x =>
    console.log(
        (x =>
            [x.filter(x => x.substr(0, 8) != 'Category'),
            x.filter(x => x.substr(0, 8) == 'Category')]
        )(x.map(x => x.title)))

doRequests([], page, affichage)
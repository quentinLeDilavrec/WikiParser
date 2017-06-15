import * as fs from 'fs'


import * as uplet from './tree2uplet';

import * as tree from './html2tree';

let noeud = JSON.parse(fs.readFileSync('D:\\acquiBD\\fetchResult\\Lists_of_cities_by_country.json').toString()) as tree.Noeud;
let a = (new uplet.Tree2uplet()).pairify(noeud, (x => '("' + x[0] + '", "' + x[1] + '")')).join(',\n')
fs.writeFileSync('D:\\acquiBD\\fetchResult\\Lists_of_cities_by_country.sql', a)

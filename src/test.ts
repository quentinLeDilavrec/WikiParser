import * as web2bd from './web2bd'
import * as fs from 'fs'

let BDcreator = new web2bd.Web2bd();
/*BDcreator.compute('/wiki/List_of_lists_of_lists')
    .save('test01')
    .save('test01', web2bd.BDType.sql)
    .save('test01', web2bd.BDType.csv)*/

//(new web2bd.Web2bd()).build();
//(new web2bd.Web2bd(new web2bd.Web2bdOptions(1, undefined, undefined, undefined, ["%cities%"], 40))).build()
//(new web2bd.Web2bd(new web2bd.Web2bdOptions(1, undefined, undefined, undefined, ["%film%"], 40))).build()
let page: string =
    //'Materials_science'
    //'List_of_engineering_branches'
    //'List_of_healthcare_occupations'
    //'List_of_metalworking_occupations'
    'List_of_film_and_television_occupations'
//'List_of_theatre_personnel'
//'List_of_sewing_occupations'
//'Lists_of_occupations'
//'List_of_important_publications_in_computer_science'
//'Computer_professional'
//'List_of_home_video_game_consoles'
//'List_of_cultural_references_to_the_September_11_attacks'
//'Carpentry'
//'Lists_of_military_aircraft_by_nation'
//'Aviation_lists'
//'List_of_Desert_Island_Discs_episodes'
//'Generational_list_of_programming_languages'
//'List_of_programming_languages_by_type'
//'Lists_of_cities_by_country'//TODO rechopper les lists de villes
//'List_of_2014_box_office_number-one_films_in_Spain'
//'Lists_of_box_office_number-one_films'//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!table proof passed 30/05/17
//'Lists_of_films'
//console.dir(
//BDcreator.compute("/wiki/")
//BDcreator.compute("/wiki/")
function callback(err) { if (err) console.log(err) }
require('child_process').exec('start chrome "https://en.wikipedia.org/wiki/' + page + '"', callback);
(x => { x; require('child_process').exec('D:\\acquiBD\\fetchResult\\' + page + '.json', callback) })(BDcreator.compute("/wiki/" + page))
//BDcreator.compute("/wiki/")
//BDcreator.compute("/wiki/")
//BDcreator.compute("/wiki/")
//BDcreator.compute("/wiki/")// chaud
//BDcreator.compute("/wiki/Lists_of_highest-grossing_films")
//BDcreator.compute("/wiki/List_of_cities_in_Algeria")
//BDcreator.compute("/wiki/List_of_lists_of_lists")
//BDcreator.compute("/wiki/List_of_sovereign_states_and_dependent_territories_by_continent")
//require('child_process').exec('C:\\xampp\\php\\php.exe -f ' + 'index.php', (error, stdout, stderr) => (error) ? console.error(error) : console.log(stdout))
//if (fs.existsSync('D:\\acquiBD\\fetchResult\\' + page + '.json')) require('child_process').exec('D:\\acquiBD\\fetchResult\\' + page + '.json', callback);
//require('child_process').exec('D:\\acquiBD\\fetch\\' + page + '.html', callback);
console.log('gg')
//let Exemple1ArgMap = <T>(l:Array<T>)=>l.map(x=>x.toString())
//)*ou entités
/*
sources http://www.worldpopdata.org/data
Pays    Population mid-2016 (millions)  ranking
China	1, 378	1
India	1, 328.9	2
United States	323.9	3
Indonesia	259.4	4
Brazil	206.1	5
Pakistan	203.4	6
Nigeria	186.5	7
Bangladesh	162.9	8
Russia	144.3	9
Mexico	128.6	10
Japan	125.3	11
Philippines	102.6	12
Ethiopia	101.7	13
Egypt	93.5	14
Vietnam	92.7	15
Germany	82.6	16
Congo, Dem.Rep.	79.8	17
Iran	79.5	18
Turkey	79.5	19
United Kingdom	65.6	20
Thailand	65.3	21
France	64.6	22
Italy	60.6	23
South Africa	55.7	24
Tanzania	54.2	25
Myanmar	52.4	26
Korea, South	50.8	27
Colombia	48.8	28
Kenya	45.4	29
Argentina	43.6	30
Spain	43.3	31
Ukraine	42.7	32
Sudan	42.1	33
Algeria	40.8	34
Poland	38.4	35
Iraq	38.1	36
Uganda	36.6	37
Canada	36.2	38
Morocco	34.7	39
Afghanistan	33.4	40
Uzbekistan	31.9	41
Saudi Arabia	31.7	42
Peru	31.5	43
Venezuela	31	44
Malaysia	30.8	45
Nepal	28.4	46
Ghana	28.2	47
Yemen	27.5	48
Mozambique	27.2	49
Angola	25.8	50
Korea, North	25.1	51
Cameroon	24.4	52
Australia	24.1	53
Cote D'ivoire	23.9	54
Madagascar	23.7	55
Taiwan	23.5	56
Sri Lanka	21.2	57
Romania	19.8	58
Niger	19.7	59
Burkina Faso	19	60
Chile	18.2	61
Kazakhstan	17.8	62
Mali	17.3	63
Malawi	17.2	64
Syria	17.2	65
Netherlands	17	66
Guatemala	16.6	67
Ecuador	16.5	68
Zimbabwe	16	69
Zambia	15.9	70
Cambodia	15.8	71
Senegal	14.8	72
Chad	14.5	73
South Sudan	12.7	74
Rwanda	11.9	75
Tunisia	11.3	76
Belgium	11.3	77
Cuba	11.2	78
Guinea	11.2	79
Burundi	11.1	80
Haiti	11.1	81
Somalia	11.1	82
Bolivia	11	83
Benin	10.8	84
Greece	10.8	85
Dominican Republic	10.6	86
Czech Republic	10.6	87
Portugal	10.3	88
Sweden	9.9	89
Hungary	9.8	90
Azerbaijan	9.8	91
Belarus	9.5	92
United Arab Emirates	9.3	93
Austria	8.8	94
Tajikistan	8.6	95
Switzerland	8.4	96
Israel	8.2	97
Honduras	8.2	98
Jordan	8.2	99
Papua New Guinea	8.2	100
Togo	7.5	101
China, Hong Kong Sar	7.4	102
Bulgaria	7.1	103
Laos	7.1	104
Serbia	7.1	105
Paraguay	7	106
Sierra Leone	6.6	107
El Salvador	6.4	108
Libya	6.3	109
Nicaragua	6.3	110
Lebanon	6.2	111
Kyrgyzstan	6.1	112
Denmark	5.7	113
Singapore	5.6	114
Finland	5.5	115
Turkmenistan	5.4	116
Slovakia	5.4	117
Eritrea	5.4	118
Norway	5.2	119
Central African Republic	5	120
Costa Rica	4.9	121
Congo	4.9	122
Palestinian Territory	4.8	123
New Zealand	4.7	124
Ireland	4.7	125
Liberia	4.6	126
Oman	4.4	127
Croatia	4.2	128
Mauritania	4.2	129
Kuwait	4	130
Panama	4	131
Georgia	4	132
Moldova	3.6	133
Bosnia - herzegovina	3.5	134
Uruguay	3.5	135
Puerto Rico	3.4	136
Mongolia	3.1	137
Armenia	3	138
Albania	2.9	139
Lithuania	2.9	140
Jamaica	2.7	141
Namibia	2.5	142
Qatar	2.5	143
Botswana	2.2	144
Lesotho	2.2	145
Gambia	2.1	146
Macedonia	2.1	147
Slovenia	2.1	148
Latvia	2	149
Guinea - bissau	1.9	150
Gabon	1.8	151
Kosovo	1.8	152
Bahrain	1.4	153
Trinidad And Tobago	1.4	154
Estonia	1.3	155
Swaziland	1.3	156
Timor - leste	1.3	157
Mauritius	1.3	158
Cyprus	1.2	159
Djibouti	0.9	160
Fiji	0.9	161
Equatorial Guinea	0.9	162
Reunion	0.8	163
Comoros	0.8	164
Bhutan	0.8	165
Guyana	0.8	166
Solomon Islands	0.7	167
China, Macao Sar	0.7	168
Montenegro	0.6	169
Western Sahara	0.6	170
Luxembourg	0.6	171
Suriname	0.5	172
Cape Verde	0.5	173
Malta	0.4	174
Brunei	0.4	175
Maldives	0.4	176
Guadeloupe	0.4	177
Bahamas	0.4	178
Belize	0.4	179
Martinique	0.4	180
Iceland	0.3	181
Vanuatu	0.3	182
Barbados	0.3	183
New Caledonia	0.3	184
French Polynesia	0.3	185
French Guiana	0.3	186
Mayotte	0.2	187
Sao Tome And Principe	0.2	188
Samoa	0.2	189
Guam	0.2	190
Saint Lucia	0.2	191
Channel Islands	0.2	192
Curacao	0.2	193
Kiribati	0.1	194
Grenada	0.1	195
St.Vincent And The Grenadines	0.1	196
Tonga	0.1	197
Federated States Of Micronesia	0.1	198
Seychelles	0.1	199
Antigua And Barbuda	0.1	200
Andorra	0.1	201
Dominica	0.1	202
Marshall Islands	0.1	203
St.Kitts - nevis	0.1	204
Monaco	0	205
Liechtenstein	0	206
San Marino	0	207
Palau	0	208
Tuvalu	0	209
Nauru	0	210
*/
/*
Poster name	Color	Sizes available
Zodiac	Full color	A2	A3	A4
Black and white	A1	A2	A3
Sepia	A3	A4	A5
Angels	Black and white	A1	A3	A4
Sepia	A2	A3	A5
*/
/*---- gg comme example
    < table >
    <col>
    <colgroup span="2" > </colgroup>
        < colgroup span= "2" > </colgroup>
            < tr >
            <td rowspan="2" > </td>
                < th colspan= "2" scope= "colgroup" > Mars < /th>
                    < th colspan= "2" scope= "colgroup" > Venus < /th>
                        < /tr>
                        < tr >
                        <th scope="col" > Produced < /th>
                            < th scope= "col" > Sold < /th>
                                < th scope= "col" > Produced < /th>
                                    < th scope= "col" > Sold < /th>
                                        < /tr>
                                        < tr >
                                        <th scope="row" > Teddy Bears< /th>
                                            < td > 50, 000 < /td>
                                            < td > 30, 000 < /td>
                                            < td > 100, 000 < /td>
                                            < td > 80, 000 < /td>
                                            < /tr>
                                            < tr >
                                            <th scope="row" > Board Games< /th>
                                                < td > 10, 000 < /td>
                                                < td > 5, 000 < /td>
                                                < td > 12, 000 < /td>
                                                < td > 9, 000 < /td>
                                                < /tr>
                                                < /table>
                                                */


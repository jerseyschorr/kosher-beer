/*global $,_*/

class Beer {

    constructor() {

        this.bar = $('#bar');
        this.bar.html('<h2>Loading...</h2>');
        this.food = $('#food');
        this.symbols = {
            'Rabbi Eliezer Simcha Weisz': {
                'type': 'text'
            },
            'Rabbi Eliyahu (Israel)': {
                'type': 'text'
            },
            'OU': {
                'img':'ou',
                'width':24
            },
            'KLBD': {
                'img':'klbd',
                'width':33
            },
            'Star-K': {
                'img':'Star-K',
                'width':25
            },
            'cRc': {
                'img':'crc',
                'width':25
            },
            'Vaad of Kansas City': {
                'img':'kansas-city',
                'width':27
            }
        };

        if (window.beerlist) {

            this.data = window.beerlist;
            this.bar.empty();
            $('footer').html(`<p>For personal use only.<br>Last Updated on ${window.beerlist.lastupdated}</p>`);

            $('#srch').on('keyup', () => {
                // IGNORE KEYS
                if (this.observer) {
                    clearTimeout(this.observer);
                }
                this.observer = setTimeout(this.searchdata.bind(this), 50);
            });
        }
    }

    sortNumber(a, b) {
       return a - b;
    }

    getIndicesOf(searchStr) {

        if (this.data.search.hasOwnProperty(searchStr)) {
            return this.data.search[searchStr];
        }
        return null;
    }

    getKosherInfo(ksr) {
        if (this.symbols[ksr]) {
            return this.symbols[ksr];
        }
        return null;
    }

    searchdata() {

        const stuff = {};
        const search = $('#srch').val().trim();

        let itemList = [];
        this.food.empty();

        if (search.length > 2) {

            const sparts = search.split(/\W+/);
            for (const ref in sparts) {
                const sp = sparts[ref];
                if (sp.length > 2) {
                    const re = new RegExp(`(\\w*${sp}\\w*)`, 'ig');
                    const itemKey = this.data.keylist.match(re);

                    let tmp = [];
                    for (const ref in itemKey) {
                        const itms = this.data.search[itemKey[ref]];
                        tmp = _.union(tmp, itms);
                    }
                    if (itemList.length === 0) {
                        itemList = tmp;
                    }
                    else {
                        itemList = _.intersection(itemList, tmp);
                    }
                }
            }
        }

        if (itemList && itemList.length > 0) {
            itemList.sort(this.sortNumber);
            for (const ref in itemList) {
                const itm = itemList[ref];
                if ($(`#${itm}`).length === 0) {
                    const s = this.data.booze[itm];
                    if (s && s[1]) {
                        if (stuff.hasOwnProperty(s[1]) === false) {
                            stuff[s[1]] = [];
                        }
                        stuff[s[1]].push({
                            'id': itm,
                            'brand': s[0],
                            'prod': s[2],
                            'ksr': s[3],
                            'stat': s[4],
                            'misc': s[5]
                        });
                    }
                }
            }

            const key = Object.keys(stuff);
            for (const ref in key) {
                const s = key[ref];
                let tbl = `<tr><th colspan="4">${s}</th></tr>`;
                this.food.append(tbl).fadeIn();
                const key2 = Object.keys(stuff[s]);
                for (const ref2 in key2) {
                    const t = key2[ref2];
                    const u = stuff[s][t];
                    let noLabel = true;
                    if (u.ksr.indexOf('*') > -1) {
                        noLabel = false;
                        u.ksr = u.ksr.replace('*', '');
                    }
                    if ($(`#${u.id}`).length === 0) {
                        tbl = `<tr id="${u.id}"`;
                        if (u.misc) {
                            tbl += ' class="hasmisc"';
                        }
                        tbl += `><td>${u.brand}</td><td>${u.prod}</td><td class="ksr`;

                        const ksrinfo = this.getKosherInfo(u.ksr);

                        if (u.stat === 0 || (ksrinfo !== null && ksrinfo.type === 'text')) {
                            tbl += ' xsml';
                        }

                        if (u.stat === 1 && noLabel) {
                            tbl += ' fade';
                        }

                        tbl += '">';
                        if (u.stat === 0) {
                            tbl += 'Not Kosher';
                        }
                        else if (ksrinfo !== null && ksrinfo.img) {
                            tbl += `<img class="ksrimg" src="img/${ksrinfo.img}.png" height="24" width="${ksrinfo.width}" alt="${u.ksr}" />`;
                        }
                        else {
                            tbl += u.ksr;
                        }

                        tbl += '</td></tr>';

                        if (u.misc) {
                            tbl += `<tr class="misc"><td colspan="3">${u.misc}</td></tr>`;
                        }

                        this.food.append(tbl).fadeIn();
                        const $tr = $(`#${u.id}`);

                        if (u.stat === 0) {
                             $tr.addClass('nk');
                        }

                    }
                }
            }
        }
    }
}

window.Beer = new Beer();

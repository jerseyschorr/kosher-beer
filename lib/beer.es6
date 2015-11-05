/*global $,_*/

class Beer {

    constructor() {

        this.bar = $('#bar');
        this.bar.html('<h2>Loading...</h2>');
        this.food = $('#food');

        if (window.beerlist) {

            console.log('got it!');

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

    getIndicesOf(searchStr) {

        if (this.data.search.hasOwnProperty(searchStr)) {
            return this.data.search[searchStr];
        }
        return null;
        /*
        const searchtxtLength = this.data.searchtxt.length;
        let startIndex = 0;
        let indices = [];
        let keepLooking = true;

        // Find Search Text
        while (keepLooking) {
            const index = this.data.searchtxt.indexOf(searchStr, startIndex);
            if (index === -1 || startIndex >= searchtxtLength) {
                keepLooking = false;
            }
            else {
                const startitems = this.data.searchtxt.indexOf(':', index + 1);
                let enditems   = this.data.searchtxt.indexOf('|', startitems + 2);
                if (enditems === -1) {
                    enditems = searchtxtLength;
                }
                indices = indices.concat(this.data.searchtxt.substring(startitems + 1, enditems).split(','));
                startIndex = enditems + 1;
            }
        }
        return indices;
        */
    }

    searchdata() {

        console.log('searchdata?', this.data);
        //const tbl = '';
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
                    console.log(itemKey);

                    let tmp = [];
                    for (const ref in itemKey) {
                        console.log('key', itemKey[ref]);
                        const itms = this.data.search[itemKey[ref]];
                        tmp = _.union(tmp, itms);
                        console.log('tmp>', tmp);
                    }
                    if (itemList.length === 0) {
                        itemList = tmp;
                    }
                    else {
                        itemList = _.intersection(itemList, tmp);
                    }
                }
            }
            // itemList = _.uniq(itemList);
        }

        if (itemList && itemList.length > 0) {
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
                            'stat': s[4]
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
                        // if (u.misc) {
                        //     tbl += ' class="hasmisc"';
                        // }
                        tbl += `><td>${u.brand}</td><td>${u.prod}</td>`;

                        if (u.stat === 0) {
                            tbl += '<td colspan="2">Not Kosher</td>';
                        }
                        else {
                            if (noLabel === true) {
                                tbl += '<td class="fade">';
                            }
                            else {
                                tbl += '<td>';
                            }
                            if (u.ksr === 'OU') {
                                tbl += '<img src="ou.png" height="24" width="24" alt="Orthodox Union" />';
                            }
                            else {
                                tbl += u.ksr;
                            }
                            tbl += '</td>';
                        }
                        tbl += '</tr>';
                        // if (u.misc) {
                        //     tbl += `<tr class="misc"><td></td><td colspan="3">${u.misc}</td></tr>`;
                        // }
                        this.food.append(tbl).fadeIn();
                         const $tr = $(`#${u.id}`);
                        if (u.stat === 0) {
                             $tr.addClass('nk');
                        }
                        // else if ((u.stat & 1) === 1) {
                        //     $tr.addClass('parve');
                        // }
                        // else if ((u.stat & 2) === 2) {
                        //     $tr.addClass('dairy');
                        // }
                        // else if ((u.stat & 4) === 4) {
                        //     $tr.addClass('meat');
                        // }

                    }
                }
            }
        }
    }
}

window.Beer = new Beer();
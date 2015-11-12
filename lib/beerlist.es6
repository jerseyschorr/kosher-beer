class BeerList {

    constructor() {
        this.data = {
            'booze': [null],
            'search': {},
            'keylist': ''
        };
        this.idx = 1;
    }

    add(type, brand, product, hechsher='', status=1, misc='') {

        const data = [brand, type, product, hechsher, status, misc];
        const work = [];
        this.data.booze[this.idx] = data;

        for (let i = 0; i < data.length - 3; i += 1) {
            const strlist = data[i].toString().split(' ');
            for (let j = 0; j < strlist.length; j += 1) {
                if (work.indexOf(strlist[j]) === -1) {
                    const str = strlist[j].toLocaleUpperCase().replace(/[^A-Z]/g, '');
                    if (str.length > 2) {
                        work.push(str);
                        if (!this.data.search.hasOwnProperty(str)) {
                            this.data.search[str] = [];
                        }
                        this.data.search[str].push(this.idx);
                    }
                }
            }
        }
        this.idx += 1;
    }

    makeList() {
        const list = Object.keys(this.data.search).join('|');
        this.data.keylist = `|${list}|`;
        return false;
    }

    print() {
        console.log(this.data.booze);
    }
}


if (window.beerdata) {
    const BL = new BeerList();

    for (let i = 0; i < window.beerdata.length; i += 1) {
        const ref = window.beerdata[i];

        let ksr = ref.Kosher;
        let status = 1;
        if (ksr === 0) {
            ksr = '';
            status = 0;
        }
        BL.add(ref.Type, ref.Brand, ref.Product, ksr, status, ref.Misc);
    }

    BL.makeList();
    window.beerlist = BL.data;
}

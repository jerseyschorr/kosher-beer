class BeerList {

    constructor() {
        this.data = {
            'booze': [null],
            'search': {},
            'keylist': ''
        };
        this.idx = 1;
    }

    add(type, brand, product, hechsher='', status=1, misc="") {

        const data = [brand, type, product, hechsher, status, misc];
        const work = [];
        this.data.booze[this.idx] = data;

        for (let i = 0; i < data.length - 2; i += 1) {
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
        //["Muller", "Yoghurt Drinks", "Vitality Strawberry", 2]
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
        // {"Type":"Beer","Brand":800,"Product":"Ice Beer","Kosher":"OU*","Misc":"","Src":1},
        // {"Type":"Beer","Brand":"21st Amendment Brewery","Product":"Assorted Varieties","Kosher":0,"Misc":"","Src":1},

        let ksr = ref.Kosher;
        let status = 1;
        if (ksr === 0) {
            ksr = '';
            status = 0;
        }
        BL.add(ref.Type, ref.Brand, ref.Product, ksr, status, ref.Misc);
    }
    // BL.add('800', 'Beer', 'Ice Beer', 'OU');
    // BL.add('Alexander', 'Beer', 'Assorted Varieties', 'Rabbi Eliezer Simcha Weisz');
    // BL.add('Anchor Brewing', 'Beer', 'Anchor Bock Beer', 'CRC');
    // BL.add('Anchor Brewing', 'Beer', 'Anchor California Lager', 'CRC');
    // BL.add('Anchor Brewing', 'Beer', 'Anchor Porter', 'CRC');
    // BL.add('Anchor Brewing', 'Beer', 'Anchor Small Beer', 'CRC');
    // BL.add('Anchor Brewing', 'Beer', 'Anchor Steam Beer', 'CRC');
    // BL.add('Anchor Brewing', 'Beer', 'Anchor Summer Beer', 'CRC');
    // BL.add('Anchor Brewing', 'Beer', 'Brekle’s Brown', 'CRC');
    // BL.add('Anchor Brewing', 'Beer', 'Humming Ale', 'CRC');
    // BL.add('Anchor Brewing', 'Beer', 'Liberty Ale', 'CRC');
    // BL.add('Anchor Brewing', 'Beer', 'Old Foghorn Ale', 'CRC');
    // BL.add('Asahi', 'Beer', 'Black', 'CRC');
    // BL.add('Asahi', 'Beer', 'Select', 'CRC');
    // BL.add('Asahi', 'Beer', 'Super Dry', 'CRC');
    // BL.add('Aspen Edge', 'Beer', 'Lager', 'OU');
    // BL.add('Blue Moon', 'Beer', 'Agave Blonde Ale', 'OU');
    // BL.add('Blue Moon', 'Beer', 'Belgian Style Pale Ale', 'OU');
    // BL.add('Blue Moon', 'Beer', 'Belgian White Ale', 'OU');
    // BL.add('Blue Moon', 'Beer', 'Blackberry Tart Ale', 'OU');
    // BL.add('Blue Moon', 'Beer', 'Caramel Apple Spiced Ale', 'OU');
    // BL.add('Blue Moon', 'Beer', 'Full Moon Winter Ale', 'OU');
    // BL.add('Blue Moon', 'Beer', 'Gingerbread Spiced Ale', 'OU');
    // BL.add('Blue Moon', 'Beer', 'Gran Cru', 'OU');
    // BL.add('Blue Moon', 'Beer', 'Harvest Moon Pumpkin Ale', 'OU');
    // BL.add('Blue Moon', 'Beer', 'Mountain Abbey Ale', 'OU');
    // BL.add('Blue Moon', 'Beer', 'Pale Ale', 'OU');
    // BL.add('Blue Moon', 'Beer', 'Peanut Butter Ale', 'OU');
    // BL.add('Blue Moon', 'Beer', 'Pine in the Neck Ale', 'OU');
    //const beerlist = {}

    BL.makeList();
    window.beerlist = BL.data;
}

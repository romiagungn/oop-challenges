class CarFactory {
    constructor() {
        this.number = [(Math.floor(Math.random() * 4) + 1)];
    }
    buildCar() {
        let hasil = [];
        let merci = new Merci(2, 4);
        for (let i = 0; i < this.number; i++) {
            hasil.push(merci.rakitMerci());
        }
        console.log(hasil);
    }

}
class Car {
    constructor(pintu, kursi) {
        this.pintu = [(Math.floor(Math.random() * 4) + 1)];
        this.kursi = [(Math.floor(Math.random() * 4) + 1)];
        this.tyre = new Tyre();
    }
    garansi() {
        let asuransi = [(Math.floor(Math.random() * 4) + 1)];
        return asuransi;
    }
}
class Tyre {
    constructor() {
        const merk = ['FDR', 'IRC', 'bridgestone', 'achillies', 'CORSA','SWALLOW'];
        this.merkBan = merk[Math.floor(Math.random() * 5) + 1];
    }

}

class Merci extends Car {
    rakitMerci() {
        let newMercy = {
            merk : 'E305',
            pintu : `${this.pintu}`,
            kursi : `${this.kursi}`,
            garansi : `${this.garansi()} tahun`,
            ban : `${this.tyre.merkBan}`
        }
        return newMercy;
    }
}

let cars = new CarFactory;
cars.buildCar();
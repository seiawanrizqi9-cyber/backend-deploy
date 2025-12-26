abstract class Shape {
    abstract luas(): number;
    abstract keliling(): number;

    deskripsi (): string {
        return `Bangun ini memiliki luas ${this.luas()} dan keliling ${this.keliling()}`; 
    }
}

export class Persegi extends Shape {
    constructor(private sisi: number) {
        super();
    }
    luas(): number {
        return this.sisi * this.sisi;
    }
    keliling(): number {
        return this.sisi * 4;
    }
}

export class Lingkaran extends Shape {
    constructor(private radius: number) {
        super();
    }
    luas(): number {
        return Math.PI * this.radius ** 2;
    }
    keliling(): number {
        return 2 * Math.PI * this.radius;
    }
}

const persegi = new Persegi(2);
console.log(persegi.deskripsi());

const lingkaran = new Lingkaran(2);
console.log(lingkaran.deskripsi());
export class Bank {
    nama: string
    alamat: string

    constructor(nama: string, alamat: string) {
        this.nama = nama
        this.alamat = alamat
    }

    getNama() {
        console.log(this.nama)
    }

    getAlamat() {
        console.log(this.alamat)
    }
}
import { Bank } from "./bank";

export class akunBank extends Bank {
  public constructor(
    public bank: Bank,
    public pemilik: string,
    private saldo: number,
    protected noRekening: string
  ) {
    super(bank.nama, bank.alamat);
  }

  getPemilik() {
    console.log(this.pemilik);
  }

  getSaldo() {
    console.log(this.saldo);
  }

  getNoRekening() {
    console.log(this.noRekening);
  }

  deposit(jumlah: number) {
    if (jumlah <= 0) {
      return console.error("Jumlah deposit harus lebih besar dari 0");
    }

    this.saldo += jumlah;
  }

  withdraw(jumlah: number) {
    if (jumlah <= 0) {
      return console.error("saldo tidak cukup");
    }

    this.saldo -= jumlah;
  }
}

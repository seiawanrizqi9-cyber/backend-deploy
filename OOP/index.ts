import { Bank } from "./bank";
import { akunBank } from "./akun";

const BNI = new Bank("BNI", "Jakarta Pusat");
const BCA = new Bank("BCA", "Jakarta Barat");

const rizqi = new akunBank(BNI, "Rizqi", 1000000, "123456789");

// BNI.getNama();
// BNI.getAlamat();
// BCA.getNama()
// BCA.getAlamat();

rizqi.getPemilik();
rizqi.getSaldo();
rizqi.getNoRekening();

rizqi.deposit(100000);
rizqi.getSaldo();
rizqi.withdraw(500000);
rizqi.getSaldo();
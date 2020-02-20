const readline = require('readline');
const Table = require('cli-table');
const sqlite3 = require('sqlite3').verbose();
const dbFile = __dirname + "/university.db";

let db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
    if (err) throw err;
    // console.log("Koneksi ke database berhasil!");
});
module.exports = db;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log(`
=========================================================
Welcome to Universitas Pendidikan Indonesia
JL. Setiabudi No.255
=========================================================
`);
    rl.question(`username :`, (username) => {
        console.log(`=========================================================`);
        rl.question(`password :`, (password) => {
            console.log(`=========================================================`);

            db.serialize(function () {

                let sql = `SELECT * FROM users WHERE username == '${username}' AND password == '${password}'`;
                db.get(sql, (err, rows) => {
                    if (err) throw err;
                    if (rows) {
                        console.log(`Welcome, ${rows.username}. YOUR access level is: ${rows.user}`);
                        mainmenu();
                    }
                    else {
                        console.log("USERNAME atau PASSWORD salah men!!!");
                    }
                })
            })
        })
    })

function mainmenu() {
    console.log(`
=========================================================
silahkan pilih opsi dibawah ini
[1] Mahasiswa
[2] Jurusan
[3] Dosen
[4] Mata Kuliah
[5] Kontrak
[6] Keluar
=========================================================`);
    rl.question(`masukkan salah satu no. dari opsi diatas : `, (number) => {
        switch (number) {
            case '1':
                mahasiswa();
                break;
            case '2':
                jurusan();
                break;
        }
    })
}

function mahasiswa() {
console.log(`
=========================================================
silahkan pilih opsi dibawah ini
[1] Daftar Murid
[2] Cari Murid
[3] Tambah Murid
[4] Hapus Murid
[5] Keluar
=========================================================`);
    rl.question(`masukkan salah satu no. dari opsi diatas : `, (number) => {
        console.log('=========================================================')
        switch (number) {
            case '1':
                daftarmurid();
                break;
            case '2':
                carimurid();
                break;
            case '3':
                tambahmurid();
                break;
            case '4':
                deletemurid();
                break;
            case '5':
                mainmenu();
        }
    })
};

function daftarmurid() {
    console.log("=========================================================");
    db.serialize(function () {

        let sql = `SELECT nim, nama, alamat, nama_jurusan, umur FROM mahasiswa JOIN jurusan ON mahasiswa.jurusan = jurusan.id_jurusan`;
        // `SELECT nim, nama, alamat, nama_jurusan, umur FROM mahasiswa JOIN jurusan ON mahasiswa.jurusan = jurusan.id_jurusan`

        db.all(sql, (err, rows) => {
            if (err) throw err;
            if (rows) {
                var table = new Table({
                    head: ['nim', 'nama', 'alamat', 'jurusan', 'umur'],
                    colWidths: [10, 10, 10, 20, 10]
                });
                rows.forEach(rows => {
                    table.push(
                        [`${rows.nim}`, `${rows.nama}`, `${rows.alamat}`, `${rows.nama_jurusan}`, `${rows.umur}`]
                    );
                });
                console.log(table.toString());
                mahasiswa();


                //console.log(`${rows.nim}, ${rows.nama}, ${rows.alamat}, ${rows.jurusan}, ${rows.umur} `);
            }
            else {
                console.log("DATA TIDAK BISA DITEMUKAN!!!");
            }
        });
    });
    rl.close()
}

function carimurid() {
    rl.question(`Masukan Nim: `, (nim) => {
        let sql = `SELECT nim, nama, alamat, nama_jurusan, umur FROM mahasiswa JOIN jurusan ON mahasiswa.jurusan = jurusan.id_jurusan WHERE nim = '${nim}'`
        db.get(sql, (err, rows) => {
            if (err) throw err;

            if (rows) {
                console.log(`
=========================================================
Student Detail
=========================================================
ID      : ${rows.nim}
NAMA    : ${rows.nama}
ALAMAT  : ${rows.alamat}
JURUSAN : ${rows.nama_jurusan}
UMUR    : ${rows.umur} tahun
`);
                mahasiswa();
            } else {
                console.log(`Mahasiswa dengan nim ${nim} tidak terdaftar`)
                mahasiswa();
            }
        })
    })
};

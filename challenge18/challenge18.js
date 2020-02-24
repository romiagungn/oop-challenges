const readline = require('readline');
const Table = require('cli-table');
const sqlite3 = require('sqlite3').verbose();
const dbFile = __dirname + "/university.db";

let db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
    if (err) throw err;
    // console.log("Koneksi ke database berhasil!");
});

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function login() {
    console.log(`
=========================================================
Welcome to Universitas Pendidikan Indonesia
JL. Setiabudi No.255
=========================================================
`);
    rl.question('username: ', (username) => {
        console.log(`=========================================================`)
        rl.question('password: ', (password) => {
            console.log(`=========================================================`)

            let sql = `SELECT * FROM users WHERE username == '${username}' AND password == '${password}'`;
            db.get(sql, (err, rows) => {
                if (err) throw err;
                if (rows) {
                    console.log(`Welcome, ${rows.username}. YOUR access level is: ${rows.user}`);
                    mainmenu();
                }
                else {
                    console.log("USERNAME atau PASSWORD salah men!!!");
                    login();
                }
            })
        })
    })
}

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
            case '3':
                dosen();
                break;
            case '4':
                matakuliah();
                break;
            case '5':
                kontrak();
                break;
            case '6':
                console.log("=========================================================");
                console.log("kamu telah keluar.");
                login();
                break;
            default:
                console.log(`=========================================================
maaf number yang anda inputkan salah`);
                mainmenu();
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

function tambahmurid() {
    console.log(`
=========================================================
lengkapi data dibawah ini :
    `)
    rl.question('NIM : ', (nim) => {
        rl.question('NAMA : ', (nama) => {
            rl.question('ALAMAT : ', (alamat) => {
                rl.question('JURUSAN : ', (jurusan) => {
                    rl.question('UMUR : ', (umur) => {
                        let sql = `INSERT INTO mahasiswa (nim, nama, alamat, jurusan, umur) values ('${nim}', '${nama}', '${alamat}', '${jurusan}', '${umur}')`;
                        db.run(sql, (err) => {
                            if (err) throw err;
                            console.log("Data Mahasiswa Berhasil di input")
                        });

                        let sql2 = `SELECT nim, nama, alamat, nama_jurusan, umur FROM mahasiswa JOIN jurusan ON mahasiswa.jurusan = jurusan.id_jurusan`;
                        db.all(sql2, (err, rows) => {
                            if (err) throw err;
                            if (rows) {
                                // console.log('selamat data yang anda masukan berhasil')

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


                            } else {
                                console.log('data yang anda masukan salah');
                                mahasiswa();
                            }
                        })
                    })
                })
            })
        })
    })
}

function deletemurid() {
    rl.question('masukan NIM yang akan di hapus : ', (nim) => {
        let sql = `DELETE FROM mahasiswa WHERE nim = '${nim}'`;
        let sql2 = `SELECT nim, nama, alamat, nama_jurusan, umur FROM mahasiswa JOIN jurusan ON mahasiswa.jurusan = jurusan.id_jurusan`;
        db.run(sql, (err) => {
            if (!err) console.log(`mahasiswa dengan NIM : '${nim}' telah dihapus`);
            console.log("=========================================================")


            db.all(sql2, (err, rows) => {
                if (err) throw err;
                if (rows) {
                    // console.log('selamat data yang anda masukan berhasil')

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


                } else {
                    console.log('data yang anda masukan salah');
                    mahasiswa();
                }
            })
        })

    })

}
function jurusan() {
    console.log(`
=========================================================
silahkan pilih opsi dibawah ini
[1] Daftar Jurusan
[2] Cari Jurusan
[3] Tambah Jurusan
[4] Hapus Jurusan
[5] Keluar
=========================================================`)
    rl.question(`masukan salah satu no. dari opsi diatas : `, (number) => {
        console.log('=========================================================');
        switch (number) {
            case '1':
                daftarjurusan();
                break;
            case '2':
                carijurusan();
                break;
            case '3':
                tambahjurusan();
                break;
            case '4':
                hapusjurusan();
                break;
            case '5':
                mainmenu();
        }
    })
};

function daftarjurusan() {
    console.log("=========================================================");
    db.serialize(function () {
        let sql = 'SELECT * FROM jurusan';

        db.all(sql, (err, rows) => {
            if (err) throw err;
            if (rows) {
                var table = new Table({
                    head: ['ID JURUSAN', 'NAMA JURUSAN'],
                    colWidths: [20, 20]
                })
                rows.forEach(rows => {
                    table.push([`${rows.id_jurusan}`, `${rows.nama_jurusan}`]);
                })
                console.log(table.toString());
                jurusan();
            }
            else {
                console.log("DATA TIDAK BISA DI TEMUKAN!!!");
                jurusan();
            }
        })
    })
}

function carijurusan() {
    rl.question(`MASUKAN ID JURUSAN: `, (answer) => {
        let sql = `SELECT * FROM jurusan WHERE id_jurusan = '${answer}'`
        db.get(sql, (err, rows) => {
            if (err) throw err;
            if (rows) {
                console.log(`
=========================================================
JURUSAN DETAIL
=========================================================
ID JURUSAN      : ${rows.id_jurusan}
NAMA JURUSAN    : ${rows.nama_jurusan}
`);
                jurusan();
            } else {
                console.log(`ID jurusan dengan ID : ${answer} tidak ditemukan`);
                jurusan();
            }
        })
    })
}

function tambahjurusan() {
    console.log(`
=========================================================
Lengkapi Data dibawah ini :
        `)
    rl.question('ID JURUSAN : ', (id) => {
        rl.question('NAMA JURUSAN : ', (nama) => {
            let sql = `INSERT INTO jurusan (id_jurusan,nama_jurusan) VALUES ('${id}','${nama}')`;
            db.run(sql, (err) => {
                if (err) throw err;
                console.log("Data Jurusan Berhasil di Input");
            });

            let sql2 = 'SELECT * FROM jurusan';
            db.all(sql2, (err, rows) => {
                if (err) throw err;
                if (rows) {
                    var table = new Table({
                        head: ['ID JURUSAN', 'NAMA JURUSAN'],
                        colWidths: [10, 20]
                    })
                    rows.forEach(rows => {
                        table.push([`${rows.id_jurusan}`, `${rows.nama_jurusan}`]);
                    })
                    console.log(table.toString());
                    jurusan();
                }
                else {
                    console.log("DATA TIDAK BISA DI TEMUKAN!!!");
                    jurusan();
                }
            })
        })
    })
}

function hapusjurusan() {
    rl.question('Masukan ID jurusan yang akan di hapus : ', (id2) => {
        let sql = `DELETE FROM jurusan WHERE id_jurusan = '${id2}'`;
        db.run(sql, (err) => {
            if (!err) console.log(`Jurusan dengan ID JURUSAN : '${id2}' telah dihapus`);
            console.log("=========================================================");

            let sql2 = 'SELECT * FROM jurusan';
            db.all(sql2, (err, rows) => {
                if (err) throw err;
                if (rows) {
                    var table = new Table({
                        head: ['ID JURUSAN', 'NAMA JURUSAN'],
                        colWidths: [10, 20]
                    })
                    rows.forEach(rows => {
                        table.push(
                            [`${rows.id_jurusan}`, `${rows.nama_jurusan}`]
                        );
                    })
                    console.log(table.toString());
                    jurusan();
                }
                else {
                    console.log("DATA TIDAK BISA DI TEMUKAN!!!");
                    jurusan();
                }
            })
        })
    })
}

function dosen() {
    console.log(`
=========================================================
silahkan pilih opsi dibawah ini
[1] Daftar Dosen
[2] Cari Dosen
[3] Tambah Dosen
[4] Hapus Dosen
[5] Keluar
=========================================================`)
    rl.question(`masukan salah satu no. dari opsi diatas : `, (number) => {
        console.log('=========================================================');
        switch (number) {
            case '1':
                daftardosen();
                break;
            case '2':
                caridosen();
                break;
            case '3':
                tambahdosen();
                break;
            case '4':
                hapusdosen();
                break;
            case '5':
                mainmenu();
        }
    })
}

function daftardosen() {
    console.log("=========================================================");
    db.serialize(function () {
        let sql = 'SELECT * FROM dosen';

        db.all(sql, (err, rows) => {
            if (err) throw err;
            if (rows) {
                var table = new Table({
                    head: ['ID DOSEN', 'NAMA DOSEN'],
                    colWidths: [20, 20]
                })
                rows.forEach(rows => {
                    table.push([`${rows.id_dosen}`, `${rows.nama_dosen}`]);
                })
                console.log(table.toString());
                dosen();
            }
            else {
                console.log("DATA TIDAK BISA DI TEMUKAN!!!");
                dosen();
            }
        })
    })
}
function caridosen() {
    rl.question(`MASUKAN ID DOSEN: `, (answer) => {
        let sql = `SELECT * FROM dosen WHERE id_dosen = '${answer}'`
        db.get(sql, (err, rows) => {
            if (err) throw err;
            if (rows) {
                console.log(`
=========================================================
JURUSAN DETAIL
=========================================================
ID DOSEN      : ${rows.id_dosen}
NAMA DOSEN    : ${rows.nama_dosen}
`);
                dosen();
            } else {
                console.log(`ID dosen dengan ID : ${answer} tidak ditemukan`);
                dosen();
            }
        })
    })
}

function tambahdosen() {
    console.log(`
=========================================================
Lengkapi Data dibawah ini :
        `)
    rl.question('ID DOSEN : ', (id) => {
        rl.question('NAMA DOSEN : ', (nama) => {
            let sql = `INSERT INTO dosen (id_dosen,nama_dosen) VALUES ('${id}','${nama}')`;
            db.run(sql, (err) => {
                if (err) throw err;
                console.log("Data Jurusan Berhasil di Input");
            });

            let sql2 = 'SELECT * FROM dosen';
            db.all(sql2, (err, rows) => {
                if (err) throw err;
                if (rows) {
                    var table = new Table({
                        head: ['ID DOSEN', 'NAMA DOSEN'],
                        colWidths: [10, 20]
                    })
                    rows.forEach(rows => {
                        table.push([`${rows.id_dosen}`, `${rows.nama_dosen}`]);
                    })
                    console.log(table.toString());
                    dosen();
                }
                else {
                    console.log("DATA TIDAK BISA DI TEMUKAN!!!");
                    dosen();
                }
            })
        })
    })
}

function hapusdosen() {
    rl.question('Masukan ID dosen yang akan di hapus : ', (id2) => {
        let sql = `DELETE FROM dosen WHERE id_dosen = '${id2}'`;
        db.run(sql, (err) => {
            if (!err) console.log(`DOSEN dengan ID DOSEN : '${id2}' telah dihapus`);
            console.log("=========================================================");

            let sql2 = 'SELECT * FROM dosen';
            db.all(sql2, (err, rows) => {
                if (err) throw err;
                if (rows) {
                    var table = new Table({
                        head: ['ID DOSEN', 'NAMA DOSEN'],
                        colWidths: [20, 20]
                    })
                    rows.forEach(rows => {
                        table.push(
                            [`${rows.id_dosen}`, `${rows.nama_dosen}`]
                        );
                    })
                    console.log(table.toString());
                    dosen();
                }
                else {
                    console.log("DATA TIDAK BISA DI TEMUKAN!!!");
                    dosen();
                }
            })
        })
    })
}




















login();
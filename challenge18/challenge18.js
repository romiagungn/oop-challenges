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
                mahasiswa();
            }
        });
    });
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
            } else {
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
                } else {
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
            } else {
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
                } else {
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
                } else {
                    console.log("DATA TIDAK BISA DI TEMUKAN!!!");
                    dosen();
                }
            })
        })
    })
}

function matakuliah() {
    console.log(`
=========================================================
silahkan pilih opsi dibawah ini
[1] Daftar Mata Kuliah
[2] Cari Mata Kuliah
[3] Tambah Mata Kuliah
[4] Hapus Mata Kuliah
[5] Keluar
=========================================================`)
    rl.question(`masukan salah satu no. dari opsi diatas : `, (number) => {
        console.log('=========================================================');
        switch (number) {
            case '1':
                daftarMatkul();
                break;
            case '2':
                cariMatkul();
                break;
            case '3':
                tambahMatkul();
                break;
            case '4':
                hapusMatkul();
                break;
            case '5':
                mainmenu();
        }
    })
};

function daftarMatkul() {
    console.log("=========================================================");
    db.serialize(function () {
        let sql = 'SELECT * FROM mata_kuliah';

        db.all(sql, (err, rows) => {
            if (err) throw err;
            if (rows) {
                var table = new Table({
                    head: ['ID MATA KULIAH', 'NAMA MATA KULIAH', 'SKS'],
                    colWidths: [20, 20, 10]
                })
                rows.forEach(rows => {
                    table.push([`${rows.id_matkul}`, `${rows.nama_matkul}`, `${rows.sks}`]);
                })
                console.log(table.toString());
                matakuliah();
            } else {
                console.log("DATA TIDAK BISA DI TEMUKAN!!!");
                matakuliah();
            }
        })
    })
}

function cariMatkul() {
    rl.question(`MASUKAN ID MATA KULIAH: `, (answer) => {
        let sql = `SELECT * FROM mata_kuliah WHERE id_matkul = '${answer}'`
        db.get(sql, (err, rows) => {
            if (err) throw err;
            if (rows) {
                console.log(`
=========================================================
JURUSAN DETAIL
=========================================================
ID MATA KULIAH      : ${rows.id_matkul}
NAMA MATA KULIAH    : ${rows.nama_matkul}
SKS                 : ${rows.sks}
`);
                matakuliah();
            } else {
                console.log(`ID mata kuliah dengan ID : ${answer} tidak ditemukan`);
                matakuliah();
            }
        })
    })
}

function tambahMatkul() {
    console.log(`
=========================================================
Lengkapi Data dibawah ini :
        `)
    rl.question('ID MATA KULIAH : ', (id) => {
        rl.question('NAMA MATA KULIAH : ', (nama) => {
            rl.question('JUMLAH SKS : ', (sks) => {
                let sql = `INSERT INTO mata_kuliah (id_matkul,nama_matkul,sks) VALUES ('${id}','${nama}','${sks}')`;
                db.run(sql, (err) => {
                    if (err) throw err;
                    console.log("Data Mata Kuliah Berhasil di Input");
                });

                let sql2 = 'SELECT * FROM mata_kuliah';
                db.all(sql2, (err, rows) => {
                    if (err) throw err;
                    if (rows) {
                        var table = new Table({
                            head: ['ID MATA KULIAH', 'NAMA MATA KULIAH', 'SKS'],
                            colWidths: [20, 20, 10]
                        })
                        rows.forEach(rows => {
                            table.push([`${rows.id_matkul}`, `${rows.nama_matkul}`, `${rows.sks}`]);
                        })
                        console.log(table.toString());
                        matakuliah();
                    } else {
                        console.log("DATA TIDAK BISA DI TEMUKAN!!!");
                        matakuliah();
                    }
                })
            })
        })
    })
}

function hapusMatkul() {
    rl.question('Masukan ID Mata Kuliah yang akan di hapus : ', (id2) => {
        let sql = `DELETE FROM mata_kuliah WHERE id_matkul = '${id2}'`;
        db.run(sql, (err) => {
            if (!err) console.log(`Mata Kuliah dengan ID Mata kuliah : '${id2}' telah dihapus`);
            console.log("=========================================================");

            let sql2 = 'SELECT * FROM mata_kuliah';
            db.all(sql2, (err, rows) => {
                if (err) throw err;
                if (rows) {
                    var table = new Table({
                        head: ['ID MATA KULIAH', 'NAMA MATA KULIAH', 'SKS'],
                        colWidths: [20, 20, 10]
                    })
                    rows.forEach(rows => {
                        table.push([`${rows.id_matkul}`, `${rows.nama_matkul}`, `${rows.sks}`]);
                    })
                    console.log(table.toString());
                    matakuliah();
                } else {
                    console.log("DATA TIDAK BISA DI TEMUKAN!!!");
                    matakuliah();
                }
            })
        })
    })
}

function kontrak() {
    console.log(`
=========================================================
silahkan pilih opsi dibawah ini
[1] Daftar Kontrak
[2] Cari Kontrak
[3] Tambah Kontrak
[4] Hapus Kontrak
[5] Keluar
=========================================================`)
    rl.question(`masukan salah satu no. dari opsi diatas : `, (number) => {
        console.log('=========================================================');
        switch (number) {
            case '1':
                daftarKontrak();
                break;
            case '2':
                cariKontrak();
                break;
            case '3':
                tambahKontrak();
                break;
            case '4':
                hapusKontrak();
                break;
            case '5':
                mainmenu();
        }
    })

}

function daftarKontrak() {
    console.log("=========================================================");
    db.serialize(function () {
        let sql = 'SELECT * FROM kontrak';

        db.all(sql, (err, rows) => {
            if (err) throw err;
            if (rows) {
                var table = new Table({
                    head: ['ID KONTRAK', 'ID DOSEN', 'NIM', 'ID MATKUL', 'NILAI'],
                    colWidths: [20, 10, 10, 20, 10]
                })
                rows.forEach(rows => {
                    table.push([`${rows.id_kontrak}`, `${rows.id_dosen}`, `${rows.nim}`, `${rows.id_matkul}`, `${rows.nilai}`]);
                })
                console.log(table.toString());
                kontrak();
            }  else {
                console.log("DATA TIDAK BISA DI TEMUKAN!!!");
                kontrak();
            }
        })
    })
}

function cariKontrak() {
    rl.question(`MASUKAN ID KONTRAK: `, (answer) => {
        let sql = `SELECT * FROM kontrak WHERE id_kontrak = '${answer}'`
        db.get(sql, (err, rows) => {
            if (err) throw err;
            if (rows) {
                console.log(`
=========================================================
JURUSAN DETAIL
=========================================================
ID KONTRAK      : ${rows.id_kontrak}
ID DOSEN        : ${rows.id_dosen}
NIM             : ${rows.nim}
ID MATKUL       : ${rows.id_matkul}
NILAI           : ${rows.nilai}
`);
                kontrak();
            } else {
                console.log(`ID Kontrak dengan ID : ${answer} tidak ditemukan`);
                kontrak();
            }
        })
    })
}

function tambahKontrak() {
    console.log(`
=========================================================
Lengkapi Data dibawah ini :
        `)
    rl.question('ID KONTRAK : ', (id) => {
        rl.question('ID DOSEN : ', (nama) => {
            rl.question('NIM : ', (nim) => {
                rl.question('ID MATKUL : ', (matkul) => {
                    rl.question('NILAI : ', (nilai) => {
                        let sql = `INSERT INTO kontrak (id_kontrak, id_dosen, nim, id_matkul, nilai) VALUES ('${id}','${nama}','${nim}','${matkul}','${nilai}')`;
                        let sql2 = `SELECT * FROM kontrak`;

                        db.run(sql, (err) => {
                            if (err) throw err;
                            console.log("Data Kontrak Berhasil di Input");
                        });

                        db.all(sql2, (err, rows) => {
                            if (err) throw err;
                            if (rows) {
                                var table = new Table({
                                    head: ['ID KONTRAK', 'ID DOSEN', 'NIM', 'ID MATKUL', 'NILAI'],
                                    colWidths: [20, 10, 10, 20, 10]
                                })
                                rows.forEach(rows => {
                                    table.push([`${rows.id_kontrak}`, `${rows.id_dosen}`, `${rows.nim}`, `${rows.id_matkul}`, `${rows.nilai}`]);
                                })
                                console.log(table.toString());
                                kontrak();
                            } else {
                                console.log("DATA TIDAK BISA DI TEMUKAN!!!");
                                kontrak();
                            }
                        })
                    })
                })
            })
        })
    })
}

function hapusKontrak() {
    rl.question('Masukan ID Kontrak yang akan di hapus : ', (id2) => {
        let sql = `DELETE FROM kontrak WHERE id_kontrak = '${id2}'`;
        db.run(sql, (err) => {
            if (!err) console.log(`Kontrak dengan ID KONTRAK : '${id2}' telah dihapus`);
            console.log("=========================================================");

            let sql2 = 'SELECT * FROM kontrak';
            db.all(sql2, (err, rows) => {
                if (err) throw err;
                if (rows) {
                    var table = new Table({
                        head: ['ID KONTRAK', 'ID DOSEN', 'NIM', 'ID MATKUL', 'NILAI'],
                        colWidths: [20, 10, 10, 20, 10]
                    })
                    rows.forEach(rows => {
                        table.push([`${rows.id_kontrak}`, `${rows.id_dosen}`, `${rows.nim}`, `${rows.id_matkul}`, `${rows.nilai}`]);
                    })
                    console.log(table.toString());
                    kontrak();
                } else {
                    console.log("DATA TIDAK BISA DI TEMUKAN!!!");
                    kontrak();
                }
            })
        })
    })
}

login();
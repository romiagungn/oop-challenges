CREATE TABLE users(
    id_login varchar(50) primary key ,
    username varchar(50),
    passwords VARCHAR(50),
    users VARCHAR (50)
);

INSERT INTO users (id_login, username, passwords, users) 
values (1 , 'romi', 'binatang', 'ADMIN'); 

CREATE TABLE jurusan(
    id_jurusan varchar(50) primary key,
    nama_jurusan varchar(50)
);

CREATE TABLE mahasiswa(
    nim varchar(50) primary key NOT NULL,
    nama varchar(50),
    alamat varchar(50),
    jurusan varchar(50),
    FOREIGN KEY (jurusan) REFERENCES jurusan (id_jurusan)
);

CREATE TABLE mata_kuliah(
    id_matkul varchar(50) primary key NOT NULL,
    nama_matkul varchar(50),
    sks varchar(50)
);

CREATE TABLE dosen(
    id_dosen varchar(50) primary key NOT NULL,
    nama_dosen varchar(50)
);

CREATE TABLE kontrak(
    id_kontrak varchar(50) primary key NOT NULL,
    nilai integer,
    nim varchar(50),
    id_matkul varchar(50),
    id_dosen VARCHAR (50),
    FOREIGN KEY (nim) REFERENCES mahasiswa (nim),
    FOREIGN KEY (id_matkul) REFERENCES mata_kuliah (id_matkul),
    FOREIGN KEY (id_dosen) REFERENCES dosen (id_dosen)        
);


INSERT INTO jurusan (id_jurusan, nama_jurusan) 
values ('J001' , 'informatika'), 
 ('J002' , 'manajemen'),
 ('J003' , 'dkv');

INSERT INTO mahasiswa (nim, nama, alamat, jurusan) values 
('M001','romie','bandung','J001'),
('M002','yasa','garut','J002'),
('M003','razan','bandung','J003'),
('M004','bayu','sukabumi','J002'),
('M005','JR','jakarta','J001');

INSERT INTO mata_kuliah (id_matkul, nama_matkul, sks) values 
('P001','data mining','2'),
('P002','komputer','2'),
('P003','sistem informasi','3'),
('P004','data digital','7');

INSERT INTO dosen (id_dosen, nama_dosen) values 
('D001','agung'),
('D002','asep'),
('D003','eko');

INSERT INTO kontrak (id_kontrak, nilai, nim, id_matkul, id_dosen) values 
('K001','A','M001','P001','D001'),
('K002','B','M002','P001','D002'),
('K003','E','M003','P002','D003'),
('K004','D','M004','P002','D001'),
('K005','C','M005','P003','D002'),
('K006','B','M001','P004','D002'),
('K007','D','M001','P003','D002');



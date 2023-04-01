import { Sequelize } from "sequelize";
import db from "../config/database.js";
const { QueryTypes } = Sequelize;
import PenyebaranModel from "../models/PenyebaranModel.js";
import JawabanModel from "../models/jawabanModels.js";
import md5 from "md5"
import FCM from "fcm-push-notif";
let response = {};

//Login Mahasiswa
const loginAccount = async (req, res) => {
    try {
        const { nim, password } = req.body;
        if (nim == null || nim == '' || password == null || password == '') throw new Error("Invalid request!!");

        const mahasiswa = await db.query("SELECT * FROM mahasiswa WHERE nim=? LIMIT 1", {
            replacements: [nim],
            type: QueryTypes.SELECT
        });
        console.log(md5(password))
        if (mahasiswa.length == 0) throw new Error("Nim tidak tersedia!!");
        if (mahasiswa[0].password != md5(password)) throw new Error("Kata sandi salah!!");

        response['msg'] = "Berhasil Masuk";
        response['data'] = { id: mahasiswa[0].id };
        res.json(response); return;
    } catch (err) {
        setResponse(res, 500, { error: err.message })
    }

}

//Register Mahasiswa
const registerAccount = async (req, res) => {
    try {
        const { username, nim, email, password, study, department, province, born, gender } = req.body;
        if (username == null || nim == '' || email == null || password == null || study == null
            || department == null || province == null || born == null || gender == null
        ) throw new Error("Invalid request!!");
        //check nim on database
        const mahasiswaNim = await db.query("SELECT COUNT(*) as total FROM mahasiswa WHERE nim=?", {
            replacements: [nim],
            type: QueryTypes.SELECT
        });
        if (mahasiswaNim[0].total > 0) throw new Error("Nim sudah terdaftar");

        //check email on database
        const mahasiswaEmail = await db.query("SELECT COUNT(*) as total FROM mahasiswa WHERE email=?", {
            replacements: [email],
            type: QueryTypes.SELECT
        });
        if (mahasiswaEmail[0].total > 0) throw new Error("Email sudah terdaftar");

        // store on database
        const currentDate = getCurrentDate();
        const hashpassword = md5(password);
        console.log(hashpassword)
        const query = `INSERT INTO mahasiswa (name, nim, email, password, studi, angkatan, provinsi, 
            kelahiran, gender, createdAt, updatedAt ) VALUES (?,?,?,?,?,?,?,?,?,?,?)`;
        await db.query(query, { replacements: [username, nim, email, hashpassword, study, department, province, born, gender, currentDate, currentDate] });
        res.json({ "msg": "Registrasi berhasil" }); return;

    } catch (error) {
        setResponse(res, 500, { error: error.message })
    }
}

// Get detail Penyebaran
const getPenyebaranById = async (req, res) => {
    try {
        const { penyebaranId } = req.body;

        if (penyebaranId == null) throw new Error("Invalid request!!");
        const query_penyebaran = `SELECT a.id, a.id_kuesioner, a.createdAt, b.title, b.deskripsi,
         b.metode, b.hadiah, b.expired, b.id_mahasiswa, b.penyebaran
         FROM penyebaran a LEFT JOIN kuesioner b ON a.id_kuesioner = b.id WHERE a.id = ?`;
        const penyebaran = await db.query(query_penyebaran, {
            replacements: [penyebaranId],
            type: QueryTypes.SELECT
        });
        response['msg'] = "Ok";
        response['data'] = penyebaran[0];
        res.json(response); return;

    } catch (error) {
        setResponse(res, 500, { error: error.message })
    }
}

// jawab kuesioner
const answerKuesioner = async (req, res) => {

    let transaction;

    try {
        const { penyebaranId, kuesionerId, mahasiswaId, answears } = req.body;
        if (penyebaranId == null || kuesionerId == null || mahasiswaId == null || answears == null) throw new Error("Invalid request!!");

        const query_penyebaran = `SELECT a.id, a.id_kuesioner, a.penyebaran, b.hadiah, b.expired 
        FROM penyebaran a LEFT JOIN kuesioner b ON a.id_kuesioner = b.id 
        WHERE a.id=? AND a.id_kuesioner = ? AND a.id_mahasiswa = ?`;
        const result = await db.query(query_penyebaran, {
            replacements: [penyebaranId, kuesionerId, mahasiswaId],
            type: QueryTypes.SELECT
        });
        if (result.length == 0) throw new Error("penyebaran kuesioner invalid!!");

        if (result[0].penyebaran == 0) throw new Error("Kuesioner sudah terjawab sebelum nya");
        const rewardPoin = result[0].hadiah;
        const jsonAnswear = JSON.parse(answears);

        // get transaction
        transaction = await db.transaction();

        await JawabanModel.bulkCreate(jsonAnswear);
        //update status penyebaran 
        await db.query('UPDATE penyebaran SET `penyebaran` = ? WHERE `id`=?', {
            replacements: [0, penyebaranId]
        });
        //update koin if has reward poin
        if (rewardPoin > 0) {
            await db.query('UPDATE mahasiswa SET koin = koin + ? WHERE id = ?', {
                replacements: [rewardPoin, mahasiswaId]
            });
        }
        await transaction.commit();
        response['msg'] = "Berhasil menjawab kuesioner";
        res.json(response); return;
    } catch (error) {
        if (transaction) await transaction.rollback();
        setResponse(res, 500, { error: error.message })
    }

}

//get responden list
const getRespondenList = async (req, res) => {
    try {
        const { kuesionerId } = req.body;
        if (kuesionerId == null) throw new Error("Invalid request!!");

        const query = `SELECT a.id,a.id_mahasiswa,a.id_kuesioner,a.penyebaran, b.name, b.nim 
        FROM penyebaran a LEFT JOIN mahasiswa b 
        ON a.id_mahasiswa = b.id WHERE a.id_kuesioner = ? `;
        const penyebaran = await db.query(query, {
            replacements: [kuesionerId],
            type: QueryTypes.SELECT
        });
        response['msg'] = "Ok";
        response['data'] = penyebaran;
        res.json(response); return;
    } catch (error) {
        setResponse(res, 500, { error: error.message })
    }
}

const getDetailResponden = async (req, res) => {
    try {
        const { surveyId, respondenId } = req.body;
        if (respondenId == null || surveyId == null) throw new Error("Invalid request!!");
        const query = `SELECT a.id, a.id_kuesioner, a.id_pertanyaan, a.id_penyebaran, a.id_mahasiswa, b.pertanyaan, a.jawaban
            FROM jawaban a LEFT JOIN pertanyaan b ON a.id_pertanyaan = b.id WHERE a.id_kuesioner=? AND a.id_penyebaran = ?`;
        const result = await db.query(query, {
            replacements: [surveyId, respondenId],
            type: QueryTypes.SELECT
        });
        response['msg'] = "Ok";
        response['data'] = result;
        res.json(response); return;
    } catch (error) {
        setResponse(res, 500, { error: error.message })
    }
}

// Penyebaran, mahasiswa 
const getHome = async (req, res) => {
    try {
        const { mahasiswaId } = req.body;
        //fetch data
        const mahasiswa = await db.query("SELECT name, nim, studi, koin FROM mahasiswa WHERE id=?", {
            replacements: [mahasiswaId],
            type: QueryTypes.SELECT
        });
        const query_penyebaran = `SELECT a.id, a.id_kuesioner, a.createdAt, b.title, b.deskripsi,
         b.metode, b.hadiah, b.expired, b.id_mahasiswa, b.penyebaran
         FROM penyebaran a LEFT JOIN kuesioner b ON a.id_kuesioner = b.id WHERE a.id_mahasiswa = ?`;
      

        const penyebaran = await db.query(query_penyebaran, {
            replacements: [mahasiswaId],
            type: QueryTypes.SELECT
        });
        response['msg'] = "Ok";
        response['user'] = mahasiswa[0];
        response['data'] = penyebaran;
        res.json(response); return;
    } catch (error) {
        setResponse(res, 500, { error: error.message })
    }
}

// detail mahasiswa 
const getProfileMahasiswa = async (req, res) => {
    try {
        const { mahasiswaId } = req.body;
        if (mahasiswaId == null) throw new Error("Invalid request!!");
        //fetch data
        const mahasiswa = await db.query("SELECT name, nim, email, studi, angkatan, provinsi, kelahiran, gender,koin FROM mahasiswa WHERE id=?", {
            replacements: [mahasiswaId],
            type: QueryTypes.SELECT
        });
        response['msg'] = "Ok";
        response['user'] = mahasiswa[0];
        res.json(response)
    } catch (error) {
        setResponse(res, 500, { error: error.message });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { mahasiswaId, username, nim, email, study, department, province, born, gender } = req.body;
        if (mahasiswaId == null || username == null || nim == '' || email == null || study == null
            || department == null || province == null || born == null || gender == null
        ) throw new Error("Invalid request!!");
        const currentDate = getCurrentDate();
        const query = `UPDATE mahasiswa SET name=?, nim=?, email=?, studi=?, angkatan=?, provinsi=?, 
        kelahiran=?, gender=?, updatedAt=? WHERE id=?`;
        await db.query(query, {
            replacements: [username, nim, email, study, department, province, born, gender, currentDate, mahasiswaId]
        });
        response['msg'] = "Berhasil update profile";
        res.json(response)
    } catch (error) {
        setResponse(res, 500, { error: error.message });
    }
}


// get list my survey
const getListKuesioner = async (req, res) => {
    const { mahasiswaId } = req.body;
    const query = `SELECT * FROM kuesioner WHERE id_mahasiswa = ?`;
    const penyebaran = await db.query(query, {
        replacements: [mahasiswaId],
        type: QueryTypes.SELECT
    });
    response['msg'] = "Ok";
    response['data'] = penyebaran;
    res.json(response); return;
}

// get list history koin
const getListHistory = async (req, res) => {
    const { mahasiswaId } = req.body;

    //fetch data
    const mahasiswa = await db.query("SELECT koin FROM mahasiswa WHERE id=?", {
        replacements: [mahasiswaId],
        type: QueryTypes.SELECT
    });
    if(mahasiswa.length == 0) throw new Error("Invalid request!!");

    const query = `SELECT * FROM history_koin WHERE mahasiswa_id = ?`;
    const histories = await db.query(query, {
        replacements: [mahasiswaId],
        type: QueryTypes.SELECT
    });
    response['msg'] = "Ok";
    response['data'] = histories;
    response['user'] = mahasiswa[0];

    res.json(response); return;
}

//Top up koin 
const topUpKoin = async (req, res) => {
    let transaction;

    try {
        const { mahasiswaId, koinTotal } = req.body;
        if (mahasiswaId == null || koinTotal == null ) throw new Error("Invalid request!!");
        if (koinTotal == 0) throw new Error("Invalid request!!");
        
        // get transaction
        transaction = await db.transaction();

       //update koin
       await db.query('UPDATE mahasiswa SET koin = koin + ? WHERE id = ?', {
            replacements: [koinTotal, mahasiswaId]
        });
        //store history koin
        const currentDate = getCurrentDate();
        const title_history = "Kamu mendapatkan koin";
        const query = `INSERT INTO history_koin (title_history, mahasiswa_id, jumlah_koin, type_history,created_history ) VALUES (?,?,?,?,?)`;
        await db.query(query, { replacements: [title_history, mahasiswaId, koinTotal, 1, currentDate] });

        await transaction.commit();
        response['msg'] = "Top up berhasil";
        res.json(response); return;
    } catch (error) {
        if (transaction) await transaction.rollback();
        setResponse(res, 500, { error: error.message })
    }
}

//Withdraw koin 
const withdrawKoin = async (req, res) => {
    let transaction;
    try {
        const { mahasiswaId, koinTotal } = req.body;
        if (mahasiswaId == null || koinTotal == null ) throw new Error("Invalid request!!");
        if (koinTotal == 0) throw new Error("Invalid request!!");
        //get current koin
        const mahasiswa = await db.query("SELECT koin FROM mahasiswa WHERE id=?", {
            replacements: [mahasiswaId],
            type: QueryTypes.SELECT
        });
        
        if (mahasiswa.length == 0) throw new Error("Mahasiswa tidak tersedia!!");
        const currentKoin = mahasiswa[0].koin;
        if( currentKoin < koinTotal ) throw new Error("Withdraw gagal!!");

        // get transaction
        transaction = await db.transaction();
       //update koin
       await db.query('UPDATE mahasiswa SET koin = koin - ? WHERE id = ?', {
            replacements: [koinTotal, mahasiswaId]
        });
        //store history koin
        const currentDate = getCurrentDate();
        const title_history = "Kamu melakukan withdraw koin";
        const query = `INSERT INTO history_koin (title_history, mahasiswa_id, jumlah_koin, type_history, created_history ) VALUES (?,?,?,?,?)`;
        await db.query(query, { replacements: [title_history, mahasiswaId, koinTotal, 2,currentDate] });

        await transaction.commit();
        response['msg'] = "Withdraw berhasil";
        res.json(response); return;
    } catch (error) {
        if (transaction) await transaction.rollback();
        setResponse(res, 500, { error: error.message })
    }
}


// getPertanyaan kuesioner
const getListPertanyaan = async (req, res) => {
    const { kuesionerId } = req.body;
    let masterPertanyaan = [];
    let sectionPertanyaan = [];
    const query = `SELECT * FROM pertanyaan WHERE id_kuesioner = ?`;
    const pertanyaan = await db.query(query, {
        replacements: [kuesionerId],
        type: QueryTypes.SELECT
    });

    const opsi = pertanyaan.map(async (el) => {
        const option = await db.query('SELECT a.*, b.section FROM options a LEFT JOIN section b ON a.id = b.id_option WHERE a.id_pertanyaan = ?', {
            replacements: [el.id],
            type: QueryTypes.SELECT,
        });
        el.options = option;
        if (el.section == 0) {
            masterPertanyaan.push(el)
        } else {
            sectionPertanyaan.push(el)
        }
        //return el;
    });
    await Promise.all(opsi);

    response['msg'] = "Ok";
    response['master'] = masterPertanyaan;
    response['data'] = sectionPertanyaan;
    res.json(response); return;
}

//Store fcmtoken
const insertFcm = async (req, res) => {
    try {
        const { mahasiswaId, token } = req.body;
        const query = 'INSERT INTO fcm (mahasiswaId, token) VALUES (?, ?) ON DUPLICATE KEY UPDATE token = ?,mahasiswaId = ?';
        await db.query(query, {
            replacements: [mahasiswaId, token, token, mahasiswaId],
        });
        res.json({ "msg": "Ok" }); return;
    } catch (error) {
        setResponse(res, 500, { error: "Something Wrong" })
    }
}


//publish survey and broadcast 
const publishMySurvey = async (req, res) => {

    try {
        const { kuesionerId, mahasiswaId, gender, province, yearFrom, yearEnd, age, reward } = req.body;
        if (kuesionerId == null || mahasiswaId == null) throw new Error("Invalid request!!");
        
        //find kuesioner
        const query = `SELECT * FROM kuesioner WHERE id=? AND id_mahasiswa = ?`;
        const survey = await db.query(query, {
            replacements: [kuesionerId, mahasiswaId],
            type: QueryTypes.SELECT
        });
        if (survey.length == 0 || survey == null) throw new Error("Invalid request!!");

        if (survey[0].penyebaran == 1) throw new Error("Alread publish");

        //get current koin
        const mahasiswa = await db.query("SELECT koin FROM mahasiswa WHERE id=?", {
            replacements: [mahasiswaId],
            type: QueryTypes.SELECT
        });
        if (mahasiswa.length == 0) throw new Error("Invalid request!!");
        const currentKoin = mahasiswa[0].koin;
        //get current date  yyyy-mm-dd
        const currentDate = getCurrentDate();

        let bindVal = []; //bind val for filter token

        let query_token = 'SELECT a.id, b.token FROM mahasiswa a LEFT JOIN fcm b ON a.id = b.mahasiswaId';
        if (gender != null || province != null || yearFrom != null || yearEnd != null || age != null) {
            query_token += ' WHERE (';
            if (gender != null) {
                query_token += ' a.gender = ?';
                bindVal.push(gender);
            }

            if (province != null) {
                query_token += ' OR a.provinsi = ?';
                bindVal.push(province);
            }

            if (yearFrom != null) {
                query_token += ' OR a.angkatan BETWEEN ? AND ?';
                bindVal.push(yearFrom);
                bindVal.push(yearEnd);
            }
            if (age != 0) {
                let fromAgeYear, endAgeYear;
                query_token += ' OR a.kelahiran BETWEEN ? AND ?';
                if (age == 1) {
                    fromAgeYear = 2022 - 21;
                    endAgeYear = 2022 - 27;
                } else {
                    fromAgeYear = 2022 - 28;
                    endAgeYear = 2022 - 34;
                }
                bindVal.push(fromAgeYear);
                bindVal.push(endAgeYear);
            }
            query_token += ' )';
        }
        //get mahasiswa token filter with criteria
        const results = await db.query(query_token, {
            replacements: bindVal,
            type: QueryTypes.SELECT
        });
        let tokens = [];
        let tempPenyebaran = [];
        results.map((el) => {
            if (el.token != null) {
                tokens.push(el.token);
            }
            tempPenyebaran.push({ id_mahasiswa: el.id, id_kuesioner: kuesionerId, penyebaran: 0 });
            
        });

        let totalResponden = tempPenyebaran.length
        const totalRewardKoin = totalResponden * reward;
        if(totalResponden > currentKoin) throw new Error("Saldo tidak mencukupi!!");
        //create bulk penyebaran 
        const createPenyebaran = await PenyebaranModel.bulkCreate(tempPenyebaran);
        //update status kuesioner and total responden
        const updateKuesioner = await db.query('UPDATE kuesioner SET penyebaran =?, responden =?, updatedAt = ?, hadiah=? WHERE id = ?', { replacements: [1, totalResponden, currentDate, totalRewardKoin, kuesionerId] });
        //update koin mahasiswa
        const updateKoin =await db.query('UPDATE mahasiswa SET koin = koin - ? WHERE id = ?', { replacements: [totalRewardKoin, mahasiswaId]});
       
        //push notification to user
        var serverKey = 'AAAA8ofE-0U:APA91bEVUGltqRQpcBu9rRuRiN0fuPjXxTDXZ6OKC0w_y9YhwTMjT_PgWJ8tJ32iK2_hrCn5pxwwBppfTRqM0P_Cra_I7VINH3ri0yFLgGlV9EwAWcX-stsmHBWdlGw520gy2rjnmEYA';
        var fcm = new FCM(serverKey);
        let fields = {
            data: {
                'title': 'New survey comming',
                'message': survey[0].title,
                'surveyId': survey[0].id,
                'timestamp': currentDate
            }
        };

        let message = {
            registration_ids: tokens,
            data: fields
        };
        if(tokens.length>0){
            await fcm.send(message).then((result) => {
                response['msg'] = "Berhasil sebar kuesioner";
                res.json(response); return;
            });
        }else{
            response['msg'] = "Berhasil sebar kuesioner";
            res.json(response); return;
        }

    } catch (error) {
        setResponse(res, 500, { error: error.message })
    }

}

//set response
function setResponse(res, status, object) {
    res.status(status);
    res.json(object);
    return;
}

// get current date
function getCurrentDate() {
    let date_time = new Date();
    // adjust 0 before single digit date
    let date = ("0" + date_time.getDate()).slice(-2);
    // get current month
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    // year
    let currentDatetime = date + "-" + month + "-" + date_time.getFullYear();
    return currentDatetime;
}

export {
    loginAccount, registerAccount, insertFcm, getHome, getPenyebaranById,
    getListKuesioner, publishMySurvey, getListPertanyaan, answerKuesioner,
    getRespondenList, getDetailResponden, getProfileMahasiswa, updateProfile,
    getListHistory,topUpKoin, withdrawKoin
}
import express from "express";
 
import { 
    register,
    login,
    logout,
    sessionLogin,
    getMahasiswaById,
    addMahasiswaUP,
    getAllDataMahasiswaLength,
    getMahasiswaLength,
    UpdateMahasiswaById,
    allMahasiswa
} from "../controllers/Mahasiswa.js";
import { 
    addKuesionerPertanyaan,
    addKuesionerTitle,
    deletePertanyaanById,
    getPertanyaanById,
    getTitleById,
    updateKuesionerQuestion,
    updateKuesionerPertanyaan,
    addOptions,
    updateOptions,
    getAllOptions,
    getOptionsById,
    getOptionsById1,
    deleteOptionsById,
    deleteOptionsById_pertanyaan,
    getKuesionerByid_mahasiswa,
    getTitleByArr,
    deletePertanyaanBySection,
    getJawaban,
    
    // findPertanyaanBySection
} from "../controllers/Kuesioner.js";
import {
    penyebaranSimple,
    penyebaranSystematic,
    penyebaranCluster,
    findPenyebaranById,
    updatePenyebaran
} from "../controllers/Penyebaran.js"
import{
    addJawaban,
    getJawabanByIdMahasiswa,
    getJawabanByKueseoner,
    getJawabanByIdPetanyaan,
    totalJawaban
} from "../controllers/Jawaban.js"
import{
    addSection,
    findSection,
    updateSection,
    findSectionByKuesioner,
    findSectionByJawaban,
    getPertanyaanBysection,
    findSectionByIdPertanyaan,
    findSectionPertanyaan,
    findSectionOption,
    getPertanyaanToBeSection,
    findIdPertanyaan,
    findIdKuesioner,
    findPertanyaanBySection,
    addMahasiswa,deleteSection,
    deleteSectionByPertanyaan
}from "../controllers/Section.js";

import { loginAccount, registerAccount, insertFcm, getHome, getPenyebaranById,
     getListKuesioner, publishMySurvey,getListPertanyaan, answerKuesioner,
     getRespondenList, getDetailResponden, getProfileMahasiswa, updateProfile,
     getListHistory,topUpKoin, withdrawKoin
} from "../controllers/Android.js";

const router = express.Router();

//App Routes fcm route
router.post('/app/login', loginAccount);
router.post('/app/register', registerAccount);
router.post('/app/fcm', insertFcm);
router.post('/app/home', getHome);
router.post('/app/penyebaran/detail', getPenyebaranById);
router.post('/app/koin/list',getListHistory);
router.post('/app/koin/topup',topUpKoin);
router.post('/app/koin/withdraw',withdrawKoin);
router.post('/app/kuesioner/list', getListKuesioner);
router.post('/app/kuesioner/publish', publishMySurvey);
router.post('/app/pertanyaan', getListPertanyaan);
router.post('/app/penyebaran/answer', answerKuesioner);
router.post('/app/responden/list',getRespondenList);
router.post('/app/responden/detail',getDetailResponden);
router.post('/app/mahasiswa',getProfileMahasiswa);
router.post('/app/mahasiswa/update',updateProfile);

//this base not modifed
router.get('/add_mahasiswa',addMahasiswa);
router.get('/section/pertanyaan/:id/:id_kuesioner',findPertanyaanBySection);
router.get('/mhs',allMahasiswa)
router.post('/register', register);
router.post('/login', login);
router.get('/logout',logout);
router.get('/login/session',sessionLogin);
router.get('/mahasiswaup/add',addMahasiswaUP);
router.get('/mahasiswa/length',getAllDataMahasiswaLength);
router.get('/penyebaran/:id',findPenyebaranById);
router.get('/jawaban/mahasiswa/:id',getJawabanByIdMahasiswa);
router.post('/jawaban/mahasiswa/:id',getJawabanByKueseoner);
router.get('/jawaban/pertanyaan/:id',getJawabanByIdPetanyaan);
router.get("/totalJawaban/:id",totalJawaban);
router.post('/mahasiswa/length',getMahasiswaLength);
router.post('/penyebaran/simple',penyebaranSimple);
router.post('/penyebaran/systematic',penyebaranSystematic);
router.post('/penyebaran/cluster',penyebaranCluster);

router.post('/kuesioner/title',addKuesionerTitle);
router.post('/kuesioner/pertanyaan',addKuesionerPertanyaan);
router.post('/kuesioner/options',addOptions);
router.get('/kuesioner/options',getAllOptions);
router.post('/kuesioner/options/section',addSection);
router.get('/kuesioner/options/section/:id_pertanyaan/:id_option',findSection);
router.patch('/kuesioner/options/section/:id_pertanyaan/:id_option',updateSection)
router.get('/options/section/kuesioner/:id',findSectionByKuesioner);
router.get('/options/section/jawaban/:id',findSectionByJawaban);
router.get('/kuesioner/pertanyaan/section/:id/:idK',getPertanyaanBysection);
router.get('/title/section/:id',getPertanyaanToBeSection);
router.get('/pertanyaan/section/:id',findIdPertanyaan);

router.get('/kuesioner/section/:id',findIdKuesioner);

router.get('/kpsp/:id',findSectionByIdPertanyaan);

router.get('/kuesioner/pertanyaan/section/pertanyaan/:id',findSectionByIdPertanyaan);
router.get('/options/section/pertanyaan/:id_pertanyaan/:id_option',findSectionPertanyaan);

router.get('/options/section/option/:id_pertanyaan/:id_option',findSectionOption);
            
router.post('/jawaban',addJawaban);
router.get('/mahasiswa/:id',getMahasiswaById);
router.patch('/mahasiswa/:id',UpdateMahasiswaById);
router.get('/kuesioner/title/:id',getTitleById);
router.get('/kuesioner/title/mahsiswa/:id',getKuesionerByid_mahasiswa);
router.post('/kuesioner/title/responden',getTitleByArr);


router.get('/kuesioner/pertanyaan/:id',getPertanyaanById);
router.get('/jawaban/:id',getJawaban);
router.get('/kuesioner/options/:id',getOptionsById);
router.get('/kuesioner/options1/:id',getOptionsById1);
router.delete('/section/:id/:id_kuesioner',deleteSection)
router.delete('/setionPertanyaan/:id/:id_kuesioner',deleteSectionByPertanyaan)


router.patch('/kuesioner/title/:id',updateKuesionerQuestion)
router.delete('/kuesioner/pertanyaan/:id',deletePertanyaanById)
router.delete('/kuesioner/pertanyaan/section/:id_kuesioner/:section',deletePertanyaanBySection)
router.delete('/kuesioner/options/:id',deleteOptionsById)
router.delete('/kuesioner/options/pertanyaan/:id',deleteOptionsById_pertanyaan)

router.patch('/kuesioner/options/:id',updateOptions)
router.patch('/kuesioner/penyebaran/:id',updatePenyebaran)


router.patch('/kuesioner/pertanyaan/:id',updateKuesionerPertanyaan)
// getTitleById
// router.post('/login', login);
// router.get('/', register);
 
export default router;
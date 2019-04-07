const express = require('express');
const router = express.Router();

const authorize = require('_helpers/authorize')
const Role = require('_helpers/role');
const Approvals = require('_helpers/approvals');
const db = require('_helpers/db');

// routes
router.get('/all/:id', authorize(), getAllTrainings);
router.get('/:id',  getMyTrainings);
router.get('/employeeTrainings/:id', getEmployeeTrainings);
router.post('/bindwithuser/:id', authorize(), bindUserWithTraining);
router.post('/acceptUserTraining/:id/:role', authorize(), acceptUserTraining);
router.post('/denyUserTraining/:id/:role', authorize(), denyUserTraining);
//router.get('/:id',authorize([Role.Admin]),  getTrainingById);
router.post('/',authorize(), createTraining);
router.post('/provider', authorize(), createProvider);
router.post('/cluster', authorize(), createCluster);
router.get('/cluster/clusters', getClusters);

module.exports = router;

function denyUserTraining(req, res, next) {

    var status = req.body.trainingStatus;
    var idUser = req.body.idUser;
    var idProvider = req.body.idProvider;
    var idCluster = req.body.idCluster;
    var idTraining = req.body.idTraining;
    var idCurrentUser = parseInt(req.params.id);
    var roleCurrentUser = req.params.role;
    var roleWhom = req.body.role;

    var values = [idCurrentUser, idUser, idProvider, idCluster, idTraining];

    if (roleCurrentUser == Role.Approver1 && status == Approvals.Pending && roleWhom == Role.User) {
        var sql = "update user_has_training ut set ut.trainingStatus = (SELECT CASE WHEN r.role = 'Approver1' THEN 'Denied by TL' WHEN r.role = 'Approver2' THEN 'Denied by LM' WHEN r.role = 'Approver3' THEN 'Denied by Director' WHEN r.role = 'Procurement' THEN 'Denied by Procurement' ELSE 'error' END FROM user_has_role ur JOIN roles r ON (r.idRole = ur.idRole) WHERE idUser = ?) where ut.idUser=? and ut.idProvider=? and ut.idCluster=? and ut.idTraining=?;         "
    }
    else if (roleCurrentUser == Role.Approver2 && ((roleWhom == Role.User && status == Approvals.Accepted1) || (roleWhom == Role.Approver1 && status == Approvals.Pending))) {
        var sql = "update user_has_training ut set ut.trainingStatus = (SELECT CASE WHEN r.role = 'Approver1' THEN 'Denied by TL' WHEN r.role = 'Approver2' THEN 'Denied by LM' WHEN r.role = 'Approver3' THEN 'Denied by Director' WHEN r.role = 'Procurement' THEN 'Denied by Procurement' ELSE 'error' END FROM user_has_role ur JOIN roles r ON (r.idRole = ur.idRole) WHERE idUser = ?) where ut.idUser=? and ut.idProvider=? and ut.idCluster=? and ut.idTraining=?;         "
    }
    else if (roleCurrentUser == Role.Approver3 && ((roleWhom == Role.User && status == Approvals.Accepted2) || (roleWhom == Role.Approver1 && status == Approvals.Accepted2) || (roleWhom == Role.Approver2 && status == Approvals.Pending))) {
        var sql = "update user_has_training ut set ut.trainingStatus = (SELECT CASE WHEN r.role = 'Approver1' THEN 'Denied by TL' WHEN r.role = 'Approver2' THEN 'Denied by LM' WHEN r.role = 'Approver3' THEN 'Denied by Director' WHEN r.role = 'Procurement' THEN 'Denied by Procurement' ELSE 'error' END FROM user_has_role ur JOIN roles r ON (r.idRole = ur.idRole) WHERE idUser = ?) where ut.idUser=? and ut.idProvider=? and ut.idCluster=? and ut.idTraining=?;         "
    }
    else if (roleCurrentUser == Role.Procurement && ((roleWhom == Role.User && status == Approvals.Accepted3) || (roleWhom == Role.Approver1 && status == Approvals.Accepted3) || (roleWhom == Role.Approver2 && status == Approvals.Accepted3))) {
        var sql = "update user_has_training ut set ut.trainingStatus = (SELECT CASE WHEN r.role = 'Approver1' THEN 'Denied by TL' WHEN r.role = 'Approver2' THEN 'Denied by LM' WHEN r.role = 'Approver3' THEN 'Denied by Director' WHEN r.role = 'Procurement' THEN 'Denied by Procurement' ELSE 'error' END FROM user_has_role ur JOIN roles r ON (r.idRole = ur.idRole) WHERE idUser = ?) where ut.idUser=? and ut.idProvider=? and ut.idCluster=? and ut.idTraining=?;         "
    }

    db.query(sql, values, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })

    console.log(idProvider + ' ' + idCluster + ' ' + idTraining + ' ' + idCurrentUser);

}




function acceptUserTraining(req, res, next) {

    var status = req.body.trainingStatus;
    var idUser = req.body.idUser;
    var idProvider = req.body.idProvider;
    var idCluster = req.body.idCluster;
    var idTraining = req.body.idTraining;
    var idCurrentUser = parseInt(req.params.id);
    var roleCurrentUser = req.params.role;
    var roleWhom = req.body.role;

    console.log(roleWhom + ' ' + roleCurrentUser + ' ' + status);

    var values = [idCurrentUser, idUser, idProvider, idCluster, idTraining];

    if (roleCurrentUser == Role.Approver1 && status == Approvals.Pending && roleWhom == Role.User) {
        var sql = "update user_has_training ut set ut.trainingStatus = (SELECT CASE WHEN r.role = 'Approver1' THEN 'Accepted by TL' WHEN r.role = 'Approver2' THEN 'Accepted by LM' WHEN r.role = 'Approver3' THEN 'Accepted by Director' WHEN r.role = 'Procurement' THEN 'Accepted by Procurement' ELSE 'error' END FROM user_has_role ur JOIN roles r ON (r.idRole = ur.idRole) WHERE idUser = ?) where ut.idUser=? and ut.idProvider=? and ut.idCluster=? and ut.idTraining=?;"
    }
    else if (roleCurrentUser == Role.Approver2 && ((roleWhom == Role.User && status == Approvals.Accepted1) || (roleWhom == Role.Approver1 && status == Approvals.Pending))) {
        var sql = "update user_has_training ut set ut.trainingStatus = (SELECT CASE WHEN r.role = 'Approver1' THEN 'Accepted by TL' WHEN r.role = 'Approver2' THEN 'Accepted by LM' WHEN r.role = 'Approver3' THEN 'Accepted by Director' WHEN r.role = 'Procurement' THEN 'Accepted by Procurement' ELSE 'error' END FROM user_has_role ur JOIN roles r ON (r.idRole = ur.idRole) WHERE idUser = ?) where ut.idUser=? and ut.idProvider=? and ut.idCluster=? and ut.idTraining=?;"
    }
    else if (roleCurrentUser == Role.Approver3 && ((roleWhom == Role.User && status == Approvals.Accepted2) || (roleWhom == Role.Approver1 && status == Approvals.Accepted2) || (roleWhom == Role.Approver2 && status == Approvals.Pending))) {
        var sql = "update user_has_training ut set ut.trainingStatus = (SELECT CASE WHEN r.role = 'Approver1' THEN 'Accepted by TL' WHEN r.role = 'Approver2' THEN 'Accepted by LM' WHEN r.role = 'Approver3' THEN 'Accepted by Director' WHEN r.role = 'Procurement' THEN 'Accepted by Procurement' ELSE 'error' END FROM user_has_role ur JOIN roles r ON (r.idRole = ur.idRole) WHERE idUser = ?) where ut.idUser=? and ut.idProvider=? and ut.idCluster=? and ut.idTraining=?;"
    }
    else if (roleCurrentUser == Role.Procurement && ((roleWhom == Role.User && status == Approvals.Accepted3) || (roleWhom == Role.Approver1 && status == Approvals.Accepted3) || (roleWhom == Role.Approver2 && status == Approvals.Accepted3))) {
        var sql = "update user_has_training ut set ut.trainingStatus = (SELECT CASE WHEN r.role = 'Approver1' THEN 'Accepted by TL' WHEN r.role = 'Approver2' THEN 'Accepted by LM' WHEN r.role = 'Approver3' THEN 'Accepted by Director' WHEN r.role = 'Procurement' THEN 'Accepted by Procurement' ELSE 'error' END FROM user_has_role ur JOIN roles r ON (r.idRole = ur.idRole) WHERE idUser = ?) where ut.idUser=? and ut.idProvider=? and ut.idCluster=? and ut.idTraining=?;"
    }

    db.query(sql, values, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })



}


// right after creation is status set to Approvals.pending
function bindUserWithTraining(req, res, next) {

    var idProvider = req.body.idProvider;
    var idCluster = req.body.idCluster;
    var idTraining = req.body.idTraining;
    var idCurrentUser = parseInt(req.params.id);
    var values = [[idCurrentUser, idTraining, idProvider, idCluster, Approvals.Pending]];

    db.query('INSERT into user_has_training ( idUser, idTraining, idProvider, idCluster, trainingStatus ) VALUES ?', [values], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
    console.log(idProvider + ' ' + idCluster + ' ' + idTraining + ' ' + idCurrentUser);
}

function getAllTrainings(req, res, next) {
    var sql = 'SELECT case when t.idTraining in (select idTraining from user_has_training where idUser = ?)  then 1 else 0 end as isMy, t.idTraining, t.name, c.name as clustername, tp.Price as price, p.name as providername, tp.idProvider, tc.idCluster from trainings t join trainings_has_clusters tc on(t.idTraining = tc.idTraining) join clusters c on(c.idCluster = tc.idCluster) join trainings_has_providers tp on (t.idTraining = tp.idTraining) join providers p on (p.idProvider = tp.idProvider);';
    var idCurrentUser = parseInt(req.params.id);

    db.query(sql, idCurrentUser, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })

}

// returns list of my trainings (current user id)
function getMyTrainings(req, res, next) {
    var idCurrentUser = parseInt(req.params.id);
    db.query('select t.name name, u.idUser, u.firstName, u.lastName, p.name provider, c.name cluster, ut.trainingStatus as status, tp.price  from user_has_training ut join providers p on(ut.idProvider = p.idProvider) join clusters c on (c.idCluster = ut.idCluster ) join trainings t on (t.idTraining = ut.idTraining) join users u on (ut.idUser = u.idUser) join trainings_has_providers tp on (tp.idProvider = ut.idProvider and tp.idTraining = ut.idTraining ) where u.idUser = ?;    ', idCurrentUser, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })

}


// returns list of my trainings (current user id)
function getEmployeeTrainings(req, res, next) {
    var idCurrentUser = parseInt(req.params.id);
    var gen = parseInt(req.params.gen);;
    var sql = "WITH RECURSIVE PotomokPredok(potomokId, predokId, generacia) AS(SELECT Dieta.idUser, Rodic.idUser, 1 FROM Users AS Dieta JOIN Users AS Rodic ON Rodic.idUser IN(Dieta.idBoss) UNION ALL SELECT Dieta.idUser, Predok.predokId, generacia + 1 FROM PotomokPredok AS Predok JOIN Users AS Dieta ON Predok.potomokId IN(Dieta.idBoss)) select  pp.potomokId idUser, u.username nameUser,r.role, u2.username nameBoss, ut.idTraining, ut.trainingStatus, t.name nameTraining, ut.idProvider, ut.idCluster from PotomokPredok pp join users u on(u.idUser = pp.potomokId) join users u2 on(u2.idUser = pp.predokId) join user_has_training ut on(pp.potomokId = ut.idUser) join trainings t on(t.idTraining = ut.idTraining) join user_has_role ur on(u.idUser = ur.IdUser ) join roles r on(r.IdRole=ur.idRole) where  pp.predokId = ? order by pp.potomokid;"

    db.query(sql, [idCurrentUser], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })

}

function createTraining(req, res, next) {
    var name = req.body.name;
    var sql = "INSERT INTO trainings(name) VALUES(?)";
    db.query(sql, [name], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
}

function createProvider(req, res, next) {
    var name = req.body.name;
    var sql = "INSERT INTO providers(name) VALUES(?)";
    db.query(sql, [name], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
}

function createCluster(req, res, next) {
    var name = req.body.name;
    var sql = "INSERT INTO clusters(name) VALUES(?)";
    db.query(sql, [name], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
}

function getClusters(req, res, next) {
    var sql = 'select idCluster, name from clusters;';
   

    db.query(sql, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })

}
/*
function getTrainingById(req, res, next) {
    const currentTraining = req.training;
    const id = parseInt(req.params.id);

    // only allow admins to access other user records
    //  if (id !== currentUser.sub && (currentUser.role !== Role.TL && currentUser.role !== Role.Admin )) {
    //      return res.status(401).json({ message: 'Unauthorized' });
    //   }

    trainingService.getTrainingById(req.params.id)
        .then(training => training ? res.json(training) : res.sendStatus(404))
        .catch(err => next(err));
}*/
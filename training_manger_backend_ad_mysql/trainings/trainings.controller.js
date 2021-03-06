const express = require('express');
const router = express.Router();

const authorize = require('_helpers/authorize')
const Role = require('_helpers/role');
const Approvals = require('_helpers/approvals');
const db = require('_helpers/db');
const ad = require('_helpers/ad');
const config = require('config.json');

// routes
router.get('/all/:id', authorize(), getAllWholeTrainings);
router.get('/active/:id', authorize(), getActiveWholeTrainings);
router.get('/procurement/everyone/:id', authorize(), getEveryonesTrainings);

router.get('/:id', authorize(), getMyTrainings);
router.get('/employeeTrainings/:id', authorize(), getEmployeeTrainings);
router.post('/bindwithuser/:id', authorize(), bindUserWithTraining);
router.post('/acceptUserTraining/:id/:status', authorize(), acceptUserTraining);
router.post('/denyUserTraining/:id/:status', authorize(), denyUserTraining);
router.post('/', authorize(), createTraining);
router.post('/provider', authorize(), createProvider);
router.post('/cluster', authorize(), createCluster);
router.get('/cluster/clusters', authorize(), getClusters);
router.get('/provider/providers', authorize(), getProviders);
router.get('/training/trainings', authorize(), getTrainings);
router.post('/wholeTraining', authorize(), saveWholeTraining);
router.post('/wholeTraining/state/:id', authorize(), disableWholeTraining);
router.post('/wholeTraining/stateE/:id', authorize(), enableWholeTraining);
router.post('/wholeTraining/participate/:id', authorize(), participateUser);
router.post('/wholeTraining/cancel/:id', authorize(), cancelUser);
router.post('/userNote', authorize(), saveUserNote);
router.post('/procurementNote', authorize(), saveProcurementNote);

router.post('/wholeTraining/acc/:id', authorize(), acceptedProcurement);
router.post('/wholeTraining/ord/:id', authorize(), orderedProcurement);
router.post('/wholeTraining/can/:id', authorize(), cancelledProcurement);

module.exports = router;

function denyUserTraining(req, res, next) {

    var idUserHasTraining = parseInt(req.params.id);
    var currentStatus = parseInt(req.params.status);
    var role = req.body.role;

    console.log(role + ' ' + idUserHasTraining + " " + currentStatus);

    if (role === 1 && Math.floor(currentStatus / 10) < 1) {
        // nastav approved by TL
        var sql = "update user_has_training ut set ut.trainingStatus =" + Approvals.DeniedTL + " where ut.idUserHasTraining=?;";
    } else if (role === 2 && Math.floor(currentStatus / 10) < 3) {
        // nastav approved by LM
        var sql = "update user_has_training ut set ut.trainingStatus =" + Approvals.DeniedLM + " where ut.idUserHasTraining=?;";
    } else if (role === 3 && Math.floor(currentStatus / 10) < 5) {
        // nastav approved by Director
        var sql = "update user_has_training ut set ut.trainingStatus =" + Approvals.DeniedDirector + " where ut.idUserHasTraining=?;";
    } else {
        return next(Error('You do not have rights / already done'));
    }

    db.query(sql, [idUserHasTraining], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })

}


function acceptUserTraining(req, res, next) {

    var idUserHasTraining = parseInt(req.params.id);
    var currentStatus = parseInt(req.params.status);
    var role = req.body.role;

    console.log(role + ' ' + idUserHasTraining + " " + currentStatus);

    if (role === 1 && Math.floor(currentStatus / 10) < 1) {
        // set approved by TL
        var sql = "update user_has_training ut set ut.trainingStatus =" + Approvals.AcceptedTL + " where ut.idUserHasTraining=?;";
    } else if (role === 2 && Math.floor(currentStatus / 10) < 3) {
        // set approved by LM
        var sql = "update user_has_training ut set ut.trainingStatus =" + Approvals.AcceptedLM + " where ut.idUserHasTraining=?;";
    } else if (role === 3 && Math.floor(currentStatus / 10) < 5) {
        // set approved by Director
        var sql = "update user_has_training ut set ut.trainingStatus =" + Approvals.AcceptedDirector + " where ut.idUserHasTraining=?;";
    } else {
        return next(Error('You do not have rights / already done'));
    }

    db.query(sql, [idUserHasTraining], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
}


// right after creation is status set to Approvals.pending
// called after sign up for training is clicked
// needs role of the person who sings up and id of whole training
async function bindUserWithTraining(req, res, next) {

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    var idUser = await parseInt(req.body.extensionAttribute1);
    var idWholeTraining = await parseInt(req.params.id);
    var role = await req.body.role;

    if (role === 0) {
        var stat = 1;
    } else if (role === 1) {
        var stat = 21;
    } else if (role === 2) {
        var stat = 41;
    } else if (role === 3) {
        var stat = 50;
    }

    var values = [[idUser, idWholeTraining, stat, dateTime]];

    db.query('INSERT into user_has_training ( idUser, idWholeTraining, trainingStatus, SignUpDate ) VALUES ?', [values], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        }
        else {
            console.log(err);
        }
    })
}


// returns list of my trainings (current user id)
function getMyTrainings(req, res, next) {
    var idCurrentUser = parseInt(req.params.id);
    var sql = 'select ut.idUserHasTraining, t.name name, p.name provider, c.name cluster, ut.trainingStatus as status, wt.price, ut.SignUpDate, ut.idUser, ut.DecisionByProcurementDate, ut.AdditionalNoteProcurement, ut.AdditionalNoteUser , ut.ProcurementStatus, ut.UserStatus   from user_has_training ut join wholetraining wt on (ut.idWholeTraining = wt.idWholeTraining) join providers p on(wt.idProvider = p.idProvider) join clusters c on (c.idCluster = wt.idCluster ) join trainings t on (t.idTraining = wt.idTraining) where ut.idUser = ?;';

    db.query(sql, idCurrentUser, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })

    

}


function acceptedProcurement(req, res, next) {

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    var idUserHasTraining = parseInt(req.params.id);
    var sql = "update user_has_training ut set ut.procurementStatus =" + 1 + " where ut.idUserHasTraining=? and ut.TrainingStatus=50;";

    db.query(sql, idUserHasTraining, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    });

    db.query("update user_has_training ut set ut.decisionByProcurementDate ='" + dateTime + "' where ut.idUserHasTraining=? and ut.TrainingStatus=50;", idUserHasTraining, (err, rows, fields) => {
        if (!err){}
          //  res.send(rows);
        else
            console.log(err);
    });

}

function orderedProcurement(req, res, next) {

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    var idUserHasTraining = parseInt(req.params.id);
    var sql = "update user_has_training ut set ut.procurementStatus =" + 10 + " where ut.idUserHasTraining=? and ut.TrainingStatus=50;";

    db.query(sql, idUserHasTraining, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    });

    db.query("update user_has_training ut set ut.decisionByProcurementDate ='" + dateTime + "' where ut.idUserHasTraining=? and ut.TrainingStatus=50;", idUserHasTraining, (err, rows, fields) => {
        if (!err){}
          //  res.send(rows);
        else
            console.log(err);
    });

}

function cancelledProcurement(req, res, next) {

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    var idUserHasTraining = parseInt(req.params.id);
    var sql = "update user_has_training ut set ut.procurementStatus =" + 19 + " where ut.idUserHasTraining=? and ut.TrainingStatus=50;";

    db.query(sql, idUserHasTraining, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    });

    db.query("update user_has_training ut set ut.decisionByProcurementDate ='" + dateTime + "' where ut.idUserHasTraining=? and ut.TrainingStatus=50;", idUserHasTraining, (err, rows, fields) => {
        if (!err){}
          //  res.send(rows);
        else
            console.log(err);
    });

}


function participateUser(req, res, next) {
    var idUserHasTraining = parseInt(req.params.id);
    var sql = "update user_has_training ut set ut.userStatus =" + 1 + " where ut.idUserHasTraining=? and ut.TrainingStatus=50;";

    db.query(sql, idUserHasTraining, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })

}


function cancelUser(req, res, next) {
    var idUserHasTraining = parseInt(req.params.id);
    var sql = "update user_has_training ut set ut.userStatus =" + 19 + " where ut.idUserHasTraining=? and ut.TrainingStatus=50;";

    db.query(sql, idUserHasTraining, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })

}


// returns list of my trainings (current user id)
function saveUserNote(req, res, next) {
    var idUserHasTraining = req.body.idUserHasTraining;
    var userNote = req.body.AdditionalNoteUser;

    var sql = "update user_has_training ut set ut.AdditionalNoteUser =? where ut.idUserHasTraining=? and ut.TrainingStatus=50;";

    db.query(sql, [userNote, idUserHasTraining], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
}

function saveProcurementNote(req, res, next) {
    var idUserHasTraining = req.body.idUserHasTraining;
    var userNote = req.body.AdditionalNoteProcurement;

    var sql = "update user_has_training ut set ut.AdditionalNoteProcurement =? where ut.idUserHasTraining=? and ut.TrainingStatus=50;";

    db.query(sql, [userNote, idUserHasTraining], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
}

// returns my employees trainings not only direct
async function getEveryonesTrainings(req, res, next) {

    var id = await parseInt(req.params.id);

    help = await config.procurement.find(function(element) {
        return element === id.toString();
      });
      
      if(help === undefined){
        return;
      } 


    var query = "(&(objectClass=user)(objectCategory=person))";
    ad.find(query, async function (err, results) {
        if ((err) || (!results)) {
            // console.log('ERROR: ' + JSON.stringify(err));
            res.send(err);
        } else {
            const allUsers = await results.users;

            var sql = "select ut.idUserHasTraining, ut.idUser, ut.TrainingStatus trainingStatus, wt.price, t.name trainingname , p.name providername, c.name clustername,  ut.SignUpDate, ut.idUser, ut.DecisionByProcurementDate, ut.AdditionalNoteProcurement, ut.AdditionalNoteUser , ut.ProcurementStatus, ut.UserStatus   from user_has_training ut join wholetraining wt on (wt.idWholeTraining = ut.idWholeTraining) join providers p on(wt.idProvider = p.idProvider) join clusters c on (c.idCluster = wt.idCluster ) join trainings t on (t.idTraining = wt.idTraining);"
            await db.query(sql, async function (err, rows, fields) {
                if (!err) {

                    for (k = 0; k < rows.length; k++) {
                        var id = await rows[k].idUser;
                        console.log(allUsers.find(x => x.extensionAttribute1 === id.toString()));
                        rows[k].nameUser = allUsers.find(x => x.extensionAttribute1 === id.toString()).displayName;
                    }
                    res.send(rows);
                }
                else
                    console.log(err);
            })
        }
    });
}

// returns my employees trainings not only direct
async function getEmployeeTrainings(req, res, next) {

    var dn = req.params.id;

    var query = "(&(objectClass=user)(objectCategory=person))";
    ad.find(query, async function (err, results) {
        if ((err) || (!results)) {
            // console.log('ERROR: ' + JSON.stringify(err));
            res.send(err);
        } else {
            const allUsers = await results.users;

            // my employees
            const myEmployees = await allUsers.filter(allUsers => allUsers.manager === dn);

            // my employees employees
            var i;
            var myEmployeesEmployees = [];
            for (i = 0; i < myEmployees.length; i++) {
                await myEmployeesEmployees.push(...allUsers.filter(allUsers => allUsers.manager === myEmployees[i].dn));
            }

            // my employees employees employees
            var j;
            var myEmployeesEmployeesEmployees = [];
            for (j = 0; j < myEmployeesEmployees.length; j++) {
                await myEmployeesEmployeesEmployees.push(...allUsers.filter(allUsers => allUsers.manager === myEmployeesEmployees[j].dn));
            }

            const Employees1id = await myEmployees.map(myEmployees => myEmployees.extensionAttribute1);
            const Employees2id = await myEmployeesEmployees.map(myEmployeesEmployees => myEmployeesEmployees.extensionAttribute1);
            const Employees3id = await myEmployeesEmployeesEmployees.map(myEmployeesEmployeesEmployees => myEmployeesEmployeesEmployees.extensionAttribute1);

            var EveryonesId = [];
            await EveryonesId.push(...Employees1id);
            await EveryonesId.push(...Employees2id);
            await EveryonesId.push(...Employees3id);

            //   let result = results.users.map(({ extensionAttribute1 }) => extensionAttribute1)
            // res.send(EveryonesId);

            var sql = "select ut.idUserHasTraining, ut.idUser, ut.TrainingStatus trainingStatus, wt.price, t.name trainingname , p.name providername, c.name clustername,  ut.SignUpDate, ut.idUser, ut.DecisionByProcurementDate, ut.AdditionalNoteProcurement, ut.AdditionalNoteUser , ut.ProcurementStatus, ut.UserStatus   from user_has_training ut join wholetraining wt on (wt.idWholeTraining = ut.idWholeTraining) join providers p on(wt.idProvider = p.idProvider) join clusters c on (c.idCluster = wt.idCluster ) join trainings t on (t.idTraining = wt.idTraining) where ut.idUser IN (?);"
            await db.query(sql, [EveryonesId], async function (err, rows, fields) {
                if (!err) {
                    // console.log(allUsers);
                    //const idUsers = rows.map(rows => rows.idUser);

                    for (k = 0; k < rows.length; k++) {
                        var id = await rows[k].idUser;
                        console.log(allUsers.find(x => x.extensionAttribute1 === id.toString()));
                        rows[k].nameUser = allUsers.find(x => x.extensionAttribute1 === id.toString()).displayName;
                    }
                    res.send(rows);
                }
                else
                    console.log(err);
            })


        }
    });

    // var sql = "WITH RECURSIVE PotomokPredok(potomokId, predokId, generacia) AS(SELECT Dieta.idUser, Rodic.idUser, 1 FROM Users AS Dieta JOIN Users AS Rodic ON Rodic.idUser IN(Dieta.idBoss) UNION ALL SELECT Dieta.idUser, Predok.predokId, generacia + 1 FROM PotomokPredok AS Predok JOIN Users AS Dieta ON Predok.potomokId IN(Dieta.idBoss)) select  pp.potomokId idUser, u.username nameUser,r.role, u2.username nameBoss, ut.idTraining, ut.trainingStatus, t.name nameTraining, ut.idProvider, ut.idCluster from PotomokPredok pp join users u on(u.idUser = pp.potomokId) join users u2 on(u2.idUser = pp.predokId) join user_has_training ut on(pp.potomokId = ut.idUser) join trainings t on(t.idTraining = ut.idTraining) join user_has_role ur on(u.idUser = ur.IdUser ) join roles r on(r.IdRole=ur.idRole) where  pp.predokId = ? order by pp.potomokid;"

    // db.query(sql, [idCurrentUser], (err, rows, fields) => {
    //     if (!err)
    //         res.send(rows);
    //     else
    //         console.log(err);
    // })

}

////// Important for creating new whole training - start
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

function getProviders(req, res, next) {
    var sql = 'select idProvider, name from providers;';

    db.query(sql, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
}

function getTrainings(req, res, next) {
    var sql = 'select idTraining, name from trainings;';

    db.query(sql, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
}
////// Important for creating new whole training - end

// each whole training has composite unique key(cluster, provider, training)
function saveWholeTraining(req, res, next) {

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + ' ' + time;

    var price = req.body.price;
    var idCluster = req.body.cluster.idCluster;
    var idProvider = req.body.provider.idProvider;
    var idTraining = req.body.training.idTraining;
    var values1 = [[idProvider, idTraining, idCluster, price, dateTime]];

    var sql1 = "INSERT INTO WholeTraining(idProvider,idTraining, idCluster, Price, CreationTime  ) VALUES(?)";
    db.query(sql1, values1, (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        }
        else {
         next(Error(err));
            console.log(err);
        }
    });
}

// requires also user id to determine which of the training are mine 
function getAllWholeTrainings(req, res, next) {
    var sql = 'select wt.idWholeTraining, wt.Active , wt.CreationTime, case when wt.idWholeTraining in (select idWholeTraining from user_has_training where idUser = ? )  then 1 else 0 end as isMy, wt.idTraining, t.name, c.name as clustername, wt.Price as price, p.name as providername, wt.idProvider, wt.idCluster from WholeTraining wt join providers p on (p.idProvider = wt.idProvider) join trainings t on (t.idTraining = wt.idTraining) join clusters c on (c.idCluster = wt.idCluster);';
    var idCurrentUser = parseInt(req.params.id);

    db.query(sql, idCurrentUser, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })

}

// requires also user id to determine which of the training are mine 
function getActiveWholeTrainings(req, res, next) {
    var sql = 'select wt.idWholeTraining, wt.Active , wt.CreationTime, case when wt.idWholeTraining in (select idWholeTraining from user_has_training where idUser = ? )  then 1 else 0 end as isMy, wt.idTraining, t.name, c.name as clustername, wt.Price as price, p.name as providername, wt.idProvider, wt.idCluster from WholeTraining wt join providers p on (p.idProvider = wt.idProvider) join trainings t on (t.idTraining = wt.idTraining) join clusters c on (c.idCluster = wt.idCluster) where wt.Active = 1;';
    var idCurrentUser = parseInt(req.params.id);

    db.query(sql, idCurrentUser, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })

}


function disableWholeTraining(req, res, next) {
    var idUserHasTraining = parseInt(req.params.id);
    var sql = "update WholeTraining wt set wt.active = 0 where wt.idWholeTraining=?;";

    db.query(sql, idUserHasTraining, (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })

}

function enableWholeTraining(req, res, next) {
    var idUserHasTraining = parseInt(req.params.id);
    var sql = "update WholeTraining wt set wt.active = 1 where wt.idWholeTraining=?;";

    db.query(sql, idUserHasTraining, (err, rows, fields) => {
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
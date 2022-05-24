const express = require('express');
const mysql = require('mysql2');
// const app = express();
const port = 3000;

const cluster = require('cluster')
const os = require('os').cpus.length;

if (cluster.isMaster) {
    const Master = require('./work');
    const master = Master();
    console.log("cluster is master ", os)
    for (let i = 0; i < os; i++) {
        master.liftWorker();
    }

    cluster.on('exit', (worker) => {
        console.log(worker);
        console.log(`The Worker number: ${worker.id} is dead.`);
        master.liftWorkerError();
    })
} else {
    // Creating a server with http and express.
    app = express();
    console.log(`cluster ${cluster.worker.id} is running.`);

    const connectionLocal = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'debeziumdb'
    });

    const connectionRemote = mysql.createConnection({
        host: '18.132.196.73',
        user: 'kelvin.vuminh',
        password: 'abc13579',
        database: 'debeziumdb'
    });

    const queryLocal = function (sql) {
        connectionLocal.query(
            sql,
            function (err, results, fields) {
                console.log("sql Local", sql); //
                console.log("result Local", results); // results contains rows returned by server
                console.log("result Local", fields); // fields contains extra meta data about results, if available
            }
        );
    }

    const loadTest = function (numbers, name, age) {
        console.log(numbers, name, age)
        let str = prepareQueryString(numbers, name, age);
        // ghi str ra file

        // option1: sử dụng cluster trong nodejs

        // option2: sử dụng câu query string trong file mới được ghi và thực thi trong mysql workbranch
    }

    const transactionLocal = function (sqls) {
        connectionLocal.beginTransaction(function (err) {
            if (err) {
                throw err;
            }
            for (const key in sqls) {
                connectionLocal.query(sqls[key]);
            }
            connectionLocal.rollback();
        });
    }


    const queryRemote = function (sql) {
        connectionRemote.query(
            sql,
            function (err, results, fields) {
                console.log("sql Remote", sql); //
                console.log("result Remote", results); // results contains rows returned by server
                console.log("result Remote", fields); // fields contains extra meta data about results, if available
            }
        );
    }

    const transactionRemote = function (sqls) {
        queryRemote.beginTransaction(function (err) {
            if (err) {
                throw err;
            }
            for (const sql in sqls) {
                queryRemote.query(sql);
            }
            connectionLocal.rollback();
        });
    }

    app.get('/', function (req, res) {
        res.sendFile('index.html', {
            root: __dirname
        })
    });

    app.get('/queryLocal', function (req, res) {
        console.log("param", req.query.query);
        try {
            queryLocal(req.query.query);
        } catch (e) {
            res.send({
                "message": "some error" + e.toString()
            });
        }
        res.send({
            "message": "success"
        });
    });

    app.get('/loadTest', function (req, res) {
        console.log("param loadtest ", req.query)
        try {
            loadTest(req.query.numbers, req.query.name, req.query.age);
        } catch (e) {
            res.send({
                "message": "load test error" + e.toString()
            });
        }
        res.send({
            "message": "load test success"
        });
    })

    app.get('/transactionLocal', function (req, res) {
        console.log("param", req.query.query);
        try {
            transactionLocal(req.query.query.split('*'));
        } catch (e) {
            res.send({
                "message": "some error" + e.toString()
            });
        }
        res.send({
            "message": "success"
        });
    });

    app.get('/queryRemote', function (req, res) {
        console.log("param", req.query.query);
        try {
            queryRemote(req.query.query);
        } catch (e) {
            res.send({
                "message": "some error" + e.toString()
            });
        }
        res.send({
            "message": "success"
        });
    });

    app.get('/transactionRemote', function (req, res) {
        console.log("param", req.query.query);
        try {
            transactionRemote(req.query.query);
        } catch (e) {
            res.send({
                "message": "some error" + e.toString()
            });
        }
        res.send({
            "message": "success"
        });
    });

    app.listen(3000, () => {
        console.log(`Example app listening on http://localhost:${port}`)
    })
}

// const connectionLocal = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'root',
//     database: 'debeziumdb'
// });


// const connectionRemote = mysql.createConnection({
//     host: '18.132.196.73',
//     user: 'kelvin.vuminh',
//     password: 'abc13579',
//     database: 'debeziumdb'
// });

// const queryLocal = function (sql) {
//     connectionLocal.query(
//         sql,
//         function (err, results, fields) {
//             console.log("sql Local", sql); //
//             console.log("result Local", results); // results contains rows returned by server
//             console.log("result Local", fields); // fields contains extra meta data about results, if available
//         }
//     );
// }

// const loadTest = function (numbers, name, age) {
//     console.log(numbers, name, age)
//     let str = prepareQueryString(numbers, name, age);
//     // ghi str ra file

//     // option1: sử dụng cluster trong nodejs

//     // option2: sử dụng câu query string trong file mới được ghi và thực thi trong mysql workbranch
// }

// const transactionLocal = function (sqls) {
//     connectionLocal.beginTransaction(function (err) {
//         if (err) {
//             throw err;
//         }
//         for (const key in sqls) {
//             connectionLocal.query(sqls[key]);
//         }
//         connectionLocal.rollback();
//     });
// }


// const queryRemote = function (sql) {
//     connectionRemote.query(
//         sql,
//         function (err, results, fields) {
//             console.log("sql Remote", sql); //
//             console.log("result Remote", results); // results contains rows returned by server
//             console.log("result Remote", fields); // fields contains extra meta data about results, if available
//         }
//     );
// }

// const transactionRemote = function (sqls) {
//     queryRemote.beginTransaction(function (err) {
//         if (err) {
//             throw err;
//         }
//         for (const sql in sqls) {
//             queryRemote.query(sql);
//         }
//         connectionLocal.rollback();
//     });
// }

// app.get('/', function (req, res) {
//     res.sendFile('index.html', {
//         root: __dirname
//     })
// });

// app.get('/queryLocal', function (req, res) {
//     console.log("param", req.query.query);
//     try {
//         queryLocal(req.query.query);
//     } catch (e) {
//         res.send({
//             "message": "some error" + e.toString()
//         });
//     }
//     res.send({
//         "message": "success"
//     });
// });

// app.get('/loadTest', function (req, res) {
//     console.log("param loadtest ", req.query)
//     try {
//         loadTest(req.query.numbers, req.query.name, req.query.age);
//     } catch (e) {
//         res.send({
//             "message": "load test error" + e.toString()
//         });
//     }
//     res.send({
//         "message": "load test success"
//     });
// })

// app.get('/transactionLocal', function (req, res) {
//     console.log("param", req.query.query);
//     try {
//         transactionLocal(req.query.query.split('*'));
//     } catch (e) {
//         res.send({
//             "message": "some error" + e.toString()
//         });
//     }
//     res.send({
//         "message": "success"
//     });
// });

// app.get('/queryRemote', function (req, res) {
//     console.log("param", req.query.query);
//     try {
//         queryRemote(req.query.query);
//     } catch (e) {
//         res.send({
//             "message": "some error" + e.toString()
//         });
//     }
//     res.send({
//         "message": "success"
//     });
// });

// app.get('/transactionRemote', function (req, res) {
//     console.log("param", req.query.query);
//     try {
//         transactionRemote(req.query.query);
//     } catch (e) {
//         res.send({
//             "message": "some error" + e.toString()
//         });
//     }
//     res.send({
//         "message": "success"
//     });
// });

// app.listen(3000, () => {
//     console.log(`Example app listening on http://localhost:${port}`)
// })
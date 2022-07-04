const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();

const http = require('http');
const server = http.createServer(app);
const {
    Server
} = require("socket.io");
const io = new Server(server);

const port = 3223;
const pathFile = "/home/kafka/kafka/logs";

const INTERVAL_CHECK = 1000;

//window
// const ZOOKEEPER_STATUS_CHECK = 'netstat -an | findstr /r ":2181';
// const KAFKA_STATUS_CHECK = 'netstat -an | findstr /r ":9092';
// const KAFKA_CONNECT_STATUS_CHECK = 'netstat -an | findstr /r ":8083';
// const KAFKA_LIST_ALL_TOPIC = 'D:\\Project\\debezium\\kafka\\bin\\windows\\kafka-topics.bat --bootstrap-server=localhost:9092 --list';
// const KAFKA_SUBCRIBE = 'D:\\Project\\debezium\\kafka\\bin\\windows\\kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic connect-offsets --from-beginning';

//linux
const ZOOKEEPER_STATUS_CHECK = 'netstat -aon |grep :2181';
const KAFKA_STATUS_CHECK = 'netstat -aon |grep :9092';
const KAFKA_CONNECT_STATUS_CHECK = 'netstat -aon |grep :8083';
const KAFKA_LIST_ALL_TOPIC = '/home/kafka/kafka/bin/kafka-topics.sh --bootstrap-server=localhost:9092 --list';
const KAFKA_SUBCRIBE = '/home/kafka/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic connect-configs --from-beginning';
const CONNECTORS = 'curl -GET http://localhost:8083/connectors';


//socket message
const REQUEST_LOG_STREAM = "REQUEST_LOG_STREAM";
const SEND_LOG_STREAM = "SEND_LOG_STREAM";

const REQUEST_TOPIC_STREAM = "REQUEST_TOPIC_STREAM";
const SEND_TOPIC_STREAM = "SEND_TOPIC_STREAM";

const roomSocket = [];

app.use(cors());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('API Monitor for Kafka')
})

app.get('/list', (req, res) => {
    const exist = fs.existsSync(pathFile);
    if (!exist) {
        res.status(404).json({
            status: "There aren't any log files",
            data: []
        });
    }
    const dirs = fs.readdirSync(pathFile);
    res.status(200).json({
        status: "OK",
        data: dirs
    });
})

app.get('/download', function (req, res) {
    console.log("req.query.file", req.query.file);
    console.log("download", pathFile + "\\" + req.query.file);
    const file = pathFile + "/" + req.query.file;
    res.download(file);
});

app.get('/zookeeperStatus', async function (req, res) {
    try {
        const result = await bashCommand(ZOOKEEPER_STATUS_CHECK);
        result.includes("LISTEN");
        res.send(resJson({
            "id": "zookeeper",
            "ip_port": "20.187.187.41:2181",
            "status": result.includes("LISTEN") ? "running" : "stopped"
        }));
    } catch (err) {
        res.send(resJson({
            "id": "zookeeper",
            "ip_port": "20.187.187.41:2181",
            "status": "down",
            "error_msg": "NO_CONNECT"
        }));
    }

});

app.get('/kafkaStatus', async function (req, res) {
    try {
        const result = await bashCommand(KAFKA_STATUS_CHECK);
        result.includes("LISTEN");
        res.send(resJson({
            "id": "kafka",
            "ip_port": "20.187.187.41:9200",
            "status": result.includes("LISTEN") ? "running" : "stopped"
        }));
    } catch (err) {
        res.send(resJson({
            "id": "kafka",
            "ip_port": "20.187.187.41:9200",
            "status": "down",
            "error_msg": "NO_CONNECT"
        }));
    }


});

app.get('/kafkaConnectStatus', async function (req, res) {
    try {
        const result = await bashCommand(KAFKA_CONNECT_STATUS_CHECK);
        result.includes("LISTEN");
        res.send(resJson({
            "id": "kafkaconnect",
            "ip_port": "20.187.187.41:8300",
            "status": result.includes("LISTEN") ? "running" : "stopped"
        }));
    } catch (err) {
        res.send(resJson({
            "id": "kafkaconnect",
            "ip_port": "20.187.187.41:8300",
            "status": "down",
            "error_msg": "NO_CONNECT"
        }));
    }
});



app.get('/getAllTopic', async function (req, res) {
    try {
        const result = await bashCommand(KAFKA_LIST_ALL_TOPIC);
        let resultWithoutBreakLine = result.split('\r')[0];
        let arr = resultWithoutBreakLine.split('\n');
        arr.pop();
        let topics = arr.reduce((acc, curr) => acc = acc + curr + ",", "");
        topics = topics.substring(0, topics.length - 1);

        res.send(resJson({
            "data": "OK",
            "data": arr
        }));
    } catch (err) {
        res.send(resJson({
            "data": [],
            "error_msg": "Error" + err
        }));
    }
});


app.get('/monitorLog', async function (req, res) {
    console.log("monitorLog", req.query.file);
    res.render('monitorLog', {
        file: req.query.file
    })
});

io.on('connection', (socket) => {

    console.log('a user connected');

    socket.on('create', (zoom) => {
        console.log('zoom with id ', zoom.zoom, 'created');
        socket.join(zoom.zoom);
    });

    socket.on(REQUEST_LOG_STREAM, (msg) => {
        console.log(REQUEST_LOG_STREAM);
        try {
            console.log("subcribe file", msg.file, "of zoom", msg.zoom);
            // setInterval(()=>{
            //     io.to(msg.zoom).emit(SEND_LOG_STREAM, {"msg": SEND_LOG_STREAM});
            // }, 1000);
            bashStream(`tail -n150 -f /home/kafka/kafka/logs/${msg.file}`,
                (message) => {
                    console.log("message", message);
                    io.to(msg.zoom).emit(SEND_LOG_STREAM, {
                        "msg": message
                    });
                }, (err) => {
                    console.log("error", err);
                    io.to(msg.zoom).emit(SEND_LOG_STREAM, {
                        "msg": "Error " + err
                    });
                });
        } catch (err) {
            io.to(msg.zoom).emit(SEND_LOG_STREAM, {
                "msg": "File doesn't exist"
            });
        }
    });

    socket.on(REQUEST_TOPIC_STREAM, (msg) => {
        console.log(REQUEST_TOPIC_STREAM);
        try {
            console.log("subcribe topic", msg.topic);
            bashStream(`/home/kafka/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic ${msg.topic} --from-beginning`,
                (message) => {
                    console.log("message", message);
                    io.to(msg.zoom).emit(SEND_TOPIC_STREAM, {
                        "msg": message
                    });
                }, (err) => {
                    console.log("error", err);
                    io.to(msg.zoom).emit(SEND_TOPIC_STREAM, {
                        "msg": "Error " + err
                    });
                });

        } catch (err) {
            io.to(msg.zoom).emit(SEND_TOPIC_STREAM, {
                "msg": "Topic not found"
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});

app.get('/subcribeLog', async function (req, res) {
    try {
        console.log("subcribe file", req.query.file);
        let sse = sseEvent(res);
        bashStream(`tail -n150 -f /home/kafka/kafka/logs/${req.query.file}`,
            (message) => {
                console.log("message", message);
                sse.send(message);
            }, (err) => {
                console.log("error", err);
                sse.send("Error " + err);
            });
    } catch (err) {
        res.send(resJson({
            "error_msg": "File doesn't exist"
        }));
    }
});

app.get('/monitorTopic', async function (req, res) {
    res.render('monitorTopic', {
        topic: req.query.topic
    })
});

app.get('/subcribeATopic', async function (req, res) {
    try {
        console.log("subcribe topic", req.query.topic);
        //D:\\Project\\debezium\\kafka\\bin\\windows\\kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic ${req.query.topic} --from-beginning
        ///home/kafka/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:2181 --topic ${req.query.topic} --from-beginning
        let sse = sseEvent(res);
        bashStream(`/home/kafka/kafka/bin/kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic ${req.query.topic} --from-beginning`,
            (message) => {
                console.log("message", message);
                sse.send(message);
            }, (err) => {
                console.log("error", err);
                sse.send("Error " + err);
            });
    } catch (err) {
        res.send(resJson({
            "status": "Error" + err,
            "error_msg": "NO TOPIC"
        }));
    }
});

app.get('/getAllConnectors', async function (req, res) {
    const result = await bashCommand(CONNECTORS);
    res.send(JSON.parse(result));
});

app.get('/getStatusConnector', async function (req, res) {
    const result = await bashCommand(CONNECTORS + "/" + req.query.connector + "/status");
    res.send(JSON.parse(result));
});

const sseEvent = (res) => {
    res.writeHead(200, {
        "Connection": "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
    });
    let sseInner = {
        send: function (data) {
            // res.write('event: message\n');
            // res.write(`data: ${JSON.stringify(data)}`);
            res.write(`${JSON.stringify(data)}`);
            res.write("\n\n");
        },
        close: function (fn, param) {
            res.on('close', () => {
                fn(param);
                res.end();
            });
        }
    }

    return sseInner;
}

const resJson = (msg) => {
    return msg;
}

const bashCommand = async (cmd) => {
    const {
        exec
    } = require('child_process');
    return new Promise((res, rej) => {
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                //some err occurred
                rej(err)
            } else {
                // the *entire* stdout and stderr (buffered)
                res(stdout);
            }
        });
    });
}

const bashStream = async (cmd, onStream, onError) => {
    console.log("stream from", cmd);
    const {
        exec,
        child
    } = require('child_process');
    const myShellScript = exec(cmd);
    myShellScript.stdout.on('data', (data) => {
        onStream(data);
        // do whatever you want here with data
    });
    myShellScript.stderr.on('data', (data) => {
        onStream(data);
    });
}

server.listen(port, () => {
    console.log(`Example app LISTEN on port http://localhost:${port}`);
});
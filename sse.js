const express = require('express');
const fs = require('fs');
const cors = require('cors');
const { ok } = require('assert');
const app = express();
const port = 3223;
const pathFile = "D:\\Project\\debezium\\kafka\\logs";

const INTERVAL_CHECK = 1000; 

//window

const ZOOKEEPER_STATUS_CHECK = 'netstat -an | findstr /r ":2181';
const KAFKA_STATUS_CHECK = 'netstat -an | findstr /r ":9092';
const KAFKA_CONNECT_STATUS_CHECK = 'netstat -an | findstr /r ":8083';

//linux
// const ZOOKEEPER_STATUS_CHECK = 'netstat -aon |grep :2181'; 
// const KAFKA_STATUS_CHECK = 'netstat -aon |grep :9092'; 
// const KAFKA_CONNECT_STATUS_CHECK = 'netstat -aon |grep :8083'; 

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/list', (req, res) => {
    const exist = fs.existsSync(pathFile);
    if (!exist) {
        res.status(404).json({
            data: 'Folder does not exist'
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

app.get('/zookeeperlogstream', async function (req, res) {
    const sse = sseEvent(res);
    const interval = setInterval(async () => {
        try{
            const result = await bashCommand(ZOOKEEPER_STATUS_CHECK);
            result.includes("LISTENING");
            sse.send(resJson(
                {
                    "id":"zookeeper",
                    "ip_port":"20.239.121.102:2181",
                    "status":result.includes("LISTENING") ? "running" : "stopped"
            }));
        } catch(err) {
            sse.send( sse.send(resJson(
                {
                    "id":"zookeeper",
                    "ip_port":"20.239.121.102:2181",
                    "status":"down",
                    "error_msg":"NO_CONNECT"
            })));
        }
    }, INTERVAL_CHECK);

    res.on("close", () => {
        clearInterval(interval);
        sse.close();
    });
});

app.get('/kafkalogstream', async function (req, res) {
    const sse = sseEvent(res);
    const interval = setInterval(async () => {
        try{
            const result = await bashCommand(KAFKA_STATUS_CHECK);
            result.includes("LISTENING");
            sse.send(resJson(
                {
                    "id":"kafka",
                    "ip_port":"20.239.121.102:9200",
                    "status":result.includes("LISTENING") ? "running" : "stopped"
            }));
        } catch(err) {
            sse.send( sse.send(resJson(
                {
                    "id":"kafka",
                    "ip_port":"20.239.121.102:9200",
                    "status":"down",
                    "error_msg":"NO_CONNECT"
            })));
        }
    }, INTERVAL_CHECK);

    res.on("close", () => {
        clearInterval(interval);
        sse.close();
    });
});

app.get('/kafkaconnectlogstream', async function (req, res) {
    const sse = sseEvent(res);
    const interval = setInterval(async () => {
        try{
            const result = await bashCommand(KAFKA_CONNECT_STATUS_CHECK);
            result.includes("LISTENING");
            sse.send(resJson(
                {
                    "id":"kafkaconnect",
                    "ip_port":"20.239.121.102:8300",
                    "status":result.includes("LISTENING") ? "running" : "stopped"
            }));
        } catch(err) {
            sse.send(sse.send( sse.send(resJson(
                {
                    "id":"kafkaconnect",
                    "ip_port":"20.239.121.102:2181",
                    "status":"down",
                    "error_msg":"NO_CONNECT"
            }))));
        }
    }, INTERVAL_CHECK);

    res.on("close", () => {
        clearInterval(interval);
        sse.close();
    });
});


app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`)
})

const sseEvent = (res) => {
    res.writeHead(200, {
        "Connection": "keep-alive",
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
    });
    let sseInner = {
        send: function (data) {
            res.write('event: message\n');
            res.write(`data: ${JSON.stringify(data)}`);
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
    return {
        "status": ok,
        "message": msg
    }
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

const bashStream = async (cmd, onStream, onClose) => {
    const {
        spawn
    } = require('child_process');
    const child = spawn('ls', );
    child.stdout.setEncoding('utf8'); //text chunks

    child.stdout.on('data', (chunk) => {
        // data from the standard output is here as buffers
        onStream(chunk);
    });

    // since these are streams, you can pipe them elsewhere
    child.stderr.pipe(dest);
    child.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
        onClose(code);
    });
}
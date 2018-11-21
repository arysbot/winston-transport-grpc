const winston = require("winston");
const Grpc = require("../src/index");

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new Grpc({ level: "error",
            serverURL: "127.0.0.1:8881"
        })
    ]
});

logger.log({
    level: "error",
    uuid: "dfht",
    service: "tester",
    request: "log",
    code: "200"
});

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
        new Grpc({ filename: 'error.log', level: 'error' }),
    ]
});

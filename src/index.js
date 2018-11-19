const Transport = require('winston-transport');
const path = require("path");


module.exports = class Grpc extends Transport {
    constructor(opts) {
        super(opts);

        this.service = opts.service;
        this._grpc = {};
        this._grpc.path = path.join(__dirname, "../node_modules/protofiles/src/Logger.proto");
        this._grpc.definition
    }

    log(info, callback) {
        setImmediate(() => {
            this.emit('logged', info);
        });


        // Perform the writing to the remote service
        callback();
    }
};

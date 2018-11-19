const Transport = require("winston-transport");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("grpc");
const path = require("path");
const { NODE_ENV } = process.env;


module.exports = class Grpc extends Transport {
    constructor(opts) {
        super(opts);

        this.level = {};
        if (Array.isArray(opts.level)) {
            for (let level in opts.level) {
                this.level[level] = 1;
            }
        } else {
            this.level.push(opts.level);
        }
        this.service = opts.service;
        this._grpc = {};
        this._grpc.path = path.join(__dirname, "../node_modules/protofiles/src/Logger.proto");
        this._grpc.definition = protoLoader.loadSync(this._grpc.path);
        this._grpc.object = grpc.loadPackageDefinition(this._grpc.definition);
        this.Logger = new this._grpc.object.Logger(`dns:///logger.arys-${NODE_ENV}.svc.cluster.local`, {
            "grpc.lb_policy_name": "round_robin"
        });
    }

    log(info, callback) {
        setImmediate(() => {
            this.emit("logged", info);
        });
        if(this.level[info.level]) {

        }

        // Perform the writing to the remote service
        callback();
    }
};

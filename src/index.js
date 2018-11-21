const Transport = require("winston-transport");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("grpc");
const path = require("path");
const { NODE_ENV } = process.env;


module.exports = class Grpc extends Transport {
    constructor(opts) {
        super(opts);

        this.serverURL = opts.serverURL || "";
        this.config = opts.config || {};
        this.level = opts.level;
        this._grpc = {};
        this._grpc.path = path.join(__dirname, "../node_modules/protofiles/src/Logger.proto");
        this._grpc.definition = protoLoader.loadSync(this._grpc.path);
        this._grpc.object = grpc.loadPackageDefinition(this._grpc.definition);
        this.Logger = new this._grpc.object.Logger(this.serverURL, grpc.credentials.createInsecure(), this.config);
    }

    log(info, callback) {
        setImmediate(() => {
            this.emit("logged", info);
        });
        if(info.level === this.level) {
            const request = {
                uuid: info.uuid,
                service: info.service,
                request: info.request,
                code: info.code,
                metadata: info.metadata
            };
            if (!request.uuid) throw new Error("Request must provide a uuid.\n" + request);
            if (!request.service) throw new Error("Request must provide its service.\n" + request);
            if (!request.request) throw new Error("Request must provide it's type.\n" + request);
            if (!request.code) throw new Error("Request must provide it's response code.\n" + request);
            if (request.metadata && typeof request.metadata !== "string") throw new Error("Request metadata must be a JSON string.\n" + request);
            this.Logger.Log(request, (error, res) => {
                if (error) {
                    return console.log('An error occurred:', error);
                }

                console.log('Response:', res);
            })
        }

        // Perform the writing to the remote service
        callback();
    }
};

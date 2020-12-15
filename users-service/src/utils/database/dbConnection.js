class Connection {
  constructor({
    connectionString,
    mongoose
  }) {
    this.connectionString = connectionString;
    this.mongoose = mongoose;
    this.reset();
  }

  start(schemas = {}) {
    if (this.startCount > 0) {
      ++this.startCount;
      if (!this.mongoose.connection) {
        this.mongoose.connection = this.connection;
      }
      return Promise.resolve(this.models);
    }

    this.startCount = 1;
    return this.connect()
      .then(() => this.verifyConnection(schemas))
      .then(() => this.createModels(schemas))
      .then(() => this.models)
      .catch((err) => {
        this.startCount = 0;
        throw err;
      });
  }

  stop() {
    if (this.startCount > 0) {
      --this.startCount;
      return new Promise((resolve, reject) => {
        if (this.startCount > 0) {
          return resolve();
        }

        this.connection.close((err) => {
          if (err) {
            ++this.startCount;
            return reject(err);
          }
          this.mongoose.connections = this.mongoose.connections.filter(conn => conn !== this.connection);
          this.reset();
          return resolve();
        });
      });
    }
    return Promise.resolve();
  }

  createModels(schemas = {}) {
    for (const modelName in schemas) {
      this.models[modelName] = this.connection.model(modelName, schemas[modelName] || {});
    }
    this.mongoose.connection = this.connection;
    return Promise.resolve(this);
  }

  connect() {
    let mongooseConnectionPoolLimit = 5;

    if (process.env.MONGOOSE_CONNECTION_POOL_LIMIT &&
      !Number.isNaN(process.env.MONGOOSE_CONNECTION_POOL_LIMIT)) {
      mongooseConnectionPoolLimit = parseInt(process.env.MONGOOSE_CONNECTION_POOL_LIMIT);
    }

    this.connection = this.mongoose.createConnection(this.connectionString, {
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      keepAlive: true,
      poolSize: mongooseConnectionPoolLimit,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    this.connection.config.autoIndex = !!process.env.GENERATE_AUTO_INDEX;

    return Promise.resolve(this);
  }

  verifyConnection() {
    return new Promise((resolve, reject) => {
      this.connection
        .on('error', reject)
        .once('open', () => resolve(this));
    });
  }

  reset() {
    this.models = {};
    this.connection = undefined;
    this.startCount = 0;
  }
}

module.exports = Connection;
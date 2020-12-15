const Connection = require('./dbConnection');

class ConnectionFactory {
  constructor() {
    this.connectionsMap = new Map();
  }

  getInstance({ connectionString, mongoose }) {
    if (!this.connectionsMap.has(connectionString)) {
      const conn = new Connection({ connectionString, mongoose });
      this.connectionsMap.set(connectionString, conn);
    }

    return this.connectionsMap.get(connectionString);
  }

  releaseInstance(connectionString) {
    const conn = this.connectionsMap.get(connectionString);
    if (conn) {
      return conn.stop();
    }
  }

  getMongooseConnectionForInstance(connectionString) {
    const conn = this.connectionsMap.get(connectionString);
    if (conn) {
      return conn.connection;
    }
    return undefined;
  }
}

module.exports = new ConnectionFactory();

const MongoClient = require("mongodb").MongoClient;
let _db;
let _client;

function initDb(callback) {
  if (_db) {
    console.warn(`🔁 Database was already initialized!`);
    return callback(null, _db);
  }
  MongoClient.connect(
    process.env.DB_URL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err, client) => {
      if (err) {
        return console.warn(`❌ ${err}`);
      }
      console.log(
        `👋 Database initialized - connected to: ${process.env.DB_URL}`
      );
      _client = client;
      _db = client.db(process.env.DB_NAME);
      return callback(null, _db);
    }
  );
}

function getDb() {
  if (!_db)
    return console.warn(
      `❌ Database has not been initialized. Please called init first.`
    );
  return _db;
}

function closeConnection() {
  if (!_client) return console.warn(`❌ Client has not been initialized.`);
  return _client.close();
}

module.exports = {
  getDb,
  initDb,
  closeConnection
};

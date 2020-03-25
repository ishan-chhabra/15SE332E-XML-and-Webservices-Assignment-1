const MongoClient = require("mongodb").MongoClient;
let _db;

function initDb(callback) {
  if (_db) {
    console.warn("Trying to init DB again!");
    return callback(null, _db);
  }
  MongoClient.connect(process.env.DB_URL, (err, client) => {
    if (err) {
      return console.log(err);
    }
    console.log("DB initialized - connected to: " + process.env.DB_URL);
    _db = client.db(process.env.DB_NAME);
    return callback(null, _db);
  });
}

function getDb() {
  if (!_db)
    return console.warn(
      "Db has not been initialized. Please called init first."
    );
  return _db;
}

module.exports = {
  getDb,
  initDb
};

require("dotenv").config();
const db = require("./utils/db");

var fs = require("fs"),
  xml2js = require("xml2js");

var parser = new xml2js.Parser();

async function initApp() {
  await db.initDb((err, _db) => {
    if (err !== null)
      return console.warn(`❌ Caught an error while initing: ${err}`);
    fs.readFile(__dirname + process.env.XML_FILE_PATH, function(err, data) {
      if (err)
        return console.warn(`❌ Caught an error while reading XML: ${err}`);
      parser.parseString(data, async function(err, parsedString) {
        if (err)
          return console.warn(`❌ Caught an error while parsing XML: ${err}`);

        var stocks = parsedString.stocks.stock;

        stocks.map(stock => {
          stock.symbol = stock.symbol[0];
          stock.price = +stock.price[0];
          stock.quantity = +stock.quantity[0];
        });

        const result = await _db.collection("stocks").insertMany(stocks);
        console.log(`💃 ${result.insertedCount} documents inserted!`);
        console.table(result.ops);
        db.closeConnection();
      });
    });
  });
}

initApp();

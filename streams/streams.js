const fs = require("fs");
const { Transform } = require("readable-stream");

const readPoemStream = fs.createReadStream("on-joy-and-sorrow-emoji.txt", { autoClose: true });

const writePoemStream = fs.createWriteStream("on-joy-and-sorrow-updated.txt", { autoClose: true });

const transformer = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().replaceAll(":)", "joy").replaceAll(":(", "sorrow"));
  },
});

readPoemStream.pipe(transformer).pipe(writePoemStream);

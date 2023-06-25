const http = require("http");
const fs = require("fs");

function doOnRequest(request, response) {
  let body = "";
  if (request.method === "POST" || request.method === "PUT") {
    request.on("data", (chunk) => {
      body += chunk;
    });
  }

  const handleError = (err) => {
    console.error(err);
    response.statusCode = 500;
    response.end(err);
  };
  if (request.method === "GET" && request.url === "/") {
    fs.readFile("index.html", "utf-8", (err, data) => {
      if (err) {
        handleError(err);
        return;
      }
      response.end(data);
    });
  } else if (request.method === "GET" && request.url === "/style.css") {
    fs.readFile("style.css", "utf-8", (err, data) => {
      if (err) {
        handleError(err);
        return;
      }
      response.end(data);
    });
  } else if (request.method === "POST" && request.url === "/sayHi") {
    fs.appendFile("./hi_log.txt", "Somebody said hi.\n", (err) => {
      if (err) {
        handleError(err);
        return;
      }
      response.end("hi back to you!");
    });
  } else if (request.method === "POST" && request.url === "/greeting") {
    request.on("end", () => {
      fs.appendFile("./hi_log.txt", `${body}\n`, (err) => {
        if (err) {
          handleError(err);
          return;
        }
        if (body === "hello") {
          response.end("hello there!");
          return;
        }
        if (body === "what's up") {
          response.end("the sky");
          return;
        }

        response.end("good morning");
      });
    });
  } else if (request.method === "PUT" && request.url === "/update-greeting") {
    request.on("end", () => {
      fs.writeFile("./hi_log.txt", `${body}\n`, (err) => {
        if (err) {
          handleError(err);
          return;
        }
        response.end("updated successfully!");
      });
    });
  } else if (request.method === "DELETE" && request.url === "/delete-greeting") {
    fs.unlink("./hi_log.txt", (err) => {
      if (err) {
        handleError(err);
        return;
      }
      response.end("deleted successfully!");
    });
  } else {
    response.statusCode = 404;
    response.end("Error: Not Found");
  }
}

const server = http.createServer(doOnRequest);

server.listen(3000);

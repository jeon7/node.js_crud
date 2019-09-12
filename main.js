var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");
var dirData = "./data";

var app = http.createServer(function (request, response) {
  var queryString = request.url;
  var queryData = url.parse(queryString, true).query;
  var pathName = url.parse(queryString, true).pathname;
  var title = queryData.id;

  if (pathName === "/") {
    showWebpage(title, response);
  } else if (pathName === "/create") {
    create(title, response);
  } else if (pathName === "/create_process") {
    createProcess(request, response);
  } else if (pathName === "/update") {
    update(title, response);
  } else if (pathName === "/update_process") {
    updateProcess(request, response);
  } else if (pathName === "/delete_process") {
    deleteProcess(request, response);
  } else {
    response.writeHead(404);
    response.end("Not Found");
  }
});

app.listen(3000);

function showWebpage(title, response) {
  var list;
  var template;
  if (title === undefined) {
    fs.readdir(dirData, function (error, fileList) {
      title = "Welcome";
      var description = "Hello Node.js";
      list = templateList(fileList);
      var control = `
        <a href="/create">create</a>
        `;
      template = templateHTML(title, list, `<h2>${title}</h2>${description}`, control);
      response.writeHead(200);
      response.end(template);
    });
  }
  else {
    fs.readFile(`data/${title}`, "utf8", function (err, description) {
      fs.readdir(dirData, function (error, fileList) {
        list = templateList(fileList);
        var control = `
        <a href="/create">create</a>
        <a href="/update?id=${title}">update</a>
        
        <form action="delete_process" method="POST" 
        onSubmit='return confirm("are you sure that you want to delete?")'>
          <input type="hidden" name="title" value="${title}">
          <input type="submit" value="delete">
        </form>
        `;
        template = templateHTML(title, list, `<h2>${title}</h2>${description}`, control);
        response.writeHead(200);
        response.end(template);
      });
    });
  }
}

function create(title, response) {
  fs.readdir(dirData, function (error, fileList) {
    var list = templateList(fileList);
    title = "WEB - create";
    var body = `
    <form action="create_process" method="POST">
    <p><input type="text" name="title" placeholder="title"></p>
    <p><textarea name="description" cols="50" rows="20" placeholder="description"></textarea></p>
    <p><input type="submit"></p>
    </form>
    `;
    var control = ``;
    var template = templateHTML(title, list, body, control);
    response.writeHead(200);
    response.end(template);
  });
}

function createProcess(request, response) {
  var body = ``;
  var post;
  var postTitle;
  var postDescription;

  request.on('data', function (data) {
    body += data;
  });

  request.on('end', function () {
    post = qs.parse(body);
    postTitle = post.title;
    postDescription = post.description;
    console.log(body);
    console.log(post);
    console.log(postTitle);
    console.log(postDescription);

    //  user input is empty
    if (!postTitle || !postDescription) {
      response.writeHead(200);
      response.end("fill the data");
    } else {
      fs.writeFile(`data/${postTitle}`, postDescription, 'utf8', function (err) {
      });
      response.writeHead(301, { Location: `/?id=${postTitle}` });
      response.end();
    }
  });
}

function update(title, response) {
  fs.readFile(`data/${title}`, "utf8", function (err, description) {
    fs.readdir(dirData, function (error, fileList) {
      list = templateList(fileList);
      var body = `
        <form action="update_process" method="POST">
        <p><input type="hidden" name="title_origin" value="${title}")</p>
        <p><input type="text" name="title_updated" value="${title}"></p>
        <p><textarea name="description" cols="50" rows="20">${description}</textarea></p>
        <p><input type="submit"></p>
        </form>
        `;
      var control = ``;
      template = templateHTML(title, list, body, control);
      response.writeHead(200);
      response.end(template);
    });
  });
}

function updateProcess(request, response) {
  var body = ``;
  var post;
  var postTitleOrigin;
  var postTitleUpdated;
  var postDescription;

  request.on('data', function (data) {
    body += data;
  });

  request.on('end', function () {
    post = qs.parse(body);
    postTitleOrigin = post.title_origin;
    postTitleUpdated = post.title_updated;
    postDescription = post.description;

    console.log(`body-${body}`);
    console.log(post);
    console.log(`postTitleOrigin-${postTitleOrigin}`);
    console.log(`postTitleUpdated-${postTitleUpdated}`);
    console.log(`postDescription-${postDescription}`);

    //  user input is empty
    if (!postTitleUpdated || !postDescription) {
      response.writeHead(200);
      response.end("fill the data");
    } else {
      fs.rename(`data/${postTitleOrigin}`, `data/${postTitleUpdated}`, function (err) {

      });
      fs.writeFile(`data/${postTitleUpdated}`, postDescription, 'utf8', function (err) {

      });


      response.writeHead(301, { Location: `/?id=${postTitleUpdated}` });
      response.end();
    }
  });
}

function deleteProcess(request, response) {
  var body = ``;
  var post;
  var postTitle;

  request.on('data', function (data) {
    body += data;
  });

  request.on('end', function () {
    post = qs.parse(body);
    postTitle = post.title;

    console.log(`body-${body}`);
    console.log(post);
    console.log(`postTitle-${postTitle}`);

    fs.unlink(`data/${postTitle}`, function(err){

    });

    response.writeHead(301, { Location: `/` });
    response.end();

  });
}

function templateList(fileList) {
  var list = `<ul>`;
  for (var i = 0; i < fileList.length; i++) {
    list += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`;
  }
  list += `</ul>`;
  return list;
}

function templateHTML(title, list, body, control) {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}

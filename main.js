var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var path = require('path');
var template = require('./lib/template.js');
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
  var html;
  if (title === undefined) {
    fs.readdir(dirData, function (error, fileList) {
      title = "Welcome";
      var description = "Hello Node.js";
      list = template.list(fileList);
      var control = `
        <a href="/create">create</a>
        `;
      html = template.html(title, list, `<h2>${title}</h2>${description}`, control);
      response.writeHead(200);
      response.end(html);
    });
  }
  else {
    fs.readFile(`data/${title}`, "utf8", function (err, description) {
      fs.readdir(dirData, function (error, fileList) {
        list = template.list(fileList);
        var control = `
        <a href="/create">create</a>
        <a href="/update?id=${title}">update</a>
        
        <form action="delete_process" method="POST" 
        onSubmit='return confirm("are you sure that you want to delete?")'>
          <input type="hidden" name="title" value="${title}">
          <input type="submit" value="delete">
        </form>
        `;
        html = template.html(title, list, `<h2>${title}</h2>${description}`, control);
        response.writeHead(200);
        response.end(html);
      });
    });
  }
}

function create(title, response) {
  fs.readdir(dirData, function (error, fileList) {
    var list = template.list(fileList);
    title = "WEB - create";
    var body = `
    <form action="create_process" method="POST">
    <p><input type="text" name="title" placeholder="title"></p>
    <p><textarea name="description" cols="50" rows="20" placeholder="description"></textarea></p>
    <p><input type="submit"></p>
    </form>
    `;
    var control = ``;
    var html = template.html(title, list, body, control);
    response.writeHead(200);
    response.end(html);
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
      list = template.list(fileList);
      var body = `
        <form action="update_process" method="POST">
        <p><input type="hidden" name="title_origin" value="${title}")</p>
        <p><input type="text" name="title_updated" value="${title}"></p>
        <p><textarea name="description" cols="50" rows="20">${description}</textarea></p>
        <p><input type="submit"></p>
        </form>
        `;
      var control = ``;
      html = template.html(title, list, body, control);
      response.writeHead(200);
      response.end(html);
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

    fs.unlink(`data/${postTitle}`, function (err) {

    });

    response.writeHead(301, { Location: `/` });
    response.end();

  });
}
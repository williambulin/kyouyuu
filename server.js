let fs = require('fs');
let http = require('http');

async function fileExists(filePath) {
  try {
    await fs.promises.readFile(filePath);
    return true;
  } catch (e) {
    // console.log(e);
    return false;
  }
}

async function findFile(filePath) {
  // Check if the file exists
  if (await fileExists(filePath))
    return filePath;
  // Check if the file exists as an html page
  else if (await fileExists(filePath + '.html'))
    return filePath + '.html';
  return filePath;
}

let server = http.createServer(async (req, res) => {
  console.log(req.socket.remoteAddress + ' @ ' + req.url);

  let url = req.url;
  if (url == '/')
    url = '/index.html';

  url = url.split('?')[0];

  let path = await findFile(process.cwd() + '/' + url);
  fs.readFile(path, async (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }

    let headers = {};
    if (path.endsWith('.svg'))
      headers["Content-Type"] = 'image/svg+xml';
    else if (path.endsWith('.js'))
      headers["Content-Type"] = 'application/javascript';
    else if (path.endsWith('.css'))
      headers["Content-Type"] = 'text/css';
    else if (path.endsWith('.html'))
      headers["Content-Type"] = 'text/html';

    let stats = await fs.promises.stat(path);
    headers['Last-Modified'] = `${stats.mtime}`;

    // If the content-type is text/html then inject the hotreload.js script
    if (headers["Content-Type"] == 'text/html') {
      // Read the hotreload.js file
      let hotreload = await fs.promises.readFile(__dirname + '/hotreload.js', 'utf8');

      // Inject the hotreload.js script into the html
      data = data.toString().replace('</body>', `<script>${hotreload}</script></body>`);
    }

    res.writeHead(200, headers);
    res.end(data);
  });
});

server.listen(80);

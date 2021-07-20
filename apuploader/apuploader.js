const fs = require('fs');
const fetch = require('node-fetch');
const Storage = require('@google-cloud/storage');

process.argv.forEach(function(val, index, array) {
  console.log(index + ': ' + val);
});

let pendingUploads = {};

function uploadFile(filename, data, file, fileExt) {
  let ws = file.createWriteStream({
    contentType: fileExt === 'jpg' ? 'image/jpeg' : 'video/mpeg',
    resumable: false,
    metadata: {
      contentDisposition: 'inline',
      'Content-Disposition': 'inline'
    }
  });

  ws.on('finish', data => {
    console.log(`Success upload: ${filename}`);
    return;
  });
  ws.on('error', err => {
    console.error('upload error:', filename, err);
    return;
  });
  ws.end(data);
}

let filePath = process.argv[2];
let apiPath = process.argv[3];
// node apuploader 'c:/apuploaddata' 'http://localhost:5001/bet-chicago/us-central1/api'
// node apuploader "C:\Users\sam_huelsdonk\Desktop\WFA\content\AP Online - Sports" https://us-central1-bet-chicago.cloudfunctions.net/api
let lastupload = ''; //block the double post from change and rename events
fs.watch(filePath, (eventType, filename) => {
  if (eventType !== 'change' && eventType !== 'rename')
    return;
  if (!filename)
    return;

  if (lastupload === filename)
    return;

  let fileExt = filename.substr(filename.length - 3);
  lastupload = filename;

  stackItRight(filename, fileExt, filePath);
});

function stackItRight(filename, fileExt, filePath) {
  let delay = 5000;
  if (fileExt === 'xml') delay = 30000;

  clearTimeout(pendingUploads[filename]);
  pendingUploads[filename] = setTimeout(() => {
    return readAndUpload(filename, fileExt, filePath);
  }, delay);
}

function readAndUpload(filename, fileExt, filePath) {
  fs.readFile(filePath + '/' + filename, (err, data) => {
    if (err || !data) {
      console.log('no data', filename);
      return;
    }
    if (fileExt === 'xml') {
      fetch(`${apiPath}/ap/uploadxml?filename=${encodeURIComponent(filename)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain; charset=utf-8'
          },
          body: data
        })
        .then(r => {
          console.log(r.status, filename);
        })
        .catch(e => console.log(e));
    }

    if (fileExt === 'jpg' || fileExt === 'mpg') {
      let bucketName = 'gs://bet-chicago.appspot.com';
      const storage = new Storage({
        projectId: '542489688565'
      });

      let bkt = storage.bucket(bucketName);

      let nameParts = filename.split('-');
      let articleId = nameParts[0];
      let revisionDate = nameParts[1];
      let imageId = nameParts[2]
      let fileIdPath = articleId + '-' + imageId;

      let file = bkt.file('/apimages/' + fileIdPath);

      file.getMetadata()
        .then(metaData => {
          if (metaData[0].size >= data.length)
            return console.log('exists ' + filename);

          uploadFile(filename, data, file, fileExt);
        })
        .catch(e => uploadFile(filename, data, file, fileExt));
    }
  });
}

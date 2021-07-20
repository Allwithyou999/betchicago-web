const util = require('util');
const parser = require('xml2json');
const firebaseAdmin = require('firebase-admin');
const AppConfig = require('../../../services/appconfig.js');
const fs = require('fs');
const appDBConfig = new AppConfig();

module.exports = {};

module.exports.uploadAPArticleText = (req, res) => {
  let apUploader = new APArticleUpload();
  apUploader.processXMLToFirebase(req.body, req, res);
};
module.exports.uploadAPArticleImage = (req, res) => {
  let apUploader = new APArticleUpload();
  apUploader.processImageToFirebase(req.body, req, res);
};

class APArticleUpload {
  processImageToFirebase(body, req, res) {
    let d = Buffer.from(body, 'base64');
    this.setAPFileToCloud(req.query.filename, d)
      .then(r => {
        return res.status(200).send('{ "success": true }');
      })
      .catch(e => {
        res.status(500).send(e);
        console.log(req.body.filename, e);
      });
  }
  removeTandDot(obj) {
    if (Array.isArray(obj)) {
      for (let c = 0, l = obj.length; c < l; c++)
        this.removeTandDot(obj[c]);
    } else {
      for (let i in obj) {
        let d = obj[i];
        //remove . from names
        if (i.indexOf('.') !== -1) {
          let newI = i.split('.').join('');
          obj[newI] = obj[i];
          delete obj[i];
        }
        if (i.indexOf('$') !== -1) {
          let newI = i.split('$').join('');
          obj[newI] = obj[i];
          delete obj[i];
        }

        if (typeof d !== 'string')
          this.removeTandDot(d);
      }
    }

    return obj;
  }
  processXMLToFirebase(fileStr, req, res) {
    let json = parser.toJson(fileStr);
    let data = JSON.parse(json);
    let filename = req.query.filename;
    let id = filename.split('-')[0];
    let editid = filename.split('-')[1];

    if (data.entry) {
      this.removeTandDot(data.entry);
    }

    firebaseAdmin.database().ref(`/apArticleStore/articleFiles/${id}/${editid}`)
      .update({
        id,
        editid,
        filename,
        data
      })
      .then(r2 => this.updateSearchableStore(id))
      .then(r => {
        return res.status(200).send('{ "success": true }');
      })
      .catch(e => {
        res.status(500).send(e);
        console.log(req.body.filename, e);
      });
  }
  __safeFireTag(tag) {
    return tag.toLowerCase().replace(/[[\]{}"'()*+? .\\^$|]/g, '');
  }
  updateSearchableStore(id) {
    return firebaseAdmin.database().ref(`/apArticleStore/articleFiles/${id}`).once('value')
      .then(result => {
        let versions = result.val();
        let version = null;
        let lastDate = '';
        for (let editid in versions) {
          let newDate = '';
          try {
            newDate = versions[editid].data.entry['apnm:NewsManagement']['apnm:PublishingReleaseDateTime'];
          } catch (e) {
            console.log('missing release date ap article', id, e);
          }

          if (!version || newDate > lastDate) {
            version = versions[editid];
            lastDate = newDate;
          }
        }
        if (!version) {
          console.log('no version found');
          return Promise.resolve(null);
        }

        let out_article = {};
        let contentText = '';
        let contentRaw = [];
        let media = [];
        if (lastDate)
          out_article.editDate = lastDate;

        if (version.data.entry['apcm:ContentMetadata']) {
          let dd = version.data.entry['apcm:ContentMetadata'];

          let fields = ['apcm:DateLine', 'apcm:HeadLine', 'apcm:ExtendedHeadline', 'apcm:ExtendedHeadline', 'apcm:SlugLine', 'apcm:SubjectClassification', 'apcm:EntityClassification'];
          for (let c = 0, l = fields.length; c < l; c++)
            if (dd[fields[c]])
              out_article[fields[c].split(':').join('')] = dd[fields[c]];

          let tags = {};
          let ids = [];
          let eids = [];
          if (out_article.apcmSubjectClassification)
            for (let c = 0, l = out_article.apcmSubjectClassification.length; c < l; c++) {
              if (!out_article.apcmSubjectClassification[c].Value)
                continue;
              if (out_article.apcmSubjectClassification[c].Value.length < 3)
                continue;
              ids.push(out_article.apcmSubjectClassification[c].Id);
              tags[this.__safeFireTag(out_article.apcmSubjectClassification[c].Value)] = true;
            }

          if (out_article.apcmEntityClassification)
            for (let c = 0, l = out_article.apcmEntityClassification.length; c < l; c++) {
              if (!out_article.apcmEntityClassification[c].Value)
                continue;
              eids.push(out_article.apcmEntityClassification[c].Id);
              tags[this.__safeFireTag(out_article.apcmEntityClassification[c].Value)] = true;
            }

          out_article.EntityIds = eids;
          out_article.SubjectIds = ids;
          out_article.tags = tags;

          try {
            if (version.data.entry.content.nitf) {
              if (version.data.entry.content.nitf.body.bodycontent.block.p) {
                if (Array.isArray(version.data.entry.content.nitf.body.bodycontent.block.p)) {
                  contentRaw = version.data.entry.content.nitf.body.bodycontent.block.p;
                  contentText = version.data.entry.content.nitf.body.bodycontent.block.p.join(' ');
                } else {
                  contentRaw = [version.data.entry.content.nitf.body.bodycontent.block.p];
                  contentText = version.data.entry.content.nitf.body.bodycontent.block.p;
                }
              }

              if (version.data.entry.content.nitf.body.bodycontent.media) {
                let mA = [];
                if (Array.isArray(version.data.entry.content.nitf.body.bodycontent.media)){
                  mA = version.data.entry.content.nitf.body.bodycontent.media;
                }
                else {
                  mA = [version.data.entry.content.nitf.body.bodycontent.media];
                }

                for (let c = 0, l = mA.length; c < l; c++) {
                  media.push({
                    id: mA[c].id,
                    caption: mA[c]['media-caption'],
                    refs: mA[c]['media-reference']
                  })
                }
              }
            }
          } catch (e) {
            console.log('body not found', id, e);
          }
        }

        let list_article = Object.assign({}, out_article);
        out_article.contentText = contentText;
        out_article.contentRaw = contentRaw;
        out_article.media = media;
        list_article.summary = contentText.substring(0, 2000);
        if (media[0])
          list_article.mainMedia = media[0];

        let tag_updates = {};
        if (out_article.editDate)
          for (let tag in out_article.tags)
            tag_updates[tag + `/${id}`] = out_article.editDate;

        let slug = out_article.apcmSlugLine;
        if (!slug) slug = '';
        slug = this.__safeFireTag(slug);
        if (!slug) {
          slug = 'invalid';
          return Promise.resolve({});
        }
        out_article.slug = slug;
        let promises = [
          firebaseAdmin.database().ref(`/apArticleStore/skinny/byId`).update({
            [id]: out_article
          }),
          firebaseAdmin.database().ref(`/apArticleStore/skinny/smallById`).update({
            [id]: list_article
          }),
          firebaseAdmin.database().ref(`/apArticleStore/skinny/byTag`).update(tag_updates),
          firebaseAdmin.database().ref(`/apArticleStore/skinny/bySlug`).update({
            [slug]: id
          })
        ];

        return Promise.all(promises);
      });
  }
}

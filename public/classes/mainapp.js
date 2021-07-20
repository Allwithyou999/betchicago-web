class cApplication {
  constructor() {
    if (window.cApplicationLocal) return;

    window.cApplicationLocal = this;

    this.readPageInfo();
    this.scrapeDOMData();
    //this.loadModels();

    //empty the original article dom
    document.querySelector('.main-body-flex-wrapper').innerHTML = '';
    this.menuShown = false;
    this.moreMenuDom = document.querySelector('.navigation-more-menu');
    document.body.addEventListener(
      'click',
      e => {
        if (this.menuShown) {
          this.moreMenuDom.style.maxHeight = '0px';
          this.moreMenuDom.style.paddingBottom = '0px';
          this.menuShown = false;
        }
      },
      false
    );
    document
      .querySelector('.more-menus-anchor')
      .addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        if (this.menuShown) {
          this.moreMenuDom.style.maxHeight = '0px';
          this.moreMenuDom.style.paddingBottom = '0px';
          this.menuShown = false;
        } else {
          this.moreMenuDom.style.paddingTop = '20px';
          this.moreMenuDom.style.paddingBottom = '20px';
          this.moreMenuDom.style.maxHeight = '5000px';
          let h = this.moreMenuDom.scrollHeight;
          this.moreMenuDom.style.maxHeight = '0px';
          this.moreMenuDom.scrollHeight;
          this.moreMenuDom.style.maxHeight = h.toString() + 'px';
          this.menuShown = true;
        }

        return false;
      });

    //append css
    let appendCSS = '';
    let agentCleaned = navigator.userAgent.replace(/[[\]{}()*+?.\\^$|;]/g, '');
    let agentParts = agentCleaned.split(' ');
    let allParts = [];
    for (let c = 0, l = agentParts.length; c < l; c++)
      allParts = allParts.concat(agentParts[c].split('/'));

    let safari = false;
    let iOS = false;
    let chrome = false;
    if (allParts.indexOf('iPhone') > -1 && allParts.indexOf('Safari') > -1)
      safari = true;
    else if (allParts.indexOf('iPhone') > -1 && allParts.indexOf('Chrome') > -1)
      chrome = true;
    else if (allParts.indexOf('iPhone') > -1 && allParts.indexOf('Mobile') > -1)
      iOS = true;
    else if (allParts.indexOf('iPad') > -1 && allParts.indexOf('Safari') > -1)
      safari = true;
    else if (allParts.indexOf('iPad') > -1 && allParts.indexOf('Chrome') > -1)
      chrome = true;
    else if (allParts.indexOf('iPad') > -1 && allParts.indexOf('Mobile') > -1)
      iOS = true;

    let grayBarPadding = 110;
    if (iOS) {
      appendCSS += `.navigation-react-header-wrapper {
        display: none;
      }
      .body-wrapper {
        padding-top: 0px;
      }`;
      grayBarPadding -= 50;
    }

    if (
      this.pageLeague === 'mlb-betting' ||
      this.pageLeague === 'golf-odds' ||
      this.pageLeague === 'ncaa-basketball-betting'
    ) {
      appendCSS += `.section-header-gray-bar {
  display: flex;
}

@media screen and (max-width: 768px) {
  .body-wrapper {
    padding-top: ${grayBarPadding}px;
  }
}
`;
    }

    window.hideNavMobileStyleBlock = document.createElement('style');
    window.hideNavMobileStyleBlock.innerHTML = appendCSS;
    document.body.appendChild(window.hideNavMobileStyleBlock);

    this.loadWebPack();
    //  this.addBackButton();

    window.addEventListener('beforeunload', () => this.showNavigatingSpinner());
  }
  showNavigatingSpinner() {
    document.querySelector('#root').innerHTML = '';
  }
  addBackButton() {
    if (
      this.isIos() &&
      window.location.pathname !== '/' &&
      this.isInStandaloneMode()
    ) {
      let backButton = document.createElement('button');
      backButton.innerHTML = 'Back';
      backButton.style.position = 'fixed';
      backButton.style.bottom = '20px';
      backButton.style.right = '20px';
      backButton.style.color = 'blue';
      backButton.style.background = 'white';
      backButton.style.padding = '5px';

      backButton.addEventListener('click', e => {
        window.history.back();
      });
      document.body.appendChild(backButton);
    }
  }
  isIos() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  }
  isInStandaloneMode() {
    return 'standalone' in window.navigator && window.navigator.standalone;
  }
  isChromeiOS() {
    if (window.navigator.userAgent.indexOf('CriOS') !== -1) return true;
    if (window.navigator.userAgent.indexOf('Chrome') !== -1) return true;
    return false;
  }
  isSafari() {
    return window.navigator.userAgent.indexOf('Safari') !== -1;
  }

  loadModels() {
    let golfModel = new BCGolfModel();
    golfModel
      .init()
      .then(r => {
        return;
      })
      .catch(e => console.log(e));
  }
  scrapeDOMData() {
    this.readArticleList('headlinesList', 'headlines-list-content-wrapper');
    this.readMainArticle();
    this.readSeoData();
    let exclusionIds = [];

    if (
      this.componentSlugData &&
      this.componentSlugData.component !== 'MixedNews'
    ) {
      for (let c = 0, l = this.headlinesList.length; c < l; c++)
        exclusionIds.push(this.headlinesList[c].id);
    }

    this.readArticleList(
      'articleList',
      'article-list-content-wrapper',
      exclusionIds,
      true
    );
    this.readArticleList(
      'trending',
      'trending-article-list-content-wrapper',
      exclusionIds
    );
    this.readArticleList(
      'league',
      'league-article-list-content-wrapper',
      exclusionIds,
      true
    );

    //exclude article if this is an author list`
    if (this.mainArticle) exclusionIds.push(this.mainArticle.id);
    this.readArticleList(
      'author',
      'author-article-list-content-wrapper',
      exclusionIds,
      true
    );
    this.readMenus();
  }

  loadWebPack() {
    fetch(this.contentPathPrefix + 'build/asset-manifest.json', {
      cache: 'no-cache'
    })
      .then(rrr => rrr.json())
      .then(json => {
        //load web load WebPack
        let js = json['main.js'];

        let scriptTag = document.createElement('script');
        scriptTag.src = this.contentPathPrefix + 'build/' + js;
        document.body.appendChild(scriptTag);
      });
  }
  readPageInfo() {
    let pageTypeTag = document.querySelector('meta[property="pagetype"]');
    this.pageType = '';
    if (pageTypeTag) this.pageType = pageTypeTag.getAttribute('content');

    let pageSectionTag = document.querySelector('meta[property="pagesection"]');
    this.pageSection = '';
    if (pageSectionTag)
      this.pageSection = pageSectionTag.getAttribute('content');

    let sectionColorTag = document.querySelector(
      'meta[property="sectioncolor"]'
    );
    this.sectionColor = '';
    if (sectionColorTag)
      this.sectionColor = sectionColorTag.getAttribute('content');

    let leagueTag = document.querySelector('meta[property="pageleague"]');
    this.pageLeague = '';
    if (leagueTag) this.pageLeague = leagueTag.getAttribute('content');

    let leagueIDTag = document.querySelector('meta[property="pageleagueid"]');
    this.pageLeagueID = '';
    if (leagueIDTag) this.pageLeagueID = leagueIDTag.getAttribute('content');

    let staticContentPathTag = document.querySelector(
      'meta[property="staticContentPath"]'
    );
    this.staticContentPath = '';
    if (staticContentPathTag)
      this.staticContentPath = staticContentPathTag.getAttribute('content');

    let staticContentLocalPathTag = document.querySelector(
      'meta[property="staticContentLocalPath"]'
    );
    this.staticContentLocalPath = '';
    if (staticContentLocalPathTag)
      this.staticContentLocalPath = staticContentLocalPathTag.getAttribute(
        'content'
      );

    if (window.location.href.indexOf('//localhost') === -1)
      this.contentPathPrefix = this.staticContentPath;
    else this.contentPathPrefix = this.staticContentLocalPath;

    let dburlTag = document.querySelector('meta[property="dburl"]');
    this.dbURL = 'https://betchicagodev.firebaseio.com';
    if (dburlTag) this.dbURL = dburlTag.getAttribute('content');
    firebase.initializeApp({
      databaseURL: this.dbURL
    });

    let ptt = document.querySelector('meta[property="patchslug"]');
    if (ptt) {
      let text = ptt.getAttribute('content');
      if (text === 'true') {
        this.patchSlug = true;
        let ptt2 = document.querySelector('meta[property="patchslugjson"]');
        let json = ptt2.getAttribute('content');
        this.patchSlugData = JSON.parse(json);
      }
    }

    ptt = document.querySelector('meta[property="componentslugjson"]');
    if (ptt) {
      let json = ptt.getAttribute('content');
      this.componentSlugData = JSON.parse(json);
    }
  }
  readArticleList(storeName, domName, excludelist = [], sort) {
    let articleListDom = document.querySelectorAll(`.${domName} li`);

    let articleList = [];
    for (let c = 0, l = articleListDom.length; c < l; c++) {
      let dom = articleListDom[c];
      let a = dom.querySelector('a');
      let headline = a.innerHTML;
      let id = dom.getAttribute('data-id');

      if (excludelist.indexOf(id) !== -1) continue;

      let url = a.getAttribute('href');
      if (url[0] === '/') url = url.substr(1);
      let image = dom.getAttribute('data-image');
      let summary = dom.getAttribute('data-summary');
      let imageAlt = dom.getAttribute('data-phototitle');
      let created = dom.getAttribute('data-created');
      let updated = dom.getAttribute('data-updated');
      let sectionName = dom.getAttribute('data-sectionname');
      let sectionColor = dom.getAttribute('data-sectioncolor');
      let sectionSlug = dom.getAttribute('data-sectionslug');
      let thumbnail = dom.getAttribute('data-thumbnail');

      let authors = [];
      let more = true;
      let authorIndex = 0;
      while (more) {
        let authorId = dom.getAttribute(`data-author-id${authorIndex}`);
        if (authorId)
          authors.push({
            id: authorId,
            title: dom.getAttribute(`data-author-title${authorIndex}`),
            fullname: dom.getAttribute(`data-author-fullname${authorIndex}`),
            company: dom.getAttribute(`data-author-company${authorIndex}`),
            twitter: dom.getAttribute(`data-author-twitter${authorIndex}`)
          });
        else more = false;

        authorIndex++;
      }

      articleList.push({
        headline,
        id,
        url,
        imageAlt,
        authors,
        image,
        imageLink: image,
        summary,
        updated,
        created,
        sectionName,
        sectionColor,
        sectionSlug,
        href: url,
        title: headline,
        thumbnail
      });
    }

    if (sort) {
      articleList = articleList.sort((a, b) => {
        if (new Date(a.updated) > new Date(b.updated)) return -1;
        if (new Date(a.updated) < new Date(b.updated)) return 1;
        return 0;
      });
    }

    this[storeName] = articleList;
  }
  __innerHTML(obj, query) {
    let t = obj.querySelector(query);
    if (t) return t.innerHTML;

    return '';
  }
  readSeoData() {
    const pageHeadlineDiv = document.querySelector('.page-headline');
    const seoFooterHeadlineDiv = document.querySelector('.seo-footer-headline');
    const seoFooterContentDiv = document.querySelector('.seo-footer-content');
    const rightSidebarWidgetDiv = document.querySelector(
      '.right-sidebar-widget'
    );

    if (pageHeadlineDiv) {
      window.cApplicationLocal.pageHeadline = pageHeadlineDiv.textContent;
    }

    if (seoFooterHeadlineDiv) {
      window.cApplicationLocal.seoFooterHeadline =
        seoFooterHeadlineDiv.textContent;
    }

    if (seoFooterContentDiv) {
      var content = seoFooterContentDiv.textContent;
      content = content.replace('&lt;', '<');
      content = content.replace('&gt;', '>');
      window.cApplicationLocal.seoFooterContent = content;
    }

    if (rightSidebarWidgetDiv) {
      var content = rightSidebarWidgetDiv.textContent;
      content = content.replace('&lt;', '<');
      content = content.replace('&gt;', '>');
      window.cApplicationLocal.rightSidebarWidget = content;
    }
  }
  readMainArticle() {
    let classWrapper = 'home-page-main-content-feed';

    if (this.pageType === 'article')
      classWrapper = 'article-page-main-article-wrapper';
    let oW = document.querySelector('.' + classWrapper);

    if (!oW) return;

    let aW = oW.querySelector('.article-featured-content-wrapper');

    if (aW) {
      let articleId = aW.getAttribute('data-id');
      let articleContent = aW.getAttribute('data-content');
      let image = aW.getAttribute('data-image');
      let imageAlt = aW.getAttribute('data-phototitle');
      let imageCaption = aW.getAttribute('data-photocred');
      let href = aW.getAttribute('href');
      let headline = oW.querySelector('.article-headline').innerHTML;
      let league = oW.querySelector('.league-name').innerHTML;

      let sectionName = aW.getAttribute('data-sectionname');
      let sectionColor = aW.getAttribute('data-sectioncolor');
      let sectionSlug = aW.getAttribute('data-sectionslug');

      let articleSummary = this.__innerHTML(oW, '.article-summary');
      let createdAt = this.__innerHTML(oW, '.created-at');
      let updatedAt = this.__innerHTML(oW, '.updated-at');
      let apImages = [];
      try {
        apImages = JSON.parse(oW.querySelector('.ap-image-data').value);
      } catch (e) {
        e;
      }
      for (let c = 0, l = apImages.length; c < l; c++) {
        let bigId = apImages[c].refs[1].id.split(':')[1];
        let smallId = apImages[c].refs[0].id.split(':')[1];
        let pId = apImages[c].refs[2].id.split(':')[1];
        apImages[
          c
        ].aBigHref = `https://www.googleapis.com/download/storage/v1/b/bet-chicago.appspot.com/o/apimages%2F${articleId}-${smallId}.jpg?alt=media`;
        apImages[
          c
        ].aSmallHref = `https://www.googleapis.com/download/storage/v1/b/bet-chicago.appspot.com/o/apimages%2F${articleId}-${bigId}.jpg?alt=media`;
        apImages[
          c
        ].aPreviewHref = `https://www.googleapis.com/download/storage/v1/b/bet-chicago.appspot.com/o/apimages%2F${articleId}-${pId}.jpg?alt=media`;
        apImages[c].alt = apImages[c].refs[0]['alternate-text'];
      }

      this.apImages = apImages;

      let authorIndex = 0;
      let authors = [];
      let more = true;
      while (more) {
        let fullname = oW.querySelector(`.author-fullname${authorIndex}`);
        if (fullname)
          authors.push({
            title: oW.querySelector(`.author-title${authorIndex}`).innerHTML,
            fullname: fullname.innerHTML,
            company: oW.querySelector(`.author-company${authorIndex}`)
              .innerHTML,
            image: oW.querySelector(`.author-image${authorIndex}`).innerHTML,
            id: oW.querySelector(`.author-id${authorIndex}`).innerHTML,
            twitter: oW.querySelector(`.author-twitter${authorIndex}`)
              .innerHTML,
            bio: oW.querySelector(`.author-bio${authorIndex}`).innerHTML
          });
        else more = false;

        authorIndex++;
      }

      let author = '';
      let authorTitle = '';
      let authorImage = '';
      let authorId = '';
      let authorBio = '';
      let authorWebsite = '';
      let authorPosition = '';
      if (authors[0]) {
        author = authors[0].fullname;
        authorTitle = authors[0].twitter;
        authorImage = authors[0].image;
        authorId = authors[0].id;
        authorBio = authors[0].bio;
        authorWebsite = authors[0].websiteUrl;
        authorPosition = authors[0].company;
      }

      this.mainArticle = {
        id: articleId,
        title: headline,
        imageLink: image,
        pageUrl: href,
        tags: '',
        content: articleContent,
        href,
        image,
        imageAlt,
        imageCaption,
        author,
        authorTitle,
        authorBio,
        authorWebsite,
        authorPosition,
        sectionName,
        sectionColor,
        sectionSlug,
        authorImage,
        authorId,
        headline,
        authors,
        articleSummary,
        articleContent,
        createdAt,
        updatedAt
      };
    } else {
      this.mainArticle = {
        title: 'No articles found',
        content: '',
        headline: 'No articles found'
      };
    }
  }
  readMenus() {
    let links = document.querySelectorAll('.navigation-main-menu > li');
    this.mainMenus = [];
    for (let c = 0, l = links.length; c < l; c++) {
      let a = links[c].querySelector('a');
      let span = links[c].querySelector('span');
      let submenu = this.__readSubMenus(links[c]);

      if (!a) continue;
      let d = {
        href: a.getAttribute('href'),
        text: a.innerHTML,
        id: span.innerHTML,
        submenu
      };
      if (d.href !== '/home' && d.text !== '...') this.mainMenus.push(d);
    }

    links = document.querySelectorAll('.navigation-more-menu > li');
    this.moreMenus = [];
    for (let c = 0, l = links.length; c < l; c++) {
      let a = links[c].querySelector('a');
      let submenu = this.__readSubMenus(links[c]);

      if (!a) continue;
      let d = {
        href: a.getAttribute('href'),
        text: a.innerHTML,
        submenu
      };

      if (d.href === '/home') a.parentElement.remove();
      if (d.href !== '/home') this.moreMenus.push(d);
    }

    links = document.querySelectorAll('.navigation-anchor-pages li');
    this.anchorPages = [];
    for (let c = 0, l = links.length; c < l; c++) {
      let a = links[c].querySelector('a');

      if (!a) continue;
      let p = links[c].querySelector('p');
      let d = {
        href: a.getAttribute('href'),
        text: a.innerHTML,
        title: p ? p.innerHTML : ''
      };
      if (d.href !== '/home') this.anchorPages.push(d);
    }
  }
  __readSubMenus(dom) {
    let links = dom.querySelectorAll('.sections-header-band > li a');
    let sectionHeaders = [];
    for (let c = 0, l = links.length; c < l; c++) {
      let a = links[c];
      let href = a.getAttribute('href');

      sectionHeaders.push({
        href: href.replace('NCAAMB', ''),
        text: a.innerHTML
      });
    }
    return sectionHeaders;
  }
  __fetchNFLPlayerStatsPage(db, orderByChild, skip, pageSize) {
    let resultIds, articles;
    return db()
      .ref(`sportRadarStore/nfl/2018/playerOffense/REG`)
      .orderByChild('rushing_yards')
      .limitToLast(pageSize)
      .startAt(skip)
      .once('value')
      .then(result => {
        resultIds = result.val();

        let promises = [];
        /*
        for (let id in resultIds)
          promises.push(
            db()
              .ref(`apArticleStore/skinny/smallById/${id}`)
              .once('value')
          );
*/
        console.log('newstuff', resultIds);
        return Promise.all(promises);
      })
      .then(rawResultList => {
        let articles = [];
        let c = 0;
        /*
        let resultList = [];
        for (let id in resultIds) {
          resultList[c] = rawResultList[c].val();
          if (resultList[c]) {
            resultList[c].id = id;
            articles.push(resultList[c]);
          }
          c++;
        }
        articles = articles.sort((a, b) => {
          if (a.editDate > b.editDate) return -1;
          if (a.editDate < b.editDate) return 1;
          return 0;
        });
*/
        return articles;
      });
  }
  __fetchAPArticles(db, tag) {
    let resultIds, articles;
    return db()
      .ref(`apArticleStore/skinny/byTag/${tag}`)
      .orderByValue()
      .limitToLast(20)
      .once('value')
      .then(result => {
        resultIds = result.val();

        let promises = [];
        for (let id in resultIds)
          promises.push(
            db()
              .ref(`apArticleStore/skinny/smallById/${id}`)
              .once('value')
          );

        return Promise.all(promises);
      })
      .then(rawResultList => {
        let articles = [];
        let c = 0;
        let resultList = [];
        for (let id in resultIds) {
          resultList[c] = rawResultList[c].val();
          if (resultList[c]) {
            resultList[c].id = id;
            articles.push(resultList[c]);
          }
          c++;
        }
        articles = articles.sort((a, b) => {
          if (a.editDate > b.editDate) return -1;
          if (a.editDate < b.editDate) return 1;
          return 0;
        });

        return articles;
      });
  }
  __processAPArticlesToNormal(apArticles) {
    let articleList = [];
    for (let c = 0, l = apArticles.length; c < l; c++) {
      if (!apArticles[c].apcmSlugLine) continue;
      let href = apArticles[c].apcmSlugLine
        .toLowerCase()
        .replace(/[[\]{}"'()*+? .\\^$|]/g, '');
      let article = apArticles[c];
      let image = '';
      let imageAlt = '';

      if (article.mainMedia) {
        if (article.mainMedia.refs) {
          let imageId = article.mainMedia.refs[1].id.split(':')[1];
          image = `https://www.googleapis.com/download/storage/v1/b/bet-chicago.appspot.com/o/apimages%2F${
            article.id
          }-${imageId}.jpg?alt=media`;

          imageAlt = article.mainMedia.refs[1]['alternate-text'];
        }
      }

      articleList.push({
        headline: apArticles[c].apcmHeadLine,
        id: apArticles[c].id,
        updated: apArticles[c].editDate,
        url: href,
        authors: [
          {
            fullname: 'AP',
            title: 'AP'
          }
        ],
        image,
        imageAlt,
        imageLink: image,
        summary:
          apArticles[c].summary
            .split(' ')
            .splice(0, 50)
            .join(' ') + '...',
        href,
        title: apArticles[c].apcmHeadLine
      });
    }

    return articleList;
  }
  getArticlePage(filter) {
    let pagesize = 10;
    if (!window.skipCount) window.skipCount = 15;
    else {
      window.skipCount += pagesize;
    }

    return fetch(
      //      `http://localhost:5001/betchicagodev/us-central1/api/contentfulapi/paged?skip=${window.skipCount}&pagesize=${pagesize}&queryfilter=${filter}`,
      `https://us-central1-bet-chicago.cloudfunctions.net/api/contentfulapi/paged?skip=${
        window.skipCount
      }&pagesize=${pagesize}&queryfilter=${filter}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: '{}'
      }
    ).then(rrr => rrr.json());
  }

  convertRestToLocal(restRecords) {
    let processedRecords = [];
    for (let c = 0, l = restRecords.length; c < l; c++) {
      let d = restRecords[c];
      let image = '';
      let imageAlt = '';
      let sectionColor = '';
      let sectionName = '';
      let sectionSlug = '';
      let thumbnail = '';
      let authors = [];

      try {
        image = d.fields.featuredImage.fields.file.url;
        imageAlt = d.fields.featuredImage.fields.description;
      } catch (e) {}
      try {
        sectionName = d.fields.section[0].fields.name;
        sectionSlug = d.fields.section[0].fields.sectionSlug;
      } catch (e) {}
      try {
        thumbnail = d.fields.thumbnail.fields.file.url;
      } catch (e) {}

      try {
        authors.push({
          company: d.fields.author[0].fields.company,
          fullname: d.fields.author[0].fields.fullName,
          twitter: d.fields.author[0].fields.twitterHandle
        });
      } catch (e) {}

      let rec = {
        id: d.sys.id,
        created: d.fields.pubDateTime,
        updated: d.fields.pubDateTime,
        authors,
        headline: d.fields.headline,
        href: d.fields.pageUrl,
        image,
        imageLink: image,
        imageAlt,
        sectionColor,
        sectionName,
        sectionSlug,
        summary: d.fields.summary,
        thumbnail,
        title: d.fields.pageTitle,
        url: d.fields.pageUrl
      };
      processedRecords.push(rec);
    }

    return processedRecords;
  }
}

function setCookie(name, value, days) {
  var expires = '';
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

function getCookie(name) {
  var nameEQ = name + '=';
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  document.cookie = name + '=; Max-Age=-99999999;';
}
window.initApp = () => new cApplication();

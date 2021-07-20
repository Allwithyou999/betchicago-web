const contentful = require('contentful');
const functions = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
const AppConfig = require('./appconfig.js');

//should be stateless
module.exports = class Contentful {
  static getClient(privateConfig) {
    if (privateConfig.contentfulPreviewKey) {
      return contentful.createClient({
        space: privateConfig.contentfulSpace,
        accessToken: privateConfig.contentfulPreviewKey,
        host: 'preview.contentful.com'
      });
    }

    return contentful.createClient({
      space: privateConfig.contentfulSpace,
      accessToken: privateConfig.contentfulDeliveryKey
    });
  }
  static getNavigationData() {
    return Promise.all([
        firebaseAdmin.database().ref('/contentfulStore/navigation_test').once('value'),
        firebaseAdmin.database().ref('/contentfulStore/anchorPages').once('value')
      ])
      .then(results => ({
        navigation: results[0].val(),
        anchorPages: results[1].val()
      }));
  }
  static updateNavigationData() {
    let appConfig = new AppConfig();
    let client, navigation, sectionPages;
    return appConfig.getConfig(true)
      .then(config => this.getClient(appConfig.privateConfig))
      .then(resultClient => {
        client = resultClient;
        return client.getEntries({
          'content_type': 'sectionPages',
          include: 2,
          limit: 200
        });
      })
      .then(rawData => {
        sectionPages = rawData.items;
        return client.getEntries({
          'content_type': 'navigation',
          include: 2
        });
      })
      .then(rawData => this.processNavigationResults(rawData, sectionPages))
      .then(resultNav => {
        navigation = resultNav;
        return client.getEntries({
          'content_type': 'anchorPagev2',
          include: 2,
          limit: 200
        });
      })
      .then(anchorPageData => this.processAnchorPages(anchorPageData))
      .then(anchorPages => {
        navigation.aLastUpdated = new Date().toISOString();
        return firebaseAdmin.database().ref('/contentfulStore').update({
          navigation_test: navigation,
          anchorPages
        });
      });
  }
  static processAnchorPages(anchorPageData) {
    //sectionSlug
    let pages = anchorPageData.items;
    let pagesBySlug = {};
    for (let c = 0, l = pages.length; c < l; c++) {
      let slug = pages[c].fields.sectionSlug;
      pagesBySlug[slug] = pages[c].fields;
      pagesBySlug[slug].id = pages[c].sys.id;
    }
    return pagesBySlug;
  }
  static processNavigationResults(result, sectionPages) {
    let includes = result.includes.Entry;
    let includeObj = {};
    for (let c = 0, l = includes.length; c < l; c++)
      includeObj[includes[c].sys.id] = this.__simpleObj(includes[c], includeObj);
    let navigationObject = this.__simpleObj(result.items[0], includeObj);

    navigationObject.primary = [];
    for (let c = 0, l = navigationObject.primaryNavigation.length; c < l; c++)
      navigationObject.primary.push(this.__simpleObj(navigationObject.primaryNavigation[c], includeObj));
    navigationObject.primaryNavigation = undefined;
    delete navigationObject.primaryNavigation;

    navigationObject.more = [];
    for (let c = 0, l = navigationObject.moreNavigation.length; c < l; c++)
      navigationObject.more.push(this.__simpleObj(navigationObject.moreNavigation[c], includeObj));
    navigationObject.moreNavigation = undefined;
    delete navigationObject.moreNavigation;

    for (let c = 0; c < navigationObject.primary.length; c++) {
      for (let d = 0; d < sectionPages.length; d++) {
        if (sectionPages[d].fields.componentID.toLowerCase() === (navigationObject.primary[c].name.replace(' ', '') + 'home').toLowerCase()) {
          if (sectionPages[d].fields.metaDescription) navigationObject.primary[c].metaDescription = sectionPages[d].fields.metaDescription;
          if (sectionPages[d].fields.metaTitle) navigationObject.primary[c].metaTitle = sectionPages[d].fields.metaTitle;
          if (sectionPages[d].fields.pageHeadline) navigationObject.primary[c].pageHeadline = sectionPages[d].fields.pageHeadline;
          if (sectionPages[d].fields.pageTitle) navigationObject.primary[c].pageTitle = sectionPages[d].fields.pageTitle;
          if (sectionPages[d].fields.seoFooterContent) navigationObject.primary[c].seoFooterContent = sectionPages[d].fields.seoFooterContent;
          if (sectionPages[d].fields.seoFooterHeadline) navigationObject.primary[c].seoFooterHeadline = sectionPages[d].fields.seoFooterHeadline;
          if (sectionPages[d].fields.rightPanelWidgets) navigationObject.primary[c].rightPanelWidgets = sectionPages[d].fields.rightPanelWidgets;
        }
      }

      if (navigationObject.primary[c].sectionComponents) {
        for (let e = 0; e < navigationObject.primary[c].sectionComponents.length; e++) {
          const sectionComponent = navigationObject.primary[c].sectionComponents[e];
          navigationObject.primary[c].sectionComponents[e] = {
            component: sectionComponent.component,
            componentName: sectionComponent.componentName,
            id: sectionComponent.id,
          };
          for (let d = 0; d < sectionPages.length; d++) {
            if (sectionPages[d].fields.componentID.toLowerCase() === (navigationObject.primary[c].name.replace(' ', '') + navigationObject.primary[c].sectionComponents[e].componentName.replace(' ', '')).toLowerCase()) {
              if (sectionPages[d].fields.metaDescription) navigationObject.primary[c].sectionComponents[e].metaDescription = sectionPages[d].fields.metaDescription;
              if (sectionPages[d].fields.metaTitle) navigationObject.primary[c].sectionComponents[e].metaTitle = sectionPages[d].fields.metaTitle;
              if (sectionPages[d].fields.pageHeadline) navigationObject.primary[c].sectionComponents[e].pageHeadline = sectionPages[d].fields.pageHeadline;
              if (sectionPages[d].fields.pageTitle) navigationObject.primary[c].sectionComponents[e].pageTitle = sectionPages[d].fields.pageTitle;
              if (sectionPages[d].fields.seoFooterContent) navigationObject.primary[c].sectionComponents[e].seoFooterContent = sectionPages[d].fields.seoFooterContent;
              if (sectionPages[d].fields.seoFooterHeadline) navigationObject.primary[c].sectionComponents[e].seoFooterHeadline = sectionPages[d].fields.seoFooterHeadline;
              if (sectionPages[d].fields.rightPanelWidgets) navigationObject.primary[c].sectionComponents[e].rightPanelWidgets = sectionPages[d].fields.rightPanelWidgets;
            }
          }
        }
      }
    }

    for (let c = 0; c < navigationObject.more.length; c++) {
      for (let d = 0; d < sectionPages.length; d++) {
        if (sectionPages[d].fields.componentID.toLowerCase() === (navigationObject.more[c].name.replace(' ', '') + 'home').toLowerCase()) {
          if (sectionPages[d].fields.metaDescription) navigationObject.more[c].metaDescription = sectionPages[d].fields.metaDescription;
          if (sectionPages[d].fields.metaTitle) navigationObject.more[c].metaTitle = sectionPages[d].fields.metaTitle;
          if (sectionPages[d].fields.pageHeadline) navigationObject.more[c].pageHeadline = sectionPages[d].fields.pageHeadline;
          if (sectionPages[d].fields.pageTitle) navigationObject.more[c].pageTitle = sectionPages[d].fields.pageTitle;
          if (sectionPages[d].fields.seoFooterContent) navigationObject.more[c].seoFooterContent = sectionPages[d].fields.seoFooterContent;
          if (sectionPages[d].fields.seoFooterHeadline) navigationObject.more[c].seoFooterHeadline = sectionPages[d].fields.seoFooterHeadline;
          if (sectionPages[d].fields.rightPanelWidgets) navigationObject.more[c].rightPanelWidgets = sectionPages[d].fields.rightPanelWidgets;
        }
      }

      if (navigationObject.more[c].sectionComponents) {
        for (let e = 0; e < navigationObject.more[c].sectionComponents.length; e++) {
          const sectionComponent = navigationObject.more[c].sectionComponents[e];
          navigationObject.more[c].sectionComponents[e] = {
            component: sectionComponent.component,
            componentName: sectionComponent.componentName,
            id: sectionComponent.id,
          };
          for (let d = 0; d < sectionPages.length; d++) {
            if (sectionPages[d].fields.componentID.toLowerCase() === (navigationObject.more[c].name.replace(' ', '') + navigationObject.more[c].sectionComponents[e].componentName.replace(' ', '')).toLowerCase()) {
              if (sectionPages[d].fields.metaDescription) navigationObject.more[c].sectionComponents[e].metaDescription = sectionPages[d].fields.metaDescription;
              if (sectionPages[d].fields.metaTitle) navigationObject.more[c].sectionComponents[e].metaTitle = sectionPages[d].fields.metaTitle;
              if (sectionPages[d].fields.pageHeadline) navigationObject.more[c].sectionComponents[e].pageHeadline = sectionPages[d].fields.pageHeadline;
              if (sectionPages[d].fields.pageTitle) navigationObject.more[c].sectionComponents[e].pageTitle = sectionPages[d].fields.pageTitle;
              if (sectionPages[d].fields.seoFooterContent) navigationObject.more[c].sectionComponents[e].seoFooterContent = sectionPages[d].fields.seoFooterContent;
              if (sectionPages[d].fields.seoFooterHeadline) navigationObject.more[c].sectionComponents[e].seoFooterHeadline = sectionPages[d].fields.seoFooterHeadline;
              if (sectionPages[d].fields.rightPanelWidgets) navigationObject.more[c].sectionComponents[e].rightPanelWidgets = sectionPages[d].fields.rightPanelWidgets;
            }
          }
        }
      }
    }

    return navigationObject;
  }
  static __getHeadlineInfo(obj) {
    obj.primaryHeadline = null;
    obj.secondaryHeadlines = [];
    if (obj.headlines) {
      if (obj.headlines.fields.primaryHeadline)
        obj.primaryHeadline = obj.headlines.fields.primaryHeadline.sys.id;
      else
        obj.primaryHeadline = 'N/A';

      let sA = obj.headlines.fields.secondaryHeadlines;
      if (sA)
        for (let c = 0, l = sA.length; c < l; c++)
          obj.secondaryHeadlines.push(sA[c].sys.id);
    }

    return obj;
  }
  static __simpleObj(obj, includeObj) {
    let f = obj.fields;
    f.id = obj.sys.id;
    if (f.sectionComponents) {
      for (let c = 0, l = f.sectionComponents.length; c < l; c++) {
        if (f.sectionComponents[c].sys) {
          let id = f.sectionComponents[c].sys.id;
          let item = includeObj[id];
          if (item)
            f.sectionComponents[c] = item;
        }
      }
    }

    if (f.headlines) {
      f = this.__getHeadlineInfo(f);
    }

    return f;
  }
};

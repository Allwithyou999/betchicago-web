const React = require('react');
const PropTypes = require('prop-types');
const R = React.createElement;

module.exports = class HeaderElement extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return R('head', null,
      this.getTagsManager(),
      this.getHeaderTags(),
      this.getOGTags(),
      this.getAssetLinks()
    );
  }
  getTagsManager() {
    return R('script', {
      dangerouslySetInnerHTML: {
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PWGBK3H');`
      }
    });
  }
  getTitleText() {
    if (this.props.ogTitle)
      return this.props.ogTitle.replace(/(\r\n\t|\n|\r\t)/gm, "");
    return this.props.appConfig.ogTitle;
  }
  getImageURL() {
    let img = '';
    if (this.props.ogImageUrl)
      img = this.props.ogImageUrl;
    else if (this.props.seoShareImg)
      img = this.props.seoShareImg + '?w=630&fm=jpg';
    else
      img = this.props.appConfig.ogImage;

    if (img.substring(0, 2) === '//')
      img = 'https:' + img;

    return img;
  }
  getDescriptionText() {
    if (this.props.ogDescription)
      return this.props.ogDescription.replace(/(\r\n\t|\n|\r\t)/gm, "");
    return this.props.appConfig.ogDescription;
  }
  getKeywords() {
    if (this.keywords)
      return this.keywords;
    return '';
  }
  getOGTags() {
    let tags = [];
    tags.push(R('meta', {
      property: "og:url",
      content: this.props.appConfig.rootFullUrl + this.props.originalUrl
    }));
    tags.push(R('meta', {
      property: "og:type",
      content: "article"
    }));
    tags.push(R('meta', {
      property: "og:title",
      content: this.getTitleText()
    }));
    tags.push(R('meta', {
      property: "og:description",
      content: this.getDescriptionText()
    }));
    tags.push(R('meta', {
      property: "og:image",
      content: this.getImageURL()
    }));
    if (this.props.privateConfig.twitterSite)
      tags.push(R('meta', {
        property: "twitter:site",
        content: this.props.privateConfig.twitterSite
      }));
    if (this.props.privateConfig.twitterSite)
      tags.push(R('meta', {
        property: "twitter:creator",
        content: this.props.privateConfig.twitterSite
      }));
    tags.push(R('meta', {
      property: "twitter:card",
      content: 'summary_large_image'
    }));

    if (this.props.privateConfig.facebookAppId)
      tags.push(R('meta', {
        property: "fb:app_id",
        content: this.props.privateConfig.facebookAppId
      }));
    tags.push(R('meta', {
      property: "pagetype",
      content: this.props.pageType
    }));
    tags.push(R('meta', {
      property: "pagesection",
      content: this.props.pageSection
    }));
    if (this.props.patchSlug) {
      tags.push(R('meta', {
        property: "patchslug",
        content: "true"
      }));
      tags.push(R('meta', {
        property: "patchslugjson",
        content: JSON.stringify(this.props.patchSlug)
      }));
    }
    if (this.props.componentSlug) {
      tags.push(R('meta', {
        property: "componentslugjson",
        content: JSON.stringify(this.props.componentSlug)
      }));
    }
    if (this.props.leagueObj){
      tags.push(R('meta', {
        property: "pageleague",
        content: this.props.leagueObj.sectionSlug
      }));
      tags.push(R('meta', {
        property: "pageleagueid",
        content: this.props.leagueObj.id
      }));
    }
    tags.push(R('meta', {
      property: "safeurlfrag",
      content: this.props.safeUrlFrag
    }));
    if (this.props.dbURL)
      tags.push(R('meta', {
        property: "dburl",
        content: this.props.dbURL
      }));
    if (this.props.sectionColor)
      tags.push(R('meta', {
        property: "sectioncolor",
        content: this.props.sectionColor
      }));
    tags.push(R('link', {
      rel: "manifest",
      href: "/manifest.webmanifest"
    }));
    /*
    cascading  overrides for each case needs to be done here
    if (this.props.seoShareImage)
      tags.push(R('meta', {
        property: "seoShareImage",
        content: this.props.seoShareImage
      }));
    if (this.props.twitterShareImage)
      tags.push(R('meta', {
        property: "twitterShareImage",
        content: this.props.twitterShareImage
      }));
    if (this.props.facebookShareImage)
      tags.push(R('meta', {
        property: "facebookShareImage",
        content: this.props.facebookShareImage
      }));
*/
    return tags;
  }
  getHeaderTags() {
    let tags = [
      R('meta', {
        charSet: 'utf-8'
      }),
      R('meta', {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, height=device-height, viewport-fit=cover'
      }),
      R('title', null, this.getTitleText()),
      R('meta', {
        name: 'description',
        content: this.getDescriptionText()
      }),
      R('meta', {
        name: 'keywords',
        content: this.getKeywords()
      }),
      R('link', {
        rel: "shortcut icon",
        href: "/favicon.ico"
      }),
      R('meta', {
        property: "staticContentPath",
        content: this.props.appConfig.staticContentPath
      }),
      R('meta', {
        property: "staticContentLocalPath",
        content: this.props.appConfig.staticContentLocalPath
      }),
      R('meta', {
        name: "google-site-verification",
        content: "tna7jPeZM0pxN_0kHT5IsOWlCHvQpYni58b9dlu_owE"
      }),
      R('meta', {
        name: "msvalidate.01",
        content: "6214E766B896CCBD653FE26F3F600A8C"
      })
    ];

    return tags;
  }
  getAssetLinks() {
    let links = [
      R('link', {
        rel: "stylesheet",
        href: this.props.staticContentPath + "main.css?v=13433121"
      }),
      R('link', {
        rel: "stylesheet",
        href: this.props.staticContentPath + "react-datepicker.css?v=13433121"
      }),
      R('script', {
        src: this.props.staticContentPath + "main.js?v=1.2434334",
        type: "application/javascript"
      }),
      R('script', {
        src: "//cdn.embedly.com/widgets/platform.js",
        type: "application/javascript"
      }),
      R('script', {
        src: "https://www.gstatic.com/firebasejs/5.1.0/firebase-app.js",
        type: "application/javascript"
      }),
      R('script', {
        src: "https://www.gstatic.com/firebasejs/5.1.0/firebase-database.js",
        type: "application/javascript",
        async: 'true'
      }),
      R('script', {
        src: this.props.staticContentPath + "classes/bcfirebasemodel.js?v=1",
        type: "application/javascript"
      }),
      R('script', {
        src: this.props.staticContentPath + "classes/bcgolfmodel.js?v=1",
        type: "application/javascript"
      }),
      R('script', {
        src: this.props.staticContentPath + "classes/mainapp.js?v=1.089067675",
        type: "application/javascript"
      }),
      R('script', {
        src: "https://cdnjs.cloudflare.com/ajax/libs/marked/0.4.0/marked.min.js",
        type: "application/javascript"
      }),
      R('script', {
        src: "https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js",
        type: "application/javascript"
      }),
      R('link', {
        rel: "apple-touch-icon",
        href: "/images/apple-icon.png"
      }),
      R('link', {
        rel: "apple-touch-icon",
        sizes: "152x152",
        href: "/images/apple-icon-152x152.png"
      }),
      R('link', {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/images/apple-icon-180x180.png"
      }),
      R('link', {
        rel: "apple-touch-icon",
        sizes: "167x167",
        href: "/images/apple-icon-167x167.png"
      }),
      R('meta', {
        rel: "apple-mobile-web-app-capable",
        content: "yes"
      }),
      R('link', {
        rel: "apple-touch-startup-image",
        sizes: "2048x2732",
        href: "/images/apple_splash_2048.png"
      }),
      R('link', {
        rel: "apple-touch-startup-image",
        sizes: "1668x2224",
        href: "/images/apple_splash_1668.png"
      }),
      R('link', {
        rel: "apple-touch-startup-image",
        sizes: "1536x2048",
        href: "/images/apple_splash_1536.png"
      }),
      R('link', {
        rel: "apple-touch-startup-image",
        sizes: "1125x2436",
        href: "/images/apple_splash_1125.png"
      }),
      R('link', {
        rel: "apple-touch-startup-image",
        sizes: "1242x2208",
        href: "/images/apple_splash_1242.png"
      }),
      R('link', {
        rel: "apple-touch-startup-image",
        sizes: "750x1334",
        href: "/images/apple_splash_750.png"
      }),
      R('link', {
        rel: "apple-touch-startup-image",
        sizes: "640x1136",
        href: "/images/apple_splash_640.png"
      })

      /* don't tell google until this actually works
      ,R('link', {
        rel: 'amphtml',
        href: this.props.appConfig.rootFullUrl + this.props.originalUrl + '?amp=true'
      })
      */
    ];
    return links;
  }
};

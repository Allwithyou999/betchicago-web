import React, { Component } from 'react';
import styled from 'styled-components';

import { db } from '../../../apis/firebase';
import { Article } from '../../../containers/components/articles';
import { FacebookIcon, TwitterIcon } from '../../../containers/components/Icons';
import AuthorImage from '../../../containers/components/AuthorImage';
import Page, { MainContent, SidebarRight } from '../../../containers/components/Layout';
import SidebarWidget from '../../../containers/components/SidebarWidget';
import ContentPromo from '../../../containers/components/ContentPromo';
import TrendingStories from '../../../containers/components/TrendingStories';
import media from '../../../containers/components/Media';

const Wrapper = styled.div``;

const ArticleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 10px;

  ${media.tablet} {
    padding: 20px 0 5px 20px;
    margin-bottom: 20px;
  }
`;

const Social = styled.div`
  display: flex;
  align-items: center;

  ${media.tablet} {
    position: absolute;
    top: 100px;
    left: 20px;
    display: block;
  }

  > div + div {
    margin-left: 12px;
    position: absolute;
    left: 20px;
    top: 100px;
  }
`;

const SocialAnchor = styled.a`
  margin-left: 10px;

  ${media.tablet} {
    position: relative;
    top: 10px;
    margin-left: 0px;
  }
`;

const Author = styled.div`
  display: flex;
  align-items: center;
`;

const AuthorBio = styled.div`
  margin-top: 20px;
  text-align: left;
  padding-left: 10px;
  font-style: italic;
  font-weight: 300;
  margin-bottom: -20px;
`;

const AuthorDetail = styled.div`
  font-size: 13px;
  line-height: 16px;
  color: ${props => (props.emphasis ? '#333' : '#666')};
  font-weight: ${props => (props.emphasis ? '700' : '400')};
  margin-left: 20px;
`;

const Content = styled.div`
  font-size: 19px;
  line-height: 28px;
  font-weight: 300;
  white-space: pre-line;
  margin-bottom: 20px;

  .embedly-card-hug {
    position: relative;
    padding-bottom: 56.2% !important;
    height: 0;
    margin: 10px 0 20px 0;
    overflow: hidden;

    iframe {
      position: absolute !important;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  ${media.tablet} {
    padding-right: 60px;
    padding-left: 85px;
  }
`;

class ArticleDetail extends Component {
  componentDidMount() {
    window.cApplicationLocal
      .__fetchAPArticles(db, 'sports')
      .then(articles => {
        this.apArticles = articles;
        return this.forceUpdate();
      })
      .catch(e => {
        console.log('failed to load ap articles', e);
      });
  }

  render() {
    let article = {
      title:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla imperdiet purus vitae',
      content: `<p>Chicago, IL — Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce pulvinar congue lorem, vel fringilla nisl congue ac. Mauris vitae dapibus nisi, ac aliquam dolor. Morbi lobortis neque neque, quis rhoncus ipsum ullamcorper placerat. Sed et dictum odio. Phasellus quis augue dictum, tempor quam sed, vestibulum orci. Nam id arcu tempor turpis molestie laoreet ut quis mi. In id eleifend ipsum.</p>
        <p>Nam eget dapibus odio.Pellentesque semper purus at tortor bibendum porta.Aenean elementum tincidunt magna, ac fringilla lacus sagittis et.Etiam vulputate tellus neque, quis malesuada risus suscipit id.Cras feugiat est eu lectus tristique dictum.<p>
        <p>Vestibulum at felis vel magna ullamcorper fringilla.Curabitur ut rhoncus dolor, a pellentesque augue.Maecenas ullamcorper gravida lorem ut cursus.Integer tempor condimentum purus, a facilisis arcu vulputate vitae.Praesent vel neque lectus.Aliquam pellentesque eros a lacus posuere, quis consequat diam aliquam.Pellentesque a justo rutrum, venenatis ligula ut, viverra diam.Fusce ut ante augue.<p>
        <p>Ut maximus egestas diam, at tincidunt dolor consectetur eget.Fusce et arcu condimentum, auctor dui ac, iaculis nunc.Ut sit amet enim ut ligula semper consequat.Phasellus quis commodo dolor.Fusce non est ac lacus aliquam blandit.Sed eleifend nibh ut ex dignissim, sed gravida tortor porttitor. <p>
        <p>Donec dictum lacus ullamcorper luctus bibendum.Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.Morbi non dolor vestibulum, ornare felis vel, porttitor ex.Integer dapibus nunc augue.Vestibulum ligula ligula, lobortis non enim vel, bibendum placerat augue.Praesent et lacus in massa gravida condimentum.Mauris et gravida lectus.Sed mollis justo vel magna gravida, in gravida augue imperdiet.<p>
        <p>Curabitur aliquam ornare leo ac ultricies.Phasellus id lorem sit amet ante pulvinar cursus.Integer venenatis iaculis ipsum.Vivamus dolor urna, convallis nec scelerisque nec, tempus sit amet purus.Donec lacinia egestas velit, vitae sodales mauris fermentum vitae.Phasellus egestas lorem non ante ullamcorper dignissim.Suspendisse nec mollis sapien.Aenean blandit felis quis suscipit tincidunt.Sed lacinia nibh sit amet condimentum aliquam.Lorem ipsum dolor sit amet, consectetur adipiscing elit.<p>
        <p>In ut accumsan purus.Nunc eleifend placerat ligula et mollis.Nunc tempus orci sit amet ipsum auctor luctus.In vel velit libero.Curabitur in finibus mauris.Vivamus risus purus, mollis sed ante eget, cursus laoreet ligula.Nullam dictum dapibus mi, ultrices pharetra lacus lacinia sed.Praesent leo ipsum, iaculis tempor mi id, mollis euismod dui.<p>`,
      tags: '27m - Byline Name  B|C Editorial Role',
      author: 'AUTHOR NAME',
      authorTitle: 'AUTHOR TITLE'
    };

    let trending = [];
    let author = [];
    let apImages = [];
    if (window.cApplicationLocal) {
      if (window.cApplicationLocal.mainArticle)
        article = window.cApplicationLocal.mainArticle;
      trending = window.cApplicationLocal.trending;
      author = window.cApplicationLocal.author;
      article.content = window.marked(article.content);
      apImages = window.cApplicationLocal.apImages;
    }

    let fbLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      window.location.href
    )}`;
    let twitterLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      window.location.href
    )}`;

    if (!article.author)
      if (this.apArticles) {
        let apL = window.cApplicationLocal.__processAPArticlesToNormal(
          this.apArticles
        );
        author = apL;

        let idToExclude = 'none';
        if (window.cApplicationLocal.mainArticle)
          idToExclude = window.cApplicationLocal.mainArticle.id;

        for (let c = 0, l = author.length; c < l; c++) {
          if (author[c].id === idToExclude) {
            author.splice(c, 1);
            break;
          }
        }
      }

    let companyPages = ['terms', 'copyright', 'privacy'];
    let noAuthorText = 'Associated Press';
    article.noDate = false;
    if (companyPages.indexOf(article.pageUrl) !== -1) {
      noAuthorText = '';
      article.noDate = true;
    }

    let showImages = false;
    let urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('showimg') === 'true') showImages = true;

    return (
      <div>
        <Page>
          <MainContent hasRight>
            <Article article={article} main />
            <Wrapper>
              <ArticleHeader>
                {article.author ? (
                  <Author>
                    <AuthorImage src={article.authorImage} />
                    <div>
                      <AuthorDetail emphasis>{article.author}</AuthorDetail>
                      <AuthorDetail>{article.authorTitle}</AuthorDetail>
                    </div>
                  </Author>
                ) : (
                  <Author>
                    {noAuthorText && (
                      <div>
                        <AuthorDetail emphasis>{noAuthorText}</AuthorDetail>
                      </div>
                    )}
                  </Author>
                )}
                {!article.noDate && (
                  <Social>
                    <a target="_parent" href={twitterLink}>
                      <TwitterIcon />
                    </a>
                    <SocialAnchor
                      target="_parent"
                      href={fbLink}
                      class="fb-xfbml-parse-ignore">
                      <FacebookIcon />
                    </SocialAnchor>
                  </Social>
                )}
              </ArticleHeader>
              <Content className={"article-content"} dangerouslySetInnerHTML={{ __html: article.content }} />
              <AuthorBio>{article.authorBio}</AuthorBio>
              {showImages &&
                apImages.map((img, i) => (
                  <img width="500" src={img.aBigHref} alt="Author" />
                ))}
            </Wrapper>
          </MainContent>
          {!article.noDate && (
            <SidebarRight>
              <SidebarWidget
                title={
                  article.author ? 'MORE FROM THIS WRITER' : 'MORE FROM THE AP'
                }>
                <TrendingStories stories={author} isArticle={true} />
              </SidebarWidget>
              <SidebarWidget title="TRENDING STORIES">
                <TrendingStories stories={trending} isArticle={true} />
              </SidebarWidget>
              <SidebarWidget>
                <ContentPromo />
              </SidebarWidget>
            </SidebarRight>
          )}
        </Page>
      </div>
    );
  }
}

export default ArticleDetail;

import React from 'react';
import styled from 'styled-components';

import media from '../Media';
import { THEME_COLORS } from '../../../modules/styles';

const Wrapper = styled.div`
  display: flex;
  margin-bottom: 20px;

  ${media.tablet} {
    margin-bottom: 30px;
  }
`

const ImageHolder = styled.div`
  width: 100px;
  height: 100%;

  ${media.desktop} {
    width: 180px;
  }

  ${media.desktop} {
    width: 210px;
  }

  img {
    max-width: 100%;
    height: auto;
    border: 1px solid #707070;
  }
`

const Content = styled.div`
  padding-left: 15px;
  flex: 1 0 1px;

  ${media.desktop} {
    padding-left: 30px;
  }

  ${props => props.noImage && `
    padding-left: 0 !important;
  `}
`

const Title = styled.div`
  font-size: 17px;
  margin-bottom: 10px;
  font-weight: 700;

  a {
    color: ${THEME_COLORS.BLACK};
    text-decoration: none;
  }

  ${media.tablet} {
    font-size: 19px;
  }
`

const Tags = styled.div`
  font-size: 11px;
  line-height: 13px;
  color: ${THEME_COLORS.BRAND};
  font-weight: 400;
  margin-bottom: 15px;
`

const Excerpt = styled.h6`
  font-weight: 300;
  line-height: 22px;
  display: none;

  ${media.tablet} {
    display: block;
  }
`

const SummaryLink = styled.a`
  text-decoration: none;
  color: inherit;
`;

class ArticleItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      imgError: false
    }
  }

  onImgError = () => {
    this.setState({ imgError: true });
  }

  render() {
    let { noImage, article } = this.props;
    let tag = '';
    if (article.updated && window.moment) {
      tag += window.moment(article.updated).fromNow() + ' &nbsp; ';
    }

    let img = article.imageLink;
    let alt = article.imageAlt;
    if (article.authors) {
      if (article.authors[0]) {
        if (article.authors[0].fullname === 'AP') {
          tag += 'AP'
        }
        else {
          tag += article.authors[0].fullname;
          if (article.authors[0].twitter) {
            tag += ' &nbsp;<span style="font-weight:bold;color:black;">|</span>&nbsp; ' + article.authors[0].twitter;
          }

          if (article.imageLink) {
            img = img.split('?')[0];
            img += '?h=300&w=400&fm=jpg&fit=fill';

            if (article.thumbnail)
              img = article.thumbnail;
          }
        }
      }
    }

    if (!img || this.state.imgError) {
      noImage = true;
    }

    return (
      <Wrapper>
        {!noImage &&
          <ImageHolder>
            <a href={'/' + article.href}><img src={img} alt={alt} onError={this.onImgError} /></a>
          </ImageHolder>
        }
        <Content noImage={noImage}>
          <Title><a href={'/' + article.href}>{article.title}</a></Title>
          <Tags dangerouslySetInnerHTML={{ __html: tag }}></Tags>
          <Excerpt><SummaryLink href={'/' + article.href}>{article.summary}</SummaryLink></Excerpt>
        </Content>
      </Wrapper>
    )
  }
}

export default ArticleItem;

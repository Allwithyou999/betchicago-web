import React from 'react';
import styled from 'styled-components';

import { TrashIcon } from '../../components/Icons';
import { THEME_COLORS } from '../../../modules/styles';

const Header = styled.h1`
  font-size: 18px;
  font-weight: 700 !important;
  margin-bottom: 20px;
`

const Row = styled.div`
  display: flex;
  margin-bottom: 25px;
`

const TrashIconContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  text-align: center;
`

const SavedStoryImage = styled.div`
  margin-left: 20px;
  margin-right: 30px;

  img {
    max-width: 250px;
  }
`

const SavedStoryContent = styled.div`
  flex: 1;
  padding-top: 5px;
`

const SavedStoryInfo = styled.div`
  color: #096CBE;
  font-size: 14px;
  margin: 10px 0;
`

const SavedStoryText = styled.div`
  font-size: 14px;
  line-height: 18px;
`

const NoContentPlaceholder = styled.div`
  color: #F15A24;
`

const SavedStory = (props) => (
  <Row>
    <TrashIconContainer onClick={() => { props.onRemove('ARTICLE', props.story.sys.id, `/savedArticles/${props.story.sys.id}`); }}>
      <TrashIcon color={THEME_COLORS.ORANGE} />
    </TrashIconContainer>
    <SavedStoryImage>
      <img src={props.story.fields.featuredImage.fields.file.url} alt={props.story.fields.featuredImage.fields.description} />
    </SavedStoryImage>
    <SavedStoryContent>
      <h2>{props.story.fields.headline}</h2>
      <SavedStoryInfo>{window.moment(props.story.sys.createdAt).fromNow()} {props.story.fields.author[0].fields.fullName} | {props.story.fields.author[0].fields.twitterHandle}</SavedStoryInfo>
      <SavedStoryText>{props.story.fields.content.split('.')[0]}</SavedStoryText>
    </SavedStoryContent>
  </Row>
);

const SavedStories = (props) => {
  const savedStories = props.data;

  return (
    <div>
      <Header>Saved Stories</Header>
      {savedStories.length === 0 && <NoContentPlaceholder>No Saved Story</NoContentPlaceholder>}
      {savedStories.length > 0 && savedStories.map(story => (
        <SavedStory story={story} key={story.sys.id} onRemove={props.onRemove} />
      ))}
    </div>
  );
}

export default SavedStories;

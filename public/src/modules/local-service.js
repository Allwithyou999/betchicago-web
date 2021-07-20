export const getTrendingStories = () => {
  let stories = [];

  if (window.cApplicationLocal && window.cApplicationLocal.trending) {
    stories = window.cApplicationLocal.trending.map(story => ({
      href: story.href,
      title: story.title
    }));
  }

  return stories;
};

export const getMainArticle = () => {
  if (window.cApplicationLocal && window.cApplicationLocal.mainArticle) {
    return window.cApplicationLocal.mainArticle;
  }

  return false;
};

export const getHeadlineList = () => {
  if (window.cApplicationLocal && window.cApplicationLocal.headlinesList) {
    return window.cApplicationLocal.headlinesList;
  }

  return [];
};

export const getArticleList = () => {
  if (window.cApplicationLocal && window.cApplicationLocal.articleList) {
    return window.cApplicationLocal.articleList;
  }

  return [];
};

export const getLeagueList = () => {
  if (window.cApplicationLocal && window.cApplicationLocal.league) {
    return window.cApplicationLocal.league;
  }

  return [];
};

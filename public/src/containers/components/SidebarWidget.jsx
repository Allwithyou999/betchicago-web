import React, { Component } from 'react';
import styled from 'styled-components';

import { THEME_COLORS } from '../../modules/styles';

const Widget = styled.div`
  margin-bottom: 40px;
`

export const WidgetTitle = styled.div`
  font-size: 11px;
  line-height: 13px;
  background: ${THEME_COLORS.BRAND};
  color: white;
  padding: 5px 15px;
  margin-bottom: 24px;
  display: inline-block;
  font-weight: 400;
`

class SidebarWidget extends Component {
  render() {
    const { title, children, ...props } = this.props;

    return (
      <Widget {...props}>
        {!!title &&
          <WidgetTitle>{title}</WidgetTitle>
        }
        {children}
      </Widget>
    )
  }
}

export default SidebarWidget;

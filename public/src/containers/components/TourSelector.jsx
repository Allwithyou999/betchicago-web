import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Dropdown from './Dropdown';

import { loadTourList } from '../../apis/golf';
import { MAX_WIDTH } from '../../modules/styles';

const TourList = styled.div`
  display: flex;
  align-items: center;
  max-width: ${MAX_WIDTH + 40}px;
  margin: 0 auto;
  padding: 0 20px;
  height: 93px;
  transition: all 0.3s ease;

  ${props => props.hide && `
    height: 0;
    overflow: hidden;
  `}
`

const TourHolder = styled.div`
  padding: 20px 20px 20px 0;
  flex: 1 0 1px;
`

// const YearHolder = styled.div`
//   padding: 20px 0;
// `

class TourSelector extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedTour: 0,
      selectedYear: 0,
    }
  }

  componentDidMount() {
    this.props.loadTourList();
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.golfYearList.length && nextProps.golfYearList.length) {
      nextProps.golfYearList.forEach((golfYear, index) => {
        if (golfYear === new Date().getFullYear()) {
          this.setState({ selectedYear: index });
          return;
        }
      })
    }
  }

  onChangeTour = index => {
    this.setState({ selectedTour: index });
    const { tourListByYear } = this.props;
    const { selectedYear } = this.state;
    this.props.onChange(tourListByYear[selectedYear][index]);
  }

  onChangeYear = index => {
    this.setState({ selectedYear: index });
    setTimeout(() => this.onChangeTour(0));
  }

  render() {
    const { showList, tourListByYear, /* golfYearList */ } = this.props;
    const { selectedTour, selectedYear } = this.state;

    let tourList = [];
    if (tourListByYear) {
      tourList = tourListByYear[selectedYear].map(tour => ({
        text: tour.name,
        value: tour.id
      }));
    }

    // const yearList = golfYearList.map(year => ({
    //   text: year,
    //   value: year
    // }));

    return (
      <TourList hide={!showList}>
        <TourHolder>
          <Dropdown items={tourList} activeItem={tourList[selectedTour]} onChange={this.onChangeTour} style={{ margin: 0 }} />
        </TourHolder>
        {/* <YearHolder>
          <Dropdown items={yearList} activeItem={yearList[selectedYear]} onChange={this.onChangeYear} style={{ margin: 0, width: 100 }} />
        </YearHolder> */}
      </TourList>
    );
  }
}

const mapStateToProps = state => ({
  tourListByYear: state.golf.tourListByYear,
  golfYearList: state.golf.golfYearList
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadTourList
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(TourSelector);

import React, { Component } from 'react';
import Wrapper from './styled';
import moment from 'moment-timezone';

class TeamScheduleTable extends Component {
  state = {
    schedule: []
  };

  componentDidMount() {
    const { data } = this.props;

    let prevMonth = new Date(data.schedule[0].scheduled).getMonth();

    let tempSch = [];
    let tempArr = [];
    data.schedule.forEach(item => {
      let mon = new Date(item.scheduled).getMonth();
      if (prevMonth !== mon) {
        tempSch.push(tempArr);
        tempArr = [];
      } else {
        tempArr.push(item);
      }
      prevMonth = mon;
    });
    this.setState({ schedule: tempSch });
  }

  render() {
    const { data } = this.props;

    console.log('>>>>', data, this.state.schedule);

    return (
      <Wrapper>
        {this.state.schedule.map((row, ind) => (
          <div
            className="TeamScheduleTable-section"
            key={'TeamScheduleTable-section' + ind}>
            <div className="TeamScheduleTable-heading">
              {moment(row[0].scheduled)
                .tz('America/Chicago')
                .format('MMMM')}{' '}
              {moment(row[0].scheduled)
                .tz('America/Chicago')
                .format('YYYY')}
            </div>
            <div className="TeamScheduleTable-subheading">
              <span>Date</span>
              <span>OPP</span>
              <span>Score</span>
              <span>Line</span>
              <span>O/U</span>
            </div>
            {row.map((item, index) =>
              item.home.name === data.market + ' ' + data.name ? (
                <div key={data.name + index} className="TeamScheduleTable-row">
                  <span>
                    {moment(item.scheduled)
                      .tz('America/Chicago')
                      .format('MM')}
                    /
                    {moment(item.scheduled)
                      .tz('America/Chicago')
                      .format('DD')}
                  </span>
                  <span>{item.away.alias}</span>
                  {item.status === 'closed' ? (
                    <span>
                      {item.home_points > item.away_points ? 'W' : 'L'}{' '}
                      {item.home_points}-{item.away_points}
                    </span>
                  ) : null}
                  {item.status === 'closed' ? <span>-</span> : null}
                  {item.status === 'closed' ? (
                    <span>-</span>
                  ) : (
                    <span className="time-span">
                      {moment(item.scheduled)
                        .tz('America/Chicago')
                        .format('h:mm a')}
                    </span>
                  )}
                </div>
              ) : (
                <div key={data.name + index} className="TeamScheduleTable-row">
                  <span>
                    {moment(item.scheduled)
                      .tz('America/Chicago')
                      .format('MM')}
                    /
                    {moment(item.scheduled)
                      .tz('America/Chicago')
                      .format('DD')}
                  </span>
                  <span>@{item.home.alias}</span>
                  {item.status === 'closed' ? (
                    <span>
                      {item.away_points > item.home_points ? 'W' : 'L'}{' '}
                      {item.away_points}-{item.home_points}
                    </span>
                  ) : null}
                  {item.status === 'closed' ? <span>-</span> : null}
                  {item.status === 'closed' ? (
                    <span>-</span>
                  ) : (
                    <span className="time-span">
                      {moment(item.scheduled)
                        .tz('America/Chicago')
                        .format('h:mm a')}
                    </span>
                  )}
                </div>
              )
            )}
          </div>
          // (row && row.summary.status === "closed") && row.summary.home.name === data.name ? <div key={index} className="LastGameTable-row">
          //   <span>{row.summary.scheduled.substr(5,5).replace("-", "/")}</span>
          //   <span>{row.summary.away.alias}</span>
          //   <span>{row.summary.home.points > row.summary.away.points ? 'W' : 'L'} {row.summary.home.points}-{row.summary.away.points}</span>
          //   <span>-</span>
          //   <span>-</span>
          //   <span>{row.summary.home.statistics ? row.summary.home.statistics.field_goals_made : 0} / {row.summary.home.statistics ? row.summary.home.statistics.field_goals_att : 0}</span>
          //   <span>-</span>
          //   <span>{row.summary.home.statistics ? row.summary.home.statistics.rebounds : 0}-{row.summary.home.statistics ? row.summary.home.statistics.offensive_rebounds : 0}</span>
          // </div> :
          // <div key={index} className="LastGameTable-row">
          //   <span>{row.summary.scheduled.substr(5,5).replace("-", "/")}</span>
          //   <span>@{row.summary.home.alias}</span>
          //   <span>{row.summary.away.points > row.summary.home.points ? 'W' : 'L'} {row.summary.away.points}-{row.summary.home.points}</span>
          //   <span>-</span>
          //   <span>-</span>
          //   <span>{row.summary.away.statistics ? row.summary.away.statistics.field_goals_made : 0} / {row.summary.away.statistics ? row.summary.away.statistics.field_goals_att : 0}</span>
          //   <span>-</span>
          //   <span>{row.summary.away.statistics ? row.summary.away.statistics.rebounds : 0}-{row.summary.away.statistics ? row.summary.away.statistics.offensive_rebounds : 0}</span>
          // </div>
        ))}
        <div>Swipe to see more stats categories</div>
      </Wrapper>
    );
  }
}

export default TeamScheduleTable;

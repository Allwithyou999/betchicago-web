import styled from 'styled-components';

export default styled.div`
  display: flex;
  flex-direction: column;
  overflow-x: auto;
  margin-bottom: 15px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  padding: 25px 15px;
  margin-top: 25px;
  background: white;
  .TeamScheduleTable-section {
    display: flex;
    flex-direction: column;
    overflow-x: auto;
    .TeamScheduleTable-heading {
      font-size: 16px;
      font-weight: bold;
      padding: 10px 0;
      margin-top: 15px;
    }
    .TeamScheduleTable-subheading,
    .TeamScheduleTable-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      span {
        min-width: 40px;
        padding-right: 15px;
      }
      span:nth-child(2) {
        flex: 1;
      }
      span:nth-child(3) {
        min-width: 62px;
      }
      span.time-span {
        min-width: 100px;
        text-align: right;
      }
    }
    .TeamScheduleTable-subheading {
      span {
        font-size: 15px;
        font-weight: bold;
        text-transform: 'uppercase';
      }
    }
    .TeamScheduleTable-row {
      border-bottom: 1px solid #ccc;
    }
  }
`;

import styled from 'styled-components';
import { media } from '../styles';

export default styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	margin: 10px;
	> div {
		&:nth-child(even) {
			background-color: #F2F2F2;
		}
	}
	.schedule-item {
		display: flex;
		width: 100%;
		cursor: pointer;
		> div {
			display: inline-block;
			font-size: 15px;
			line-height: 18px;
			font-weight: 300;
			padding: 10px 5px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			> div {
				padding: 3px;
			}
		}
		.teams {
			flex: 8;
			color: #111111;
			font-weight: 400;
			> div {
				display: flex;
				align-items: center;
			}
		}
		.numberandtime {
			flex: 4
			display: flex;
    	justify-content: space-between;
		}
		.betNumbers {
			color: #959595;
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			.win {
				font-weight: bold;
				color: black;
			}
			.lose {
				color: black;
			}
		}
		.time {
			color: #111111;
			font-weight: 400;
			display: flex;
			align-items: center;
		}
		.team-img {
			width: 40px;
			height: 40px;
			margin-right: 10px;
		}
	}
	${props =>
    props.single &&
    `
		margin-bottom: 10px;
	`}
`;

export const DetailClose = styled.button`
  position: absolute;
  top: -120px;
  left: 10px;
  z-index: 1999;
  z-index: 99999 ${media.mobile} {
    top: -100px;
    z-index: 99999;
  }
`;

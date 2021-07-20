import styled from 'styled-components';

const Wrapper = styled.div`
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
	.schedule-item-score {
		display: flex;
		flex-direction: column;
		width: 100%;
		padding: 10px;
		margin-bottom: 20px;
		.score-row {
			display: flex;
			width: 100%;
			padding: 5px 0px;
			align-items: center;
			.team-img {
				width: 40px;
				height: 40px;
				margin-right: 10px;
			}
			> div:first-child {
				flex: 1;
				align-items: center;
				display: flex;
				span {
					font-weight: bold;
				}
			}
			> div:last-child {
				width: 200px;
				display: flex;
				justify-content: space-around;
			}
		}
		.score-row: first-child {
			border-bottom: 1px solid;
			font-size: 13px;
		}
		.scheduleDetail-score-leader {
			padding-top: 5px;
			color: #aaa;
			font-size: 14px;
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

const Link = styled.a`
  width: 100%;
  text-decoration: none;
  color: black;
`;

export { Wrapper, Link };

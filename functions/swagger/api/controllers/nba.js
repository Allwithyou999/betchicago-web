const firebaseAdmin = require('firebase-admin');
const AppConfig = require('../../../services/appconfig.js');
const moment = require('moment-timezone');
const fetch = require('node-fetch');
const appDBConfig = new AppConfig();

const basePath = 'http://api.sportradar.us/nba/production/v5/en';
const tmpAPIKey = 'qw52afqtqz8g9jy47dw79vkh';
const seasonsTypes = ['REG', 'PST'];

const request = function(query) {
	
	return new Promise((resolve, reject) => {
		return fetch(query, {
				headers: {
					'Accept': 'application/json',
					"Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
				},
				dataType: 'json'
			})
			.then(response => {
				return resolve(response.json());
			})
			.catch(e => reject(e));
	});
}

const updateItem = async (sport, type, id, tag, bPath, apiKey) => {
  try {
		let result = await request(`${bPath}/${type}/${id}/${tag}.json?api_key=${apiKey}`);	
		firebaseAdmin.database().ref(`sportRadarStore/${sport}/${type}/${id}/${tag}`).update(result);

		let waitTill = new Date(new Date().getTime() + 200);
		while (waitTill > new Date().getTime());
	} catch (e) {
		console.log(e);
	}
};

module.exports.updateDailyData  = async (req, res) => {
  try {
		let date = req.query.date;
		let dateStr = !date ? (moment().tz("America/Chicago").format()) : (new Date(date)).toISOString();
		let date10 = dateStr.substr(0, 4) + '/' + dateStr.substr(5, 2) + '/' + dateStr.substr(8, 2);
		let schedule = await request(`${basePath}/games/${date10}/schedule.json?api_key=${tmpAPIKey}`);
		await firebaseAdmin.database().ref(`/sportRadarStore/nba/daily/${date10}/schedule`).update(schedule);

		const getGameData = async (index) => {
			if (index >= schedule.games.length) {
				res.status(200).send('{ "success": true }');
				return;
			}

			let gameId = schedule.games[index].id;
			await updateItem('nba', 'games', gameId, 'boxscore', basePath, tmpAPIKey);
			await updateItem('nba', 'games', gameId, 'summary', basePath, tmpAPIKey);
			await updateItem('nba', 'games', gameId, 'pbp', basePath, tmpAPIKey);

			await updateItem('nba', 'teams', schedule.games[index].home.id, 'profile', basePath, tmpAPIKey);
			await updateItem('nba', 'teams', schedule.games[index].away.id, 'profile', basePath, tmpAPIKey);
			
			getGameData(index+1);
		}
		getGameData(0);
		// res.status(200).send('{ "success": true }');	
	} catch (e) {
		res.status(500).send(e);
	}
};

module.exports.updateYearData  = async (req, res) => {
	try {
		const { year, tag } = req.query;
		let root = '';	
		const loopSeasons = async index => {
			if (index >= seasonsTypes.length) {
				res.status(200).send('{ "success": true }');
				return;
			}
			let waitTill = new Date(new Date().getTime() + 1000);
			while (waitTill > new Date().getTime());
			let tmpTag = '';
			if(tag === 'schedule') {
				root = 'games';
			} else if(tag === 'standings') {
				root = 'seasons';
			} 
			// else if(tag === 'tournaments') {
			// 	root = 'tournaments';
			// 	tmpTag = 'schedule';
			// }
			let result = await request(`${basePath}/${root}/${year}/${seasonsTypes[index]}/${tmpTag || tag}.json?api_key=${tmpAPIKey}`);
			let teamLists = {};	
			
			if (tag === 'schedule') {
				let teamSchedule = {};
				result.games.forEach(game => {
					if (!teamSchedule[game.home.id]) {
						teamSchedule[game.home.id] = {};
						teamSchedule[game.home.id].schedule = [];
					}
					if (!teamSchedule[game.away.id]) {
						teamSchedule[game.away.id] = {};
						teamSchedule[game.away.id].schedule = [];
					}
					teamSchedule[game.home.id].schedule.push(game);
					teamSchedule[game.away.id].schedule.push(game);
				});
				for (key in teamSchedule) {
					if (key.indexOf('583') === 0) {
						firebaseAdmin.database().ref(`/sportRadarStore/nba/year/${year}/${seasonsTypes[index]}/teams/${key}`).update(teamSchedule[key]);
					}
				}
			}

			if(tag === 'standings') {
				let newResult = {};
				let conferenceList = [];
				let haveTeamList = false;
				if(result.conferences) {
					haveTeamList = true;
					result.conferences.forEach(conf => {
						let confTeams = [];
						conf.divisions.forEach( division => {
								division.teams.forEach(team => {
									teamLists[team.id] = team;
									// confTeams[team.id] = team;
								});
						})
						// conferenceList.push({
						// 	alias: conf.alias,
						// 	id: conf.id,
						// 	name: conf.name
						// })
						// newResult[conf.id] = {teams: confTeams}
					})
					// newResult["conferenceList"] = conferenceList;
					// result.conferences = newResult;
					
				}
				if(haveTeamList){
					await firebaseAdmin.database().ref(`/sportRadarStore/nba/year/${year}/${seasonsTypes[index]}/teams`).update(teamLists);
				}
			} 
			await firebaseAdmin.database().ref(`/sportRadarStore/nba/year/${year}/${seasonsTypes[index]}/${tag}`).update(result);
			loopSeasons(index+1);
		}
		loopSeasons(0);	
	} catch (e) {
		res.status(500).send(e);
	}
};

module.exports.updateGameData  = async (req, res) => {
  try {		
		const { gameId, tag } = req.query;
		await updateItem('nba', 'games', gameId, tag, basePath, tmpAPIKey);
		res.status(200).send('{ "success": true }');
	} catch (e) {
		res.status(500).send(e);
	}
};

module.exports.updatePlayerData  = async (req, res) => {
  try {		
		const { playerId } = req.query;
		await updateItem('nba', 'players', playerId, 'profile', basePath, tmpAPIKey);
		res.status(200).send('{ "success": true }');
	} catch (e) {
		res.status(500).send(e);
	}
};

module.exports.updateTeamData  = async (req, res) => {
  try {		
		const { teamId } = req.query;
		await updateItem('nba', 'teams', teamId, 'profile', basePath, tmpAPIKey);
		res.status(200).send('{ "success": true }');
	} catch (e) {
		res.status(500).send(e);
	}
};

module.exports.updateSeasonStats  = async (req, res) => {
  try {		
		const { year } = req.query;
		
		let snapshot = await firebaseAdmin.database().ref(`/sportRadarStore/nba/year/${year}/REG/teams`).once("value");
		let teamData = snapshot.val();
		let keys = Object.keys(teamData);

		for (i = 0; i < keys.length; i++) {
			if (keys[i].indexOf("583") === 0) {
				let statsData = await request(`${basePath}/seasons/${year}/REG/teams/${keys[i]}/statistics.json?api_key=${tmpAPIKey}`); // eslint-disable-line no-await-in-loop
				teamData[keys[i]].stats = statsData;
				teamData[keys[i]].lastUpdate = new Date().getTime();
				firebaseAdmin.database().ref(`/sportRadarStore/nba/year/${year}/REG/teams/${keys[i]}`).update(teamData[keys[i]]);
				let waitTill = new Date(new Date().getTime() + 100);
				while (waitTill > new Date().getTime());
			}
		}

		// await firebaseAdmin.database().ref(`/sportRadarStore/nba/year/${year}/REG/teams`).update(teamData);
		
		res.status(200).send('{ "success": true }');
		
	} catch (e) {
		res.status(500).send(e);
	}
};

module.exports.getFutureData  = async (req, res) => {
	try {		
		const { year } = req.query;

		let res =  await request('https://api.sportradar.us/oddscomparison-usp1/en/us/categories/sr:category:15/outrights.json?api_key=swg4s5tc77z2wpwhmz5u3vem');
		res.outrights.forEach((item) => {
			if (item.name.indexOf('NBA - Winner') === 0) {
				firebaseAdmin.database().ref(`/sportRadarStore/nba/year/${year}/REG/odds/all`).set({data: item});
			}
			if (item.name.indexOf('NBA - Eastern Conference - Winner') === 0) {
				firebaseAdmin.database().ref(`/sportRadarStore/nba/year/${year}/REG/odds/eastern`).set({data: item});
			}
			if (item.name.indexOf('NBA - Western Conference - Winner') === 0) {
				firebaseAdmin.database().ref(`/sportRadarStore/nba/year/${year}/REG/odds/western`).set({data: item});
				res.status(200).send('{ "success": true }');
			}
		})
	} catch (e) {
		res.status(500).send(e);
	}
};

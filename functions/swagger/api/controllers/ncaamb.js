const firebaseAdmin = require('firebase-admin');
const AppConfig = require('../../../services/appconfig.js');
const fetch = require('node-fetch');
const appDBConfig = new AppConfig();
const moment = require('moment-timezone');


const basePath = 'http://api.sportradar.us/ncaamb/production/v4/en';
const tmpAPIKey = 'ecekkwt58ynzjdfzj96vj3au';
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

const updateNCAAItem = async (sport, type, id, tag, bPath, apiKey) => {
  try {
		let result = await request(`${bPath}/${type}/${id}/${tag}.json?api_key=${apiKey}`);	
		firebaseAdmin.database().ref(`sportRadarStore/${sport}/${type}/${id}/${tag}`).update(result);

		let waitTill = new Date(new Date().getTime() + 200);
		while (waitTill > new Date().getTime());
	} catch (e) {
		console.log(e);
	}
};

module.exports.updateNCAAMBDailyData  = async (req, res) => {
  try {
		let date = req.query.date;
		date = !date ? new Date() : new Date(date);
		let dateStr = date.toISOString();
				let date10 = dateStr.substr(0, 4) + '/' + dateStr.substr(5, 2) + '/' + dateStr.substr(8, 2);
		let schedule = await request(`${basePath}/games/${date10}/schedule.json?api_key=${tmpAPIKey}`);
		await firebaseAdmin.database().ref(`/sportRadarStore/ncaamb/daily/${date10}/schedule`).update(schedule);

		const getGameData = async (index) => {
			if (index >= schedule.games.length) {
				res.status(200).send('{ "success": true }');
				return;
			}

			let gameId = schedule.games[index].id;
			await updateNCAAItem('ncaamb', 'games', gameId, 'boxscore', basePath, tmpAPIKey);
			await updateNCAAItem('ncaamb', 'games', gameId, 'summary', basePath, tmpAPIKey);
			await updateNCAAItem('ncaamb', 'games', gameId, 'pbp', basePath, tmpAPIKey);
			
			getGameData(index+1);
		}
		getGameData(0);	
		res.status(200).send('{ "success": true }');	
	} catch (e) {
		res.status(500).send(e);
	}
};

module.exports.updateNCAAMBYearData  = async (req, res) => {
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
			} else if(tag === 'tournaments') {
				root = 'tournaments';
				tmpTag = 'schedule';
			}
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
					firebaseAdmin.database().ref(`/sportRadarStore/ncaamb/year/${year}/${seasonsTypes[index]}/teams/${key}`).update(teamSchedule[key]);
				}
			}

			if(tag === 'standings') {
				let newResult = {};
				let conferenceList = [];
				let haveTeamList = false;
				if(result.conferences) {
					haveTeamList = true;
					result.conferences.forEach(conf => {
						conf.teams.forEach(async team => {
							teamLists[team.id] = team;
						});
						conferenceList.push({
							alias: conf.alias,
							id: conf.id,
							name: conf.name
						})
						newResult[conf.id] = {teams: conf.teams}
					})
					newResult["conferenceList"] = conferenceList;
					result.conferences = newResult;
					
				}
				if(haveTeamList){
					await firebaseAdmin.database().ref(`/sportRadarStore/ncaamb/year/${year}/${seasonsTypes[index]}/teams`).update(teamLists);
				}
			} 
			await firebaseAdmin.database().ref(`/sportRadarStore/ncaamb/year/${year}/${seasonsTypes[index]}/${tag}`).update(result);
			loopSeasons(index+1);
		}
		loopSeasons(0);	
	} catch (e) {
		res.status(500).send(e);
	}
};

module.exports.updateNCAAMBGameData  = async (req, res) => {
  try {		
		const { gameId, tag } = req.query;
		await updateNCAAItem('ncaamb', 'games', gameId, tag, basePath, tmpAPIKey);
		res.status(200).send('{ "success": true }');
	} catch (e) {
		res.status(500).send(e);
	}
};

module.exports.updateNCAAMBPlayerData  = async (req, res) => {
  try {		
		const { playerId } = req.query;
		await updateNCAAItem('ncaamb', 'players', playerId, 'profile', basePath, tmpAPIKey);
		res.status(200).send('{ "success": true }');
	} catch (e) {
		res.status(500).send(e);
	}
};

module.exports.updateNCAAMBTeamData  = async (req, res) => {
  try {		
		const { teamId } = req.query;
		await updateNCAAItem('ncaamb', 'teams', teamId, 'profile', basePath, tmpAPIKey);
		res.status(200).send('{ "success": true }');
	} catch (e) {
		res.status(500).send(e);
	}
};

module.exports.updateNCAAMBSeasonStats  = async (req, res) => {
  try {		
		const { year } = req.query;
		
		let snapshot = await firebaseAdmin.database().ref(`/sportRadarStore/ncaamb/year/${year}/REG/teams`).once("value");
		let teamData = snapshot.val();
		let keys = Object.keys(teamData);

		for (let i = 0; i < keys.length; i++) {
			for (let j = i + 1; j < keys.length; j++) {
				if (teamData[keys[j]].lastUpdate ===undefined || (teamData[keys[i]].lastUpdate !==undefined && teamData[keys[j]].lastUpdate !==undefined && teamData[keys[i]].lastUpdate > teamData[keys[j]].lastUpdate)) {
					let temp = keys[i];
					keys[i] = keys[j];
					keys[j] = temp;
				}
			}
		}
		/* eslint-disable no-await-in-loop */
		for (i = 0; i < 100; i++) {
			let statsData = await request(`${basePath}/seasons/${year}/REG/teams/${keys[i]}/statistics.json?api_key=${tmpAPIKey}`); // eslint-disable-line no-await-in-loop
			teamData[keys[i]].stats = statsData;
			teamData[keys[i]].lastUpdate = new Date().getTime();
			firebaseAdmin.database().ref(`/sportRadarStore/ncaamb/year/${year}/REG/teams/${keys[i]}`).update(teamData[keys[i]]);
			let waitTill = new Date(new Date().getTime() + 100);
			while (waitTill > new Date().getTime());
		}
		/* eslint-disable no-await-in-loop */
		// await firebaseAdmin.database().ref(`/sportRadarStore/ncaamb/year/${year}/REG/teams`).update(teamData);
		
		res.status(200).send('{ "success": true }');
		
	} catch (e) {
		res.status(500).send(e);
	}
};

module.exports.updateNCAAMBRankingData  = async (req, res) => {
	try {		
		const { year } = req.query;
		let rankingData = await request(`${basePath}/rpi/${year}/rankings.json?api_key=${tmpAPIKey}`);
		let scheduleData = await request(`${basePath}/games/${year}/REG/schedule.json?api_key=${tmpAPIKey}`);
		let games = scheduleData.games;
		let rankings = rankingData.rankings;

		let result = [];
		for(let i=0; i<25; i++) {
			let item = rankings[i];
			item.nextGame = null;
			games.forEach(game => {
				if((game.home.id === item.id || game.away.id === item.id) && game.status === 'scheduled' && !item.nextGame) {
					item.nextGame = game;
				}
			})
			result.push(item);
		}
		await firebaseAdmin.database().ref(`/sportRadarStore/ncaamb/year/${year}/REG/rankings`).set({list: result, updated: moment().utc().format()});
		res.status(200).send('{ "success": true }');
	} catch (e) {
		res.status(500).send(e);
	}
};

module.exports.getNCAAMBFutureData  = async (req, res) => {
	try {		
		const { year } = req.query;

		let result =  await request('https://api.sportradar.us/oddscomparison-usp1/en/us/categories/sr:category:15/outrights.json?api_key=swg4s5tc77z2wpwhmz5u3vem');
		result.outrights.forEach((item) => {
			if (item.name.indexOf('NCAA') ===0) {
				firebaseAdmin.database().ref(`/sportRadarStore/ncaamb/year/${year}/REG/odds`).set({data: item});
				res.status(200).send('{ "success": true }');
			}
		})
	} catch (e) {
		res.status(500).send(e);
	}
};

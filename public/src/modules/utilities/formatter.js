export const formatMoney = value =>
  value && value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const getMonthName = month => {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];
  return monthNames[month];
};

export const getWeekName = week => {
  const weekNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  return weekNames[week];
};

export const getLocalDate = date => new Date(date.getTime());
export const convertToUTC = date =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000);

export const formatDate = (date, format = 'mm dd') => {
  const local = getLocalDate(date);
  const day = local.getDate();
  const month = getMonthName(local.getMonth());
  const year = local.getFullYear();
  const week = getWeekName(local.getDay());

  return format
    .replace('yyyy', year)
    .replace('mm', month)
    .replace('MM', local.getMonth() + 1)
    .replace('dd', day)
    .replace('ww', week.substr(0, 3))
    .replace('WW', week);
};

export const formatAMPM = (date, full = false, sec = false) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  if (full) {
    return hours + ':' + minutes;
  } else {
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    if (sec) {
      return hours + ':' + minutes + ':' + seconds + ampm;
    } else {
      return hours + ':' + minutes + ampm;
    }
  }
};

export const formatDateFull = (date, dashed = false) => {
  const local = getLocalDate(date);
  const day = local.getDate();
  const year = local.getFullYear();
  const month = local.getMonth() + 1;

  if (dashed) {
    return `${year}-${twoDigits(month)}-${twoDigits(day)}`;
  } else {
    return `${year}/${twoDigits(month)}/${twoDigits(day)}`;
  }
};

export const getTimezone = () => {
  let timezone = new Date()
    .toString()
    .split('(')[1]
    .split(')')[0];
  if (timezone.split(' ').length) {
    return timezone
      .split(' ')
      .map(s => s.substr(0, 1))
      .join('');
  }
  return timezone;
};

export const twoDigits = val => {
  let temp = '00' + val;
  return temp.substr(temp.length - 2);
};

export const formatTime = date => {
  const local = getLocalDate(date);

  const hour = '00' + local.getHours();
  const minute = '00' + local.getMinutes();

  return hour.substr(hour.length - 2) + ':' + minute.substr(minute.length - 2);
};

export const formatPeriod = (startDate, endDate) => {
  const startLocal = getLocalDate(startDate);
  const endLocal = getLocalDate(endDate);

  return (
    getMonthName(startLocal.getMonth()) +
    ' ' +
    startLocal.getDate() +
    ' - ' +
    getMonthName(endLocal.getMonth()) +
    ' ' +
    endLocal.getDate()
  );
};

export const formatTourPeriod = (start_date, end_date) => {
  const start = getLocalDate(new Date(start_date));
  const end = getLocalDate(new Date(end_date));
  if (start.getFullYear() !== end.getFullYear()) {
    return `${getMonthName(
      start.getMonth()
    )} ${start.getDate()}, ${start.getFullYear()} - ${getMonthName(
      end.getMonth()
    )} ${end.getDate()}, ${end.getFullYear()}`;
  } else if (start.getMonth() !== end.getMonth()) {
    return `${getMonthName(
      start.getMonth()
    )} ${start.getDate()} - ${getMonthName(
      end.getMonth()
    )} ${end.getDate()}, ${start.getFullYear()}`;
  } else {
    return `${getMonthName(
      start.getMonth()
    )} ${start.getDate()} - ${end.getDate()}, ${start.getFullYear()}`;
  }
};

export const formatLeaderboardRound = (leaderboard, size = -1) => {
  const { players, summary } = leaderboard;

  if (!summary || !summary.rounds) return;

  return players.slice(0, size).map((data, index) => {
    let name = data.first_name
      ? data.first_name.substr(0, 1) + '. ' + data.last_name
      : data.name;
    let ldata = {
      pos: data.position,
      name,
      earning: data.money ? '$' + formatMoney(data.money) : '',
      final: '-',
      par: data.score,
      fedex: data.points,
      link: `/golf-odds/player/${data.id}`
    };

    if (ldata.final === 0) ldata.final = 'E';
    if (ldata.final > 0) ldata.final = '+' + ldata.final;

    if (ldata.par === 0) ldata.par = 'E';
    if (ldata.par > 0) ldata.par = '+' + ldata.par;

    let i;
    for (i = 0; i < 4; i++) {
      if (!data.rounds || !data.rounds[i]) {
        ldata[`r${i + 1}`] = '';
        continue;
      }

      let thru = data.rounds[i].thru;
      if (thru === 0) {
        ldata[`r${i + 1}`] = '';
      } else if (thru > 0 && thru < 18) {
        if (data.rounds[i].score === 0) {
          ldata[`r${i + 1}`] = 'E (' + thru + ')';
        } else if (data.rounds[i].score > 0) {
          ldata[`r${i + 1}`] =
            '+' + data.rounds[i].score.toString() + ' (' + thru + ')';
        } else {
          ldata[`r${i + 1}`] =
            data.rounds[i].score.toString() + ' (' + thru + ')';
        }
      } else if (thru >= 18) {
        ldata[`r${i + 1}`] = data.rounds[i].strokes.toString();

        if (ldata.final === '-') {
          ldata.final = data.rounds[i].strokes;
        } else {
          ldata.final += data.rounds[i].strokes;
        }
      } else {
        ldata[`r${i + 1}`] = '';
      }
    }

    return ldata;
  });
};

export const getLastDayOfWeek = (date = new Date()) => {
  const curr = new Date(date);
  const first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
  const last = first + 6; // last day is the first day + 6

  // var firstday = new Date(curr.setDate(first));
  const lastday = new Date(curr.setDate(last));
  return lastday;
};

export const formatLeaderboardSummary = (leaderboard, size = -1) => {
  const { players, summary } = leaderboard;
  let round = 0;
  if (!summary || !summary.rounds) return;
  summary.rounds.forEach((r, index) => {
    if (r.status === 'inprogress' || r.status === 'closed') {
      round = index;
    }
  });

  if (!players) {
    return [];
  }

  return players.slice(0, size).map((data, index) => {
    let name = data.first_name
      ? data.first_name.substr(0, 1) + '. ' + data.last_name
      : data.name;
    let ldata = {
      pos: data.position,
      name,
      par: data.score,
      link: `/golf-odds/player/${data.id}`
    };

    if (data.rounds && data.rounds[round]) {
      ldata.thru = data.rounds[round].thru;
      ldata.round = data.rounds[round].score;
      if (ldata.thru === 18) ldata.thru = 'F';
      if (ldata.round === 0) ldata.round = 'E';
      if (ldata.round > 0) ldata.round = '+' + ldata.round;
    }

    if (ldata.par === 0) ldata.par = 'E';
    if (ldata.par > 0) ldata.par = '+' + ldata.par;

    return ldata;
  });
};

export const formatPlayerTourData = list => {
  return list.map(data => {
    let ldata = {
      date: formatDate(new Date(data.summary.start_date), 'mm dd'),
      event: data.summary.name,
      link: `/golf-odds/leaderboard/${data.id}`,
      pos: data.player.position,
      par: data.player.score,
      total: data.player.points,
      win: data.winner ? data.winner.score : ''
    };
    let i;
    for (i = 0; i < data.player.rounds.length; i++) {
      ldata[`r${i + 1}`] = data.player.rounds[i].strokes;
    }
    for (let j = i; j < 4; j++) {
      ldata[`r${j + 1}`] = '- -';
    }

    return ldata;
  });
};

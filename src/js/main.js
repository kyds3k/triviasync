function forEachWithDelay(array, callback, delay) {
  let i = 0;
  let interval = setInterval(() => {
    callback(array[i], i, array);
    if (++i === array.length) clearInterval(interval);
  }, delay);
}

function titleCase(str) {
  let titleCase;
  
  titleCase = str
      .toLowerCase()
      .split(" ")
      .map(function (s) {
          return s.charAt(0) == '(' ? '(' + s.charAt(1).toUpperCase() + s.substring(2) : s.charAt(0).toUpperCase() + s.substring(1);
      })
      .join(" ");

    return titleCase
}

async function logData() {
  const ratData = await ratTrap();
  const keepPlayers = await keepScorePlayers();
  console.log(ratData);
  console.log(keepPlayers);
}

async function populateBoard() {
  const ratData = await ratTrap();

  forEachWithDelay(ratData, (team) => {
    const data = {
      "name": `${titleCase(team.name)}`
    }
    fetch('https://keepthescore.co/api/emiktfvokje/player/', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  }, 250);
}

async function syncScores() {
  const ratData = await ratTrap();
  const keepPlayers = await keepScorePlayers();
  let syncIndex = 0;

  forEachWithDelay(ratData, (team) => {
    let ratName = team.name.toUpperCase();
    for (let index = 0; index < ratData.length; index++) {
      const keepTheScoreName = keepPlayers[index].name.toUpperCase();
      console.log(`${ratName}, ${keepTheScoreName}`);
      if(ratName == keepTheScoreName ) {
        let data = {
          "player_id": `${keepPlayers[index].id}`,
          "score": `${keepPlayers[syncIndex].score * -1}`
        }
        console.log(data);
        fetch('https://keepthescore.co/api/emiktfvokje/score/', {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
        data = {
          "player_id": `${keepPlayers[index].id}`,
          "score": `${team.score}`
        }  
        fetch('https://keepthescore.co/api/emiktfvokje/score/', {
          method: 'POST', // or 'PUT'
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });              
        syncIndex = 0;   
        break;
      } else {
        syncIndex++;
      }
    }


    // fetch('https://keepthescore.co/api/emiktfvokje/player/', {
    //   method: 'POST', // or 'PUT'
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(data),
    // })
    // .then((response) => response.json())
    // .then((data) => {
    //   console.log('Success:', data);
    // })
    // .catch((error) => {
    //   console.error('Error:', error);
    // });

  }, 1000);
}

async function ratTrap() {
  const url = 'https://corsproxy.io/?' + encodeURIComponent('https://triviarat.com/api/public/players/d20a6a1fe10d4e29');
  const options = {
    method: 'GET'
  };
  const data = await fetch(url, options)
    .then(response => response.json())
    .catch(err => console.error(err));
  return data.players;
}

async function keepScorePlayers() {
  const url = 'https://keepthescore.co/api/emiktfvokje/board/'
  const options = {
    method: 'GET'
  };
  const data = await fetch(url, options)
    .then(response => response.json())
    .catch(err => console.error(err));
  return data.players;
}

//populateBoard();

const logButton = document.querySelector('.log');
const populateButton = document.querySelector('.populate');
const syncButton = document.querySelector('.sync');

logButton.addEventListener('click', (e) => {
  e.preventDefault();
  logData();
});

populateButton.addEventListener('click', (e) => {
  e.preventDefault();
  populateBoard();
});

syncButton.addEventListener('click', (e) => {
  e.preventDefault();
  syncScores();
})
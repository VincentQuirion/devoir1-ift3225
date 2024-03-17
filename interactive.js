//
// Game
//

armors = null;
majors = null;
minors = null;

current_mode = 0;

score = 0;

mode1Start = 0;
mode1Progress = 0;

mode2Major = 0;

function onKeyPlayed(key_code, note) {
  pianoPlayAudio(key_code);
  pianoHighlightKey(key_code);
  
  switch (current_mode) {
    case 1: {
      actual = note;
      expected = majors[(mode1Progress + mode1Start) % majors.length];

      console.log(actual, expected);

      if (enharmonic(actual, expected)) {

        console.log("Correct");
        mode1Progress++;
        score += 1;
        qbSetScore(score);
        cfMoveCursorToNote(expected);
      }
      else {
        let prev_score = score;
        setTimeout(() => alert(`Votre réponse : ${actual}\nBonne réponse : ${expected}\n Vous avez atteint un score de ${prev_score}`), 100)
        onGameOver()
      }
      break;
    }
    case 2:
    {
      actual = note;
      expected = majors[mode2Major];

      console.log(actual, expected);

      if (enharmonic(actual, expected)) {
        console.log("Correct");
        score += 1;
        qbSetScore(score);
        onMode(2);
      }
      else {
        let prev_score = score;
        setTimeout(() => alert(`Votre réponse : ${actual}\nBonne réponse : ${expected}\n Vous avez atteint un score de ${prev_score}`), 100)
        onGameOver()
      }
      break;
    }
    case 3:
    {
      actual = note;
      expected = majors[mode3Armor];

      console.log(actual, expected);

      if (enharmonic(actual, expected)) {
        console.log("Correct");
        score += 1;
        qbSetScore(score);
        onMode(3);
      }
      else {
        let prev_score = score;
        setTimeout(() => alert(`Votre réponse : ${actual}\nBonne réponse : ${expected}\n Vous avez atteint un score de ${prev_score}`), 100)
        onGameOver()
      }
      break;
    }
  }
}

function onGameOver() {
  qbClearTimer();
  score = 0;
  qbSetScore(score)
  onMode(0);
}

function onMode(new_mode) {
  if (new_mode != 0 && current_mode == 0) {
    dShowGame();
  }

  if(new_mode == 0 && current_mode != 0) {
    dShowHome();
  }

  dHideMode(current_mode);

  current_mode = new_mode;

  dShowMode(current_mode);

  switch (current_mode)
  {
    case 1: 
    {
      mode1Start = Math.floor(Math.random() * majors.length);
      dMode1Start(majors[mode1Start]);
      qbStartTimer(4096, () => {alert(`Temps écoulé!\n Vous avez atteint un score de ${score}`) ; onGameOver()});
      break;
    }
    case 2:
    {
      mode2Major = Math.floor(Math.random() * majors.length);
      dMode2Start(majors[mode2Major]);
      qbStartTimer(4096, () => {alert(`Temps écoulé!\n Vous avez atteint un score de ${score}`) ; onGameOver()});
      break;
    }
    case 3:
    {
      mode3Armor = Math.floor(Math.random() * armors.length)
      dMode3Start(armors[mode3Armor]);
      qbStartTimer(4096, () => {alert(`Temps écoulé!\n Vous avez atteint un score de ${score}`) ; onGameOver()});
      break;
    }
  }
}

//
// Content API
//

function dMode1Start(start_note) {
  document.getElementById("qb-mode-1-start").innerHTML = start_note;
}

function dMode2Start(major_note) {
  document.getElementById("qb-mode-2-major").innerHTML = major_note;
}

function dMode3Start(img) {
  document.getElementById("qb-mode-3-img").src = img;
}

function dShowMode(mode) {
  switch (mode) {
    case 0: document.getElementById("qb-home").classList.remove("d-none"); break;
    case 1: document.getElementById("qb-mode-1").classList.remove("d-none"); break;
    case 2: document.getElementById("qb-mode-2").classList.remove("d-none"); break;
    case 3: document.getElementById("qb-mode-3").classList.remove("d-none"); break;
  }
}

function dHideMode(mode) {
  switch (mode) {
    case 0: document.getElementById("qb-home").classList.add("d-none"); break;
    case 1: document.getElementById("qb-mode-1").classList.add("d-none"); break;
    case 2: document.getElementById("qb-mode-2").classList.add("d-none"); break;
    case 3: document.getElementById("qb-mode-3").classList.add("d-none"); break;
  }
}

function dShowHome() {
  document.getElementById("rows-piano").classList.add("d-none");
  document.getElementById("rows-table").classList.remove("d-none");
}

function dShowGame() {
  document.getElementById("rows-piano").classList.remove("d-none");
  document.getElementById("rows-table").classList.add("d-none");
}


//
// Question Board API
//

timerRemaining = 0;
timerInterval = null;

function qbStartTimer(duration, callback = null) {
  qbClearTimer();

  const timer = document.getElementById("qb-timer");
  
  timer.style.strokeDashoffset = 1;
  timerRemaining = duration;

	timerInterval = setInterval(function(){
		if(timerRemaining > 0){
      timerRemaining--;
			timer.style.strokeDashoffset = (duration - timerRemaining) / duration;
		} else {      
      if (typeof callback === 'function') {
        callback();
      }
		}  
	}, 1);
}

function qbClearTimer() {
  if(timerInterval) clearInterval(timerInterval);

  const timer = document.getElementById("qb-timer");
  
  timer.style.strokeDashoffset = 1;
  
  timerInterval = null;
  timerRemaining = 0;
}

function qbSetScore(score) {
  const score_element = document.getElementById("qb-score");
  score_element.innerHTML = score;
}


//
// Piano API
//

function pianoPlayAudio(key_code) {
  const audio = document.querySelector(`audio[data-key="${key_code}"]`);

  if (!audio) return;

  audio.currentTime = 0;
  audio.play();
}

function pianoHighlightKey(key_code) {
  const note_text = document.querySelector(`.note-text[data-key="${key_code}"]`);

  if (!note_text) return;

  note_text.style.opacity = 1;

  if (note_text.timeout) clearTimeout(note_text.timeout);

  note_text.timeout = setTimeout(() => {
    note_text.style.opacity = 0;
  }, 1000);
}

//
// Circle of fifths API
//

function cfMoveCursorToNote(note) {
  const cf_note = document.querySelector(`.cf-note[data-note="${note}"]`);

  if (!cf_note) return;

  const angle = cf_note.getAttribute('data-angle');
  const circle = document.getElementById("cf-cursor");
  const center = { x: 150, y: 150 };
  const point = { x: 150, y: 30 };
  const radians = angle * (Math.PI / 180);
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const x = center.x + (point.x - center.x) * cos - (point.y - center.y) * sin;
  const y = center.y + (point.x - center.x) * sin + (point.y - center.y) * cos;
  const translateX = x - center.x;
  const translateY = y - center.y;

  circle.setAttribute("transform", "translate(" + translateX + "," + translateY + ")");
}

//
// Data Fetching & Utilities
//

const noteToSharp = {
  "sol♭" : "fa♯",
  "ré♭" : "do♯",
  "la♭" : "sol♯",
  "mi♭" : "ré♯",
  "si♭" : "la♯",
  "fa♭" : "mi♯",
  "do♭" : "si♯",
};

function enharmonic(note1, note2) {
  note1Sharp = note1.endsWith("♭") ? noteToSharp[note1] : note1;
  note2Sharp = note2.endsWith("♭") ? noteToSharp[note2] : note2;

  console.log(note1Sharp, note2Sharp); // TODO remove
  return note1Sharp == note2Sharp;
}

function loadData() {
  // Extraction des données
  const dataElement = document.getElementById("datatable")
            
  // Initialisation d'un tableau vide pour stocker les données
  var data = [];

  // On itère sur toutes les colonnes du tableau
  dataElement.querySelectorAll('tr').forEach(function(row) {
      var rowData = [];

      // On itère sur toutes les colonnes de la rangée
      row.querySelectorAll('td').forEach(function(cell) {
          // On ajoute les données de la cellule dans le tableau
          rowData.push(cell.textContent.trim().split(" ")[0]);
      });
      // Formattage des données pour les rendre plus utilisables
      rowData.splice(0, 1)
      // Ajoute la rangée au tableau
      data.push(rowData);
  });

  var imgs = [];

  dataElement.querySelectorAll('img').forEach(function(img) {
    imgs.push(img.src);
  });

  data.push(imgs);
  
  // Encore du formattage nécessaire
  data.splice(0, 2)

  // Retourne les données
  console.log(data)

  return data;
}

//
// Event listeners
//

const keys_pressed = {};
mouse_down = false;

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.piano polygon').forEach((key) => {
    key.addEventListener('mousedown', (_e) => {
      const key_code = key.getAttribute('data-key');
      const note = key.getAttribute('data-note');
      onKeyPlayed(key_code, note);
      key.classList.add('active');
      mouse_down = true;
    });

    key.addEventListener('mouseup', (_e) => {
      key.classList.remove('active');
      mouse_down = false;
    });

    key.addEventListener('mouseenter', (_e) => {
      if(!mouse_down) return;
      const key_code = key.getAttribute('data-key');
      const note = key.getAttribute('data-note');
      onKeyPlayed(key_code, note);
      key.classList.add('active');
    });

    key.addEventListener('mouseleave', (_e) => {
      key.classList.remove('active');
    });
  });

  document.getElementById('qb-mode-1-btn').addEventListener('click', () => {
    onMode(1);
  });

  document.getElementById('qb-mode-2-btn').addEventListener('click', () => {
    onMode(2);
  });

  document.getElementById('qb-mode-3-btn').addEventListener('click', () => {
    onMode(3);
  });

  data = loadData();

  majors = data[0];
  minors = data[1];
  armors = data[2];
});

document.addEventListener('keydown', (e) => {
  const key_code = e.keyCode;

  if(keys_pressed[key_code] === true) return;

  const key = document.querySelector(`.piano polygon[data-key="${key_code}"]`);

  if(!key) return;

  const note = key.getAttribute('data-note');

  onKeyPlayed(key_code, note);

  keys_pressed[key_code] = true;
  key.classList.add('active');
});

document.addEventListener('keyup', (e) => {
  const key_code = e.keyCode;

  if(keys_pressed[key_code] === false) return;

  const key = document.querySelector(`.piano polygon[data-key="${key_code}"]`);

  if(!key) return;

  keys_pressed[e.keyCode] = false
  key.classList.remove('active');
});

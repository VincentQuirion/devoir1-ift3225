//
// IO - Piano
//

const history = [];

function playNote(data_key)
{
  history.push(data_key);

  const audio = document.querySelector(`audio[data-key="${data_key}"]`);

  if (!audio) return;

  audio.currentTime = 0;
  audio.play();

  const note_text = document.querySelector(`.note-text[data-key="${data_key}"]`);

  if (!note_text) return;

  note_text.style.opacity = 1;

  // Cancel last timeout and set a new one
  if (note_text.timeout) clearTimeout(note_text.timeout);

  note_text.timeout = setTimeout(() => {
    note_text.style.opacity = 0;
  }, 1000);
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
      playNote(key_code);
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
      playNote(key_code);
      key.classList.add('active');
    });

    key.addEventListener('mouseleave', (_e) => {
      key.classList.remove('active');
    });
  });
});

document.addEventListener('keydown', (e) => {
  const key_code = e.keyCode;

  if(keys_pressed[key_code] === true) return;

  const key = document.querySelector(`.piano polygon[data-key="${key_code}"]`);

  if(!key) return;
  
  playNote(key_code);
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

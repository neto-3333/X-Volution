// Short looping scores. Each step is an eighth note, expressed in semitones.
const Music = (() => {
  const maps = [
    [60,4,7,11,7,2,4,7,0], [50,0,7,3,7,5,3,10,7],
    [62,7,9,4,2,7,4,0,2], [51,0,3,7,6,0,3,10,6]
  ];
  const caves = [
    [48,0,7,3,2,0,10,7,3], [43,0,0,7,6,3,0,6,7],
    [54,0,7,12,10,3,7,10,2]
  ];
  const combat = [52,0,7,3,10,2,7,5,3];
  const guardian = [45,0,12,7,6,0,3,10,7];
  let context, timer, scene = '', step = 0, next = 0;
  let enabled = localStorage.getItem('adn-music') !== 'off';

  function note(pitch, time, length, volume, type) {
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = 440 * 2 ** ((pitch - 69) / 12);
    envelope.gain.setValueAtTime(.0001, time);
    envelope.gain.exponentialRampToValueAtTime(volume, time + .018);
    envelope.gain.exponentialRampToValueAtTime(.0001, time + length);
    oscillator.connect(envelope).connect(context.destination);
    oscillator.start(time);
    oscillator.stop(time + length);
  }

  function tick() {
    if (!scene || !enabled || document.hidden || context?.state !== 'running') return;
    const [kind, index] = scene.split('/');
    const score = kind === 'map' ? maps[index] : kind === 'cave' ? caves[index] :
      kind === 'boss' ? guardian : combat;
    const beat = {map:.32, cave:.27, fight:.21, boss:.18}[kind];
    next = Math.max(next, context.currentTime);
    while (next < context.currentTime + .11) {
      const root = score[0] + [0,-5,-2,-7][Math.floor(step / 8) % 4];
      note(root + score[1 + step % 8], next, beat * .92, .061, kind === 'cave' ? 'sine' : 'triangle');
      if (step % 2 === 0) note(root - 12, next, beat * 1.55, .085, 'sine');
      step++;
      next += beat;
    }
  }
  function resume() {
    if (!enabled || document.hidden) return;
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    context ||= new Audio();
    if (context.state !== 'running') context.resume().catch(() => {});
    timer ||= setInterval(tick, 75);
  }
  for (const event of ['pointerup','keydown','click']) document.addEventListener(event, resume);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) context?.suspend(); else if (context) resume();
  });
  return {
    play(kind, index = 0) {
      const key = kind + '/' + index;
      if (key !== scene) { scene = key; step = 0; next = 0; }
    },
    get enabled() { return enabled; },
    toggle() {
      enabled = !enabled;
      localStorage.setItem('adn-music', enabled ? 'on' : 'off');
      if (enabled) resume(); else context?.suspend();
    }
  };
})();

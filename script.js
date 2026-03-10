const rounds = [
  {
    id: "quiz-detalle",
    type: "quiz",
    typeLabel: "Pregunta",
    category: "Dulce",
    title: "Detalle tuyo",
    prompt: "¿Qué detalle mío te enamora más de lo razonable?",
    options: [
      {
        label: "Cuando me pongo tierno sin aviso",
        points: 2,
        feedbackTitle: "Me conocés",
        feedback: "Ahí quedo regalado.",
      },
      {
        label: "Cuando te hago reír y me agrando un poco",
        points: 1,
        feedbackTitle: "También",
        feedback: "Esa versión mía te busca siempre.",
      },
      {
        label: "Cuando intento disimular lo mucho que me gustás",
        points: 0,
        feedbackTitle: "Peligroso",
        feedback: "Ese plan me sale demasiado mal.",
      },
    ],
  },
  {
    id: "choose-freeze",
    type: "define",
    typeLabel: "Elegí",
    category: "Momento nuestro",
    title: "Congelar esto",
    prompt: "Si guardaras un momento conmigo, ¿cuál sería?",
    options: [
      {
        label: "Una mirada que dijo demasiado",
        points: 1,
        feedbackTitle: "Lo guardo",
        feedback: "Ese también me quedó adentro.",
      },
      {
        label: "Una risa que nos dejó pegados",
        points: 0,
        feedbackTitle: "Lindo",
        feedback: "Esa escena igual se queda.",
      },
      {
        label: "Ese segundo en que todo bajó de velocidad",
        points: 0,
        feedbackTitle: "Uf",
        feedback: "Ahí ya se sentía distinto.",
      },
    ],
  },
  {
    id: "quiz-home",
    type: "quiz",
    typeLabel: "Pregunta",
    category: "Casa",
    title: "Cerca tuyo",
    prompt: "¿Qué cosa mía te hace sentir más en casa?",
    options: [
      {
        label: "La calma que aparece cuando estamos cerca",
        points: 2,
        feedbackTitle: "Eso vale",
        feedback: "No hay mucho más lindo que eso.",
      },
      {
        label: "La forma en que te escucho de verdad",
        points: 1,
        feedbackTitle: "Me llega",
        feedback: "Eso también es muy nuestro.",
      },
      {
        label: "Mi torpeza enamorada",
        points: 0,
        feedbackTitle: "Te creo",
        feedback: "Sirve, pero no me salva del todo.",
      },
    ],
  },
  {
    id: "challenge-silence",
    type: "challenge",
    typeLabel: "Desafío",
    category: "Silencio",
    title: "Mirame así",
    prompt: "Siete segundos. Sin hablar.",
    points: 1,
    steps: [
      "Acercate un poco.",
      "Mirá sin escaparte.",
      "Aguantá la sonrisa si podés.",
    ],
    tip: "A veces alcanza con eso.",
    feedbackTitle: "Ya está",
    feedback: "Eso dijo más que un párrafo entero.",
  },
  {
    id: "quiz-discovery",
    type: "quiz",
    typeLabel: "Pregunta",
    category: "Descubrimiento",
    title: "Conmigo",
    prompt: "¿Qué descubriste de vos desde que estamos juntos?",
    options: [
      {
        label: "Que te sale querer con menos miedo",
        points: 2,
        feedbackTitle: "Eso sí",
        feedback: "Y se nota hermoso.",
      },
      {
        label: "Que conmigo bajás la guardia más fácil",
        points: 1,
        feedbackTitle: "Se siente",
        feedback: "Eso ya es un montón.",
      },
      {
        label: "Que te cuesta menos quedarte cerca",
        points: 0,
        feedbackTitle: "También",
        feedback: "Igual eso ya cambia bastante.",
      },
    ],
  },
  {
    id: "choose-calm",
    type: "define",
    typeLabel: "Elegí",
    category: "Calma",
    title: "Lo que te calma",
    prompt: "¿Qué sentís que hago yo que te calma sin darme cuenta?",
    options: [
      {
        label: "La forma en que te abrazo",
        points: 1,
        feedbackTitle: "Cerca",
        feedback: "Eso me pega directo.",
      },
      {
        label: "Cuando te escucho sin apuro",
        points: 0,
        feedbackTitle: "Importa",
        feedback: "Eso también nos cuida mucho.",
      },
      {
        label: "La mirada con la que te busco",
        points: 0,
        feedbackTitle: "Ajá",
        feedback: "Esa mirada tiene lo suyo.",
      },
    ],
  },
  {
    id: "challenge-look",
    type: "challenge",
    typeLabel: "Desafío",
    category: "Ahora sí",
    title: "Decímelo cerca",
    prompt: "Decime algo mío que no te cansarías de mirar.",
    points: 1,
    steps: [
      "Acercate un poco.",
      "Decilo bajito.",
      "Sosteneme la mirada un segundo.",
    ],
    tip: "No hace falta explicar demasiado.",
    feedbackTitle: "Eso pegó",
    feedback: "Quedó flotando lindo.",
  },
  {
    id: "quiz-never-change",
    type: "quiz",
    typeLabel: "Pregunta",
    category: "Íntimo",
    title: "Que no cambie",
    prompt: "¿Qué te gustaría que nunca cambie entre nosotros?",
    options: [
      {
        label: "La paz que aparece cuando estamos juntos",
        points: 2,
        feedbackTitle: "Sí",
        feedback: "Eso también quiero cuidarlo.",
      },
      {
        label: "Las ganas de contarnos todo",
        points: 1,
        feedbackTitle: "Mucho",
        feedback: "Eso nos hace muy bien.",
      },
      {
        label: "La manera en que nos reímos de cualquier cosa",
        points: 0,
        feedbackTitle: "Hermoso",
        feedback: "Eso nos salva seguido.",
      },
    ],
  },
  {
    id: "choose-real",
    type: "define",
    typeLabel: "Elegí",
    category: "Verdad",
    title: "Lo que no se actúa",
    prompt: "¿Qué pensás que tenemos nosotros que no se finge?",
    options: [
      {
        label: "La forma en que nos miramos",
        points: 1,
        feedbackTitle: "Tal cual",
        feedback: "Eso no se inventa.",
      },
      {
        label: "Lo fácil que se siente hablar",
        points: 0,
        feedbackTitle: "También",
        feedback: "Eso ya vale muchísimo.",
      },
      {
        label: "Las ganas de volver a vernos",
        points: 0,
        feedbackTitle: "Obvio",
        feedback: "Eso se nota sin esfuerzo.",
      },
    ],
  },
  {
    id: "quiz-tension",
    type: "quiz",
    typeLabel: "Pregunta",
    category: "Tensión linda",
    title: "Ese momento",
    prompt: "¿Qué momento entre nosotros tuvo más tensión linda?",
    options: [
      {
        label: "Cuando nos quedamos mirándonos de más",
        points: 2,
        feedbackTitle: "Ahí fue",
        feedback: "Eso tuvo electricidad linda.",
      },
      {
        label: "Cuando el beso casi pasa antes de pasar",
        points: 1,
        feedbackTitle: "Casi",
        feedback: "Ese borde también fue fuerte.",
      },
      {
        label: "Cuando una risa nos dejó demasiado cerca",
        points: 0,
        feedbackTitle: "Sirve",
        feedback: "Igual dejó algo en el aire.",
      },
    ],
  },
  {
    id: "challenge-danger",
    type: "challenge",
    typeLabel: "Desafío",
    category: "Respirá…",
    title: "Lo peligroso de vos",
    prompt: "Completá la frase sin escaparte.",
    points: 1,
    steps: [
      "Decí: “Lo peligroso de vos es que...”",
      "Terminá la idea mirándome.",
      "Dejá que quede un segundo en el aire.",
    ],
    tip: "Acá ya no conviene mentir.",
    feedbackTitle: "Uf",
    feedback: "Eso quedó directo.",
  },
  {
    id: "choose-look",
    type: "define",
    typeLabel: "Elegí",
    category: "Mirada final",
    title: "Una sola mirada",
    prompt: "Si tuvieras que elegirme con una sola mirada, ¿cuál sería?",
    options: [
      {
        label: "La que frena todo por un segundo",
        points: 1,
        feedbackTitle: "Esa",
        feedback: "La siento hasta de lejos.",
      },
      {
        label: "La que pide beso sin hablar",
        points: 0,
        feedbackTitle: "Peligrosa",
        feedback: "Esa también me complica lindo.",
      },
      {
        label: "La que te deja en paz y en ganas",
        points: 0,
        feedbackTitle: "Qué bien",
        feedback: "Ahí ya no hay defensa.",
      },
    ],
  },
  {
    id: "challenge-last-confession",
    type: "challenge",
    typeLabel: "Desafío",
    category: "Última confesión",
    title: "Decímelo bajito",
    prompt: "Acercate y decime qué sentís cuando te abrazo.",
    points: 1,
    steps: [
      "Acercate sin apuro.",
      "Decímelo en voz baja.",
      "Quedate cerca un segundo más.",
    ],
    tip: "Lo más lindo suele decirse así.",
    feedbackTitle: "Lo sentí",
    feedback: "Con esto ya valió todo.",
  },
];

const orderedDeckIds = [
  "quiz-detalle",
  "choose-freeze",
  "quiz-home",
  "challenge-silence",
  "quiz-discovery",
  "choose-calm",
  "challenge-look",
  "quiz-never-change",
  "choose-real",
  "quiz-tension",
  "challenge-danger",
  "choose-look",
  "challenge-last-confession",
];

const roundStageLabels = [
  "Suave",
  "Suave",
  "Ahora se puso interesante",
  "Ahora se puso interesante",
  "Esto ya no es solo un juego",
  "Esto ya no es solo un juego",
  "Respirá…",
  "Respirá…",
  "Respirá…",
  "Respirá…",
  "Respirá…",
  "Última confesión",
  "Última confesión",
];

const resultTiers = [
  {
    min: 0,
    max: 4,
    title: "Nos seguimos descubriendo",
    summary: "Ya hay ternura, curiosidad y ganas de seguir acercándose.",
  },
  {
    min: 5,
    max: 8,
    title: "Cada vez más cerca",
    summary: "Lo suyo tiene verdad, calma y una tensión linda que no se fuerza.",
  },
  {
    min: 9,
    max: 12,
    title: "Acá pasa algo serio",
    summary: "Se nota en cómo se miran, en cómo se cuidan y en cómo se eligen.",
  },
  {
    min: 13,
    max: Number.POSITIVE_INFINITY,
    title: "Demasiado ustedes",
    summary: "Acá ya hay intimidad, deseo suave y una forma de quererse que no se improvisa.",
  },
];

const resultExtras = [
  {
    min: 0,
    max: 4,
    mood: "Ternura en progreso",
    reward: "Otra ronda + abrazo largo",
  },
  {
    min: 5,
    max: 8,
    mood: "Cerca de verdad",
    reward: "Mirada larga + beso",
  },
  {
    min: 9,
    max: 12,
    mood: "Intimidad linda",
    reward: "Confesión extra + beso",
  },
  {
    min: 13,
    max: Number.POSITIVE_INFINITY,
    mood: "Conexión peligrosa",
    reward: "Besos y plan siguiente",
  },
];

const finalMessage = [
  "Sofi:",
  "",
  "Quería que estas preguntas hicieran algo simple: acercarte un poco más a mí y dejarme acercarme un poco más a vos.",
  "Me gusta la versión de mí que aparece cuando estoy con vos: más tranquilo, más valiente, más enamorado.",
  "Gracias por hacer tan lindo algo tan nuestro.",
  "Si estos seis meses se sienten así, yo quiero seguir eligiéndote con las mismas ganas y con más todavía.",
  "Te quiero muchísimo.",
].join("\n");

const totalAvailablePoints = rounds.reduce((total, round) => {
  if (round.type === "challenge") {
    return total + round.points;
  }

  const bestOption = Math.max(...round.options.map((option) => option.points));
  return total + bestOption;
}, 0);

const state = {
  deck: [],
  currentRoundIndex: 0,
  completedRounds: 0,
  score: 0,
  awaitingContinue: false,
  revealToken: 0,
  soundEnabled: false,
  audioContext: null,
  canGenerateSound: "AudioContext" in window || "webkitAudioContext" in window,
  reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
};

const elements = {
  welcomeScreen: document.getElementById("welcomeScreen"),
  gameScreen: document.getElementById("gameScreen"),
  revealScreen: document.getElementById("revealScreen"),
  resultScreen: document.getElementById("resultScreen"),
  startButton: document.getElementById("startButton"),
  restartButton: document.getElementById("restartButton"),
  continueButton: document.getElementById("continueButton"),
  soundToggle: document.getElementById("soundToggle"),
  soundToggleText: document.querySelector(".sound-toggle__text"),
  roundStageLabel: document.getElementById("roundStageLabel"),
  roundTypeTag: document.getElementById("roundTypeTag"),
  roundCounter: document.getElementById("roundCounter"),
  progressBar: document.getElementById("progressBar"),
  progressText: document.getElementById("progressText"),
  scoreDisplay: document.getElementById("scoreDisplay"),
  roundCategory: document.getElementById("roundCategory"),
  roundTitle: document.getElementById("roundTitle"),
  roundPrompt: document.getElementById("roundPrompt"),
  roundBody: document.getElementById("roundBody"),
  feedbackBox: document.getElementById("feedbackBox"),
  feedbackTitle: document.getElementById("feedbackTitle"),
  feedbackText: document.getElementById("feedbackText"),
  revealLabel: document.getElementById("revealLabel"),
  revealTitle: document.getElementById("revealTitle"),
  revealText: document.getElementById("revealText"),
  resultTier: document.getElementById("resultTier"),
  resultScore: document.getElementById("resultScore"),
  resultSummary: document.getElementById("resultSummary"),
  resultMetricScore: document.getElementById("resultMetricScore"),
  resultMetricMood: document.getElementById("resultMetricMood"),
  resultMetricReward: document.getElementById("resultMetricReward"),
  finalMessage: document.getElementById("finalMessage"),
  particles: document.getElementById("particles"),
  roundCard: document.getElementById("roundCard"),
};

function buildDeck() {
  const roundMap = new Map(rounds.map((round) => [round.id, round]));
  return orderedDeckIds.map((id) => roundMap.get(id)).filter(Boolean);
}

function formatScore(score) {
  return `${score} ${score === 1 ? "corazón" : "corazones"}`;
}

function resetFeedback() {
  state.awaitingContinue = false;
  elements.feedbackBox.hidden = true;
  elements.feedbackTitle.textContent = "";
  elements.feedbackText.textContent = "";
  elements.continueButton.textContent = "Seguir";
}

function setView(viewName) {
  elements.welcomeScreen.hidden = viewName !== "welcome";
  elements.gameScreen.hidden = viewName !== "game";
  elements.revealScreen.hidden = viewName !== "reveal";
  elements.resultScreen.hidden = viewName !== "result";
}

function updateHud() {
  const totalRounds = state.deck.length || orderedDeckIds.length;
  const visibleRoundNumber = Math.min(state.currentRoundIndex + 1, totalRounds);
  const progress = totalRounds === 0 ? 0 : (state.completedRounds / totalRounds) * 100;

  elements.roundCounter.textContent = `Ronda ${visibleRoundNumber}/${totalRounds}`;
  elements.progressText.textContent = `${state.completedRounds}/${totalRounds}`;
  elements.progressBar.style.width = `${progress}%`;
  elements.scoreDisplay.textContent = formatScore(state.score);
}

function animateIn(element) {
  element.classList.remove("is-pop");
  void element.offsetWidth;
  element.classList.add("is-pop");
}

function scrollCardIntoView(target) {
  target.scrollIntoView({
    behavior: state.reducedMotion ? "auto" : "smooth",
    block: "start",
  });
}

function updateContinueButtonLabel() {
  const isLastRound = state.currentRoundIndex === state.deck.length - 1;
  elements.continueButton.textContent = isLastRound ? "Ver resultado" : "Seguir";
}

function showFeedback(title, text) {
  state.awaitingContinue = true;
  updateContinueButtonLabel();
  elements.feedbackTitle.textContent = title;
  elements.feedbackText.textContent = text;
  elements.feedbackBox.hidden = false;
  animateIn(elements.feedbackBox);

  requestAnimationFrame(() => {
    scrollCardIntoView(elements.feedbackBox);
    elements.continueButton.focus({ preventScroll: true });
  });
}

function lockOptionButtons(selectedButton) {
  const buttons = elements.roundBody.querySelectorAll(".option-button");

  buttons.forEach((button) => {
    button.disabled = true;
    button.classList.add("is-locked");
  });

  if (selectedButton) {
    selectedButton.classList.add("is-selected");
  }
}

function handleOptionSelection(option, button) {
  if (state.awaitingContinue) {
    return;
  }

  state.score += option.points;
  state.completedRounds += 1;
  lockOptionButtons(button);
  updateHud();
  playTone(option.points > 0 ? "success" : "soft");
  showFeedback(option.feedbackTitle, option.feedback);
}

function renderChoiceRound(round) {
  const optionsMarkup = round.options.map((option, index) => `
    <button class="option-button" type="button" data-option-index="${index}">
      <span class="option-button__badge" aria-hidden="true">${String.fromCharCode(65 + index)}</span>
      <strong class="option-button__title">${option.label}</strong>
    </button>
  `).join("");

  elements.roundBody.innerHTML = `<div class="options-grid">${optionsMarkup}</div>`;

  elements.roundBody.querySelectorAll(".option-button").forEach((button) => {
    button.addEventListener("click", () => {
      const optionIndex = Number(button.dataset.optionIndex);
      handleOptionSelection(round.options[optionIndex], button);
    });
  });
}

function handleChallengeCompletion(round) {
  if (state.awaitingContinue) {
    return;
  }

  state.score += round.points;
  state.completedRounds += 1;
  updateHud();

  const challengeButton = elements.roundBody.querySelector("[data-challenge-complete]");
  if (challengeButton) {
    challengeButton.disabled = true;
  }

  playTone("celebrate");
  showFeedback(round.feedbackTitle, round.feedback);
}

function renderChallengeRound(round) {
  const stepsMarkup = round.steps.map((step) => `<li><span>${step}</span></li>`).join("");

  elements.roundBody.innerHTML = `
    <div class="challenge-layout">
      <div class="challenge-top">
        <span class="challenge-seal">${round.category}</span>
        <span class="challenge-points">+${round.points}</span>
      </div>
      <ol class="challenge-steps">${stepsMarkup}</ol>
      <p class="challenge-tip">${round.tip}</p>
      <button class="button button--primary" type="button" data-challenge-complete>Listo</button>
    </div>
  `;

  elements.roundBody.querySelector("[data-challenge-complete]").addEventListener("click", () => {
    handleChallengeCompletion(round);
  });
}

function getStageLabel(roundIndex) {
  return roundStageLabels[roundIndex] || "Ahora se puso interesante";
}

function renderCurrentRound() {
  const round = state.deck[state.currentRoundIndex];
  resetFeedback();
  updateHud();

  elements.roundCard.dataset.roundType = round.type;
  elements.roundStageLabel.textContent = getStageLabel(state.currentRoundIndex);
  elements.roundTypeTag.textContent = round.typeLabel;
  elements.roundCategory.textContent = round.category;
  elements.roundTitle.textContent = round.title;
  elements.roundPrompt.textContent = round.prompt;
  elements.roundBody.innerHTML = "";

  if (round.type === "challenge") {
    renderChallengeRound(round);
  } else {
    renderChoiceRound(round);
  }

  animateIn(elements.roundCard);

  requestAnimationFrame(() => {
    scrollCardIntoView(elements.roundCard);
  });
}

function getResultTier(score) {
  return resultTiers.find((tier) => score >= tier.min && score <= tier.max);
}

function getResultExtras(score) {
  return resultExtras.find((tier) => score >= tier.min && score <= tier.max);
}

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function showFinalReveal(token) {
  const steps = [
    {
      label: "Respirá…",
      title: "Última confesión",
      text: "Dejá que esto baje un segundo.",
    },
    {
      label: "Resultado emocional en proceso…",
      title: "Contando lo que se sintió",
      text: "Un poquito más.",
    },
    {
      label: "Resultado desbloqueado",
      title: "Ahora mirá esto",
      text: "Llegaron hasta acá por algo.",
    },
  ];

  const activeSteps = state.reducedMotion ? [steps[steps.length - 1]] : steps;
  const delays = state.reducedMotion ? [180] : [900, 1100, 900];

  setView("reveal");

  for (let index = 0; index < activeSteps.length; index += 1) {
    if (token !== state.revealToken) {
      return false;
    }

    const step = activeSteps[index];
    elements.revealLabel.textContent = step.label;
    elements.revealTitle.textContent = step.title;
    elements.revealText.textContent = step.text;
    animateIn(elements.revealScreen);
    playTone(index === activeSteps.length - 1 ? "celebrate" : "soft");
    await wait(delays[index]);
  }

  return token === state.revealToken;
}

async function finishGame() {
  const token = ++state.revealToken;
  const tier = getResultTier(state.score);
  const extras = getResultExtras(state.score);

  elements.resultTier.textContent = tier.title;
  elements.resultScore.textContent = `${state.score}/${totalAvailablePoints} corazones`;
  elements.resultSummary.textContent = tier.summary;
  elements.resultMetricScore.textContent = `${state.score}/${totalAvailablePoints}`;
  elements.resultMetricMood.textContent = extras.mood;
  elements.resultMetricReward.textContent = extras.reward;
  elements.finalMessage.textContent = finalMessage;
  elements.progressBar.style.width = "100%";
  elements.progressText.textContent = `${state.deck.length}/${state.deck.length}`;

  const canShow = await showFinalReveal(token);
  if (!canShow) {
    return;
  }

  setView("result");
  animateIn(elements.resultScreen);
  playTone("win");

  requestAnimationFrame(() => {
    scrollCardIntoView(elements.resultScreen);
    elements.restartButton.focus({ preventScroll: true });
  });
}

function goToNextRound() {
  if (!state.awaitingContinue) {
    return;
  }

  state.currentRoundIndex += 1;

  if (state.currentRoundIndex >= state.deck.length) {
    finishGame();
    return;
  }

  renderCurrentRound();
}

function startGame() {
  state.revealToken += 1;
  state.deck = buildDeck();
  state.currentRoundIndex = 0;
  state.completedRounds = 0;
  state.score = 0;
  resetFeedback();
  setView("game");
  updateHud();
  renderCurrentRound();
  playTone("start");
}

function ensureAudioContext() {
  if (!state.canGenerateSound) {
    return null;
  }

  if (state.audioContext) {
    return state.audioContext;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  state.audioContext = new AudioContextClass();
  return state.audioContext;
}

function playTone(kind) {
  if (!state.soundEnabled || !state.canGenerateSound) {
    return;
  }

  const audioContext = ensureAudioContext();
  if (!audioContext) {
    return;
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => undefined);
  }

  const tones = {
    start: [392, 523.25],
    success: [523.25, 659.25],
    soft: [329.63],
    celebrate: [587.33, 698.46],
    win: [523.25, 659.25, 783.99],
  };

  const notes = tones[kind] || tones.soft;
  const duration = kind === "win" ? 0.24 : 0.16;
  const startAt = audioContext.currentTime;

  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const noteStart = startAt + index * 0.08;

    oscillator.type = "sine";
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(0.0001, noteStart);
    gainNode.gain.exponentialRampToValueAtTime(0.04, noteStart + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, noteStart + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start(noteStart);
    oscillator.stop(noteStart + duration + 0.02);
  });
}

function toggleSound() {
  if (!state.canGenerateSound) {
    elements.soundToggle.disabled = true;
    elements.soundToggle.setAttribute("aria-disabled", "true");
    elements.soundToggle.setAttribute("aria-pressed", "false");
    elements.soundToggle.title = "Este navegador no permite generar sonido";
    elements.soundToggleText.textContent = "Sonido no disponible";
    return;
  }

  state.soundEnabled = !state.soundEnabled;
  elements.soundToggle.setAttribute("aria-pressed", String(state.soundEnabled));
  elements.soundToggle.title = state.soundEnabled ? "Desactivar sonido" : "Activar sonido";
  elements.soundToggleText.textContent = state.soundEnabled ? "Sonido encendido" : "Sonido apagado";

  if (state.soundEnabled) {
    ensureAudioContext();
    playTone("soft");
  }
}

function createParticles() {
  const symbols = ["❤", "♥", "✦", "✧"];
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < 24; index += 1) {
    const particle = document.createElement("span");
    particle.textContent = symbols[index % symbols.length];
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${11 + Math.random() * 13}s`;
    particle.style.animationDelay = `${Math.random() * 8}s`;
    particle.style.opacity = (0.12 + Math.random() * 0.18).toFixed(2);
    fragment.appendChild(particle);
  }

  elements.particles.appendChild(fragment);
}

function initialize() {
  elements.finalMessage.textContent = finalMessage;
  elements.resultMetricScore.textContent = `0/${totalAvailablePoints}`;
  elements.progressText.textContent = `0/${orderedDeckIds.length}`;
  elements.scoreDisplay.textContent = formatScore(state.score);

  if (!state.canGenerateSound) {
    elements.soundToggle.disabled = true;
    elements.soundToggle.setAttribute("aria-disabled", "true");
    elements.soundToggle.title = "Este navegador no permite generar sonido";
    elements.soundToggleText.textContent = "Sonido no disponible";
  } else {
    elements.soundToggle.title = "Activar sonido";
  }

  createParticles();

  elements.startButton.addEventListener("click", startGame);
  elements.restartButton.addEventListener("click", startGame);
  elements.continueButton.addEventListener("click", goToNextRound);
  elements.soundToggle.addEventListener("click", toggleSound);
}

initialize();

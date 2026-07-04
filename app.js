const scenario = window.TRAINING_SCENARIOS[0];
const views = [...document.querySelectorAll(".view")];
const state = { step: 0, scores: { safety: 0, tactical: 0, legal: 0 }, history: [] };

const $ = (id) => document.getElementById(id);

function showView(id) {
  views.forEach((view) => view.classList.toggle("active", view.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetState() {
  state.step = 0;
  state.scores = { safety: 0, tactical: 0, legal: 0 };
  state.history = [];
}

function renderStep() {
  const step = scenario.steps[state.step];
  const progress = Math.round(((state.step + 1) / scenario.steps.length) * 100);
  $("step-label").textContent = `STEP ${state.step + 1} / ${scenario.steps.length}`;
  $("progress-percent").textContent = `${progress}%`;
  $("progress-bar").style.width = `${progress}%`;
  $("situation-text").textContent = step.situation;
  $("principle-text").textContent = step.principle;
  $("fact-grid").innerHTML = step.facts.map(([key, value]) => `<div><span>${key}</span><strong>${value}</strong></div>`).join("");
  $("choices").innerHTML = "";

  step.choices.forEach((choice, index) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.innerHTML = `<span class="choice-key">${String.fromCharCode(65 + index)}</span><span>${choice.label}</span><i aria-hidden="true">→</i>`;
    button.addEventListener("click", () => chooseAction(choice));
    $("choices").appendChild(button);
  });
}

function chooseAction(choice) {
  Object.keys(state.scores).forEach((key) => { state.scores[key] += choice.scores[key]; });
  state.history.push({ step: state.step + 1, label: choice.label, ...choice });

  const total = Object.values(choice.scores).reduce((sum, score) => sum + score, 0);
  const level = choice.tone === "danger" ? "risk" : total >= 65 ? "good" : "caution";
  const copy = {
    good: ["안전 중심 판단", "판단의 우선순위가 적절합니다.", "✓"],
    caution: ["재평가 필요", "일부 효과가 있지만 보완이 필요합니다.", "!"],
    risk: ["위험 증가", "경찰관의 위험 노출이 커지는 선택입니다.", "×"]
  }[level];

  $("feedback-view").dataset.level = level;
  $("feedback-kicker").textContent = `STEP ${state.step + 1} FEEDBACK`;
  $("feedback-title").textContent = copy[1];
  $("feedback-icon").textContent = copy[2];
  $("feedback-summary").textContent = copy[0];
  $("feedback-outcome").textContent = choice.result;
  $("feedback-coaching").textContent = choice.coaching;
  $("feedback-scores").innerHTML = [
    ["안전", choice.scores.safety], ["전술", choice.scores.tactical], ["법적", choice.scores.legal]
  ].map(([label, score]) => `<span>${label} <b>+${score}</b></span>`).join("");
  $("next-button").innerHTML = state.step === scenario.steps.length - 1 ? "결과 리포트 보기 <span>→</span>" : "다음 상황으로 <span>→</span>";
  showView("feedback-view");
}

function buildResult() {
  const maxScores = { safety: 84, tactical: 84, legal: 68 };
  const normalized = Object.fromEntries(Object.entries(state.scores).map(([key, value]) => [key, Math.min(100, Math.round((value / maxScores[key]) * 100))]));
  const total = Math.round((normalized.safety + normalized.tactical + normalized.legal) / 3);
  const grade = total >= 85 ? "우수" : total >= 70 ? "양호" : total >= 55 ? "보완 필요" : "재훈련 권장";

  $("total-score").textContent = total;
  $("grade-label").textContent = grade;
  $("score-ring").style.setProperty("--score", `${total * 3.6}deg`);
  $("result-message").textContent = total >= 70 ? "안전 공간을 만드는 판단이 전반적으로 잘 유지되었습니다." : "위험에 반응하기 전 거리와 엄폐를 먼저 확보하는 연습이 필요합니다.";

  const labels = { safety: "경찰관 안전성", tactical: "전술적 적절성", legal: "법적 적절성" };
  $("metric-list").innerHTML = Object.entries(normalized).map(([key, value]) => `<div class="metric"><div><span>${labels[key]}</span><strong>${value}</strong></div><div class="metric-track"><i style="width:${value}%"></i></div></div>`).join("");
  $("history-list").innerHTML = state.history.map((item) => `<div class="history-item"><span>${item.step}</span><div><small>STEP ${item.step}</small><strong>${item.label}</strong></div></div>`).join("");

  const improvements = [];
  if (normalized.safety < 75) improvements.push("대상자와의 거리를 늘리고 엄폐물을 먼저 확보하십시오.");
  if (normalized.tactical < 75) improvements.push("지원 요청, 주변인 통제, 대체 계획을 하나의 흐름으로 판단하십시오.");
  if (normalized.legal < 75) improvements.push("물리력 선택 전 위해 수준과 필요성·상당성을 다시 확인하십시오.");
  if (!improvements.length) improvements.push("지원 도착 후 역할 분담과 현장 인계까지 판단 범위를 확장해 보십시오.");
  $("improvement-list").innerHTML = improvements.map((item) => `<li>${item}</li>`).join("");
  showView("result-view");
}

$("start-button").addEventListener("click", () => { resetState(); renderStep(); showView("simulation-view"); });
$("exit-button").addEventListener("click", () => showView("intro-view"));
$("next-button").addEventListener("click", () => {
  if (state.step < scenario.steps.length - 1) { state.step += 1; renderStep(); showView("simulation-view"); }
  else buildResult();
});
$("retry-button").addEventListener("click", () => { resetState(); renderStep(); showView("simulation-view"); });
$("print-button").addEventListener("click", () => window.print());

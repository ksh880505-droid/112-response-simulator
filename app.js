const scenario = window.TRAINING_SCENARIOS[0];
const views = [...document.querySelectorAll(".view")];
const state = { step: 0, scores: { safety: 0, tactical: 0, legal: 0 }, history: [], result: null, user: null };
const supabaseConfig = window.SUPABASE_CONFIG || {};
const hasSupabaseConfig = Boolean(
  window.supabase &&
  supabaseConfig.url &&
  supabaseConfig.anonKey &&
  !supabaseConfig.url.includes("YOUR_") &&
  !supabaseConfig.anonKey.includes("YOUR_")
);
const supabaseClient = hasSupabaseConfig ? window.supabase.createClient(supabaseConfig.url, supabaseConfig.anonKey) : null;

const $ = (id) => document.getElementById(id);

function setAuthMessage(message, tone = "muted") {
  $("auth-message").textContent = message;
  $("auth-message").dataset.tone = tone;
}

function updateAuthUI() {
  const signedIn = Boolean(state.user);
  $("auth-status").innerHTML = signedIn ? "<span></span> 로그인됨" : "<span></span> 로그인 필요";
  $("signout-button").classList.toggle("hidden", !signedIn);
  $("auth-form").classList.toggle("hidden", signedIn);
  if (signedIn) setAuthMessage(`${state.user.email} 계정으로 훈련 결과를 저장할 수 있습니다.`);
  else if (!hasSupabaseConfig) setAuthMessage("Supabase URL과 anon key를 supabase-config.js에 넣으면 인증과 저장이 활성화됩니다.");
  else setAuthMessage("이메일과 비밀번호로 로그인하거나 회원가입할 수 있습니다.");
}

async function loadSession() {
  if (!supabaseClient) {
    updateAuthUI();
    return;
  }

  const { data } = await supabaseClient.auth.getSession();
  state.user = data.session?.user || null;
  updateAuthUI();

  supabaseClient.auth.onAuthStateChange((_event, session) => {
    state.user = session?.user || null;
    updateAuthUI();
  });
}

async function signIn(email, password) {
  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

async function signUp(email, password) {
  const { error } = await supabaseClient.auth.signUp({ email, password });
  if (error) throw error;
}

function showView(id) {
  views.forEach((view) => view.classList.toggle("active", view.id === id));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetState() {
  state.step = 0;
  state.scores = { safety: 0, tactical: 0, legal: 0 };
  state.history = [];
  state.result = null;
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
  state.result = { total, grade, normalized, scores: { ...state.scores }, history: [...state.history] };

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

async function saveResult() {
  if (!supabaseClient) {
    setAuthMessage("Supabase 설정을 먼저 입력해야 결과를 저장할 수 있습니다.", "warning");
    return;
  }
  if (!state.user) {
    setAuthMessage("로그인 후 결과를 저장할 수 있습니다.", "warning");
    return;
  }
  if (!state.result) {
    setAuthMessage("훈련을 완료한 뒤 결과를 저장할 수 있습니다.", "warning");
    return;
  }

  const { error } = await supabaseClient.from("training_results").insert({
    user_id: state.user.id,
    scenario_id: scenario.id,
    scenario_title: scenario.title,
    total_score: state.result.total,
    grade: state.result.grade,
    scores: state.result.scores,
    normalized_scores: state.result.normalized,
    choice_history: state.result.history
  });

  if (error) {
    setAuthMessage(`저장 실패: ${error.message}`, "warning");
    return;
  }
  setAuthMessage("훈련 결과를 Supabase DB에 저장했습니다.");
}

loadSession();

$("auth-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabaseClient) {
    setAuthMessage("Supabase 설정을 먼저 입력하십시오.", "warning");
    return;
  }
  try {
    await signIn($("auth-email").value, $("auth-password").value);
    setAuthMessage("로그인되었습니다.");
  } catch (error) {
    setAuthMessage(`로그인 실패: ${error.message}`, "warning");
  }
});

$("signup-button").addEventListener("click", async () => {
  if (!supabaseClient) {
    setAuthMessage("Supabase 설정을 먼저 입력하십시오.", "warning");
    return;
  }
  try {
    await signUp($("auth-email").value, $("auth-password").value);
    setAuthMessage("회원가입 요청이 완료되었습니다. 이메일 확인 설정이 켜져 있으면 메일을 확인하십시오.");
  } catch (error) {
    setAuthMessage(`회원가입 실패: ${error.message}`, "warning");
  }
});

$("signout-button").addEventListener("click", async () => {
  if (supabaseClient) await supabaseClient.auth.signOut();
});

$("start-button").addEventListener("click", () => { resetState(); renderStep(); showView("simulation-view"); });
$("exit-button").addEventListener("click", () => showView("intro-view"));
$("next-button").addEventListener("click", () => {
  if (state.step < scenario.steps.length - 1) { state.step += 1; renderStep(); showView("simulation-view"); }
  else buildResult();
});
$("retry-button").addEventListener("click", () => { resetState(); renderStep(); showView("simulation-view"); });
$("print-button").addEventListener("click", () => window.print());
$("save-result-button").addEventListener("click", saveResult);

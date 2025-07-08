const lesson1 = [
    { question: "What is 2 + 2?", options: ["3", "4", "5"], correct: "4" },
    { question: "Capital of Japan?", options: ["Kyoto", "Osaka", "Tokyo"], correct: "Tokyo" },
    { question: "How many sides does a triangle have?", options: ["3", "4", "5"], correct: "3" }
];

const lesson2 = [
    {
        question: "猫の進化と歴史に関する記述として、正しいのはどれか。",
        options: ["すべてのネコ科動物は単独で生活し、集団をつくらない。",
            "犬と猫では、家畜化されたのは猫のほうが早い。",
            "猫は古代エジプトで思み嫌われたため、多数がミイラにされたとみられる。",
            "日本で猫をペットとして飼うようになったのは、江戸時代の庶民であった。",
            "ミトコンドリアDNAの解析により、猫の祖先はリビアヤマネコであることが確認された。"],
        correct: "ミトコンドリアDNAの解析により、猫の祖先はリビアヤマネコであることが確認された。"
    },
    {
        question: "純血種の猫に関する記述として、正しいのはどれか。",
        options: ["アビシニアンとスコティッシュフォールドは、どちらも短毛種である。",
            "日本で現在一番多く飼われている短毛種の猫は、サイアミーズ（シャム）とバーミーズである。",
            "純血種の猫の日本での飼育率は、6割程度である。",
            "アメリカンカールやマンチカンは、耳の変形が特徴的な猫種である。",
            "ラグドールやメインクーンは、猫の品種として大型である。"],
        correct: "ラグドールやメインクーンは、猫の品種として大型である。"
    },
    {
        question: "シャンプーに関する記述として、正しいのはどれか。",
        options: ["猫の爪は安全なので、最後に切る。",
            "猫の換毛期は日照時間が長くなる春から夏にかけて多く発生し、手入れとしてシャンプーが必要である。",
            "室内飼育で、過剰にセルフグルーミングを行う猫の場合、ブラッシングやコーミングをしなくてもよい。",
            "リンス剤の濃度は、シングルコートの短毛種は薄めに希釈し長毛種は濃いめに希釈する。",
            "猫にも肛門腺はあるが、猫は常に舐めているため肛門腺は絞らない。"],
        correct: "猫の換毛期は日照時間が長くなる春から夏にかけて多く発生し、手入れとしてシャンプーが必要である。"
    }
];

const lesson3 = [
    { question: "What is 5 x 5?", options: ["10", "25", "15"], correct: "25" },
    { question: "Square root of 49?", options: ["6", "7", "8"], correct: "7" }
];

const lessonMap = {
    1: lesson1,
    2: lesson2,
    3: lesson3
};

const lessonNames = {
    1: "第一章",
    2: "第二章",
    3: "第三章"
};

let lessonScope = [];
try {
    const stored = localStorage.getItem("lessonScope");
    lessonScope = stored ? JSON.parse(stored) : [];
    if (!Array.isArray(lessonScope)) {
        // If parsed data is not an array, reset to empty
        lessonScope = [];
    }
} catch (e) {
    console.error("Error reading lessonScope from localStorage:", e);
    lessonScope = [];
}

const selectedLessonNames = lessonScope.length > 0
    ? lessonScope.map(id => lessonNames[id] || `Unknown(${id})`).join(", ")
    : "None";

const quizData = lessonScope.flatMap(id => lessonMap[id] || []);

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

shuffle(quizData);

let currentQuestion = 0;
let score = 0;

const questionEl = document.getElementById("question");
const formEl = document.getElementById("quiz-form");
const nextBtn = document.getElementById("next-btn");
const resultEl = document.getElementById("result");
const savedScoreEl = document.getElementById("saved-score");

function loadQuestion() {
    const q = quizData[currentQuestion];
    questionEl.textContent = q.question;
    formEl.innerHTML = "";

    // 🔀 Copy and shuffle options
    const shuffledOptions = [...q.options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }

    // 🎯 Render shuffled options
    shuffledOptions.forEach(option => {
        const label = document.createElement("label");
        label.className = "option";
        label.innerHTML = `<input type="radio" name="answer" value="${option}"> ${option}`;
        formEl.appendChild(label);
    });

    resultEl.textContent = "";
}

nextBtn.addEventListener("click", () => {
    const selected = formEl.answer?.value;

    if (!selected) {
        showAlert("Please choose an answer!");
        return;
    }

    if (selected === quizData[currentQuestion].correct) {
        score++;
    }

    currentQuestion++;

    if (currentQuestion < quizData.length) {
        loadQuestion();
    } else {
        showFinalResult();
    }
});

function showFinalResult() {
    questionEl.textContent = "Quiz Completed!";
    formEl.innerHTML = "";
    nextBtn.style.display = "none";

    resultEl.innerHTML = `🎉 You scored <strong>${score}</strong> out of <strong>${quizData.length}</strong>.`;

    // Save score in localStorage
    localStorage.setItem("lastScore", score);
    savedScoreEl.innerHTML = `
      📝 Question Scope: ${selectedLessonNames}<br>
      📌 Last Score: <strong>${score}</strong>
    `;

    // ✅ Add back button at the bottom
    const bottomActions = document.getElementById("bottom-actions");
    if (!bottomActions) {
        console.error("❌ bottom-actions element not found in HTML");
        return;
    }

    const backBtn = document.createElement("button");
    backBtn.textContent = "Back to Lesson Selection";
    backBtn.className = "back-btn";
    backBtn.onclick = () => {
        window.location.href = "index.html";
    };

    bottomActions.innerHTML = ""; // clear if any
    bottomActions.appendChild(backBtn);
}

window.addEventListener("DOMContentLoaded", () => {
    loadQuestion();
});

function showAlert(message) {
  document.getElementById("alert-message").textContent = message;
  document.getElementById("overlay-alert").classList.remove("hidden");
}

function hideAlert() {
  document.getElementById("overlay-alert").classList.add("hidden");
}
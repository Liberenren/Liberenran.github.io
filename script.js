  let currentPage = 1;
  const totalPages = 15;

  function showPage(pageNum, clickedLink = null, event = null) {
    if (event) event.preventDefault();
    if (pageNum < 1 || pageNum > totalPages) return;

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(`page-${pageNum}`);
    if (targetPage) targetPage.classList.add('active');

    currentPage = pageNum;

    document.querySelectorAll('.pagenation li a').forEach(link => {
      link.classList.remove('active');
      if (link.textContent === String(pageNum)) {
        link.classList.add('active');
      }
    });
  }

  function changePage(direction, event) {
    if (event) event.preventDefault();
    if (direction === 'prev' && currentPage > 1) {
      showPage(currentPage - 1);
    } else if (direction === 'next' && currentPage < totalPages) {
      showPage(currentPage + 1);
    }
  }





  //答えの補完
// ページごとの入力状態を保存
function setupInputTracking(pageId) {
  const inputs = document.querySelectorAll(`#${pageId} input, #${pageId} button`);

  inputs.forEach((input, index) => {
    input.addEventListener("input", () => saveInputs(pageId));
    input.addEventListener("change", () => saveInputs(pageId));
    input.addEventListener("click", () => saveInputs(pageId)); // ボタン用
  });

  restoreInputs(pageId); // 読み込み時に復元
}

// 保存処理（localStorageに保存）
function saveInputs(pageId) {
  const inputs = document.querySelectorAll(`#${pageId} input, #${pageId} button`);
  const inputValues = {};

  inputs.forEach((input, index) => {
    const type = input.type;

    if (type === "text") {
      inputValues[index] = input.value.trim();
    }

    else if (type === "radio") {
      if (input.checked) {
        inputValues[input.name] = input.value;
      }
    }

    else if (input.tagName === "BUTTON") {
      inputValues[index] = input.classList.contains("selected");
    }
  });

  // localStorage に保存
  const allAnswers = JSON.parse(localStorage.getItem("answers") || "{}");
  allAnswers[pageId] = inputValues;
  localStorage.setItem("answers", JSON.stringify(allAnswers));
}

// 復元処理（localStorageから取得）
function restoreInputs(pageId) {
  const allAnswers = JSON.parse(localStorage.getItem("answers") || "{}");
  const pageAnswers = allAnswers[pageId];
  if (!pageAnswers) return;

  const inputs = document.querySelectorAll(`#${pageId} input, #${pageId} button`);

  inputs.forEach((input, index) => {
    const type = input.type;

    if (type === "text") {
      input.value = pageAnswers[index] || "";
    }

    else if (type === "radio") {
      if (pageAnswers[input.name] === input.value) {
        input.checked = true;
      }
    }

    else if (input.tagName === "BUTTON") {
      if (pageAnswers[index]) {
        input.classList.add("selected");
      } else {
        input.classList.remove("selected");
      }
    }
  });
}

// 初期化：全ページに対応
for (let i = 1; i <= 15; i++) {
  const pageId = `page-${i}`;
  setupInputTracking(pageId);
}

//送信用

document.addEventListener('DOMContentLoaded', function () {
    const answers = {};

    function saveAnswers() {
        document.querySelectorAll('#page-1 input[type="text"]').forEach((input, i) => {
            answers[`yomi${i + 1}`] = input.value.trim();
        });

        answers['jp_01'] = document.querySelector('input[name="jp"]')?.value.trim() || '';
        answers['jp_02'] = document.querySelector('input[name="jp1"]:checked')?.value || '';
        answers['Choice'] = document.querySelector('input[name="Choice1"]:checked')?.value || '';
        answers['jp5'] = document.querySelector('input[name="jp5"]')?.value.trim() || '';
        answers['contact'] = document.querySelector('input[name="contact1"]:checked')?.value || '';

        answers['math_01'] = document.querySelector('input[name="math_01"]:checked')?.value || '';
        answers['math_02'] = document.querySelector('input[name="math_021"]:checked')?.value || '';
        answers['math_03'] = document.querySelector('input[name="math_031"]:checked')?.value || '';
        answers['math_041'] = document.querySelector('input[name="math_041"]')?.value.trim() || '';
        answers['math_042'] = document.querySelector('input[name="math_042"]')?.value.trim() || '';
        answers['math_043'] = document.querySelector('input[name="math_043"]')?.value.trim() || '';
    }

    async function submitToGAS() {
    saveAnswers();

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbwWnUVTEngeQiasSuUmoB0hIn-VyYrdyscLe_W_oSRXeGEpeHd2kqYrDCgFmhARo81TsQ/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(answers)
        });

        if (response.ok) {
            const result = await response.json(); // レスポンスをJSONで処理する
            if (result.result === "OK") {
                alert('送信が完了しました。ありがとうございました！');
            } else {
                console.error('不明なサーバー応答:', result);
                alert('送信に失敗しました。もう一度お試しください。');
            }
        } else {
            console.error('サーバーエラー:', response.statusText);
            alert('送信に失敗しました。もう一度お試しください。');
        }
    } catch (error) {
        console.error('ネットワークリクエスト中のエラー:', error);
        alert('送信に失敗しました。もう一度お試しください。');
    }
}

    const lastPage = document.querySelector('#page-4'); // 必要に応じて #page-5 に
    if (lastPage) {
        const btn = document.createElement('button');
        btn.textContent = '送信する';
        btn.addEventListener('click', submitToGAS);
        btn.style.marginTop = '20px';
        lastPage.appendChild(btn);
    }
});

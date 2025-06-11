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

 document.addEventListener("DOMContentLoaded", () => {
  const totalPages = 15;
  let currentPage = 1;

  // ページ表示切り替え
  function showPage(pageNum) {
    if (pageNum < 1 || pageNum > totalPages) return;

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const target = document.getElementById(`page-${pageNum}`);
    if (target) target.classList.add('active');

    currentPage = pageNum;
  }

  // ページ移動
  document.querySelectorAll(".next, .prev").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      const dir = btn.classList.contains("next") ? 1 : -1;
      saveInputs(`page-${currentPage}`);
      showPage(currentPage + dir);
    });
  });

  // 入力状態を保存
  function saveInputs(pageId) {
    const inputs = document.querySelectorAll(`#${pageId} input`);
    const data = {};

    inputs.forEach(input => {
      if (input.type === "radio") {
        if (input.checked) {
          data[input.name] = input.value;
        }
      } else {
        data[input.name || input.id] = input.value;
      }
    });

    const all = JSON.parse(sessionStorage.getItem("answers") || "{}");
    all[pageId] = data;
    sessionStorage.setItem("answers", JSON.stringify(all));
  }

  // 入力状態を復元
  function restoreInputs(pageId) {
    const saved = JSON.parse(sessionStorage.getItem("answers") || "{}")[pageId];
    if (!saved) return;

    const inputs = document.querySelectorAll(`#${pageId} input`);
    inputs.forEach(input => {
      if (input.type === "radio") {
        input.checked = saved[input.name] === input.value;
      } else {
        input.value = saved[input.name || input.id] || "";
      }
    });
  }

  // 全ページにトラッキングイベント追加
  for (let i = 1; i <= totalPages; i++) {
    const pageId = `page-${i}`;
    document.querySelectorAll(`#${pageId} input`).forEach(input => {
      input.addEventListener("input", () => saveInputs(pageId));
      input.addEventListener("change", () => saveInputs(pageId));
    });
    restoreInputs(pageId); // ページ読み込み時に復元
  }

  // 初期ページ表示
  showPage(1);
});



//送信用

document.addEventListener('DOMContentLoaded', function () {
  function collectAnswers() {
    const answers = {};

    document.querySelectorAll('#page-1 input[type="text"]').forEach((input, i) => {
      answers[`yomi${i + 1}`] = input.value.trim();
    });

    answers['jp_01'] = document.querySelector('input[name="jp_01"]')?.value.trim() || '';
    answers['jp_02'] = document.querySelector('input[name="jp_02"]:checked')?.value || '';
    answers['choice'] = document.querySelector('input[name="choice"]:checked')?.value || '';
    answers['jp5'] = document.querySelector('input[name="jp5"]')?.value.trim() || '';
    answers['contact'] = document.querySelector('input[name="contact"]:checked')?.value || '';
    answers['math_01'] = document.querySelector('input[name="math_01"]:checked')?.value || '';
    answers['math_02'] = document.querySelector('input[name="math_02"]:checked')?.value || '';
    answers['math_03'] = document.querySelector('input[name="math_03"]:checked')?.value || '';
    answers['math_041'] = document.querySelector('input[name="math_041"]')?.value.trim() || '';
    answers['math_042'] = document.querySelector('input[name="math_042"]')?.value.trim() || '';
    answers['math_043'] = document.querySelector('input[name="math_043"]')?.value.trim() || '';

    return answers;
  }

  async function submitToGAS(answers) {
    const params = new URLSearchParams();
    for (const key in answers) {
      params.append(key, answers[key]);
    }

    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbzLizIm3y_N5c8ToJ1FPbfaFmLH8rcSnCxSAoID-w5BcMKB0ndyCenw_2G2VX-3GHES9A/exec', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('送信完了:', result);
      
      if (result.status === "success") {
        alert('送信が完了しました。ありがとうございました！');
      } else {
        throw new Error(result.message || '送信に失敗しました');
      }
    } catch (error) {
      console.error('送信エラー:', error);
      alert('送信に失敗しました。もう一度お試しください。');
    }
  }

  const hoverButton = document.querySelector('#page-4 .button');
  if (hoverButton) {
    hoverButton.addEventListener('click', () => {
      const answers = collectAnswers();
      submitToGAS(answers);
    });
  } else {
    console.warn("送信ボタンが見つかりませんでした。");
  }
});
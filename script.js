const API_URL =
  "https://script.google.com/macros/s/AKfycbyPOzQkXLRmZsMfIIphkn_vpFxmyKtqc3xvUw0zigCqg_fh2Gc8U0Lo6K7LhjLnDu3q1Q/exec";

function formatSeat(seat) {
  if (!seat) return "";
  const m = String(seat).trim().match(/^([A-Za-z])\s*(\d+)$/);
  return m ? `${m[1].toUpperCase()}排${m[2]}號` : seat;
}

function checkIn() {
  const name = document.getElementById("name").value.trim();
  const result = document.getElementById("result");
  const button = document.querySelector("button");

  if (!name) {
    result.textContent = "請輸入本名";
    return;
  }

  /* ① 先顯示「暫時成功畫面」 */
  button.disabled = true;
  button.textContent = "確認中…";

  result.textContent =
`⏳ 正在確認報名資料…`;

  /* ② 背景送出請求 */
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ name })
  })
  .then(res => res.json())
  .then(data => {

    /* ❌ 沒報名 → 直接推翻 */
    if (data.status === "not_found") {
      result.textContent =
`❌ 查無此報名資料

請確認輸入的是【報名本名】
或請直接找 CC 協助`;
      return;
    }

    /* 🪑 座位判斷 */
    let seatBlock = "";
    if (data.seat) {
      seatBlock =
`您的座位是：
🎟️ ${formatSeat(data.seat)}`;
    } else {
      seatBlock =
`⚠️ 您尚未選位
請找 CC 詢問目前可入座的空位`;
    }

    /* ✅ 真正成功畫面 */
    result.textContent =
`✅ 報到完成！

${seatBlock}

感謝您前來參加
【Stray Kids: The dominATE Experience】包場活動 💙

請記得：
✔️ 找 CC 領取電影票與特典
✔️ 領取爆米花與飲料 🍿🥤

祝您和 Stray Kids 度過愉快的下午！`;

  })
  .catch(() => {
    result.textContent =
`⚠️ 系統忙碌中
請直接找 CC 協助`;
  })
  .finally(() => {
    button.disabled = false;
    button.textContent = "我已到場";
  });
}

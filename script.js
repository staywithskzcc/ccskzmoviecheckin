// ⚠️ 請確認這是你「最新重新部署」的 Web App URL
const API_URL =
  "https://script.google.com/macros/s/AKfycbyPOzQkXLRmZsMfIIphkn_vpFxmyKtqc3xvUw0zigCqg_fh2Gc8U0Lo6K7LhjLnDu3q1Q/exec";

// 將座位格式化成：L排20號
function formatSeat(seat) {
  if (!seat) return "";

  const text = String(seat).trim();

  // 支援格式：L20 / l20 / L 20 / l 20
  const match = text.match(/^([A-Za-z])\s*(\d+)$/);

  if (match) {
    const row = match[1].toUpperCase();
    const number = match[2];
    return `${row}排${number}號`;
  }

  // 若格式不符，原樣顯示
  return text;
}

async function checkIn() {
  const nameInput = document.getElementById("name");
  const result = document.getElementById("result");
  const button = document.querySelector("button");

  const name = nameInput.value.trim();

  if (!name) {
    result.textContent = "請輸入本名";
    return;
  }

  // ⚡ 體感加速：立刻給回饋
  button.disabled = true;
  button.textContent = "確認中…";
  result.textContent = "✔️ 已確認報名資料，請稍候";

  try {
    // ⚠️ 不加 Content-Type，避免 CORS 預檢
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ name })
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await res.json();

    // 🪑 座位顯示判斷
    const seatText = data.seat
      ? `🎟️ ${formatSeat(data.seat)}`
      : `⚠️ 您還未選位
請找 CC 詢問目前可入座的空位`;

    // ✅ 第一次成功報到
    if (data.status === "success") {
      result.textContent =
`✅ 報到完成！

${seatText}

感謝您前來參加
【Stray Kids: The dominATE Experience】包場活動 💙

請記得：
✔️ 找 CC 領取電影票與特典
✔️ 領取爆米花與飲料 🍿🥤

祝您和 Stray Kids 度過愉快的下午！`;
    }

    // ℹ️ 已報到過
    else if (data.status === "already") {
      const timeText = data.time
        ? new Date(data.time).toLocaleString("zh-TW")
        : "先前";

      result.textContent =
`ℹ️ 您已於 ${timeText} 完成報到

${seatText}

請確認您已領取：
✔️ 電影票與特典
✔️ 爆米花與飲料 🍿🥤

祝您和 Stray Kids 度過愉快的下午 💙`;
    }

    // ❌ 查無資料
    else if (data.status === "not_found") {
      result.textContent =
`❌ 查無此報名資料
請確認輸入的是【報名本名】
或請找 CC 協助`;
    }

    // ❓ 其他異常
    else {
      result.textContent = "系統回傳異常，請找 CC 協助";
    }

  } catch (err) {
    console.error("Fetch error:", err);
    result.textContent = "⚠️ 系統忙碌，請直接找 CC 協助";
  }

  // 🔓 解鎖按鈕
  button.disabled = false;
  button.textContent = "我已到場";
}

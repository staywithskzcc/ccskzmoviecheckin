const API_URL = "https://script.google.com/macros/s/AKfycbyPOzQkXLRmZsMfIIphkn_vpFxmyKtqc3xvUw0zigCqg_fh2Gc8U0Lo6K7LhjLnDu3q1Q/exec";

async function checkIn() {
  const name = document.getElementById("name").value.trim();
  const result = document.getElementById("result");

  if (!name) {
    result.textContent = "請輸入本名";
    return;
  }

 result.textContent = "【前端已更新】處理中，請稍候…";


  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });

    const data = await res.json();

    if (data.status === "success") {
      result.textContent =
`✅ 報到完成！

您的座位是：
🎟️ ${data.seat}

感謝您前來參加
【Stray Kids: The dominATE Experience】包場活動 💙

請記得：
✔️ 找 CC 領取電影票與特典
✔️ 領取爆米花與飲料 🍿🥤

祝您和 Stray Kids 度過愉快的下午！`;
    }

    else if (data.status === "already") {
      result.textContent =
`ℹ️ 您已於 ${new Date(data.time).toLocaleString("zh-TW")} 完成報到

您的座位是：
🎟️ ${data.seat}

請確認您已領取：
✔️ 電影票與特典
✔️ 爆米花與飲料 🍿🥤

祝您和 Stray Kids 度過愉快的下午 💙`;
    }

    else if (data.status === "not_found") {
      result.textContent =
`❌ 查無此報名資料
請確認輸入的是【報名本名】或請找 CC 協助`;
    }

    else {
      result.textContent = "系統錯誤，請找 CC 協助";
    }

  } catch (err) {
    result.textContent = "連線失敗，請檢查網路或找 CC 協助";
  }
}

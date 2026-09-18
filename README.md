# 妮好，薇笑生活｜午睡空間

50 分鐘沉浸式睡眠體驗的品牌官網。台北・桃園，採預約制。純靜態網站，由巧薇經營。

## 結構

```
index.html            首頁（單頁式）
assets/css/site.css   樣式與 design token
assets/images/        LOGO、favicon、巧薇去背照與品牌圖形
versions/photo-layout/ 有照片版的版面備份（等實拍照到位後還原）
google-sheet/          表單寫入 Google 試算表的 Apps Script 與設定步驟
docs/                 品牌文件與上線前補齊清單
prototypes/           舊版與早期原型（不上線）
```

## 本機預覽

需要 Node.js：

```bash
node .claude/serve.js
# 開啟 http://127.0.0.1:8765
```

或用任何靜態伺服器指向專案根目錄。

## 上線前待辦

實拍照片、巧薇簡介、Open Graph 分享圖與網域、
表單後端等待辦清單，由網站經營者另外保存。
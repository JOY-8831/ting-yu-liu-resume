Ting-Yu Liu Resume Website Backup
備份日期：2026-08-01

此資料夾包含：
- app：網站頁面、雙語履歷內容、繪本閱讀器與 CSS。
- public：人物照片、作品圖片、證書圖片、24 頁繪本等公開素材。
- dist：已完成建置、可供發布的網站版本。
- package.json／package-lock.json：重建網站所需的套件與版本清單。
- .openai/hosting.json：目前網站的 Sites 專案設定。
- 待調整與視覺討論.txt：尚待優化的視覺問題、方案與後續 prompt。
- deployment-package-v45.tar.gz：目前完成版的網站發布封裝。

為節省空間，備份不包含：
- node_modules：可依 package-lock.json 重新安裝。
- .git：網站的內部版本記錄。
- tmp 與 .wrangler：暫存及工具快取。

目前線上網址：
https://ting-yu-liu-resume.orangeyuu31.chatgpt.site

網站主要入口：
- 履歷首頁：/
- 互動繪本：/picture-book

若未來需要復原或修改，將整個資料夾交給 Codex，並說明：
「請讀取 BACKUP-README.txt、app、public、package.json 與 dist，繼續修改這個雙語履歷網站。」

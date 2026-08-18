"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import resumeData from "./resume-data.json";

type Lang = "zh" | "en";
type Tag = "esg" | "it" | "guide" | "other";
type Kind = "work" | "education" | "project" | "volunteer";
type Localized = { zh: string; en: string };
type TeamRotation = {
  name: Localized;
  period: Localized;
  bullets: Localized[];
};
type Item = {
  id: string;
  kind: Kind;
  tags: Tag[];
  period: Localized;
  title: Localized;
  org: Localized;
  summary: Localized;
  bullets: Localized[];
  teams?: TeamRotation[];
  image?: string;
  link?: string;
  imageLabel: Localized;
};
type Certificate = {
  title: Localized;
  issuer: Localized;
  period: Localized;
  detail: Localized;
  link?: string;
  image?: string;
  tone: string;
};

type TagDefinition = { id: Tag; label: Localized; color: string };
type ProfileFields = {
  name: string;
  chineseName: string;
  role: Localized;
  intro: Localized;
  location: Localized;
  profileText: Localized;
  skillText: Localized;
  languages: Localized;
};
type PortfolioData = { schemaVersion: 2; items: Item[]; certificates: Certificate[]; tags: TagDefinition[]; profile: ProfileFields };

const initialProfile: ProfileFields = {
  name: "Ting-Yu Liu",
  chineseName: "劉庭妤",
  role: { zh: "永續專員｜碳排放、資料與數位改善", en: "Sustainability Specialist | Carbon, Data & Digital Improvement" },
  intro: { zh: "我把複雜的永續與營運問題轉化成可執行的策略、清楚的指標與實用的數位工具；並結合 IT、資料與創意參與，設計自動化流程、儀表板、網站與學習體驗，讓跨文化團隊、客戶與社群更容易理解問題、貢獻想法並採取行動。", en: "I turn complex sustainability and operational challenges into practical strategies, clear metrics and useful digital tools. Combining IT, data and creative, participatory approaches, I build automations, dashboards, websites and learning experiences that help cross-cultural teams, customers and communities understand problems, contribute ideas and take action." },
  location: { zh: "台北・混合辦公・亞太跨國合作", en: "Taipei, Taiwan · Hybrid · APAC collaboration" },
  profileText: { zh: "具環境科學、IT 服務營運與企業分析背景，專長涵蓋 CSRD、SBTi、供應鏈減碳、資料治理、Power BI 與變革推動。", en: "An interdisciplinary specialist across environmental science, IT service operations and enterprise analytics, with strengths in CSRD, SBTi, supply-chain decarbonisation, data governance, Power BI and change enablement." },
  skillText: { zh: "Power BI・Power Automate・GIS・HTML・JavaScript・Python・R・Microsoft 365", en: "Power BI · Power Automate · GIS · HTML · JavaScript · Python · R · Microsoft 365" },
  languages: { zh: "中文（母語）・英文 C1・德文 B1", en: "Mandarin (native) · English C1 · German B1" },
};

const initialTags: TagDefinition[] = [
  { id: "esg", label: { zh: "永續 & ESG", en: "Sustainability & ESG" }, color: "#9aaa63" },
  { id: "it", label: { zh: "IT & Data", en: "IT & Data" }, color: "#6f9fba" },
  { id: "guide", label: { zh: "導遊 & 環境教育", en: "Guiding & Environmental Education" }, color: "#c47f5a" },
  { id: "other", label: { zh: "其他興趣", en: "Other Interests" }, color: "#917a9e" },
];

const sectionLabels: Record<Kind, Localized> = {
  work: { zh: "工作經歷", en: "Experience" },
  education: { zh: "教育背景", en: "Education" },
  project: { zh: "專案與成果", en: "Projects & Achievements" },
  volunteer: { zh: "志工與社群", en: "Volunteering & Community" },
};

const initialCertificates: Certificate[] = [
  {
    title: { zh: "環境教育人員認證", en: "Environmental Education Certificate" },
    issuer: { zh: "台灣環境部", en: "Ministry of Environment, Taiwan" },
    period: { zh: "2026.03 核發", en: "Issued Mar 2026" },
    detail: { zh: "具備依法執行與推廣環境教育的專業資格。", en: "Qualified to deliver and promote environmental education in Taiwan." },
    tone: "#d8f36a",
  },
  {
    title: { zh: "中文母語 · 英文 C1 · 德文 B1", en: "Mandarin Native · English C1 · German B1" },
    issuer: { zh: "跨文化溝通與國際協作", en: "Cross-cultural communication & international collaboration" },
    period: { zh: "語言能力", en: "Languages" },
    detail: { zh: "跨文化學習、研究與全球企業協作所需的語言能力。", en: "Language capability for cross-cultural study, research and global collaboration." },
    tone: "#a9ddff",
  },
  {
    title: { zh: "CSRD 基礎", en: "CSRD Fundamentals" },
    issuer: { zh: "Sustainability Reporting Institute", en: "Sustainability Reporting Institute" },
    period: { zh: "2025.09 核發", en: "Issued Sep 2025" },
    detail: { zh: "完成 CSRD 與永續報導基礎培訓。證書編號：68b6a8e094d1ed1de70e228f", en: "Completed foundational training in CSRD and sustainability reporting. Credential ID: 68b6a8e094d1ed1de70e228f" },
    tone: "#a8d8b9",
  },
  {
    title: { zh: "循環經濟－永續材料管理", en: "Circular Economy – Sustainable Materials Management" },
    issuer: { zh: "Coursera", en: "Coursera" },
    period: { zh: "2025.09 核發", en: "Issued Sep 2025" },
    detail: { zh: "完成循環經濟原則與永續材料管理的跨領域課程。", en: "Completed an interdisciplinary course on circular-economy principles and sustainable materials management." },
    image: "/circular-economy-certificate.png",
    tone: "#f3c36f",
  },
  {
    title: { zh: "氣候相關財務揭露工作小組（TCFD）", en: "Task Force on Climate-related Financial Disclosures (TCFD)" },
    issuer: { zh: "The CPD Certification Service", en: "The CPD Certification Service" },
    period: { zh: "2025.09 核發", en: "Issued Sep 2025" },
    detail: { zh: "完成以 TCFD 氣候相關財務揭露框架為主題的 CPD 認證培訓。", en: "Completed CPD-certified training on the TCFD framework for climate-related financial disclosures." },
    tone: "#9dd5e8",
  },
  {
    title: { zh: "RYT 200 瑜珈師資培訓", en: "RYT 200 Yoga Teacher Training" },
    issuer: { zh: "ULU Yoga／Yoga Alliance", en: "ULU Yoga / Yoga Alliance" },
    period: { zh: "2026.05.12 完成", en: "Completed May 12, 2026" },
    detail: { zh: "完成 200 小時多流派瑜珈師資課程，培訓聚焦傳統哈達瑜珈與流動瑜珈。", en: "Completed a 200-hour multi-style yoga teacher training course focused on traditional hatha and vinyasa yoga." },
    image: "/ryt200-certificate.jpg",
    tone: "#e6c6ff",
  },
  {
    title: { zh: "救生員證照", en: "Lifeguard Certificate" },
    issuer: { zh: "核發單位待補", en: "Issuer to be added" },
    period: { zh: "日期與效期待補", en: "Issue and expiry dates to be added" },
    detail: { zh: "水域安全、緊急應變與救援訓練；證照資訊待補。", en: "Training in water safety, emergency response and rescue; credential details to be added." },
    tone: "#ffc98d",
  },
];

const initialItems: Item[] = [
  {
    id: "sustainability-specialist",
    kind: "work",
    tags: ["esg", "it"],
    period: { zh: "2026.03 – 至今", en: "Mar 2026 – Present" },
    title: { zh: "永續專員", en: "Sustainability Specialist" },
    org: { zh: "DSV - Global Transport and Logistics｜台北・混合辦公", en: "DSV - Global Transport and Logistics | Taipei · Hybrid" },
    summary: { zh: "與亞太區重要客戶經理及跨功能團隊合作，將物流資料轉化為可信賴的碳排放分析、客戶永續報告與可行洞察。", en: "Partner with Key Account Managers and cross-functional teams across APAC to turn logistics data into reliable carbon-emission analysis, customer sustainability reports and actionable insights." },
    bullets: [
      { zh: "理解亞太客戶需求，依公認碳盤查方法與物流參數處理、驗證及分析貨運資料，量化運輸排放。", en: "Understand APAC customer needs and process, validate and analyse freight data using recognised carbon-accounting methodologies and logistics parameters." },
      { zh: "製作客戶導向的永續報告，以清楚的資料視覺化呈現結果與可行建議。", en: "Produce customer-facing sustainability reports with clear data visualisation and actionable recommendations." },
      { zh: "透過工作流程優化、自動化與標準化，提升碳報告的效率、一致性與資料品質。", en: "Improve carbon-reporting efficiency, consistency and data quality through workflow optimisation, automation and standardisation." },
      { zh: "促進亞太跨團隊知識分享，持續改善碳排放回報實務。", en: "Enable APAC knowledge sharing and continuous improvement of carbon-reporting practices across functions." },
    ],
    imageLabel: { zh: "物流碳排放分析／可替換作品圖", en: "Logistics carbon analysis / replaceable image" },
  },
  {
    id: "global-it-trainee",
    kind: "work",
    tags: ["esg", "it"],
    period: { zh: "2023.11 – 2025.03", en: "Nov 2023 – Mar 2025" },
    title: { zh: "全球 IT 儲備幹部", en: "Global IT Trainee" },
    org: { zh: "DB Schenker｜德國 Essen", en: "DB Schenker | Essen, Germany" },
    summary: { zh: "於全球營運、全球永續與航空貨運永續部門輪調，結合資料分析、流程改善與跨部門協作，推動全球 IT 與永續轉型專案。", en: "Rotated across Global Operations, Global Sustainability and Air Freight Sustainability, combining data analytics, process improvement and cross-functional collaboration." },
    bullets: [],
    teams: [
      {
        name: { zh: "Global Air Freight Sustainability", en: "Global Air Freight Sustainability" },
        period: { zh: "2024.10–2025.03", en: "Oct 2024–Mar 2025" },
        bullets: [
          { zh: "對內外推廣永續航空燃料（SAF），支援 Scope 3 減碳策略、銷售透明度與利害關係人溝通。", en: "Promoted Sustainable Aviation Fuel internally and externally to support Scope 3 decarbonisation, sales transparency and stakeholder communication." },
          { zh: "建立 SAF 銷售與採購儀表板，提供各區即時洞察並支援策略決策。", en: "Developed dashboards tracking SAF sales and procurement, providing cluster-level insights for data-driven decisions." },
          { zh: "共同製作 SAF 官方網站並優化銷售流程，提升客戶溝通、成交率與接觸紀錄透明度。", en: "Co-created an official SAF webpage and streamlined the sales pipeline, improving customer communication and transparency of hit rate and customer touch." },
          { zh: "研究競爭者減碳技術並轉化為可執行策略，支援 Scope 3 減量規劃。", en: "Benchmarked competitor carbon-reduction technologies and translated findings into actionable Scope 3 strategies." },
        ],
      },
      {
        name: { zh: "Global Sustainability", en: "Global Sustainability" },
        period: { zh: "2024.07–2024.09", en: "Jul–Sep 2024" },
        bullets: [
          { zh: "支援全球 ESG／SE 報告系統，強化跨國資料品質、自動驗證與即時事故通報。", en: "Supported the global ESG/SE reporting system through multinational data-quality controls, automated validation and incident reporting." },
          { zh: "主導 ESG 自動化工具的供應商接洽與評估，向高階領導團隊提出可行方案。", en: "Led vendor engagement and assessment of ESG automation tools, presenting viable solutions to the Senior Leadership Team." },
          { zh: "設計績效追蹤與自動驗證規則，使 140+ 國 ESG 資料完整性提升 45%。", en: "Improved ESG data integrity by 45% across 140+ countries through performance trackers and automated validation rules." },
          { zh: "撰寫符合 ISO 14001 的健康與安全手冊，強化內部永續與合規標準。", en: "Authored a Health & Safety manual aligned with ISO 14001, reinforcing internal sustainability and compliance standards." },
        ],
      },
      {
        name: { zh: "Global Operations, Infrastructure and Service", en: "Global Operations, Infrastructure and Service" },
        period: { zh: "2023.11–2024.06", en: "Nov 2023–Jun 2024" },
        bullets: [
          { zh: "支援主管推動人力管理與營運轉型，整合資料視覺化、人才發展與目標管理流程。", en: "Supported the Head Manager on HR management and operational transformation initiatives." },
          { zh: "整合人力指標儀表板與 Power Automate 表單，自動蒐集每月品質及每季員工滿意度資料。", en: "Integrated a workforce metrics dashboard with a Power Automate form, automating monthly quality and quarterly employee-satisfaction data collection and visualisation." },
          { zh: "在 LMS 建立能力差距分析與職涯路徑框架，支援 100+ ITSD 人員精準培訓。", en: "Developed an ability-gap analysis and career-path framework in the LMS, supporting targeted upskilling for 100+ ITSD employees." },
          { zh: "使用 Miroboard、Workpath 與 Microsoft 工具建立 OKR 追蹤系統，提升目標一致性與問責。", en: "Implemented an OKR tracking system using Miroboard, Workpath and Microsoft tools, strengthening alignment and accountability." },
        ],
      },
    ],
    imageLabel: { zh: "全球 IT 儲備幹部輪調", en: "Global IT Trainee rotations" },
  },
  {
    id: "it-service-desk",
    kind: "work",
    tags: ["it"],
    period: { zh: "2025.04 – 2025.12", en: "Apr 2025 – Dec 2025" },
    title: { zh: "IT 服務導入經理", en: "IT Service Onboarding Manager" },
    org: { zh: "DB Schenker × DSV｜德國 Essen", en: "DB Schenker x DSV | Essen, Germany" },
    summary: { zh: "在企業合併的 IT 基礎架構移轉期間，確保工單流程順利轉換。", en: "Ensured a smooth ticket-process transition during IT infrastructure migration in a corporate merger." },
    bullets: [
      { zh: "透過跨部門協作重新設計工單流程，建立清楚的標準作業程序並舉辦教育訓練。", en: "Redesigned the ticketing process with clear SOPs and training sessions via cross-functional collaboration." },
      { zh: "維護 100+ 項 IT 服務的知識文章，協助服務台人員更有效支援 70,000+ 名內部使用者。", en: "Maintained Knowledge Articles for 100+ IT services, enabling service desk agents better supporting 70,000+ internal users." },
    ],
    imageLabel: { zh: "IT 服務流程／可替換作品圖", en: "IT service workflow / replaceable image" },
  },
  {
    id: "dsv-reporting-tools",
    kind: "project",
    tags: ["esg", "it"],
    period: { zh: "2026.03 – 至今", en: "Mar 2026 – Present" },
    title: { zh: "物流碳報告工具組", en: "Logistics Carbon Reporting Toolkit" },
    org: { zh: "DSV｜三套內部軟體", en: "DSV | Three internal software tools" },
    summary: { zh: "開發三套內部工具，串接資料查找與整理、報告產製，以及報告視覺化與品質檢查；其中一項工作流程加速 85%。", en: "Developed three internal tools spanning data retrieval and preparation, report generation, and report visualisation and quality checks; one workflow was accelerated by 85%." },
    bullets: [
      { zh: "將重複性資料處理與報告步驟標準化，提升產出效率與一致性。", en: "Standardised repetitive data and reporting steps to improve output efficiency and consistency." },
      { zh: "重新設計圖表與報告版面，使碳排結果更容易被客戶理解與使用。", en: "Improved charts and report layouts so carbon results are easier for customers to understand and use." },
    ],
    imageLabel: { zh: "三套工具的匿名化流程示意", en: "Anonymised workflow across three tools" },
  },
  {
    id: "saf-integrated-dashboard",
    kind: "project",
    tags: ["esg", "it"],
    period: { zh: "2025・輪調後期", en: "2025 · Final rotation phase" },
    title: { zh: "SAF 整合儀表板", en: "Integrated SAF Dashboard" },
    org: { zh: "DB Schenker｜全球 IT 儲備幹部專案", en: "DB Schenker | Global IT Trainee project" },
    summary: { zh: "在航空貨運永續輪調後期整合 SAF 銷售、採購與區域進度資訊，讓分散資料能以一致視角追蹤並支援後續決策。", en: "Integrated SAF sales, procurement and regional progress information into a consistent view for tracking and decision support during the final rotation phase." },
    bullets: [
      { zh: "整合不同來源與區域的 SAF 指標，減少人工彙整並提升資料可讀性。", en: "Combined SAF metrics across sources and regions, reducing manual consolidation and improving readability." },
    ],
    imageLabel: { zh: "匿名化 SAF 整合儀表板概念畫面", en: "Anonymised integrated SAF dashboard concept" },
  },
  {
    id: "powerbi-service-dashboards",
    kind: "project",
    tags: ["esg", "it"],
    period: { zh: "2023.11 – 2024.03", en: "Nov 2023 – Mar 2024" },
    title: { zh: "Power BI Workforce Metrics 人力儀表板", en: "Power BI Workforce Metrics Dashboard" },
    org: { zh: "DB Schenker｜Global Operations, Infrastructure and Service", en: "DB Schenker | Global Operations, Infrastructure and Service" },
    summary: { zh: "於全球 IT 儲備幹部第一個輪調部門建立 Power BI 人力指標儀表板，整合人力結構、員工滿意度與意見回饋，協助團隊更快掌握趨勢與改善重點。", en: "Built a Power BI workforce metrics dashboard during the first Global IT Trainee rotation, integrating workforce structure, employee satisfaction and feedback to help the team identify trends and improvement priorities faster." },
    bullets: [],
    imageLabel: { zh: "匿名化 Power BI 人力指標儀表板概念畫面", en: "Anonymised Power BI workforce metrics dashboard concept" },
  },
  {
    id: "saf-marketing-site",
    kind: "project",
    tags: ["esg", "it"],
    period: { zh: "2024.07 – 2025.04", en: "Jul 2024 – Apr 2025" },
    title: { zh: "SAF 官方介紹與行銷網站", en: "Official SAF Information & Marketing Website" },
    org: { zh: "DB Schenker｜永續航空燃料內容專案", en: "DB Schenker | Sustainable Aviation Fuel content project" },
    summary: { zh: "撰寫永續航空燃料官方網站內容，將 SAF、市場發展與減碳價值轉化為清楚、易理解的對外介紹。", en: "Wrote official web content that translated Sustainable Aviation Fuel, market developments and decarbonisation value into clear, accessible external communication." },
    bullets: [
      { zh: "結合 SAF 供需缺口模型、區域目標與政策脈絡，支援行銷及客戶溝通。", en: "Connected SAF supply-demand analysis, regional targets and policy context to support marketing and customer communication." },
    ],
    image: "/saf-information-marketing-post.png",
    imageLabel: { zh: "DB Schenker SAF 官方介紹與行銷貼文", en: "DB Schenker official SAF information and marketing post" },
  },
  {
    id: "emct",
    kind: "work",
    tags: ["esg", "it"],
    period: { zh: "2020.06 – 2020.08", en: "Jun 2020 – Aug 2020" },
    title: { zh: "實習生", en: "Intern" },
    org: { zh: "宸訊科技 EMCT｜台灣", en: "EMCT | Taiwan" },
    summary: { zh: "為國家公園網站製作推廣內容，並將高雄市違規廢棄物通報資料轉化為 GIS 熱區圖，協助辨識高風險路段及可能需要優先清潔或巡查的位置。", en: "Created promotional content for a National Parks website and transformed Kaohsiung waste-violation reports into GIS hotspot maps to identify high-risk corridors and areas for potential cleaning or inspection prioritisation." },
    bullets: [
      { zh: "清理並定位 1,920 筆 2013 年通報資料，處理非標準地址，再以 Kepler.gl、TGOS 與 Mapbox 呈現空間分布。", en: "Cleaned and geocoded 1,920 reports from 2013, resolving non-standard addresses and visualising their spatial distribution with Kepler.gl, TGOS, and Mapbox." },
      { zh: "自行開發爬蟲，自動操作網頁 HTML 並擷取座標資料，減少逐筆查找與複製座標的人工處理。", en: "Developed a web scraper that interacted with webpage HTML and extracted coordinates, reducing manual record-by-record lookup and copying." },
      { zh: "依違規類型與車種比較熱點，辨識台 1、台 17、台 19 甲及前鎮、路竹、楠梓等聚集區；亦探索夜市周邊與人口密度等可能因素。", en: "Compared hotspots by violation and vehicle type, identifying clusters along Provincial Highways 1, 17, and 19A and in Qianzhen, Luzhu, and Nanzih, while exploring possible factors such as night markets and population density." },
      { zh: "參與 App 測試，檢查功能與使用流程並回報問題。", en: "Conducted app testing, checking functionality and user flows and reporting issues." },
    ],
    image: "/emct-waste-hotspot-map.png",
    imageLabel: { zh: "高雄廢棄物違規通報熱區與主要聚集路段", en: "Waste-violation hotspots and major clusters in Kaohsiung" },
  },
  {
    id: "ntnu-research-assistant",
    kind: "work",
    tags: ["esg", "it"],
    period: { zh: "2020.12 – 2021.09", en: "Dec 2020 – Sep 2021" },
    title: { zh: "兼任研究助理", en: "Part-time Research Assistant" },
    org: { zh: "國立臺灣師範大學地理學系", en: "Department of Geography, National Taiwan Normal University" },
    summary: { zh: "參與七家灣溪高山水文地質特性與流域水循環研究，利用地球化學參數辨識水源，以及地表水與地下水之間的交互作用。", en: "Supported research on alpine hydrogeological characteristics and watershed cycling in Qijiawan Creek, using geochemical parameters to identify water sources and surface-water–groundwater interactions." },
    bullets: [],
    imageLabel: { zh: "高山流域水文研究", en: "Alpine watershed hydrology research" },
  },
  {
    id: "tea",
    kind: "work",
    tags: ["esg", "guide"],
    period: { zh: "2018.04 – 2018.12", en: "Apr 2018 – Dec 2018" },
    title: { zh: "永續與社群實習", en: "Sustainability & Community Intern" },
    org: { zh: "台灣藍鵲茶｜台灣", en: "Taiwan Blue Magpie Tea | Taiwan" },
    summary: { zh: "協助 B Corp 認證、友善契作農業、企業 CSR 與環境教育社群溝通。", en: "Supported B Corp certification, eco-friendly contract farming, CSR programmes and environmental education." },
    bullets: [
      { zh: "彙整永續資料、治理文件與佐證，協調 B Corp 認證。", en: "Consolidated sustainability data, governance documents and evidence for B Corp certification." },
      { zh: "管理茶產品、環境教育與 NGO 活動內容，共辦公開講座並使粉專追蹤成長 10%。", en: "Managed product, education and NGO content; co-organised public talks and grew the page following by 10%." },
    ],
    image: "/taiwan-blue-magpie-tea.jpg",
    imageLabel: { zh: "台灣藍鵲茶活動現場", en: "Taiwan Blue Magpie Tea community event" },
  },
  {
    id: "master",
    kind: "education",
    tags: ["esg", "it"],
    period: { zh: "2021.10 – 2023.08", en: "Oct 2021 – Aug 2023" },
    title: { zh: "地下水與全球變遷聯合碩士", en: "Joint Master of Groundwater and Global Change" },
    org: { zh: "里斯本大學高等技術學院／IHE Delft 水教育學院／德勒斯登工業大學｜葡萄牙、荷蘭、德國", en: "Instituto Superior Técnico, University of Lisbon / IHE Delft Institute for Water Education / Technische Universität Dresden | Portugal, Netherlands, Germany" },
    summary: { zh: "以洞穴滴水同位素研究喀斯特通氣帶過程；並分析乾旱對德國三種生態系碳吸收的影響。", en: "Investigated karst vadose-zone processes using cave-drip water isotopes and analysed drought impacts on carbon uptake in three German ecosystems." },
    bullets: [
      { zh: "2022 年 6 月參與法國 Digne 五天戶外考察，與跨國同學及來自葡萄牙、荷蘭和德國的教師進行現地量測。", en: "Joined a five-day field course in Digne, France, in June 2022 with an international cohort and teachers from Portugal, the Netherlands and Germany." },
      { zh: "從地質構造、水文到水化學，以多角度觀察、量測並理解地下水系統。", en: "Conducted field measurements spanning geological formations, hydrology and water chemistry, strengthening a multidisciplinary understanding of groundwater systems." },
    ],
    image: "/ihe-digne-video-frame.jpg",
    link: "https://www.youtube.com/watch?v=mvAHYkQFhrg",
    imageLabel: { zh: "法國 Digne 戶外考察", en: "Field course in Digne, France" },
  },
  {
    id: "bachelor",
    kind: "education",
    tags: ["esg", "it", "guide"],
    period: { zh: "2017 – 2021", en: "2017 – 2021" },
    title: { zh: "地理學學士", en: "BA in Geography" },
    org: { zh: "國立臺灣師範大學｜台灣", en: "National Taiwan Normal University | Taiwan" },
    summary: { zh: "以 SWAT 模型研究氣候變遷下鳳山溪流域茶園藍／綠水空間差異與調適策略；另研究新竹茶農對缺水災害的認知與調適。", en: "Used the SWAT model to develop adaptive tea-farming strategies under climate change and studied farmers’ awareness and adaptation to water scarcity in Hsinchu." },
    bullets: [],
    imageLabel: { zh: "SWAT 與茶園研究／可替換作品圖", en: "SWAT and tea-farm research / replaceable image" },
  },
  {
    id: "undergraduate-research",
    kind: "project",
    tags: ["esg", "it"],
    period: { zh: "2019.08 – 2021", en: "Aug 2019 – 2021" },
    title: { zh: "氣候調適、茶園水資源與都市熱島研究", en: "Climate Adaptation, Tea-Water & Urban Heat Research" },
    org: { zh: "國立臺灣師範大學地理學系", en: "Department of Geography, National Taiwan Normal University" },
    summary: { zh: "大學期間以 SWAT 評估鳳山溪流域茶園藍水與綠水的空間差異及調適策略，並完成兩項佳作研究：新竹茶農對水資源不足的災害識覺，以及臺北盆地土地利用變遷與都市熱島效應。", en: "Used SWAT to assess spatial differences in blue and green water and adaptation strategies for tea farms in the Fengshan River watershed, and completed two recognised studies on Hsinchu tea farmers’ risk perception of water scarcity and land-use change and urban heat in the Taipei Basin." },
    bullets: [
      { zh: "科技部大專生研究計畫：2019.08–2020.03。", en: "Ministry of Science and Technology undergraduate research project: Aug 2019–Mar 2020." },
      { zh: "大專生小論文競賽：2020、2021 年皆獲佳作。", en: "Undergraduate research-paper competition: Honorable Mention in both 2020 and 2021." },
    ],
    imageLabel: { zh: "茶園水資源、SWAT 與都市熱島研究概念畫面", en: "Tea-water, SWAT and urban-heat research concept" },
  },
  {
    id: "water-gamechanger",
    kind: "project",
    tags: ["esg", "it", "guide"],
    period: { zh: "2023", en: "2023" },
    title: { zh: "節水系統：UN Gamechanger Challenge Top 20", en: "Water-saving System — UN Gamechanger Challenge Top 20" },
    org: { zh: "地下水與全球變遷聯合碩士期間・國際創新挑戰", en: "Joint Master in Groundwater and Global Change · International innovation challenge" },
    summary: { zh: "開發獲選 UN 2023 Gamechanger Challenge 前 20 名的節水系統，並於台灣金斯頓學校籌辦線上分享。", en: "Developed a water-saving system recognised in the Top 20 of the UN 2023 Gamechanger Challenge and organised an online talk at Taiwan Kingston School." },
    bullets: [],
    imageLabel: { zh: "節水系統／可替換作品圖", en: "Water-saving system / replaceable image" },
  },
  {
    id: "climate-game",
    kind: "project",
    tags: ["esg", "it", "guide"],
    period: { zh: "2021", en: "2021" },
    title: { zh: "《神農氏的時光機》氣候調適網頁遊戲", en: "Shennong’s Time Machine — Climate Adaptation Web Game" },
    org: { zh: "榮獲 Honorable Mention", en: "Honorable Mention" },
    summary: { zh: "與張容慈共同企劃一款以台灣農業為背景的氣候教育遊戲，將 RCP 4.5／8.5 氣候情境、作物生長條件與調適成本轉化為互動決策。", en: "Co-designed a Taiwan-focused climate education game with a teammate, translating RCP 4.5/8.5 scenarios, crop requirements, and adaptation costs into interactive decisions." },
    bullets: [
      { zh: "玩家可選擇五種作物與不同地區，運用改變種植地形、增加灌溉、改種作物或興建溫室等工具，在資金與產量之間做取捨。", en: "Players select among five crops and regions, then balance budget and yield using adaptations such as changing terrain, irrigation, crop switching, and greenhouses." },
      { zh: "企劃結合 TCCIP 統計降尺度氣候資料、作物防災栽培曆與 DSSAT 作物模式概念，讓學生與民眾理解氣候風險及調適並非單一答案。", en: "The concept combines TCCIP downscaled climate data, crop-disaster calendars, and DSSAT crop-model principles to show that climate adaptation involves multiple trade-offs." },
    ],
    image: "/climate-game-adaptation-screen.png",
    link: "https://www.youtube.com/watch?v=NZWUcXR3HQk",
    imageLabel: { zh: "RCP 4.5 情境下的作物調適決策畫面", en: "Crop adaptation decisions under an RCP 4.5 scenario" },
  },
  {
    id: "tgos-butterfly-map",
    kind: "project",
    tags: ["esg", "it", "guide"],
    period: { zh: "大學期間", en: "University project" },
    title: { zh: "TGOS 蝴蝶觀察地圖競賽作品", en: "TGOS Butterfly Observation Map Competition" },
    org: { zh: "TGOS 地圖應用競賽", en: "TGOS Map Application Competition" },
    summary: { zh: "整理蝴蝶觀察資訊並製作互動式地圖參賽，以空間視角呈現觀察地點與蝴蝶紀錄。", en: "Organised butterfly-observation information into an interactive competition map, presenting observation sites and records through a spatial perspective." },
    bullets: [],
    imageLabel: { zh: "蝴蝶觀察互動地圖概念畫面", en: "Interactive butterfly observation map concept" },
  },
  {
    id: "butterfly-volunteer",
    kind: "volunteer",
    tags: ["esg", "guide", "other"],
    period: { zh: "大學期間", en: "University years" },
    title: { zh: "蝴蝶保育與環境教育志工", en: "Butterfly Conservation & Environmental Education Volunteer" },
    org: { zh: "台灣蝴蝶保育協會", en: "Taiwan Butterfly Conservation Association" },
    summary: { zh: "參與協會志工活動，累積蝴蝶觀察、保育推廣與環境教育經驗，並成為後續蝴蝶辨識 AR App 的創作基礎。", en: "Supported association activities and gained experience in butterfly observation, conservation outreach and environmental education, later informing the Butterfly Identification AR App." },
    bullets: [],
    imageLabel: { zh: "蝴蝶保育志工／活動圖片待補", en: "Butterfly conservation volunteering / image to be added" },
  },
  {
    id: "butterfly-ar",
    kind: "project",
    tags: ["it", "guide", "other"],
    period: { zh: "大學期間", en: "University project" },
    title: { zh: "蝴蝶辨識 AR 環境教育 App", en: "Butterfly Identification AR App" },
    org: { zh: "評審獎", en: "Judges’ Award" },
    summary: { zh: "結合台灣蝴蝶保育協會志工經驗，打造沉浸式行動 AR 蝴蝶辨識與環境教育應用。", en: "Built an immersive mobile AR app for butterfly identification after volunteering with the Taiwan Butterfly Conservation Association." },
    bullets: [],
    image: "/butterfly-app-video-frame.jpg",
    link: "https://www.youtube.com/watch?v=ldLmzGwkLnI",
    imageLabel: { zh: "AR App／可替換作品圖", en: "AR app / replaceable image" },
  },
  {
    id: "taiwan-travel-guide",
    kind: "project",
    tags: ["it", "guide", "other"],
    period: { zh: "2026.01", en: "Jan 2026" },
    title: { zh: "Build Your Taiwan Journey 互動旅遊網站", en: "Build Your Taiwan Journey — Interactive Travel Website" },
    org: { zh: "待業期間自主專案・與設計師 Kathleen 合作", en: "Independent career-break project · Co-created with designer Kathleen" },
    summary: { zh: "與設計師共同規劃並製作台灣旅遊互動網站，讓旅客依行程與偏好快速探索台灣必去景點、必吃美食與在地資訊。", en: "Co-created an interactive Taiwan travel website that helps visitors quickly discover must-see places, local food and practical context based on their itinerary and preferences." },
    bullets: [
      { zh: "負責旅遊知識、內容架構、使用情境與互動體驗協作，將導覽經驗轉化為可自行探索的數位產品。", en: "Contributed travel knowledge, content structure, user scenarios and experience design, translating guiding expertise into a self-directed digital product." },
      { zh: "以遊戲化入口與簡易選擇流程降低資訊負擔，並整理圖片、食譜與參考來源。", en: "Used a playful entry and simple choice flow to reduce information overload, with curated photo, food and reference sources." },
    ],
    link: "https://joy-8831.github.io/taiwan-travel-guide/",
    image: "/build-your-taiwan-journey.png",
    imageLabel: { zh: "互動旅遊網站", en: "Interactive travel website" },
  },
  {
    id: "ntnu-picture-book-site",
    kind: "project",
    tags: ["esg", "guide", "other"],
    period: { zh: "2019", en: "2019" },
    title: { zh: "原創環境繪本《生命保衛戰》", en: "Life Defence Battle — Original Environmental Picture Book" },
    org: { zh: "國立臺灣師範大學｜繪本創作", en: "National Taiwan Normal University | Picture-book creation" },
    summary: { zh: "創作 24 頁原創環境繪本《生命保衛戰》，以圖像與故事呈現生態保育與環境教育議題。", en: "Created the 24-page original environmental picture book Life Defence Battle, using illustration and storytelling to explore ecology and environmental education." },
    bullets: [
      { zh: "從故事構想、文字到插畫皆由本人完成，將環境議題轉化為容易閱讀的敘事作品。", en: "Developed the story concept, writing and illustrations, translating environmental themes into an approachable narrative." },
      { zh: "完整繪本已整理為獨立閱讀頁，可逐頁翻閱。", en: "The complete book is available in a dedicated page-turning reader." },
    ],
    link: "/picture-book",
    image: "/life-defence-picture-book.png",
    imageLabel: { zh: "原創環境繪本《生命保衛戰》", en: "Original environmental picture book Life Defence Battle" },
  },
  {
    id: "sticker-design",
    kind: "project",
    tags: ["other"],
    period: { zh: "個人創作", en: "Personal creative work" },
    title: { zh: "《貓咪瑜珈老師（基礎動作）》LINE 訊息貼圖", en: "Cat as Yoga Teacher (Basic) — LINE Message Stickers" },
    org: { zh: "LINE Creators Market｜24 張訊息貼圖", en: "LINE Creators Market | 24 message stickers" },
    summary: { zh: "以可愛貓咪示範 24 種經典基礎瑜珈姿勢，並預留文字空間，讓使用者能自由加入訊息，結合瑜珈教學、角色插畫與日常聊天。", en: "Illustrated 24 classic basic yoga poses with an adorable cat and space for custom text, designed for both yoga practice and everyday chats." },
    bullets: [
      { zh: "貼圖 ID 46183296｜版本 1｜語言：繁體中文、英文。", en: "Sticker ID 46183296 | Version 1 | Languages: Traditional Chinese and English." },
      { zh: "從山式、下犬式、戰士式到攤屍式，以完整系列呈現基礎瑜珈動作。", en: "Covers a complete basic-yoga sequence, from Mountain and Downward Dog to Warrior and Corpse poses." },
    ],
    link: "https://line.me/S/sticker/35434888",
    image: "/cat-yoga-stickers.png",
    imageLabel: { zh: "《貓咪瑜珈老師（基礎動作）》24 張貼圖預覽", en: "Preview of 24 Cat as Yoga Teacher stickers" },
  },
  {
    id: "deer-stickers",
    kind: "project",
    tags: ["guide", "other"],
    period: { zh: "個人創作", en: "Personal creative work" },
    title: { zh: "《鹿鹿上鹿啦》LINE 原創貼圖", en: "Deer, You Are Everywhere — LINE Stickers" },
    org: { zh: "LINE Creators Market｜16 張貼圖", en: "LINE Creators Market | 16 stickers" },
    summary: { zh: "以臺灣特有亞種臺灣水鹿為主角，運用「鹿」的諧音、冷笑話與生活情境，將本土野生動物轉化為具有辨識度的聊天角色。", en: "Turned the Formosan sambar deer, a subspecies native to Taiwan, into a distinctive chat character through deer-related wordplay, humour and everyday situations." },
    bullets: [
      { zh: "貼圖 ID 22054400｜版本 1｜語言：繁體中文、英文。", en: "Sticker ID 22054400 | Version 1 | Languages: Traditional Chinese and English." },
      { zh: "以 16 張插畫結合臺灣生態特色、角色設計與中文諧音創意。", en: "Combines Taiwanese ecology, character design and Chinese wordplay across 16 illustrations." },
    ],
    link: "https://line.me/S/sticker/16051689",
    image: "/deer-stickers.png",
    imageLabel: { zh: "《鹿鹿上鹿啦》16 張貼圖預覽", en: "Preview of 16 Deer, You Are Everywhere stickers" },
  },
  {
    id: "community",
    kind: "volunteer",
    tags: ["guide", "other"],
    period: { zh: "持續參與", en: "Ongoing" },
    title: { zh: "活動策劃、導覽與社群參與", en: "Events, Guiding & Community Engagement" },
    org: { zh: "台灣與德國", en: "Taiwan & Germany" },
    summary: { zh: "以細緻觀察與真實連結為核心，策劃戶外踏查、城市導覽、速寫活動與國際地理年會。", en: "Organised field trips, city tours, urban-sketching sessions and the 2020 International Geography Conference." },
    bullets: [
      { zh: "舉辦免費城市速寫活動，促進社群連結並支援募款倡議。", en: "Organised free urban-sketching events to build community and support fundraising." },
    ],
    link: "https://halfgeographer.wordpress.com/2025/06/12/sketch-tour/",
    image: "/sketch-tour-collage.png",
    imageLabel: { zh: "城市速寫導覽活動與參與者作品", en: "Urban sketch tour and participants’ artwork" },
  },
];

const creativeIds = new Set([
  "butterfly-volunteer",
  "ntnu-picture-book-site",
  "sticker-design",
  "deer-stickers",
  "community",
]);

const ui = {
  zh: {
    navWork: "經歷", navProjects: "證照", navCreative: "個人創作", navContact: "聯絡",
    eyebrow: "永續 × 科技 × 人與地方",
    role: "永續專員｜碳排放、資料與數位改善",
    intro: "我把複雜的永續與營運問題轉化成可執行的策略、清楚的指標與實用的數位工具；並結合 IT、資料與創意參與，設計自動化流程、儀表板、網站與學習體驗，讓跨文化團隊、客戶與社群更容易理解問題、貢獻想法並採取行動。",
    location: "台北・混合辦公・亞太跨國合作",
    selected: "已選方向", all: "全部",
    cards: "作品卡片", resume: "正式履歷",
    download: "下載目前版本 HTML",
    profile: "關於我",
    profileText: "具環境科學、IT 服務營運與企業分析背景，專長涵蓋 CSRD、SBTi、供應鏈減碳、資料治理、Power BI 與變革推動。",
    skills: "技能與語言",
    skillText: "Power BI・Power Automate・GIS・HTML・JavaScript・Python・R・Microsoft 365",
    languages: "中文（母語）・英文 C1・德文 B1",
    contact: "一起把想法變成有影響力的行動。",
    email: "寄信給我", linkedin: "LinkedIn",
    replace: "作品圖片預留區",
    noResult: "沒有符合目前組合的項目，請減少標籤。",
    present: "至今",
  },
  en: {
    navWork: "Experience", navProjects: "Certificates", navCreative: "Personal Work", navContact: "Contact",
    eyebrow: "Sustainability × Technology × People & Place",
    role: "Sustainability Specialist | Carbon, Data & Digital Improvement",
    intro: "I turn complex sustainability and operational challenges into practical strategies, clear metrics and useful digital tools. Combining IT, data and creative, participatory approaches, I build automations, dashboards, websites and learning experiences that help cross-cultural teams, customers and communities understand problems, contribute ideas and take action.",
    location: "Taipei, Taiwan · Hybrid · APAC collaboration",
    selected: "Selected paths", all: "All",
    cards: "Portfolio cards", resume: "Formal résumé",
    download: "Download current HTML",
    profile: "Profile",
    profileText: "An interdisciplinary specialist across environmental science, IT service operations and enterprise analytics, with strengths in CSRD, SBTi, supply-chain decarbonisation, data governance, Power BI and change enablement.",
    skills: "Skills & languages",
    skillText: "Power BI · Power Automate · GIS · HTML · JavaScript · Python · R · Microsoft 365",
    languages: "Mandarin (native) · English C1 · German B1",
    contact: "Let’s turn a good idea into measurable impact.",
    email: "Email me", linkedin: "LinkedIn",
    replace: "Replaceable project image",
    noResult: "No items match this combination. Try fewer tags.",
    present: "Present",
  },
};

function EditableText({ value }: { value: string; editing: boolean; multiline?: boolean; onChange: (value: string) => void }) {
  return <>{value}</>;
}

const assetPath = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

function ProjectVisualContent({ item, lang, index }: { item: Item; lang: Lang; index: number }) {
  if (item.id === "dsv-reporting-tools") {
    return <div className="softwareShowcase" aria-label={lang === "zh" ? "三套內部軟體的匿名化示意圖" : "Anonymised visual of three internal software tools"}><div className="softwareTop"><strong>{lang === "zh" ? "3 套內部工具" : "3 internal tools"}</strong><span>85% ↑</span></div><div className="softwareFlow"><div><i>01</i><b>{lang === "zh" ? "資料查找" : "Data finder"}</b><small>{lang === "zh" ? "蒐集・驗證・整理" : "Collect · validate · prepare"}</small></div><div><i>02</i><b>{lang === "zh" ? "報告產製" : "Report builder"}</b><small>{lang === "zh" ? "資料到報告" : "Data-to-report workflow"}</small></div><div><i>03</i><b>{lang === "zh" ? "視覺優化" : "Visual QA"}</b><small>{lang === "zh" ? "圖表・版面・檢查" : "Charts · layout · checks"}</small></div></div><p>{lang === "zh" ? "匿名化介面示意，不含公司或客戶資料" : "Anonymised interface concept — no company or customer data"}</p></div>;
  }

  if (item.id === "saf-integrated-dashboard") {
    return <div className="portfolioConcept safConcept" role="img" aria-label={lang === "zh" ? "匿名化 SAF 整合儀表板示意" : "Anonymised SAF dashboard concept"}>
      <div className="conceptHeader"><b>SAF PERFORMANCE</b><span>DEMO DATA</span></div>
      <div className="conceptKpis"><div><small>SALES</small><strong>ON TRACK</strong></div><div><small>SUPPLY</small><strong>PLANNED</strong></div><div><small>REGIONS</small><strong>ALIGNED</strong></div></div>
      <div className="conceptSplit"><div className="conceptBars">{[42, 68, 54, 82, 64, 91].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div><div className="conceptProgress"><span>AMERICAS<i style={{ width: "72%" }} /></span><span>EUROPE<i style={{ width: "86%" }} /></span><span>APAC<i style={{ width: "61%" }} /></span></div></div>
      <p>{lang === "zh" ? "重新繪製的匿名化概念畫面" : "Recreated anonymised concept"}</p>
    </div>;
  }

  if (item.id === "powerbi-service-dashboards") {
    return <div className="portfolioConcept workforceConcept" role="img" aria-label={lang === "zh" ? "匿名化人力指標儀表板示意" : "Anonymised workforce dashboard concept"}>
      <div className="conceptHeader"><b>WORKFORCE PULSE</b><span>ANONYMISED</span></div>
      <div className="conceptKpis"><div><small>WORKFORCE</small><strong>TREND</strong></div><div><small>SATISFACTION</small><strong>PULSE</strong></div><div><small>FEEDBACK</small><strong>THEMES</strong></div></div>
      <div className="workforceVisual"><div className="lineChart"><i /><i /><i /><i /><i /><i /></div><div className="feedbackRows"><span /><span /><span /></div></div>
      <p>{lang === "zh" ? "不含真實員工、檔名或營運數據" : "No real employee, file or operational data"}</p>
    </div>;
  }

  if (item.id === "undergraduate-research") {
    return <div className="portfolioConcept researchConcept" role="img" aria-label={lang === "zh" ? "茶園水資源與都市熱島研究示意" : "Tea-water and urban-heat research concept"}>
      <div className="conceptHeader"><b>WATER × LAND × CLIMATE</b><span>RESEARCH</span></div>
      <div className="researchPanels"><div className="watershedPanel"><i /><i /><i /><strong>SWAT</strong><small>BLUE / GREEN WATER</small></div><div className="heatPanel">{Array.from({ length: 20 }).map((_, i) => <i key={i} className={`heat${i % 5}`} />)}<strong>URBAN HEAT</strong></div></div>
      <p>{lang === "zh" ? "流域模型、茶園調適與都市熱島" : "Watershed modelling, tea adaptation and urban heat"}</p>
    </div>;
  }

  if (item.id === "tgos-butterfly-map") {
    return <div className="portfolioConcept butterflyMapConcept" role="img" aria-label={lang === "zh" ? "蝴蝶觀察互動地圖示意" : "Butterfly observation map concept"}>
      <div className="conceptHeader"><b>BUTTERFLY OBSERVATIONS</b><span>TGOS MAP</span></div>
      <div className="mapCanvas"><span className="mapRoute" /><i className="pin pin1">✦</i><i className="pin pin2">✦</i><i className="pin pin3">✦</i><i className="pin pin4">✦</i><strong>◒</strong><small>OBSERVATION LAYERS</small></div>
      <p>{lang === "zh" ? "依地點組織觀察紀錄的互動地圖概念" : "Interactive concept mapping records by location"}</p>
    </div>;
  }

  if (item.image) return <img src={assetPath(item.image)} alt={item.imageLabel[lang]} />;
  return <><span className="visualMark">{["◌", "⌁", "✦", "◎"][index % 4]}</span><small>{item.imageLabel[lang]}</small></>;
}

const initialPortfolio = resumeData as PortfolioData;
const retiredProjectIds = new Set(["master-research", "forest-ecosystem-carbon", "alpine-watershed-research"]);
const requiredItemIds = new Set(["tea-community-project"]);
const addedCertificates = initialCertificates.filter((certificate) =>
  [
    "CSRD Fundamentals",
    "Circular Economy – Sustainable Materials Management",
    "Task Force on Climate-related Financial Disclosures (TCFD)",
  ].includes(certificate.title.en),
);
const finalCertificateTitles = new Set(["RYT 200 Yoga Teacher Training", "Lifeguard Certificate"]);

function mergeAndOrderCertificates(savedCertificates?: Certificate[]): Certificate[] {
  const certificates = Array.isArray(savedCertificates) ? [...savedCertificates] : [...initialPortfolio.certificates];
  for (const certificate of addedCertificates) {
    if (!certificates.some((item) => item.title.en === certificate.title.en)) certificates.push(certificate);
  }
  return [
    ...certificates.filter((certificate) => !finalCertificateTitles.has(certificate.title.en)),
    ...certificates.filter((certificate) => finalCertificateTitles.has(certificate.title.en)),
  ];
}

function migratePortfolio(saved: Partial<PortfolioData>): PortfolioData {
  const legacyIntro = {
    zh: "我把複雜的永續資料轉化成可執行的策略、清楚的指標與好用的數位工具，串連跨文化團隊、營運現場與環境教育。",
    en: "I turn complex sustainability data into practical strategies, clear metrics and useful digital tools—connecting cross-cultural teams, operations and environmental learning.",
  };
  const savedProfile = saved.profile;
  const profile = savedProfile
    ? {
        ...savedProfile,
        intro: {
          zh: !savedProfile.intro?.zh || savedProfile.intro.zh === legacyIntro.zh ? initialProfile.intro.zh : savedProfile.intro.zh,
          en: !savedProfile.intro?.en || savedProfile.intro.en === legacyIntro.en ? initialProfile.intro.en : savedProfile.intro.en,
        },
      }
    : initialPortfolio.profile;
  const savedItems = (Array.isArray(saved.items) ? saved.items : initialPortfolio.items)
    .filter((item) => !retiredProjectIds.has(item.id));
  const itemsWithRequiredProjects = [
    ...savedItems,
    ...initialPortfolio.items.filter((item) => requiredItemIds.has(item.id) && !savedItems.some((savedItem) => savedItem.id === item.id)),
  ];
  const items = itemsWithRequiredProjects
    .map((item) => {
      const source = initialPortfolio.items.find((initialItem) => initialItem.id === item.id);
      if (item.id === "saf-marketing-site") return { ...item, image: "/saf-information-marketing-post.png", imageLabel: source?.imageLabel ?? item.imageLabel };
      if (item.id === "water-gamechanger") return { ...item, image: "/un-gamechanger-team-star.jpg", imageLabel: source?.imageLabel ?? item.imageLabel };
      if (item.id === "powerbi-service-dashboards") return { ...item, image: undefined, imageLabel: source?.imageLabel ?? item.imageLabel };
      if (item.id === "ntnu-research-assistant") return { ...item, summary: source?.summary ?? item.summary };
      if (item.id === "tea") return { ...item, bullets: source?.bullets ?? item.bullets };
      if (item.id === "butterfly-volunteer") return { ...item, image: "/taiwan-butterfly-conservation-volunteer.jpg", imageLabel: source?.imageLabel ?? item.imageLabel };
      return item;
    });
  return {
    schemaVersion: 2,
    items,
    certificates: mergeAndOrderCertificates(saved.certificates),
    tags: Array.isArray(saved.tags) ? saved.tags : initialPortfolio.tags,
    profile,
  };
}

export default function Home() {
  const [lang, setLang] = useState<Lang>("en");
  const [activeTags, setActiveTags] = useState<Tag[]>([]);
  const [view, setView] = useState<"cards" | "resume">("cards");
  const editing = false;
  const portfolio = initialPortfolio;
  const certViewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "zh-Hant";
  }, [lang]);

  const { items, certificates, tags, profile } = portfolio;
  useEffect(() => {
    const viewport = certViewportRef.current;
    if (!viewport) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dragging = false;
    let moved = false;
    let hovered = false;
    let focused = false;
    let startX = 0;
    let startScrollLeft = 0;
    let pauseUntil = 0;
    let lastFrame = performance.now();
    let animationFrame = 0;

    const loopWidth = () => {
      const group = viewport.querySelector<HTMLElement>(".certGroup");
      return group ? group.offsetWidth + 10 : viewport.scrollWidth / 2;
    };
    const wrapPosition = (position: number) => {
      if (reducedMotion) return Math.max(0, Math.min(position, viewport.scrollWidth - viewport.clientWidth));
      const width = loopWidth();
      if (!width) return position;
      while (position < 0) position += width;
      while (position >= width) position -= width;
      return position;
    };
    const pauseManualMovement = () => {
      pauseUntil = performance.now() + 1200;
    };
    const animate = (now: number) => {
      const elapsed = Math.min(now - lastFrame, 50);
      lastFrame = now;
      if (!reducedMotion && !dragging && !hovered && !focused && now >= pauseUntil) {
        viewport.scrollLeft = wrapPosition(viewport.scrollLeft - elapsed * 0.03);
      }
      animationFrame = window.requestAnimationFrame(animate);
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      dragging = true;
      moved = false;
      startX = event.clientX;
      startScrollLeft = viewport.scrollLeft;
      viewport.classList.add("isDragging");
      viewport.setPointerCapture(event.pointerId);
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const distance = event.clientX - startX;
      if (Math.abs(distance) > 4) moved = true;
      viewport.scrollLeft = wrapPosition(startScrollLeft - distance);
    };
    const endPointerDrag = (event: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      viewport.classList.remove("isDragging");
      if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
      pauseManualMovement();
    };
    const handleClick = (event: MouseEvent) => {
      if (!moved) return;
      event.preventDefault();
      event.stopPropagation();
      moved = false;
    };
    const handleWheel = (event: WheelEvent) => {
      const movement = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (!movement) return;
      viewport.scrollLeft = wrapPosition(viewport.scrollLeft + movement);
      pauseManualMovement();
      event.preventDefault();
    };
    const handlePointerEnter = () => { hovered = true; };
    const handlePointerLeave = () => { hovered = false; };
    const handleFocusIn = () => { focused = true; };
    const handleFocusOut = (event: FocusEvent) => { focused = viewport.contains(event.relatedTarget as Node | null); };

    if (!reducedMotion) viewport.scrollLeft = Math.max(loopWidth() - 1, 0);
    viewport.addEventListener("pointerdown", handlePointerDown);
    viewport.addEventListener("pointermove", handlePointerMove);
    viewport.addEventListener("pointerup", endPointerDrag);
    viewport.addEventListener("pointercancel", endPointerDrag);
    viewport.addEventListener("pointerenter", handlePointerEnter);
    viewport.addEventListener("pointerleave", handlePointerLeave);
    viewport.addEventListener("focusin", handleFocusIn);
    viewport.addEventListener("focusout", handleFocusOut);
    viewport.addEventListener("click", handleClick, true);
    viewport.addEventListener("wheel", handleWheel, { passive: false });
    animationFrame = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      viewport.removeEventListener("pointerdown", handlePointerDown);
      viewport.removeEventListener("pointermove", handlePointerMove);
      viewport.removeEventListener("pointerup", endPointerDrag);
      viewport.removeEventListener("pointercancel", endPointerDrag);
      viewport.removeEventListener("pointerenter", handlePointerEnter);
      viewport.removeEventListener("pointerleave", handlePointerLeave);
      viewport.removeEventListener("focusin", handleFocusIn);
      viewport.removeEventListener("focusout", handleFocusOut);
      viewport.removeEventListener("click", handleClick, true);
      viewport.removeEventListener("wheel", handleWheel);
    };
  }, [certificates.length]);
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const showClickFeedback = (event: PointerEvent) => {
      if (reducedMotion.matches || event.button !== 0) return;
      const spark = document.createElement("span");
      spark.className = "clickSpark";
      spark.setAttribute("aria-hidden", "true");
      spark.style.left = `${event.clientX}px`;
      spark.style.top = `${event.clientY}px`;
      document.body.appendChild(spark);
      spark.addEventListener("animationend", () => spark.remove(), { once: true });
    };
    window.addEventListener("pointerdown", showClickFeedback);
    return () => window.removeEventListener("pointerdown", showClickFeedback);
  }, []);
  const t = {
    ...ui[lang],
    role: profile.role[lang],
    intro: profile.intro[lang],
    location: profile.location[lang],
    profileText: profile.profileText[lang],
    skillText: profile.skillText[lang],
    languages: profile.languages[lang],
  };
  const filtered = useMemo(
    () => activeTags.length ? items.filter((item) => activeTags.every((tag) => item.tags.includes(tag))) : items,
    [activeTags, items],
  );
  const creativeItems = filtered.filter((item) => creativeIds.has(item.id));
  const timelineRows = useMemo(() => {
    const timelineItems = filtered.filter((item) => !creativeIds.has(item.id));
    const byId = new Map(timelineItems.map((item) => [item.id, item]));
    const groups: { key: string; label: Localized; pathIds: string[]; projectIds: string[] }[] = [
      { key: "dsv", label: { zh: "2026–至今", en: "2026–Now" }, pathIds: ["sustainability-specialist"], projectIds: ["dsv-reporting-tools"] },
      { key: "taiwan-journey", label: { zh: "2026.01", en: "Jan 2026" }, pathIds: [], projectIds: ["taiwan-travel-guide"] },
      { key: "it-service", label: { zh: "2025", en: "2025" }, pathIds: ["it-service-desk"], projectIds: [] },
      {
        key: "global-it-trainee",
        label: { zh: "2023–25", en: "2023–25" },
        pathIds: ["global-it-trainee"],
        projectIds: [
          "saf-integrated-dashboard",
          "saf-marketing-site",
          "powerbi-service-dashboards",
        ],
      },
      {
        key: "master",
        label: { zh: "2021–23", en: "2021–23" },
        pathIds: ["master"],
        projectIds: ["water-gamechanger"],
      },
      {
        key: "research-assistant",
        label: { zh: "2020–21", en: "2020–21" },
        pathIds: ["ntnu-research-assistant"],
        projectIds: [],
      },
      { key: "emct", label: { zh: "2020", en: "2020" }, pathIds: ["emct"], projectIds: [] },
      { key: "tea", label: { zh: "2018", en: "2018" }, pathIds: ["tea"], projectIds: ["tea-community-project"] },
      {
        key: "bachelor",
        label: { zh: "2017–21", en: "2017–21" },
        pathIds: ["bachelor"],
        projectIds: ["climate-game", "undergraduate-research", "butterfly-ar", "tgos-butterfly-map"],
      },
    ];
    const usedIds = new Set(groups.flatMap((group) => [...group.pathIds, ...group.projectIds]));
    const customItems = timelineItems.filter((item) => !usedIds.has(item.id));
    if (customItems.length) {
      groups.unshift({
        key: "custom",
        label: { zh: "新增", en: "New" },
        pathIds: customItems.filter((item) => item.kind !== "project").map((item) => item.id),
        projectIds: customItems.filter((item) => item.kind === "project").map((item) => item.id),
      });
    }
    return groups
      .map((group) => ({
        key: group.key,
        label: group.label,
        path: group.pathIds.map((id) => byId.get(id)).filter((item): item is Item => Boolean(item)),
        projects: group.projectIds.map((id) => byId.get(id)).filter((item): item is Item => Boolean(item)),
      }))
      .filter((group) => group.path.length || group.projects.length);
  }, [filtered]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = Array.from(document.querySelectorAll<HTMLElement>(
      ".controls > *, .certifications .certIntro, .certCard, .timelineRow, .creativeHeading, .creativeCard, .resumeItem, .about > *",
    ));

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("revealVisible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("revealVisible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
    );

    targets.forEach((target, index) => {
      target.classList.add("revealItem");
      target.style.setProperty("--reveal-delay", `${Math.min(index % 4, 3) * 55}ms`);
      observer.observe(target);
    });

    return () => observer.disconnect();
  }, [view, activeTags]);

  const toggleTag = (tag: Tag) => {
    setActiveTags((current) => current.includes(tag) ? current.filter((x) => x !== tag) : [...current, tag]);
  };

  // The public GitHub build is intentionally read-only. These callbacks keep
  // the shared presentation markup simple while performing no mutations.
  const updateProfile = () => undefined;
  const updateName = () => undefined;
  const updateItemText = () => undefined;
  const updateBullet = () => undefined;
  const updateTeamText = () => undefined;
  const updateTeamBullet = () => undefined;
  const updateCertificate = () => undefined;

  const itemTools = (_item: Item) => null;

  const downloadHtml = () => {
    const sections = (Object.keys(sectionLabels) as Kind[])
      .map((kind) => {
        const rows = filtered.filter((x) => x.kind === kind);
        if (!rows.length) return "";
        return `<section><h2>${sectionLabels[kind][lang]}</h2>${rows.map((x) => `<article><div class="row"><h3>${x.title[lang]} · ${x.org[lang]}</h3><time>${x.period[lang]}</time></div><p>${x.summary[lang]}</p>${x.teams?.map((team) => `<div class="team"><h4>${team.name[lang]} <span>${team.period[lang]}</span></h4><ul>${team.bullets.map((b) => `<li>${b[lang]}</li>`).join("")}</ul></div>`).join("") ?? ""}${x.bullets.length ? `<ul>${x.bullets.map((b) => `<li>${b[lang]}</li>`).join("")}</ul>` : ""}${x.link ? `<p><a href="${x.link}">${x.link}</a></p>` : ""}</article>`).join("")}</section>`;
      }).join("");
    const credentialsHtml = `<section><h2>${lang === "zh" ? "證照與資格" : "Certificates & Credentials"}</h2>${certificates.map((c) => `<article><div class="row"><h3>${c.title[lang]} · ${c.issuer[lang]}</h3><time>${c.period[lang]}</time></div><p>${c.detail[lang]}</p></article>`).join("")}</section>`;
    const html = `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Ting-Yu Liu — ${t.role}</title><style>
      *{box-sizing:border-box}body{font-family:Arial,"Noto Sans TC",sans-serif;color:#172722;max-width:900px;margin:0 auto;padding:34px;font-size:11px;line-height:1.38}header{border-bottom:3px solid #172722;padding-bottom:14px;margin-bottom:18px}.top{display:flex;justify-content:space-between;gap:20px;align-items:end}h1{font-size:28px;margin:0;letter-spacing:-.5px}header h2{margin:3px 0 0;color:#29745d;font-size:15px}.contact{text-align:right}h2{font-size:14px;text-transform:uppercase;letter-spacing:1.5px;border-bottom:1px solid #8ba098;padding-bottom:4px;margin:15px 0 7px}article{break-inside:avoid;margin:0 0 9px}.row{display:flex;justify-content:space-between;gap:15px}h3{font-size:11.5px;margin:0}h4{font-size:10.5px;margin:7px 0 2px;border-bottom:1px solid #8ba098;padding-bottom:2px}h4 span{float:right;color:#51655e;font-weight:normal}time{white-space:nowrap;font-weight:bold;color:#51655e}p{margin:3px 0}ul{margin:4px 0 0;padding-left:19px;list-style:disc outside}li{padding-left:2px;margin:2px 0}.team{break-inside:avoid}.skills{background:#eef4f0;padding:8px 10px;margin-top:12px}@media print{@page{size:A4;margin:12mm}body{padding:0;max-width:none;font-size:9.5px}h1{font-size:24px}h2{margin-top:10px}article{margin-bottom:6px}}
    </style></head><body><header><div class="top"><div><h1>${profile.name.toUpperCase()} ${profile.chineseName}</h1><h2>${t.role}</h2></div><div class="contact">tyjoy.liu@gmail.com<br>linkedin.com/in/ting-yu-liu-joy/<br>${t.location}</div></div><p>${t.profileText}</p></header>${sections}${credentialsHtml}<div class="skills"><strong>${t.skills}</strong><br>${t.skillText}<br>${t.languages}</div></body></html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Ting-Yu-Liu-${lang}-${activeTags.length ? activeTags.join("-") : "full"}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main>
      <nav className="nav">
        <a className="brand" href="#top">TYL<span>.</span></a>
        <div className="navlinks"><a href="#experience">{t.navWork}</a><a href="#certifications">{t.navProjects}</a><a href="#personal-creative">{t.navCreative}</a><a href="#contact">{t.navContact}</a></div>
        <div className="language" aria-label="Language">
          <button className={lang === "zh" ? "active" : ""} onClick={() => setLang("zh")}>中</button>
          <button className={lang === "en" ? "active" : ""} onClick={() => setLang("en")}>EN</button>
        </div>
      </nav>

      <header className="hero" id="top">
        <div className="heroCopy">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1><span><EditableText value={profile.name.split(" ")[0] ?? profile.name} editing={editing} onChange={(value) => updateName("name", `${value} ${profile.name.split(" ").slice(1).join(" ")}`.trim())} /></span><span><em><EditableText value={profile.name.split(" ").slice(1).join(" ")} editing={editing} onChange={(value) => updateName("name", `${profile.name.split(" ")[0] ?? ""} ${value}`.trim())} /></em> <b className="chineseName"><EditableText value={profile.chineseName} editing={editing} onChange={(value) => updateName("chineseName", value)} /></b></span></h1>
          <h2><EditableText value={t.role} editing={editing} onChange={(value) => updateProfile("role", value)} /></h2>
          <p className="intro"><EditableText value={t.intro} editing={editing} multiline onChange={(value) => updateProfile("intro", value)} /></p>
          <p className="location"><span className="mapPin" aria-hidden="true" /><EditableText value={t.location} editing={editing} onChange={(value) => updateProfile("location", value)} /></p>
        </div>
        <div className="portraitWrap">
          <div className="orbit orbitOne" /><div className="orbit orbitTwo" />
          <img src={assetPath("/profile-source-0-X7.jpg")} alt="Ting-Yu Liu" className="portrait" />
          <div className="stat statOne"><strong>85%</strong><span>{lang === "zh" ? "節省處理時間" : "time saved"}</span></div>
          <div className="stat statTwo"><strong>100+</strong><span>{lang === "zh" ? <>IT 服務<br />提升服務台支援能力</> : <>IT services<br />service desk enablement</>}</span></div>
        </div>
      </header>

      <section className="controls" id="experience">
        <div>
          <span className="controlLabel">{t.selected}</span>
          <div className="tags">
            <button className={`tag ${activeTags.length === 0 ? "selected" : ""}`} onClick={() => setActiveTags([])}>#{t.all}</button>
            {tags.map((tag) => <button key={tag.id} style={{"--tag": tag.color} as React.CSSProperties} className={`tag ${activeTags.includes(tag.id) ? "selected" : ""}`} aria-pressed={activeTags.includes(tag.id)} onClick={() => toggleTag(tag.id)}>#{tag.label[lang]} <span>{activeTags.includes(tag.id) ? "×" : "+"}</span></button>)}
          </div>
        </div>
        <div className="actions">
          <div className="viewToggle">
            <button className={view === "cards" ? "active" : ""} onClick={() => setView("cards")}>▦ {t.cards}</button>
            <button className={view === "resume" ? "active" : ""} onClick={() => setView("resume")}>☷ {t.resume}</button>
          </div>
          <button className="download" onClick={downloadHtml}>↓ {t.download}</button>
        </div>
      </section>

      <section className="certifications" id="certifications">
        <div className="certIntro">
          <p className="eyebrow">{lang === "zh" ? "證照與資格" : "Certificates & Credentials"}</p>
          <h2>{lang === "zh" ? "專業知識，也要能在現場實踐。" : "Knowledge made practical in the field."}</h2>
        </div>
        <div ref={certViewportRef} className="certViewport" tabIndex={0} aria-label={lang === "zh" ? "可左右拖曳瀏覽證照" : "Drag horizontally to browse certificates"}>
          <div className="certTrack">
            <div className="certGroup">
              {certificates.map((cert, certificateIndex) => (
                <article className="certCard" key={cert.title.en}>
                  <span className="certMark">✓</span>
                  <p className="certPeriod"><EditableText value={cert.period[lang]} editing={editing} onChange={(value) => updateCertificate(certificateIndex, "period", value)} /></p>
                  <h3><EditableText value={cert.title[lang]} editing={editing} onChange={(value) => updateCertificate(certificateIndex, "title", value)} /></h3>
                  <h4><EditableText value={cert.issuer[lang]} editing={editing} onChange={(value) => updateCertificate(certificateIndex, "issuer", value)} /></h4>
                  <p><EditableText value={cert.detail[lang]} editing={editing} multiline onChange={(value) => updateCertificate(certificateIndex, "detail", value)} /></p>
                  {cert.link && <a href={cert.link} target="_blank" rel="noreferrer">{lang === "zh" ? "查看資格資料" : "View credential"} ↗</a>}
                  <details className="certDetails">
                    <summary>{lang === "zh" ? "顯示證照圖片" : "Show certificate image"}</summary>
                    <div className={`certMedia ${cert.image ? "hasImage" : "isEmpty"}`}>
                      {cert.image ? <img src={assetPath(cert.image)} alt={`${cert.title[lang]} ${lang === "zh" ? "證書" : "certificate"}`} /> : <span>{lang === "zh" ? "證書圖片待補" : "Certificate image to be added"}</span>}
                    </div>
                  </details>
                </article>
              ))}
            </div>
            <div className="certGroup certGroupClone" aria-hidden="true" inert>
              {certificates.map((cert) => (
                <article className="certCard" key={`clone-${cert.title.en}`}>
                  <span className="certMark">✓</span>
                  <p className="certPeriod">{cert.period[lang]}</p>
                  <h3>{cert.title[lang]}</h3>
                  <h4>{cert.issuer[lang]}</h4>
                  <p>{cert.detail[lang]}</p>
                  {cert.link && <span className="certCloneLink">{lang === "zh" ? "查看資格資料" : "View credential"} ↗</span>}
                  <div className="certCloneToggle">{lang === "zh" ? "顯示證照圖片" : "Show certificate image"}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="work" className={view === "cards" ? "cardView" : "resumeView"}>
        {!filtered.length && <p className="empty">{t.noResult}</p>}
        {view === "cards" ? <div className="timelinePortfolio">
          <div className="timelineHead"><span>{lang === "zh" ? "工作／學術經歷" : "Work / Academic path"}</span><span>{lang === "zh" ? "年份" : "Year"}</span><span>{lang === "zh" ? "同期專案與作品" : "Projects from the same period"}</span></div>
          {timelineRows.map((row) => <div className={`timelineRow ${row.path.length && row.projects.length ? "linked" : ""}`} key={row.key}>
            <div className="pathColumn">{row.path.map((item) => <article className="pathCard" key={item.id}>
              {itemTools(item)}
              <div className="meta"><span>{sectionLabels[item.kind][lang]}</span><time><EditableText value={item.period[lang]} editing={editing} onChange={(value) => updateItemText(item.id, "period", value)} /></time></div>
              <h3><EditableText value={item.title[lang]} editing={editing} onChange={(value) => updateItemText(item.id, "title", value)} /></h3>
              <h4><EditableText value={item.org[lang]} editing={editing} onChange={(value) => updateItemText(item.id, "org", value)} /></h4>
              <p><EditableText value={item.summary[lang]} editing={editing} multiline onChange={(value) => updateItemText(item.id, "summary", value)} /></p>
              {item.teams && <div className="teamRotations">{item.teams.map((team, teamIndex) => <section className="teamRotation" key={`${item.id}-${teamIndex}`}><h5><span><EditableText value={team.name[lang]} editing={editing} onChange={(value) => updateTeamText(item.id, teamIndex, "name", value)} /></span><time><EditableText value={team.period[lang]} editing={editing} onChange={(value) => updateTeamText(item.id, teamIndex, "period", value)} /></time></h5><ul>{team.bullets.map((bullet, bulletIndex) => <li key={bulletIndex}><EditableText value={bullet[lang]} editing={editing} multiline onChange={(value) => updateTeamBullet(item.id, teamIndex, bulletIndex, value)} /></li>)}</ul></section>)}</div>}
              {item.bullets.length > 0 && <ul>{item.bullets.slice(0, 3).map((bullet, index) => <li key={index}><EditableText value={bullet[lang]} editing={editing} multiline onChange={(value) => updateBullet(item.id, index, value)} /></li>)}</ul>}
              <div className="miniTags">{item.tags.map((id) => <span key={id}>#{tags.find((x) => x.id === id)?.label[lang]}</span>)}</div>
            </article>)}</div>
            <div className="yearRail"><span>{row.label[lang]}</span></div>
            <div className="projectColumn">{row.projects.map((item, i) => <article className="projectCard" key={item.id}>
              {itemTools(item)}
              <div className={`projectVisual visual${i % 4}`}><ProjectVisualContent item={item} lang={lang} index={i} /></div>
              <div className="projectBody"><div className="meta"><span>{sectionLabels[item.kind][lang]}</span><time><EditableText value={item.period[lang]} editing={editing} onChange={(value) => updateItemText(item.id, "period", value)} /></time></div><h3><EditableText value={item.title[lang]} editing={editing} onChange={(value) => updateItemText(item.id, "title", value)} /></h3><h4><EditableText value={item.org[lang]} editing={editing} onChange={(value) => updateItemText(item.id, "org", value)} /></h4><p><EditableText value={item.summary[lang]} editing={editing} multiline onChange={(value) => updateItemText(item.id, "summary", value)} /></p>{item.bullets.length > 0 && <ul>{item.bullets.slice(0, 3).map((bullet, index) => <li key={index}><EditableText value={bullet[lang]} editing={editing} multiline onChange={(value) => updateBullet(item.id, index, value)} /></li>)}</ul>}{item.link && <a className="projectLink" href={item.link} target="_blank" rel="noreferrer">{lang === "zh" ? "開啟作品" : "Visit project"} ↗</a>}<div className="miniTags">{item.tags.map((id) => <span key={id}>#{tags.find((x) => x.id === id)?.label[lang]}</span>)}</div></div>
            </article>)}</div>
          </div>)}
          {creativeItems.length > 0 && <section className="creativeShelf" id="personal-creative">
            <div className="creativeHeading"><div><p className="eyebrow">{lang === "zh" ? "個人投入" : "Personal work"}</p><h2>{lang === "zh" ? "在工作與研究之外，持續觀察、創作與連結。" : "Observing, creating and connecting beyond work and research."}</h2></div><p>{lang === "zh" ? "環境教育、繪本、貼圖、導覽與社群參與" : "Environmental education, picture books, stickers, guiding and community engagement"}</p></div>
            <div className="creativeGrid">{creativeItems.map((item, i) => <article className="projectCard creativeCard" key={item.id}>{itemTools(item)}<div className={`projectVisual visual${i % 4}`}>{item.image ? <img src={assetPath(item.image)} alt={item.imageLabel[lang]} /> : <><span className="visualMark">TYL.</span><small>{item.imageLabel[lang]}</small></>}</div><div className="projectBody"><div className="meta"><span>{sectionLabels[item.kind][lang]}</span><time><EditableText value={item.period[lang]} editing={editing} onChange={(value) => updateItemText(item.id, "period", value)} /></time></div><h3><EditableText value={item.title[lang]} editing={editing} onChange={(value) => updateItemText(item.id, "title", value)} /></h3><h4><EditableText value={item.org[lang]} editing={editing} onChange={(value) => updateItemText(item.id, "org", value)} /></h4><p><EditableText value={item.summary[lang]} editing={editing} multiline onChange={(value) => updateItemText(item.id, "summary", value)} /></p>{item.bullets.length > 0 && <ul>{item.bullets.slice(0, 2).map((bullet, index) => <li key={index}><EditableText value={bullet[lang]} editing={editing} multiline onChange={(value) => updateBullet(item.id, index, value)} /></li>)}</ul>}{item.link && <a className="projectLink" href={item.link} target="_blank" rel="noreferrer">{lang === "zh" ? "查看作品" : "View project"} ↗</a>}<div className="miniTags">{item.tags.map((id) => <span key={id}>#{tags.find((x) => x.id === id)?.label[lang]}</span>)}</div></div></article>)}</div>
          </section>}
        </div> : (
          <div className="resumePaper">
            <div className="resumeHeader"><div><h2>{profile.name.toUpperCase()} {profile.chineseName}</h2><p>{t.role}</p></div><div>tyjoy.liu@gmail.com<br/>linkedin.com/in/ting-yu-liu-joy/</div></div>
            <div className="resumeIntro"><h3>{t.profile}</h3><p><EditableText value={t.profileText} editing={editing} multiline onChange={(value) => updateProfile("profileText", value)} /></p></div>
            {(Object.keys(sectionLabels) as Kind[]).map((kind) => {
              const rows = filtered.filter((x) => x.kind === kind);
              return rows.length ? <section key={kind}><h3 className="resumeSection">{sectionLabels[kind][lang]}</h3>{rows.map((item) => <article className="resumeItem" key={item.id}>{itemTools(item)}<div className="resumeTitle"><div><strong><EditableText value={item.title[lang]} editing={editing} onChange={(value) => updateItemText(item.id, "title", value)} /></strong><span><EditableText value={item.org[lang]} editing={editing} onChange={(value) => updateItemText(item.id, "org", value)} /></span></div><time><EditableText value={item.period[lang]} editing={editing} onChange={(value) => updateItemText(item.id, "period", value)} /></time></div><p><EditableText value={item.summary[lang]} editing={editing} multiline onChange={(value) => updateItemText(item.id, "summary", value)} /></p>{item.teams && <div className="resumeTeams">{item.teams.map((team, teamIndex) => <section key={`${item.id}-${teamIndex}`}><h4><span><EditableText value={team.name[lang]} editing={editing} onChange={(value) => updateTeamText(item.id, teamIndex, "name", value)} /></span><time><EditableText value={team.period[lang]} editing={editing} onChange={(value) => updateTeamText(item.id, teamIndex, "period", value)} /></time></h4><ul>{team.bullets.map((bullet, bulletIndex) => <li key={bulletIndex}><EditableText value={bullet[lang]} editing={editing} multiline onChange={(value) => updateTeamBullet(item.id, teamIndex, bulletIndex, value)} /></li>)}</ul></section>)}</div>}{item.bullets.length > 0 && <ul>{item.bullets.map((bullet, bulletIndex) => <li key={bulletIndex}><EditableText value={bullet[lang]} editing={editing} multiline onChange={(value) => updateBullet(item.id, bulletIndex, value)} /></li>)}</ul>}{item.link && <a className="resumeLink" href={item.link} target="_blank" rel="noreferrer">{item.link}</a>}</article>)}</section> : null;
            })}
            <section><h3 className="resumeSection">{lang === "zh" ? "證照與資格" : "Certificates & Credentials"}</h3>{certificates.map((cert) => <article className="resumeItem" key={cert.title.en}><div className="resumeTitle"><div><strong>{cert.title[lang]}</strong><span>{cert.issuer[lang]}</span></div><time>{cert.period[lang]}</time></div><p>{cert.detail[lang]}</p></article>)}</section>
            <div className="resumeSkills"><strong>{t.skills}</strong><p>{t.skillText}</p><p>{t.languages}</p></div>
          </div>
        )}
      </section>

      <section className="about">
        <div><p className="eyebrow">{t.profile}</p><h2>{lang === "zh" ? "從地下水到全球供應鏈，讓資料產生改變。" : "From groundwater to global supply chains, making data matter."}</h2></div>
        <div><p><EditableText value={t.profileText} editing={editing} multiline onChange={(value) => updateProfile("profileText", value)} /></p><h3>{t.skills}</h3><p><EditableText value={t.skillText} editing={editing} multiline onChange={(value) => updateProfile("skillText", value)} /></p><p><EditableText value={t.languages} editing={editing} multiline onChange={(value) => updateProfile("languages", value)} /></p></div>
      </section>

      <footer id="contact"><p>{t.contact}</p><h2>Let&apos;s make<br/><em>impact</em> together.</h2><div><a href="mailto:tyjoy.liu@gmail.com">{t.email} ↗</a><a href="https://www.linkedin.com/in/ting-yu-liu-joy/" target="_blank" rel="noreferrer">{t.linkedin} ↗</a></div></footer>
    </main>
  );
}

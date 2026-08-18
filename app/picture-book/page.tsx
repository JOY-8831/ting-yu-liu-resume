"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

const totalPages = 24;

export default function PictureBookPage() {
  const [page, setPage] = useState(1);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [singlePage, setSinglePage] = useState(false);
  const touchStart = useRef<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 700px)");
    const update = () => setSinglePage(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const turn = useCallback((directionStep: number) => {
    setDirection(directionStep > 0 ? "next" : "prev");
    setPage((current) => {
      if (singlePage) return Math.min(totalPages, Math.max(1, current + directionStep));
      if (directionStep > 0) return current === 1 ? 2 : Math.min(totalPages, current + 2);
      return current <= 2 ? 1 : Math.max(2, current - 2);
    });
  }, [singlePage]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") turn(1);
      if (event.key === "ArrowLeft") turn(-1);
      if (event.key === "Home") setPage(1);
      if (event.key === "End") setPage(totalPages);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [turn]);

  const hasRightPage = !singlePage && page > 1 && page < totalPages;
  const pageLabel = hasRightPage ? `${page}–${page + 1}` : `${page}`;

  return (
    <main className="bookReader">
      <header className="bookHeader">
        <Link href="/#work" className="bookBack" aria-label="返回履歷">← 返回履歷</Link>
        <div>
          <p>ORIGINAL PICTURE BOOK · 2019</p>
          <h1>《生命保衛戰》</h1>
          <span>原創繪本｜劉庭妤 · 生態保育與環境教育</span>
        </div>
        <span className="bookCount">{pageLabel} / {totalPages}</span>
      </header>

      <section
        className="bookStage"
        aria-label={`繪本第 ${pageLabel} 頁，共 ${totalPages} 頁`}
        onTouchStart={(event) => { touchStart.current = event.touches[0]?.clientX ?? null; }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;
          const distance = event.changedTouches[0].clientX - touchStart.current;
          if (Math.abs(distance) > 45) turn(distance < 0 ? 1 : -1);
          touchStart.current = null;
        }}
      >
        <button className="bookArrow bookPrev" onClick={() => turn(-1)} disabled={page === 1} aria-label="上一頁">‹</button>
        <div className={`bookPageShell ${hasRightPage ? "bookSpread" : "bookSingle"}`}>
          <img
            key={`left-${page}`}
            className={`bookPage bookTurn-${direction}`}
            src={`/picture-book/${page}.jpg`}
            alt={`《生命保衛戰》第 ${page} 頁`}
            draggable={false}
          />
          {hasRightPage && <img
            key={`right-${page + 1}`}
            className={`bookPage bookPageRight bookTurn-${direction}`}
            src={`/picture-book/${page + 1}.jpg`}
            alt={`《生命保衛戰》第 ${page + 1} 頁`}
            draggable={false}
          />}
        </div>
        <button className="bookArrow bookNext" onClick={() => turn(1)} disabled={page === totalPages} aria-label="下一頁">›</button>
      </section>

      <nav className="bookControls" aria-label="繪本閱讀控制">
        <button onClick={() => { setDirection("prev"); setPage(1); }} disabled={page === 1}>第一頁</button>
        <input
          aria-label="繪本頁面選擇"
          type="range"
          min="1"
          max={totalPages}
          value={page}
          onChange={(event) => {
            const selected = Number(event.target.value);
            const next = singlePage || selected === 1 || selected === totalPages ? selected : selected - (selected % 2);
            setDirection(next >= page ? "next" : "prev");
            setPage(next);
          }}
        />
        <button onClick={() => { setDirection("next"); setPage(totalPages); }} disabled={page === totalPages}>最後一頁</button>
      </nav>
      <p className="bookHint">使用左右方向鍵、按鈕或滑動翻頁；桌機顯示跨頁，手機顯示單頁。</p>
    </main>
  );
}

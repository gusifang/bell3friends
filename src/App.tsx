import { useEffect } from "react";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import { chapters } from "./content/article";
import {
  Classical,
  Cheating,
  Quantum,
  FinalExperiment,
} from "./chapters/Chapters";
export default function App() {
  const location = useLocation();
  const index = chapters.findIndex((c) => c.path === location.pathname);
  const chapter = chapters[Math.max(0, index)];
  useEffect(() => {
    document.title = `${chapter.label} · Three Friends`;
    window.scrollTo(0, 0);
  }, [chapter]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to article
      </a>
      <header className="site-header">
        <Link className="brand" to="/classical">
          <span className="brand-mark">✳</span> THREE FRIENDS{" "}
          <span className="brand-sub">/ THE IMPOSSIBLE GAME</span>
        </Link>
        <span className="header-note">
          An interactive story about Bell’s theorem
        </span>
      </header>
      <div className="page-shell">
        <nav className="chapter-nav" aria-label="Chapters">
          {chapters.map((c, i) => (
            <Link
              key={c.path}
              to={c.path}
              aria-current={i === index ? "page" : undefined}
            >
              <span className="chapter-number">0{i + 1}</span>
              <span>{c.label}</span>
              <span className="nav-status">
                {i === index ? "READING" : i < index ? "EXPLORED" : ""}
              </span>
            </Link>
          ))}
          <div className="nav-foot">
            A simple game.
            <br />
            An impossible promise.
            <br />A different kind of nature.
          </div>
        </nav>
        <main id="main">
          <div
            className="chapter-progress"
            aria-label={`Chapter ${Math.max(0, index) + 1} of 4`}
          >
            {chapters.map((c, i) => (
              <span className={i <= index ? "filled" : ""} key={c.path} />
            ))}
          </div>
          <section className="hero">
            <span className="eyebrow">{chapter.kicker}</span>
            <h1>{chapter.title}</h1>
            <p className="lede">{chapter.intro}</p>
          </section>
          <Routes>
            <Route path="/classical" element={<Classical />} />
            <Route path="/cheating" element={<Cheating />} />
            <Route path="/quantum" element={<Quantum />} />
            <Route path="/experiment" element={<FinalExperiment />} />
            <Route path="*" element={<Navigate to="/classical" replace />} />
          </Routes>
          <nav className="chapter-pagination" aria-label="Continue article">
            {index > 0 ? (
              <Link to={chapters[index - 1].path}>
                <small>Previous</small>
                {chapters[index - 1].label}
              </Link>
            ) : (
              <span />
            )}
            {index < 3 ? (
              <Link to={chapters[Math.max(0, index) + 1].path}>
                <small>Next</small>
                {chapters[Math.max(0, index) + 1].label}
              </Link>
            ) : (
              <Link to="/classical">
                <small>Start again</small>The impossible game
              </Link>
            )}
          </nav>
          <footer>
            Adapted from “Three friends and the impossible game”. GHZ argument:
            Greenberger, Horne & Zeilinger (1989). Historical experimental note:
            three-photon GHZ test (2000).
            <br />A local, ideal mathematical simulation. No tracking. No live
            apparatus.
          </footer>
        </main>
      </div>
    </>
  );
}

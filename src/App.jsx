import { useState, useEffect } from "react";
import "./App.css";

const GLITCH_CHARS = "!@#$%^&*<>/\\|[]{}~`";

function GlitchText({ text, className = "" }) {
  const [display, setDisplay] = useState(text);
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const trigger = setInterval(() => {
      if (Math.random() > 0.85) {
        setGlitching(true);
        let frames = 0;
        const glitchInterval = setInterval(() => {
          setDisplay(
            text
              .split("")
              .map((c) =>
                Math.random() > 0.6
                  ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
                  : c
              )
              .join("")
          );
          frames++;
          if (frames > 6) {
            clearInterval(glitchInterval);
            setDisplay(text);
            setGlitching(false);
          }
        }, 60);
      }
    }, 1800);
    return () => clearInterval(trigger);
  }, [text]);

  return (
    <span className={`${className} ${glitching ? "glitching" : ""}`}>
      {display}
    </span>
  );
}

function BootSequence({ onComplete }) {
  const lines = [
    "> initializing CYBERMYKI_PHOTO_OS v1.0",
    "> mounting lens driver... OK",
    "> loading Canon EOS Rebel T7 interface...",
    "> calibrating sensor matrix... OK",
    "> scanning aperture settings... f/1.8 → f/22",
    "> importing captured_frames[]... OK",
    "> launching portfolio interface...",
    "",
    "SYSTEM READY.",
  ];
  const [visibleLines, setVisibleLines] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < lines.length) {
        setVisibleLines((prev) => [...prev, lines[i]]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setDone(true), 500);
        setTimeout(onComplete, 1200);
      }
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`boot-screen ${done ? "fade-out" : ""}`}>
      <div className="boot-terminal">
        <div className="boot-header">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
          <span className="boot-title">PHOTO_OS — boot</span>
        </div>
        <div className="boot-lines">
          {visibleLines.map((line, i) => (
            <div key={i} className={`boot-line ${line === "SYSTEM READY." ? "ready" : ""}`}>
              {line}
            </div>
          ))}
          <span className="cursor-blink">█</span>
        </div>
      </div>
    </div>
  );
}

const SPECS = [
  { label: "BODY",         value: "Canon EOS Rebel T7"      },
  { label: "SENSOR",       value: "24.1MP APS-C CMOS"       },
  { label: "ISO_RANGE",    value: "100 – 6400"               },
  { label: "SHUTTER",      value: "1/4000s max"              },
  { label: "AF_POINTS",    value: "9-point Phase Detect"     },
  { label: "OPERATOR_LVL", value: "BEGINNER // LEARNING"     },
];

const SUBJECTS = [
  { icon: "◈", label: "Street",       tag: "urban_capture"  },
  { icon: "◉", label: "Nature",       tag: "flora_fauna"    },
  { icon: "◆", label: "Architecture", tag: "structure_scan" },
  { icon: "◎", label: "Portrait",     tag: "human_frame"    },
  { icon: "◐", label: "Low Light",    tag: "night_mode"     },
];

// ── GALLERY ──────────────────────────────────────────────────────────────────
// Put images inside public/photos/ — reference them as /photos/filename.jpg
// Set src: null for placeholder cards (shown as coming-soon tiles)
const GALLERY = [
  {
    id: "001",
    title: "JijiTheCat",
    tag: "PORTRAIT",
    col: "span-2",
    src: "/photos/JijiTheCat.jpg",
  },
  {
    id: "002",
    title: "bug-nature",
    tag: "NATURE",
    col: "",
    src: "/photos/bug-nature.JPG",
  },
  {
    id: "003",
    title: "River",
    tag: "LANDSCAPE",
    col: "",
    src: "/photos/River.JPG",
  },
  {
    id: "004",
    title: "flower-butterfly",
    tag: "NATURE",
    col: "",
    src: "/photos/flower-butterfly.JPG",
  },
  {
    id: "005",
    title: "turtle-lake",
    tag: "WILDLIFE",
    col: "span-2",
    src: "/photos/turtle-lake.JPG",
  },
];

// ── PRICING ───────────────────────────────────────────────────────────────────
const PRICING = [
  {
    tier:         "MINI_SESSION",
    label:        "Mini Session",
    price:        "$49",
    duration:     "30 min",
    deliverables: "10 edited photos",
    tag:          "STARTER",
    features: [
      "1 location",
      "1 outfit change",
      "Online gallery delivery",
      "7-day turnaround",
    ],
    highlight: false,
  },
  {
    tier:         "STANDARD_SESSION",
    label:        "Standard Session",
    price:        "$99",
    duration:     "1 hour",
    deliverables: "25 edited photos",
    tag:          "POPULAR",
    features: [
      "Up to 2 locations",
      "2 outfit changes",
      "Online gallery delivery",
      "5-day turnaround",
      "1 free revision round",
    ],
    highlight: true,
  },
  {
    tier:         "EVENT_COVERAGE",
    label:        "Event Coverage",
    price:        "$179",
    duration:     "2–3 hours",
    deliverables: "50+ edited photos",
    tag:          "EVENTS",
    features: [
      "Birthdays / graduations / etc.",
      "Multiple locations",
      "Online gallery delivery",
      "7-day turnaround",
      "1 free revision round",
    ],
    highlight: false,
  },
];

const PALETTE = [
  "#0d0f14", "#0a3628", "#0f5c3a", "#00ff9d",
  "#00e68a", "#00cc7a", "#1a1f2e", "#c8ffd4",
];

// ── Gallery Card ─────────────────────────────────────────────────────────────
function GalleryCard({ item, index }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const color = PALETTE[(index * 3 + 2) % PALETTE.length];

  return (
    <div
      className={`gallery-card ${item.col}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ "--accent": color }}
    >
      {item.src && !imgError ? (
        <img
          src={item.src}
          alt={item.title}
          className="card-photo"
          onError={() => setImgError(true)}
        />
      ) : (
        <>
          <div className="card-noise" />
          <div className="card-grid-bg" />
        </>
      )}

      <div className={`card-overlay ${hovered ? "hovered" : ""}`}>
        <div className="card-scan-line" />
        <div className="card-frame-corner tl" />
        <div className="card-frame-corner tr" />
        <div className="card-frame-corner bl" />
        <div className="card-frame-corner br" />
        <div className="card-meta">
          <span className="card-id">frame_{item.id}</span>
          <span className="card-tag">[{item.tag}]</span>
        </div>
        <div className="card-title">{item.title}</div>
        {(!item.src || imgError) && <div className="card-placeholder-icon">⬡</div>}
      </div>
    </div>
  );
}

// ── Pricing Card ─────────────────────────────────────────────────────────────
function PricingCard({ plan }) {
  return (
    <div className={`pricing-card ${plan.highlight ? "pricing-highlight" : ""}`}>
      {plan.highlight && <div className="pricing-popular-badge">// MOST POPULAR</div>}
      <div className="pricing-header">
        <span className="pricing-tag">[{plan.tag}]</span>
        <h3 className="pricing-label">{plan.label}</h3>
      </div>
      <div className="pricing-price">
        <span className="pricing-amount">{plan.price}</span>
        <span className="pricing-meta">/ {plan.duration} · {plan.deliverables}</span>
      </div>
      <ul className="pricing-features">
        {plan.features.map((f, i) => (
          <li key={i} className="pricing-feature">
            <span className="pricing-arrow">→</span> {f}
          </li>
        ))}
      </ul>
      <a href="mailto:elizalde.13@hotmail.com" className="pricing-cta">
        <span className="pricing-cta-prompt">&gt;&nbsp;</span>
        BOOK NOW
      </a>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [booted, setBooted]     = useState(false);
  const [visible, setVisible]   = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (booted) setTimeout(() => setVisible(true), 100);
  }, [booted]);

  return (
    <>
      {!booted && <BootSequence onComplete={() => setBooted(true)} />}
      <div className={`app ${visible ? "app-visible" : ""}`}>
        <div className="scanlines" />

        {/* ── HEADER ── */}
        <header className="site-header">
          <div className="header-left">
            <div className="logo-block">
              <span className="logo-bracket">[</span>
              <GlitchText text="CYBER" className="logo-cyber" />
              <span className="logo-myki">MYKI</span>
              <span className="logo-bracket">]</span>
            </div>
            <span className="logo-sub">// PHOTO_PORTFOLIO</span>
          </div>
          <div className="header-right">
            <span className="status-dot" />
            <span className="status-text">SYSTEM_ONLINE</span>
          </div>
        </header>

        {/* ── HERO ── */}
        <section className="hero">
          <div className="hero-bg">
            <div className="hero-circle c1" />
            <div className="hero-circle c2" />
            <div className="hero-grid" />
          </div>
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span className="prompt">root@cybermyki:~$</span>
              <span className="prompt-cmd"> cat identity.txt</span>
            </div>
            <h1 className="hero-name">
              <GlitchText text="CyberMyki" />
            </h1>
            <p className="hero-tagline">
              <span className="tag-bracket">{"<"}</span>
              Capturing the world one frame at a time
              <span className="tag-bracket">{" />"}</span>
            </p>
            <div className="hero-badges">
              <span className="badge">Canon EOS Rebel T7</span>
              <span className="badge">Beginner</span>
              <span className="badge">Dallas, TX</span>
            </div>
          </div>
          <div className="hero-hud">
            <div className="hud-item">
              <span className="hud-label">APERTURE</span>
              <span className="hud-value">f/5.6</span>
            </div>
            <div className="hud-divider">|</div>
            <div className="hud-item">
              <span className="hud-label">SHUTTER</span>
              <span className="hud-value">1/200s</span>
            </div>
            <div className="hud-divider">|</div>
            <div className="hud-item">
              <span className="hud-label">ISO</span>
              <span className="hud-value">400</span>
            </div>
            <div className="hud-divider">|</div>
            <div className="hud-item">
              <span className="hud-label">MODE</span>
              <span className="hud-value">MANUAL</span>
            </div>
          </div>
        </section>

        {/* ── TABS ── */}
        <nav className="tabs-nav">
          {["profile", "gallery", "pricing"].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              <span className="tab-prompt">&gt;&nbsp;</span>
              {tab.toUpperCase()}
            </button>
          ))}
          <div className="tabs-line" />
        </nav>

        {/* ── PROFILE TAB ── */}
        {activeTab === "profile" && (
          <main className="tab-content fade-in">
            <section className="section">
              <div className="section-header">
                <span className="section-num">01</span>
                <h2 className="section-title">ABOUT_ME</h2>
                <div className="section-line" />
              </div>
              <div className="about-grid">
                <div className="about-terminal">
                  <div className="terminal-bar">
                    <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
                    <span className="terminal-title">bio.txt</span>
                  </div>
                  <div className="terminal-body">
                    <p><span className="t-key">name</span><span className="t-eq">=</span><span className="t-val">"CyberMyki"</span></p>
                    <p><span className="t-key">occupation</span><span className="t-eq">=</span><span className="t-val">"Full-Stack Engineer + Photographer"</span></p>
                    <p><span className="t-key">skill_level</span><span className="t-eq">=</span><span className="t-val">"Beginner // actively learning"</span></p>
                    <p><span className="t-key">location</span><span className="t-eq">=</span><span className="t-val">"Dallas, TX"</span></p>
                    <br />
                    <p className="t-comment">// I picked up a camera to see the world differently.</p>
                    <p className="t-comment">// Every photo is a commit to memory —</p>
                    <p className="t-comment">// exploring light, shadow, and timing.</p>
                  </div>
                </div>
                <div className="about-subjects">
                  <p className="subjects-label">&gt; interests[]</p>
                  {SUBJECTS.map((s, i) => (
                    <div key={i} className="subject-row" style={{ animationDelay: `${i * 0.08}s` }}>
                      <span className="subject-icon">{s.icon}</span>
                      <span className="subject-label">{s.label}</span>
                      <span className="subject-tag">{s.tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="section">
              <div className="section-header">
                <span className="section-num">02</span>
                <h2 className="section-title">HARDWARE_SPECS</h2>
                <div className="section-line" />
              </div>
              <div className="specs-block">
                <div className="specs-camera-icon">
                  <svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="20" width="110" height="65" rx="6" stroke="var(--green)" strokeWidth="2" fill="none"/>
                    <rect x="35" y="10" width="50" height="18" rx="3" stroke="var(--green)" strokeWidth="2" fill="none"/>
                    <circle cx="60" cy="55" r="20" stroke="var(--green)" strokeWidth="2" fill="none"/>
                    <circle cx="60" cy="55" r="13" stroke="var(--green-dim)" strokeWidth="1.5" fill="none"/>
                    <circle cx="60" cy="55" r="6" stroke="var(--green-dim)" strokeWidth="1" fill="none"/>
                    <circle cx="95" cy="32" r="5" stroke="var(--green)" strokeWidth="1.5" fill="none"/>
                    <rect x="12" y="30" width="14" height="10" rx="2" stroke="var(--green-dim)" strokeWidth="1" fill="none"/>
                  </svg>
                </div>
                <div className="specs-table">
                  {SPECS.map((s, i) => (
                    <div key={i} className="spec-row">
                      <span className="spec-label">{s.label}</span>
                      <span className="spec-sep">→</span>
                      <span className="spec-value">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="section">
              <div className="section-header">
                <span className="section-num">03</span>
                <h2 className="section-title">LEARNING_LOG</h2>
                <div className="section-line" />
              </div>
              <div className="log-grid">
                {[
                  { skill: "Exposure Triangle",  progress: 65, status: "IN_PROGRESS" },
                  { skill: "Manual Focus",        progress: 40, status: "LEARNING"    },
                  { skill: "Composition Rules",   progress: 75, status: "PRACTICING"  },
                  { skill: "RAW Editing",         progress: 30, status: "EARLY_STAGE" },
                  { skill: "Low Light Shooting",  progress: 50, status: "IN_PROGRESS" },
                  { skill: "Street Photography",  progress: 55, status: "EXPLORING"   },
                ].map((item, i) => (
                  <div key={i} className="log-item">
                    <div className="log-top">
                      <span className="log-skill">{item.skill}</span>
                      <span className="log-status">{item.status}</span>
                    </div>
                    <div className="log-bar-bg">
                      <div
                        className="log-bar-fill"
                        style={{ width: `${item.progress}%`, animationDelay: `${i * 0.12}s` }}
                      />
                    </div>
                    <span className="log-pct">{item.progress}%</span>
                  </div>
                ))}
              </div>
            </section>
          </main>
        )}

        {/* ── GALLERY TAB ── */}
        {activeTab === "gallery" && (
          <main className="tab-content fade-in">
            <section className="section">
              <div className="section-header">
                <span className="section-num">—</span>
                <h2 className="section-title">CAPTURED_FRAMES[]</h2>
                <div className="section-line" />
              </div>
              <p className="gallery-note">
                <span className="prompt">&gt;</span> Displaying {GALLERY.filter(g => g.src).length} processed frame(s) · {GALLERY.filter(g => !g.src).length} pending...
                <span className="cursor-blink"> █</span>
              </p>
              <div className="gallery-grid">
                {GALLERY.map((item, i) => (
                  <GalleryCard key={item.id} item={item} index={i} />
                ))}
              </div>
            </section>
          </main>
        )}

        {/* ── PRICING TAB ── */}
        {activeTab === "pricing" && (
          <main className="tab-content fade-in">
            <section className="section">
              <div className="section-header">
                <span className="section-num">—</span>
                <h2 className="section-title">PRICING_PACKAGES</h2>
                <div className="section-line" />
              </div>
              <p className="gallery-note" style={{ marginBottom: "36px" }}>
                <span className="prompt">&gt;</span> Beginner-friendly rates · Based in Dallas, TX · Travel fees may apply outside DFW
              </p>
              <div className="pricing-grid">
                {PRICING.map((plan, i) => (
                  <PricingCard key={i} plan={plan} />
                ))}
              </div>
              <div className="pricing-note">
                <span className="prompt">&gt;</span>
                <span> All sessions include a free pre-shoot consultation. Prices are introductory and subject to change as I grow.</span>
              </div>
            </section>
          </main>
        )}

        {/* ── FOOTER ── */}
        <footer className="site-footer">
          <span className="footer-prompt">root@cybermyki:~$</span>
          <span className="footer-text"> © 2025 CyberMyki // All Rights Reserved</span>
          <span className="footer-status">[ PHOTO_OS RUNNING ]</span>
        </footer>
      </div>
    </>
  );
}
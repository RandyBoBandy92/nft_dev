import "./App.css";
import monkeyNft from "./assets/monkey-nft.png";

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <nav>
          <div className="nav-links">
            <a href="#" className="nav-link">
              Marketplace
            </a>
            <a href="#" className="nav-link">
              Activity
            </a>
            <a href="#" className="nav-link">
              Community
            </a>
          </div>
        </nav>
      </header>

      <main className="main-content">
        <div className="hero-section">
          <div className="hero-text">
            <h1 className="hero-title">
              Discover, collect, and sell extraordinary NFTs
            </h1>
            <p className="hero-subtitle">
              Explore the marketplace to find unique digital artwork and
              collectibles.
            </p>
            <div className="cta-buttons">
              <button className="btn primary-btn">Explore</button>
              <button className="btn secondary-btn">Create</button>
            </div>
          </div>
          <div className="hero-image">
            <img src={monkeyNft} alt="Monkey NFT" className="nft-image" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

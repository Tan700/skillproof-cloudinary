import Link from 'next/link';

export default function Home() {
  return (
    <main className="page">
      <div className="shell">
        <div className="nav">
          <Link href="/" className="brand">skillproof/</Link>
          <nav className="navlinks"><Link href="/dashboard">Dashboard</Link><Link href="/discover">Discover</Link></nav>
        </div>

        <section className="hero">
          <div>
            <span className="eyebrow">Media-first proof of work</span>
            <h1>SHOW.<br/>DON'T JUST<br/>TELL.</h1>
            <p>SkillProof turns student projects into interactive proof-of-work pages using the media they already create: demos, screenshots, certificates, and explanations.</p>
            <div className="ctas"><Link className="btn" href="/dashboard">Build my proof →</Link><Link className="btn secondary" href="/discover">Explore talent</Link></div>
          </div>
          <div className="heroCard">
            <div className="heroMedia"><div className="play">▶</div><small>Cloudinary-powered project demo</small></div>
            <div className="heroInfo"><h3>Smart Irrigation System</h3><p>ESP32 + sensors + automation, shown through actual project evidence.</p><div className="tags"><span className="tag">IoT</span><span className="tag">ESP32</span><span className="tag">Sensors</span><span className="tag">C++</span></div></div>
          </div>
        </section>

        <section className="section">
          <div className="sectionHead"><div><h2>One upload. Many experiences.</h2></div><p>Cloudinary is the media layer: uploads, transformations, automatic quality/format optimization, tags, contextual metadata, and delivery all sit inside the core product flow.</p></div>
          <div className="featureGrid">
            <div className="feature"><div className="num">01 / UPLOAD</div><h3>Collect proof</h3><p>Bring in project demos, screenshots, certificates, and other evidence through the Cloudinary Upload Widget.</p></div>
            <div className="feature"><div className="num">02 / TRANSFORM</div><h3>Prepare media</h3><p>Render responsive images and optimized video delivery instead of serving original files everywhere.</p></div>
            <div className="feature"><div className="num">03 / DISCOVER</div><h3>Find real work</h3><p>Search projects by skills and evidence so recruiters can move from claims to visible proof.</p></div>
          </div>
        </section>

        <section className="section" id="how">
          <div className="sectionHead"><div><h2>Built for a judge in three minutes.</h2></div><p>Start with an upload, show the optimized asset, open the proof page, then search the project library. That is the entire story.</p></div>
          <div className="panel"><div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
            {['Create project','Upload to Cloudinary','Open proof page','Search talent'].map((step,i)=><div key={step} style={{padding:18,border:'1px solid var(--line)',borderRadius:14}}><div style={{fontWeight:900,fontSize:12}}>0{i+1}</div><div style={{marginTop:28,fontWeight:800}}>{step}</div></div>)}
          </div></div>
        </section>

        <div className="footer"><div style={{display:'flex',justifyContent:'space-between',gap:20,flexWrap:'wrap'}}><span>SkillProof — hackathon MVP</span><span>Cloudinary is a core part of the media workflow.</span></div></div>
      </div>
    </main>
  );
}

'use client';

import Link from 'next/link';

export function Nav() {
  return (
    <header className="appHeader">
      <div className="shell">
        <div className="nav">
          <Link href="/" className="brand">skillproof/</Link>
          <nav className="navlinks">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/discover">Discover</Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

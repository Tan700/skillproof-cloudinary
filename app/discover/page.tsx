'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Nav } from '@/components/Nav';
import { ProjectCard } from '@/components/ProjectCard';
import { readProjects } from '@/lib/storage';
import { Project } from '@/lib/types';

export default function DiscoverPage() {
  const [query, setQuery] = useState('IoT');
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => { setProjects(readProjects()); }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => [p.title, p.description, p.creator, ...p.skills].join(' ').toLowerCase().includes(q));
  }, [query, projects]);

  return <>
    <Nav />
    <main className="shell dashboard">
      <div className="dashboardTop"><div><h1>Discover proof</h1><p>Search the project library by skill, topic, or builder.</p></div><Link className="btn secondary" href="/dashboard">Create project</Link></div>
      <div className="searchBar"><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Try: IoT, React, AI, ESP32..." /><button className="btn" type="button">Search</button></div>
      {results.length ? <div className="projectGrid">{results.map((p)=><ProjectCard key={p.id} project={p}/>)}</div> : <div className="empty">No projects match “{query}”. Try another skill.</div>}
    </main>
  </>;
}

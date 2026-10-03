'use client';

import { FormEvent, useEffect, useState } from 'react';
import { CloudinaryUpload } from '@/components/CloudinaryUpload';
import { ProjectCard } from '@/components/ProjectCard';
import {
  addSupabaseProjectAsset,
  createSupabaseProject,
  ensureAnonymousProfile,
  fetchProjects,
} from '@/lib/supabase/data';
import { Project, ProjectAsset } from '@/lib/types';

export default function DashboardClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [createdId, setCreatedId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadProjects() {
    try {
      setLoading(true);
      setError(null);

      await ensureAnonymousProfile();

      const data = await fetchProjects();

      setProjects(data);

      if (!createdId && data.length > 0) {
        setCreatedId(data[0].id);
      }
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load projects.'
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createProject(e: FormEvent) {
    e.preventDefault();

    try {
      setCreating(true);
      setError(null);

      const project = await createSupabaseProject({
        title,
        description,
        skills: skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      });

      const refreshed = await fetchProjects();

      setProjects(refreshed);
      setCreatedId(project.id);

      setTitle('');
      setDescription('');
      setSkills('');
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to create project.'
      );
    } finally {
      setCreating(false);
    }
  }

  async function attachAsset(asset: ProjectAsset) {
    if (!createdId) return;

    try {
      setError(null);

      await addSupabaseProjectAsset(createdId, asset);

      const refreshed = await fetchProjects();

      setProjects(refreshed);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save media record.'
      );
    }
  }

  const selectedProject =
    projects.find((project) => project.id === createdId) ??
    projects[0];

  if (loading) {
    return (
      <div className="dashboard">
        <div className="panel">
          <h2>Loading your proof library…</h2>
          <p>Connecting SkillProof to Supabase.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboardTop">
        <div>
          <h1>Your proof library</h1>

          <p>
            Build project pages around the media that proves
            your work.
          </p>

          <div className="statRow">
            <div className="stat">
              <b>{projects.length}</b>
              <span>Projects</span>
            </div>

            <div className="stat">
              <b>
                {projects.reduce(
                  (total, project) =>
                    total + project.assets.length,
                  0
                )}
              </b>
              <span>Media assets</span>
            </div>

            <div className="stat">
              <b>Cloudinary</b>
              <span>Media layer</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div
          className="notice"
          style={{ borderColor: '#ef4444' }}
        >
          <strong>Something went wrong</strong>
          <p>{error}</p>
        </div>
      )}

      <div className="formGrid">
        <section className="panel">
          <h2>1. Create a project</h2>

          <form onSubmit={createProject}>
            <div className="field">
              <label>Project name</label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Smart Irrigation System"
              />
            </div>

            <div className="field">
              <label>Description</label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="What did you build and why?"
              />
            </div>

            <div className="field">
              <label>Skills (comma separated)</label>

              <input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="IoT, ESP32, Sensors, C++"
              />
            </div>

            <button
              className="btn"
              type="submit"
              disabled={creating}
            >
              {creating
                ? 'Creating project…'
                : 'Create proof page'}
            </button>
          </form>
        </section>

        <section className="panel">
          <h2>2. Add media to the project</h2>

          {!createdId ? (
            <div className="notice">
              Create a project first. Once created,
              Cloudinary becomes the media intake layer.
            </div>
          ) : (
            <>
              <CloudinaryUpload
                title="Project demo video"
                description="Upload the real demo. Cloudinary stores the original and delivers an optimized rendition."
                resourceType="video"
                projectId={createdId}
                onUploaded={attachAsset}
              />

              <div style={{ height: 12 }} />

              <CloudinaryUpload
                title="Screenshots / evidence"
                description="Upload UI shots, hardware photos, certificates, or diagrams."
                resourceType="image"
                projectId={createdId}
                onUploaded={attachAsset}
              />

              <div
                style={{ marginTop: 12 }}
                className="success"
              >
                Cloudinary tags and contextual metadata are
                attached during upload.
              </div>
            </>
          )}
        </section>
      </div>

      <section className="section">
        <div className="sectionHead">
          <div>
            <h2>Projects</h2>
          </div>

          <p>
            Projects are now persisted in Supabase, while
            Cloudinary owns the actual media files.
          </p>
        </div>

        {projects.length ? (
          <div className="projectGrid">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        ) : (
          <div className="empty">
            You don't have any projects yet. Create your
            first proof-of-work project above.
          </div>
        )}
      </section>

      {selectedProject && (
        <div className="notice">
          <strong>{selectedProject.title}</strong>

          <p>
            This project is stored in Supabase and its media
            is delivered through Cloudinary.
          </p>
        </div>
      )}
    </div>
  );
}
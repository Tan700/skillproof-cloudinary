'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchProjectBySlug } from '@/lib/supabase/data';
import { Project } from '@/lib/types';

function imageUrl(publicId: string) {
  const cloud =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloud) return '';

  return `https://res.cloudinary.com/${cloud}/image/upload/c_scale,w_1200/q_auto/f_auto/${publicId}`;
}

function videoUrl(publicId: string) {
  const cloud =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloud) return '';

  return `https://res.cloudinary.com/${cloud}/video/upload/c_scale,w_1400/q_auto/f_auto:video/${publicId}`;
}

function videoPosterUrl(publicId: string) {
  const cloud =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  if (!cloud) return '';

  return `https://res.cloudinary.com/${cloud}/video/upload/so_0/c_scale,w_1400/q_auto/${publicId}.jpg`;
}

export default function ProjectProofClient({
  slug,
}: {
  slug: string;
}) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProject() {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchProjectBySlug(slug);

        setProject(result);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load project.'
        );
      } finally {
        setLoading(false);
      }
    }

    loadProject();
  }, [slug]);

  if (loading) {
    return (
      <main className="shell proof">
        <div className="panel">
          <h2>Loading project proof…</h2>
          <p>
            Fetching project data from Supabase and media
            from Cloudinary.
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="shell proof">
        <div
          className="notice"
          style={{ borderColor: '#ef4444' }}
        >
          <strong>Unable to load project</strong>
          <p>{error}</p>

          <Link
            className="linkBtn"
            href="/dashboard"
          >
            ← Back to dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="shell proof">
        <div className="empty">
          Project not found.

          <div style={{ marginTop: 12 }}>
            <Link
              className="linkBtn"
              href="/dashboard"
            >
              ← Go back to dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const video = project.assets.find(
    (asset) => asset.resourceType === 'video'
  );

  const images = project.assets.filter(
    (asset) => asset.resourceType === 'image'
  );

  return (
    <main className="shell proof">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 12,
          alignItems: 'center',
          marginBottom: 18,
        }}
      >
        <Link
          className="linkBtn"
          href="/dashboard"
        >
          ← Back to projects
        </Link>

        <span className="cloudinaryPulse">
          ● CLOUDINARY MEDIA PIPELINE
        </span>
      </div>

      <div className="proofHero">
        <div className="proofVideo">
          {video ? (
            <video
              src={videoUrl(video.publicId)}
              poster={videoPosterUrl(video.publicId)}
              controls
              playsInline
              preload="metadata"
            />
          ) : (
            <div className="placeholder">
              <div style={{ fontSize: 50 }}>▶</div>

              <h3>Project demo</h3>

              <p>
                Upload a project video from the dashboard
                to populate this media player.
              </p>
            </div>
          )}
        </div>

        <aside className="proofSide">
          <span className="eyebrow">
            Visual proof
          </span>

          <h1>{project.title}</h1>

          <p>{project.description}</p>

          <div className="tags">
            {project.skills.map((skill) => (
              <span className="tag" key={skill}>
                {skill}
              </span>
            ))}
          </div>

          <div style={{ height: 18 }} />

          <div className="notice">
            <strong>Media powered by Cloudinary</strong>

            <p>
              Project media is uploaded to Cloudinary,
              organized using project-aware metadata,
              transformed for delivery, and optimized
              before reaching the browser.
            </p>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 10,
              marginTop: 16,
              flexWrap: 'wrap',
            }}
          >
            {project.links.github && (
              <a
                className="btn secondary"
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub ↗
              </a>
            )}

            {project.links.demo && (
              <a
                className="btn light"
                href={project.links.demo}
                target="_blank"
                rel="noreferrer"
              >
                Live demo ↗
              </a>
            )}
          </div>
        </aside>
      </div>

      <section className="proofBlock">
        <h3>Evidence gallery</h3>

        {images.length ? (
          <div className="gallery">
            {images.map((img) => (
              <img
                key={img.publicId}
                src={imageUrl(img.publicId)}
                alt="Project evidence"
                loading="lazy"
              />
            ))}
          </div>
        ) : (
          <div className="empty">
            Add screenshots, hardware photos, diagrams,
            or certificates from the dashboard.
          </div>
        )}
      </section>

      <section className="proofBlock">
        <h3>Project journey</h3>

        <div className="timeline">
          <div className="timelineItem">
            <div className="timelineDot" />

            <div>
              <b>Problem</b>

              <div
                style={{
                  color: 'var(--muted)',
                  marginTop: 4,
                }}
              >
                Describe the real-world problem this project
                solves.
              </div>
            </div>
          </div>

          <div className="timelineItem">
            <div className="timelineDot" />

            <div>
              <b>Build</b>

              <div
                style={{
                  color: 'var(--muted)',
                  marginTop: 4,
                }}
              >
                Show the prototype through images and short
                clips.
              </div>
            </div>
          </div>

          <div className="timelineItem">
            <div className="timelineDot" />

            <div>
              <b>Result</b>

              <div
                style={{
                  color: 'var(--muted)',
                  marginTop: 4,
                }}
              >
                Connect the visual proof to an outcome or
                learning.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="proofBlock">
        <h3>How the media is optimized</h3>

        <div className="featureGrid">
          <div className="feature">
            <div className="num">VIDEO</div>

            <p>
              <b>f_auto:video + q_auto</b>
              <br />
              Cloudinary dynamically prepares the video
              for delivery.
            </p>
          </div>

          <div className="feature">
            <div className="num">IMAGE</div>

            <p>
              <b>f_auto + q_auto + width</b>
              <br />
              The browser receives an appropriately sized
              image instead of the original asset.
            </p>
          </div>

          <div className="feature">
            <div className="num">METADATA</div>

            <p>
              <b>Tags + context</b>
              <br />
              Uploads carry SkillProof and project-aware
              metadata.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
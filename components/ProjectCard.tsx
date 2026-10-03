'use client';

import Link from 'next/link';
import { Project } from '@/lib/types';

function optimizedImageUrl(project: Project) {
  const asset = project.assets.find((a) => a.resourceType === 'image');
  if (!asset) return null;

  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  return cloud
    ? `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,w_900/${asset.publicId}`
    : asset.secureUrl;
}

function optimizedVideoUrl(project: Project) {
  const asset = project.assets.find((a) => a.resourceType === 'video');
  if (!asset) return null;

  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  return cloud
    ? `https://res.cloudinary.com/${cloud}/video/upload/f_auto:video,q_auto,w_900/${asset.publicId}`
    : asset.secureUrl;
}

export function ProjectCard({ project }: { project: Project }) {
  const video = project.assets.find((a) => a.resourceType === 'video');
  const image = project.assets.find((a) => a.resourceType === 'image');

  const imageUrl = optimizedImageUrl(project);
  const videoUrl = optimizedVideoUrl(project);

  return (
    <article className="projectCard">
      <div className="cardMedia">
        {video && videoUrl ? (
          <video
            src={videoUrl}
            muted
            playsInline
            controls
            preload="metadata"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : image && imageUrl ? (
          <img
            src={imageUrl}
            alt={`${project.title} evidence`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              display: 'grid',
              placeItems: 'center',
              height: '100%',
              color: '#fff',
              padding: 30,
              textAlign: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: 34, marginBottom: 8 }}>▶</div>
              <div style={{ opacity: 0.8, fontSize: 12 }}>
                Project proof preview
              </div>
            </div>
          </div>
        )}

        <span className="mediaBadge">MEDIA PROOF</span>
      </div>

      <div className="cardBody">
        <h3>{project.title}</h3>

        <p>{project.description}</p>

        <div className="tags">
          {project.skills.map((skill) => (
            <span className="tag" key={skill}>
              {skill}
            </span>
          ))}
        </div>

        <div className="cardMeta">
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>
            {project.assets.length} media assets
          </span>

          <Link
            className="linkBtn"
            href={`/project/${project.slug}`}
          >
            View proof →
          </Link>
        </div>
      </div>
    </article>
  );
}
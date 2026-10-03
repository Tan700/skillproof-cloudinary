SkillProof — Visual Proof-of-Work Portfolios

Don't just tell recruiters what you can do. Show them.

SkillProof is a media-first portfolio platform for students and early-career builders. Instead of relying on a text-only resume, users create project pages backed by real evidence: demo videos, screenshots, certificates, diagrams, and links.

Cloudinary is the core media layer of the product. It handles project-media upload, organization, transformation, optimization, poster generation, and delivery. Supabase stores product data and Cloudinary asset references, while Next.js powers the web application.

Hackathon Track

Media-Savvy Startup — Cloudinary

The product is designed around the idea that media should be a functional part of the user experience, not just an attachment field.

Problem

Students frequently list skills such as IoT, React, Python, AI, or ESP32 on a resume, but a recruiter still has to search for evidence of what was actually built.

SkillProof addresses this gap by turning project claims into shareable visual proof-of-work pages.

Instead of:

Python
IoT
ESP32
Machine Learning

the project can present:

Project Demo Video
+ Screenshots
+ Certificates / Evidence
+ Skills
+ Project Description
+ GitHub / Live Demo Links

The result is a portfolio experience centered on evidence rather than only text.

Current MVP

The current hackathon MVP includes:

Landing page explaining the product.

Supabase anonymous authentication for frictionless MVP onboarding.

Persistent project records in Supabase PostgreSQL.

Cloudinary Upload Widget for project videos and evidence images.

Cloudinary folders, tags, and contextual project metadata on uploads.

Cloudinary-optimized image and video delivery using dynamic transformations.

Cloudinary-generated video poster/thumbnail from the uploaded video.

Public project proof pages backed by Supabase.

Recruiter-style Discover page backed by real Supabase project data.

Search across project title, description, builder, and skills.

GitHub-ready project structure, CI workflow, setup documentation, and demo script.

Deliberately deferred for the code-freeze MVP

Generative AI project-story writing was considered but intentionally left out of the code-freeze build to keep the core Cloudinary workflow reliable and demonstrable. It can be added later without changing the fundamental architecture.

Why Cloudinary Is Central

Cloudinary is not used as a static image host. It is part of the product's active media workflow.

1. Upload

Users upload project media directly through the Cloudinary Upload Widget.

Supported MVP media:

Images: PNG, JPG/JPEG, WebP

Videos: MP4, MOV, WebM

2. Media organization

Uploads are associated with a project folder and carry SkillProof/project-aware tags and contextual metadata.

Example concept:

skillproof/<project-id>/

Tags:
- skillproof
- project-demo
- project-evidence

Context:
- project_id
- product=skillproof

3. Transformation

The application requests transformed delivery URLs instead of blindly serving original files.

Examples used in the MVP include:

Images
c_scale + width constraint + q_auto + f_auto

Videos
c_scale + width constraint + q_auto + f_auto:video

4. Video poster generation

The proof page generates a poster image from the uploaded video using Cloudinary video-to-image delivery.

Conceptually:

Uploaded video
      ↓
Cloudinary
      ↓
Frame extraction
      ↓
Optimized poster image
      ↓
Proof page

5. Delivery

The user-facing proof pages consume Cloudinary delivery URLs, allowing transformed media to be delivered through Cloudinary rather than exposing the original upload as the only representation.

Architecture

                    SKILLPROOF
                        │
                 Next.js application
                        │
          ┌─────────────┴─────────────┐
          │                           │
          ▼                           ▼
      Supabase                    Cloudinary
          │                           │
   ┌──────┼────────┐            ┌─────┼────────────┐
   │      │        │            │     │            │
   ▼      ▼        ▼            ▼     ▼            ▼
 Auth   Projects  Assets      Upload Transform  Delivery
   │               │                │      │        │
   │               └────────────────┴──────┴────────┘
   │                               │
   └───────────────────────────────┘
                                   ▼
                          Public proof page
                                   │
                                   ▼
                              Discover/search

Responsibility split

Next.js

Product UI and routing

Project creation flow

Proof pages

Discover/search interface

Supabase

Anonymous authentication

PostgreSQL project/profile/asset records

Row Level Security

Persistent project metadata and Cloudinary asset references

Cloudinary

Media upload

Media storage/organization

Tags/context

Dynamic transformation

Image/video optimization

Video poster generation

Media delivery

Data Model

The MVP uses three main database tables:

profiles
  id
  user_id
  username
  display_name
  bio
  role

projects
  id
  profile_id
  title
  slug
  description
  skills[]
  github_url
  live_url
  is_public

project_assets
  id
  project_id
  cloudinary_public_id
  secure_url
  resource_type
  format
  width
  height
  duration
  label
  metadata

The actual media file remains in Cloudinary. Supabase stores the application record and the information required to associate the asset with a project.

Efficiency

The MVP is designed to avoid unnecessary media processing inside the application backend.

Media efficiency

Browser uploads go to Cloudinary rather than passing large media files through the app server.

q_auto is used for automatic quality optimization.

f_auto / f_auto:video allow format-aware delivery.

Width-constrained transformations prevent unnecessarily large media from being delivered to the browser.

Video posters are generated from the source video instead of requiring a second manually uploaded thumbnail.

Evidence images on the proof page use lazy loading.

Product efficiency

Supabase stores structured metadata while Cloudinary handles media workloads.

The application remains a small Next.js codebase rather than introducing custom media-processing infrastructure.

Feasibility

SkillProof is intentionally built from managed services so the hackathon MVP can be implemented quickly and maintained by a small team.

The product does not attempt to build its own:

CDN

video transcoding pipeline

media transformation engine

object storage layer

authentication infrastructure

relational database

Instead, the application composes proven services into a focused product workflow.

This makes the MVP practical to build while leaving room for production hardening later.

Scalability Path

The current architecture separates application data from media infrastructure, which gives the product a clear growth path.

Current

Next.js
  + Supabase
  + Cloudinary

Future

Students ─────┐
              │
Colleges ─────┼──► SkillProof platform
              │
Recruiters ───┘

                         │
                         ▼
                Structured project data
                         │
                         ▼
                  Cloudinary media layer

Potential future capabilities include:

Full user accounts and social sign-in.

Recruiter filters by skill and evidence type.

Cloudinary-backed media search and structured metadata queries.

Video captions/transcription.

AI-generated project summaries and storytelling.

College project showcases.

Candidate/project analytics.

Custom portfolio domains.

Signed uploads and stricter production security.

The key design principle remains the same: media stays a first-class part of the product.

Tech Stack

Frontend: Next.js, React, TypeScript

Styling: CSS

Database: Supabase PostgreSQL

Authentication: Supabase Anonymous Auth for MVP onboarding

Media: Cloudinary Upload Widget + transformations + delivery

Hosting: Vercel

Version control: Git + GitHub

Running Locally

1. Clone the repository

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd skillproof-cloudinary

2. Install dependencies

npm install

3. Create .env.local

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<your_cloudinary_cloud_name>
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<your_unsigned_upload_preset>

NEXT_PUBLIC_SUPABASE_URL=<your_supabase_project_url>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your_supabase_publishable_key>

Do not commit .env.local or any secret keys.

4. Start development

npm run dev

Open:

http://localhost:3000

5. Production build test

npm run build

The current MVP has been verified with a successful production build locally.

Supabase Setup

The MVP expects these tables:

profiles
projects
project_assets

Anonymous sign-ins must be enabled in the Supabase Auth settings.

Row Level Security is enabled for the application tables so project creation and asset records can be associated with the authenticated MVP user.

Cloudinary Setup

Create an unsigned upload preset for the hackathon prototype.

The app expects the preset name in:

NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=<your_unsigned_upload_preset>

The MVP upload flow is:

Student
  ↓
Cloudinary Upload Widget
  ↓
Cloudinary asset
  ↓
public_id + secure_url + media metadata
  ↓
Supabase project_assets
  ↓
Public proof page

For production, use signed uploads/server-side controls and tighter upload restrictions as the product matures.

Demo Flow

A recommended 2–4 minute demo:

0:00–0:30 — Problem

Show a text-only skill list and explain the gap between a claimed skill and visible proof.

0:30–1:00 — Create project

Create Smart Irrigation System with skills such as IoT, ESP32, Sensors, and C++.

1:00–1:30 — Cloudinary upload

Upload one project video and one screenshot through the Cloudinary Upload Widget.

1:30–2:00 — Cloudinary workflow

Show the uploaded asset in Cloudinary and explain that the app attaches project-aware tags/context and requests optimized/transformed delivery.

2:00–2:30 — Proof page

Open the public proof page, play the project video, show the generated poster, and show the evidence gallery.

2:30–3:00 — Discover

Open Discover, search for IoT, and open the project proof page from the result.

Closing line

SkillProof turns project claims into visual proof-of-work. Cloudinary powers the media experience behind that proof.

Submission Checklist

Before code freeze, verify:

Cloudinary is actively used in the product.

Image and video upload work.

Cloudinary transformations/optimization are visible in the implementation.

Project media is stored in Cloudinary and associated with Supabase project records.

Public proof page works in a fresh/incognito browser.

Discover/search works with real Supabase data.

Production deployment works.

GitHub repository is public.

.env.local and secrets are not committed.

README is updated with final links and instructions.

2–4 minute demo video is recorded.

Cloudinary feedback survey is completed at cld.media/hackathon-survey.

Final Submission Links

Replace these placeholders before submitting:

Live demo:  <YOUR_VERCEL_URL>
GitHub:     <YOUR_PUBLIC_GITHUB_REPOSITORY_URL>
Demo video: <YOUR_DEMO_VIDEO_URL>

Project Status

Hackathon MVP — Code Freeze Candidate

The current prototype focuses on a reliable, demonstrable media workflow rather than a large feature set. The architecture is deliberately simple enough for a small team to operate and structured so the product can expand without replacing the core media layer.

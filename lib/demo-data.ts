import { Project } from './types';

export const demoProjects: Project[] = [
  {
    id: 'demo-iot',
    slug: 'smart-irrigation-system',
    title: 'Smart Irrigation System',
    description: 'An automated irrigation prototype that uses soil-moisture sensing and an ESP32 to reduce unnecessary watering.',
    skills: ['IoT', 'ESP32', 'Sensors', 'C++'],
    creator: 'Aarav Sharma',
    creatorRole: 'Computer Engineering Student',
    createdAt: '2026-09-28',
    assets: [],
    links: {
      github: 'https://github.com/',
      demo: 'https://example.com/',
    },
  },
  {
    id: 'demo-ai',
    slug: 'visual-study-coach',
    title: 'Visual Study Coach',
    description: 'A study assistant that turns notes and diagrams into quick revision cards and visual explainers.',
    skills: ['Next.js', 'AI', 'UX', 'Education'],
    creator: 'Meera Kulkarni',
    creatorRole: 'Student Builder',
    createdAt: '2026-09-21',
    assets: [],
    links: { github: 'https://github.com/' },
  },
  {
    id: 'demo-cv',
    slug: 'campus-navigation',
    title: 'Campus Navigation Prototype',
    description: 'A mobile-first accessibility-focused navigation concept for large college campuses.',
    skills: ['React', 'Maps', 'Accessibility'],
    creator: 'Rohan Joshi',
    creatorRole: 'Frontend Developer',
    createdAt: '2026-09-17',
    assets: [],
    links: { demo: 'https://example.com/' },
  },
];

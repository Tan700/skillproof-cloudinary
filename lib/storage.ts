import { Project } from './types';
import { demoProjects } from './demo-data';

export const STORAGE_KEY = 'skillproof-projects-v1';

export function readProjects(): Project[] {
  if (typeof window === 'undefined') return demoProjects;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoProjects));
    return demoProjects;
  }
  try {
    const parsed = JSON.parse(raw) as Project[];
    return Array.isArray(parsed) ? parsed : demoProjects;
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demoProjects));
    return demoProjects;
  }
}

export function writeProjects(projects: Project[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function addProject(project: Project) {
  writeProjects([project, ...readProjects()]);
}

import { Nav } from '@/components/Nav';
import ProjectProofClient from '@/components/ProjectProofClient';

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <><Nav /><ProjectProofClient slug={slug} /></>;
}

import { Nav } from '@/components/Nav';
import DashboardClient from '@/components/DashboardClient';

export default function DashboardPage() {
  return (
    <>
      <Nav />
      <main className="shell dashboard">
        <DashboardClient />
      </main>
    </>
  );
}
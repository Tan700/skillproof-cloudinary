import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SkillProof — show what you built',
  description: 'A media-first proof-of-work portfolio powered by Cloudinary.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

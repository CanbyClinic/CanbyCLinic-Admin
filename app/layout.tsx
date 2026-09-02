import type { Metadata, Viewport } from 'next';
import './globals.css';
import SiteChrome from '../components/SiteChrome';

export const viewport: Viewport = { themeColor: '#07131B', colorScheme: 'dark light' };
export const metadata: Metadata = {
  metadataBase: new URL('https://canby-community-clinic.johnjohn962.chatgpt.site'),
  title: { default: 'Canby Community Clinic | Care begins with being heard', template: '%s | Canby Community Clinic' },
  description: 'Primary care, patient resources, appointment steps, and clinic information for Canby Community Clinic in Reseda, California.',
  icons: { icon: '/assets/logo/canby-logo-original.jpeg', apple: '/assets/logo/canby-logo-original.jpeg' },
  openGraph: { title: 'Canby Community Clinic | Care begins with being heard', description: 'Community-centered care and practical patient support in Reseda.', images: [{ url: '/assets/scenes/h-01-arrival.png', width: 1727, height: 911, alt: 'A representative community clinic entrance in Reseda.' }] },
  twitter: { card: 'summary_large_image', title: 'Canby Community Clinic', description: 'Care begins with being heard.', images: ['/assets/scenes/h-01-arrival.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteChrome />{children}</body></html>;
}

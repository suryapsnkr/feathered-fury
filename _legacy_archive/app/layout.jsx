import './globals.css';

export const metadata = {
  title: 'Angry Birds: Feathered Fury | Next.js 2D Physics Game',
  description: 'A complete 2D physics-based slingshot destruction game built with Next.js, React, Tailwind CSS, Phaser 3, and Matter.js.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23ef4444"/><circle cx="40" cy="45" r="12" fill="%23fff"/><circle cx="60" cy="45" r="12" fill="%23fff"/><circle cx="44" cy="45" r="5" fill="%23000"/><circle cx="64" cy="45" r="5" fill="%23000"/><polygon points="50,55 75,65 50,75" fill="%23f59e0b"/></svg>'
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 antialiased min-h-screen flex flex-col justify-between">
        {children}
      </body>
    </html>
  );
}

import { ReactNode } from 'react';
import { Navbar } from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border py-6 mt-auto">
        <div className="container flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground sm:flex-row sm:gap-4">
          <p>&copy; {new Date().getFullYear()} VerifyID. All rights reserved.</p>
          <span className="hidden sm:inline" aria-hidden="true">|</span>
          <a className="hover:text-foreground transition-colors" href="/privacy-policy">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
}
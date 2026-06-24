import React from 'react';
import { PlusCircle, User, Layers } from 'lucide-react';
import { useDemoState } from '../useDemoState';
import { DemoShell } from '../components/DemoShell';

const PLACEHOLDER_COPY: Record<string, { title: string; body: string; icon: React.ReactNode }> = {
  create: {
    title: 'Create',
    body: 'Campaign builder and content studio — coming in Phase 2 of the investor demo.',
    icon: <PlusCircle className="w-10 h-10 text-primary" />,
  },
  profile: {
    title: 'Profile',
    body: 'Creator profile and public identity — coming in Phase 2 of the investor demo.',
    icon: <User className="w-10 h-10 text-primary" />,
  },
  system: {
    title: 'System',
    body: 'Money movement map, product overview, and platform architecture — Phase 2.',
    icon: <Layers className="w-10 h-10 text-primary" />,
  },
};

export const DemoPlaceholder: React.FC = () => {
  const { state } = useDemoState();
  const tab = state.activeNavTab;
  const content = PLACEHOLDER_COPY[tab];

  if (!content || tab === 'feed' || tab === 'wallet') return null;

  return (
    <DemoShell showNav>
      <div className="flex flex-col items-center justify-center min-h-[70dvh] px-6 text-center demo-animate-fade-up">
        <div className="demo-glass-card demo-glow-ring w-20 h-20 rounded-2xl flex items-center justify-center mb-6">
          {content.icon}
        </div>
        <h1 className="font-display text-2xl font-bold mb-2">{content.title}</h1>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
          {content.body}
        </p>
      </div>
    </DemoShell>
  );
};

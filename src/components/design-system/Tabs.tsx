import { useState, createContext, useContext, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType>({ value: '', onValueChange: () => {} });

function Tabs({ children, defaultValue, className }: { children: ReactNode; defaultValue: string; className?: string }) {
  const [value, setValue] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, onValueChange: setValue }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn(
      'inline-flex h-11 items-center justify-center rounded-xl bg-white/[0.04] p-1 border border-white/[0.06]',
      className
    )}>
      {children}
    </div>
  );
}

function TabsTrigger({ children, value, className }: { children: ReactNode; value: string; className?: string }) {
  const { value: selected, onValueChange } = useContext(TabsContext);
  return (
    <button
      onClick={() => onValueChange(value)}
      className={cn(
        'relative inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
        selected === value
          ? 'text-white'
          : 'text-white/40 hover:text-white/60',
        className
      )}
    >
      {selected === value && (
        <motion.div
          layoutId="tabs-indicator"
          className="absolute inset-0 bg-white/[0.08] border border-white/[0.06] rounded-lg"
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

function TabsContent({ children, value, className }: { children: ReactNode; value: string; className?: string }) {
  const { value: selected } = useContext(TabsContext);
  if (selected !== value) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={cn('mt-4', className)}
    >
      {children}
    </motion.div>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };

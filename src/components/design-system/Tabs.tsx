import { useState, createContext, useContext, ReactNode } from 'react';
import { cn } from '@/lib/utils';

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
      'inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',
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
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-ring',
        selected === value
          ? 'bg-background text-foreground shadow-sm'
          : 'hover:text-foreground',
        className
      )}
    >
      {children}
    </button>
  );
}

function TabsContent({ children, value, className }: { children: ReactNode; value: string; className?: string }) {
  const { value: selected } = useContext(TabsContext);
  if (selected !== value) return null;
  return <div className={cn('mt-2 animate-fade-in', className)}>{children}</div>;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };

import { useState, createContext, useContext, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AccordionContextType {
  openItems: Set<string>;
  toggle: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextType>({ openItems: new Set(), toggle: () => {} });

function Accordion({ children, className, type = 'single' }: { children: ReactNode; className?: string; type?: 'single' | 'multiple' }) {
  const [openItems, setOpenItems] = useState(new Set<string>());
  const toggle = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (type === 'single') { next.clear(); next.add(id); }
      else next.add(id);
      return next;
    });
  };
  return <AccordionContext.Provider value={{ openItems, toggle }}><div className={cn('space-y-2', className)}>{children}</div></AccordionContext.Provider>;
}

function AccordionItem({ children, value, className }: { children: ReactNode; value: string; className?: string }) {
  return <div className={cn('border rounded-lg', className)} data-state={useContext(AccordionContext).openItems.has(value) ? 'open' : 'closed'}>{children}</div>;
}

function AccordionTrigger({ children, value, className }: { children: ReactNode; value: string; className?: string }) {
  const { openItems, toggle } = useContext(AccordionContext);
  const isOpen = openItems.has(value);
  return (
    <button
      onClick={() => toggle(value)}
      className={cn('flex w-full items-center justify-between p-4 text-sm font-medium transition-all hover:bg-muted/50 rounded-lg', className)}
    >
      {children}
      <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform duration-200', isOpen && 'rotate-180')} />
    </button>
  );
}

function AccordionContent({ children, value, className }: { children: ReactNode; value: string; className?: string }) {
  const { openItems } = useContext(AccordionContext);
  if (!openItems.has(value)) return null;
  return <div className={cn('px-4 pb-4 text-sm text-muted-foreground animate-fade-in', className)}>{children}</div>;
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

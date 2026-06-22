import { useState, createContext, useContext, ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
  return (
    <AccordionContext.Provider value={{ openItems, toggle }}>
      <div className={cn('space-y-2', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ children, value, className }: { children: ReactNode; value: string; className?: string }) {
  const { openItems } = useContext(AccordionContext);
  return (
    <div 
      className={cn('rounded-xl border border-white/[0.06] overflow-hidden', className)}
      data-state={openItems.has(value) ? 'open' : 'closed'}
    >
      {children}
    </div>
  );
}

function AccordionTrigger({ children, value, className }: { children: ReactNode; value: string; className?: string }) {
  const { openItems, toggle } = useContext(AccordionContext);
  const isOpen = openItems.has(value);
  return (
    <button
      onClick={() => toggle(value)}
      className={cn(
        'flex w-full items-center justify-between p-4 text-sm font-medium transition-all hover:bg-white/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset',
        className
      )}
      aria-expanded={isOpen}
    >
      <span className="text-white/80">{children}</span>
      <ChevronDown className={cn(
        'h-4 w-4 text-white/30 transition-transform duration-200',
        isOpen && 'rotate-180'
      )} />
    </button>
  );
}

function AccordionContent({ children, value, className }: { children: ReactNode; value: string; className?: string }) {
  const { openItems } = useContext(AccordionContext);
  return (
    <AnimatePresence>
      {openItems.has(value) && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          className="overflow-hidden"
        >
          <div className={cn('px-4 pb-4 text-sm text-white/50 leading-relaxed', className)}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

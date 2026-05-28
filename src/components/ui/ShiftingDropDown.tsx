import React, { useEffect, useState, ReactNode } from "react";
import { FiChevronDown } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TabItem {
  id: string | number;
  title: string;
  Component: React.ComponentType<any>;
}

interface ShiftingDropDownProps {
  tabs: TabItem[];
  className?: string;
}

export const ShiftingDropDown = ({ tabs, className }: ShiftingDropDownProps) => {
  return (
    <div className={cn("flex w-full justify-start text-foreground", className)}>
      <Tabs tabs={tabs} />
    </div>
  );
};

const Tabs = ({ tabs }: { tabs: TabItem[] }) => {
  const [selected, setSelected] = useState<string | number | null>(null);
  const [dir, setDir] = useState<"l" | "r" | null>(null);

  const handleSetSelected = (val: string | number | null) => {
    if (typeof selected === "number" && typeof val === "number") {
      setDir(selected > val ? "r" : "l");
    } else if (val === null) {
      setDir(null);
    }

    setSelected(val);
  };

  return (
    <div
      onMouseLeave={() => handleSetSelected(null)}
      className="relative flex h-fit gap-2"
    >
      {tabs.map((t) => {
        return (
          <Tab
            key={t.id}
            selected={selected}
            handleSetSelected={handleSetSelected}
            tab={t.id}
          >
            {t.title}
          </Tab>
        );
      })}

      <AnimatePresence>
        {selected && <Content dir={dir} selected={selected} tabs={tabs} />}
      </AnimatePresence>
    </div>
  );
};

const Tab = ({ 
  children, 
  tab, 
  handleSetSelected, 
  selected 
}: { 
  children: ReactNode; 
  tab: string | number; 
  handleSetSelected: (val: string | number | null) => void; 
  selected: string | number | null;
}) => {
  return (
    <button
      id={`shift-tab-${tab}`}
      onMouseEnter={() => handleSetSelected(tab)}
      onClick={() => handleSetSelected(tab)}
      className={cn(
        "flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-colors",
        selected === tab
          ? "bg-zinc-800 text-zinc-100"
          : "text-zinc-400 hover:text-zinc-100"
      )}
    >
      <span>{children}</span>
      <FiChevronDown
        className={cn("transition-transform", selected === tab ? "rotate-180" : "")}
      />
    </button>
  );
};

const Content = ({ 
  selected, 
  dir, 
  tabs 
}: { 
  selected: string | number; 
  dir: "l" | "r" | null; 
  tabs: TabItem[];
}) => {
  return (
    <motion.div
      id="overlay-content"
      initial={{
        opacity: 0,
        y: 8,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      exit={{
        opacity: 0,
        y: 8,
      }}
      className="absolute right-0 lg:left-auto top-[calc(100%_+_24px)] w-[calc(100vw-2rem)] sm:w-96 rounded-lg border border-zinc-800 bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 p-4 shadow-xl z-50"
    >
      <Bridge />
      <Nub selected={selected} />

      {tabs.map((t) => {
        return (
          <div className="overflow-hidden" key={t.id}>
            {selected === t.id && (
              <motion.div
                initial={{
                  opacity: 0,
                  x: dir === "l" ? 100 : dir === "r" ? -100 : 0,
                }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
              >
                <t.Component />
              </motion.div>
            )}
          </div>
        );
      })}
    </motion.div>
  );
};

const Bridge = () => (
  <div className="absolute -top-[24px] left-0 right-0 h-[24px]" />
);

const Nub = ({ selected }: { selected: string | number }) => {
  const [left, setLeft] = useState(0);

  useEffect(() => {
    moveNub();
  }, [selected]);

  const moveNub = () => {
    if (selected) {
      const hoveredTab = document.getElementById(`shift-tab-${selected}`);
      const overlayContent = document.getElementById("overlay-content");

      if (!hoveredTab || !overlayContent) return;

      const tabRect = hoveredTab.getBoundingClientRect();
      const { left: contentLeft } = overlayContent.getBoundingClientRect();

      const tabCenter = tabRect.left + tabRect.width / 2 - contentLeft;

      setLeft(tabCenter);
    }
  };

  return (
    <motion.span
      style={{
        clipPath: "polygon(0 0, 100% 0, 50% 50%, 0% 100%)",
      }}
      animate={{ left }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-tl border border-zinc-800 bg-zinc-900"
    />
  );
};

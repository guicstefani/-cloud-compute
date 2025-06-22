
import { motion } from "framer-motion";

interface Tab {
  id: string;
  label: string;
  icon?: React.ComponentType<any>;
}

interface FuturisticTabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export const FuturisticTabs = ({ tabs, activeTab, onChange }: FuturisticTabsProps) => {
  return (
    <div className="flex space-x-1 p-1 bg-gray-900/50 rounded-xl backdrop-blur-sm border border-gray-700/50">
      {tabs.map(tab => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`
              relative px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2
              ${activeTab === tab.id 
                ? 'text-white' 
                : 'text-gray-400 hover:text-gray-200'
              }
            `}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              {Icon && <Icon className="w-4 h-4" />}
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

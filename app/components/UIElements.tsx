'use client';

import { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  GitBranch, 
  TrendingUp, 
  Award,
  Target,
  Zap,
  ArrowRight,
  CheckCircle2,
  Circle
} from 'lucide-react';

export interface UIElement {
  id: string;
  type: 'wizard' | 'steps' | 'timeline' | 'stats' | 'achievements' | 'progress';
  name: string;
  icon: React.ReactNode;
  preview: React.ReactNode;
  component: (props: any) => React.ReactNode;
}

// Wizard Component
function WizardElement({ steps = 3, currentStep = 1 }: { steps?: number; currentStep?: number }) {
  return (
    <div className="w-full py-8 px-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {Array.from({ length: steps }).map((_, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;
          
          return (
            <div key={index} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted 
                    ? 'bg-blue-600 dark:bg-blue-400 border-blue-600 dark:border-blue-400 text-white' 
                    : isActive 
                    ? 'bg-blue-100 dark:bg-blue-900 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400' 
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{stepNum}</span>
                  )}
                </div>
                <span className={`mt-2 text-xs font-medium ${
                  isActive || isCompleted 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-400'
                }`}>
                  Step {stepNum}
                </span>
              </div>
              {index < steps - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${
                  isCompleted 
                    ? 'bg-blue-600 dark:bg-blue-400' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Step-by-Step Component
function StepsElement({ items = ['Step 1', 'Step 2', 'Step 3'] }: { items?: string[] }) {
  return (
    <div className="w-full py-6 px-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-400 text-white flex items-center justify-center text-sm font-semibold">
              {index + 1}
            </div>
            <div className="flex-1 pt-1">
              <p className="text-base font-medium text-gray-900 dark:text-gray-100">{item}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Timeline Component
function TimelineElement({ items = ['Event 1', 'Event 2', 'Event 3'] }: { items?: string[] }) {
  return (
    <div className="w-full py-6 px-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>
        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={index} className="relative flex items-start gap-4">
              <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-400 border-4 border-white dark:border-gray-950"></div>
              <div className="flex-1 pt-1">
                <p className="text-base font-medium text-gray-900 dark:text-gray-100">{item}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Stats Component
function StatsElement({ stats = [
  { label: 'Projects', value: '50+' },
  { label: 'Clients', value: '30+' },
  { label: 'Experience', value: '5y' }
] }: { stats?: Array<{ label: string; value: string }> }) {
  return (
    <div className="w-full py-6 px-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="grid grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Achievements Component
function AchievementsElement({ items = ['Achievement 1', 'Achievement 2', 'Achievement 3'] }: { items?: string[] }) {
  return (
    <div className="w-full py-6 px-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <Award className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <p className="text-base text-gray-900 dark:text-gray-100">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Progress Component
function ProgressElement({ items = [
  { label: 'Skill 1', progress: 90 },
  { label: 'Skill 2', progress: 75 },
  { label: 'Skill 3', progress: 60 }
] }: { items?: Array<{ label: string; progress: number }> }) {
  return (
    <div className="w-full py-6 px-6 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.label}</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 dark:bg-blue-400 transition-all duration-500"
                style={{ width: `${item.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Element Library
export const UI_ELEMENTS: UIElement[] = [
  {
    id: 'timeline',
    type: 'timeline',
    name: 'Timeline',
    icon: <GitBranch className="w-5 h-5" />,
    preview: <TimelineElement />,
    component: (props) => <TimelineElement {...props} />
  },
  {
    id: 'stats',
    type: 'stats',
    name: 'Statistics',
    icon: <TrendingUp className="w-5 h-5" />,
    preview: <StatsElement />,
    component: (props) => <StatsElement {...props} />
  },
  {
    id: 'achievements',
    type: 'achievements',
    name: 'Achievements',
    icon: <Award className="w-5 h-5" />,
    preview: <AchievementsElement />,
    component: (props) => <AchievementsElement {...props} />
  },
  {
    id: 'progress',
    type: 'progress',
    name: 'Progress Bars',
    icon: <Target className="w-5 h-5" />,
    preview: <ProgressElement />,
    component: (props) => <ProgressElement {...props} />
  }
];

// Element Palette Component
export function UIElementsPalette({ onDragStart, onSave }: { onDragStart: (element: UIElement) => void; onSave?: () => void }) {
  return (
    <div className="p-4 space-y-2">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 px-2">
        UI Elements
      </h3>
      <div className="space-y-2">
        {UI_ELEMENTS.map((element) => (
          <div
            key={element.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('application/json', JSON.stringify({ type: element.type, id: element.id }));
              onDragStart(element);
            }}
            className="group cursor-grab active:cursor-grabbing p-3 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="text-blue-600 dark:text-blue-400">
                {element.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {element.name}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <div className="scale-75 origin-top-left pointer-events-none">
                {element.preview}
              </div>
            </div>
          </div>
        ))}
      </div>
      {onSave && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={onSave}
            className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium"
          >
            Save Portfolio
          </button>
        </div>
      )}
    </div>
  );
}

// Render custom element
export function renderCustomElement(element: { type: string; id: string; props?: any }) {
  const uiElement = UI_ELEMENTS.find(e => e.id === element.id || e.type === element.type);
  if (!uiElement) return null;
  return uiElement.component(element.props || {});
}


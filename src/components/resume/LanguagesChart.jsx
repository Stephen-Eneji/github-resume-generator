import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import useResumeStore from '../../store/resumeStore';

const COLORS = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6',
  '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#06B6D4'
];

export default function LanguagesChart() {
  const githubData = useResumeStore(state => state.githubData);

  if (!githubData) return null;

  // Calculate total lines of code and language percentages
  const languageStats = githubData.repositories.reduce((acc, repo) => {
    if (repo.language && repo.size) {
      acc[repo.language] = (acc[repo.language] || 0) + repo.size;
    }
    return acc;
  }, {});

  const totalSize = Object.values(languageStats).reduce((a, b) => a + b, 0);
  
  const data = Object.entries(languageStats)
    .map(([name, size]) => ({
      name,
      value: size,
      percentage: ((size / totalSize) * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Programming Languages</h3>
      
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name) => [
                  `${((value / totalSize) * 100).toFixed(1)}%`,
                  name
                ]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((lang, index) => (
            <div 
              key={lang.name}
              className="flex items-center space-x-2 text-sm"
            >
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="font-medium">{lang.name}</span>
              <span className="text-gray-500">{lang.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 
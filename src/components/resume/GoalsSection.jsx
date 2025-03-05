import React, { useState } from 'react';
import { FaPlus, FaTrash, FaChevronDown, FaChevronUp, FaEdit, FaSave } from 'react-icons/fa';

export default function GoalsSection({ isEditing }) {
  const [sectionTitle, setSectionTitle] = useState('Professional Goals');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [goals, setGoals] = useState([]);
  const [expandedGoals, setExpandedGoals] = useState({});

  const handleAddGoal = () => {
    const newGoal = {
      id: Date.now(),
      title: '',
      timeframe: '',
      status: 'In Progress',
      description: '',
      bullets: []
    };
    setGoals([...goals, newGoal]);
    setExpandedGoals({ ...expandedGoals, [newGoal.id]: true });
  };

  const handleAddBullet = (goalId) => {
    setGoals(currentGoals =>
      currentGoals.map(goal =>
        goal.id === goalId
          ? { ...goal, bullets: [...goal.bullets, { id: Date.now(), text: '' }] }
          : goal
      )
    );
  };

  const handleUpdateBullet = (goalId, bulletId, value) => {
    setGoals(currentGoals =>
      currentGoals.map(goal =>
        goal.id === goalId
          ? {
              ...goal,
              bullets: goal.bullets.map(bullet =>
                bullet.id === bulletId ? { ...bullet, text: value } : bullet
              )
            }
          : goal
      )
    );
  };

  const handleRemoveBullet = (goalId, bulletId) => {
    setGoals(currentGoals =>
      currentGoals.map(goal =>
        goal.id === goalId
          ? { ...goal, bullets: goal.bullets.filter(bullet => bullet.id !== bulletId) }
          : goal
      )
    );
  };

  const toggleExpand = (id) => {
    setExpandedGoals(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        {isEditingTitle ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className="text-xl font-semibold text-gray-900 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={() => setIsEditingTitle(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              <FaSave />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-900">{sectionTitle}</h3>
            {isEditing && (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="text-blue-600 hover:text-blue-800"
              >
                <FaEdit />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white rounded-lg border p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <input
                        type="text"
                        value={goal.title}
                        onChange={(e) => setGoals(goals =>
                          goals.map(g =>
                            g.id === goal.id ? { ...g, title: e.target.value } : g
                          )
                        )}
                        placeholder="Goal Title"
                        className="font-medium text-lg w-full"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleExpand(goal.id)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          {expandedGoals[goal.id] ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        <button
                          onClick={() => setGoals(goals => goals.filter(g => g.id !== goal.id))}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>

                    {expandedGoals[goal.id] && (
                      <div className="space-y-3">
                        <div className="flex gap-4">
                          <input
                            type="text"
                            value={goal.timeframe}
                            onChange={(e) => setGoals(goals =>
                              goals.map(g =>
                                g.id === goal.id ? { ...g, timeframe: e.target.value } : g
                              )
                            )}
                            placeholder="Timeframe (e.g., Q4 2024)"
                            className="text-sm text-gray-600 flex-1"
                          />
                          <select
                            value={goal.status}
                            onChange={(e) => setGoals(goals =>
                              goals.map(g =>
                                g.id === goal.id ? { ...g, status: e.target.value } : g
                              )
                            )}
                            className="text-sm border rounded px-2 py-1"
                          >
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="On Hold">On Hold</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          {goal.bullets.map((bullet) => (
                            <div key={bullet.id} className="flex items-center gap-2">
                              <span>•</span>
                              <input
                                type="text"
                                value={bullet.text}
                                onChange={(e) => handleUpdateBullet(goal.id, bullet.id, e.target.value)}
                                placeholder="Bullet point"
                                className="flex-1 text-sm text-gray-600"
                              />
                              <button
                                onClick={() => handleRemoveBullet(goal.id, bullet.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => handleAddBullet(goal.id)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            <FaPlus /> Add Bullet Point
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-lg">{goal.title}</h4>
                        <p className="text-sm text-gray-600">{goal.timeframe}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleExpand(goal.id)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          {expandedGoals[goal.id] ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        <span className={`text-sm px-2 py-1 rounded ${getStatusColor(goal.status)}`}>
                          {goal.status}
                        </span>
                      </div>
                    </div>

                    {expandedGoals[goal.id] && goal.bullets.length > 0 && (
                      <ul className="list-disc list-inside space-y-1">
                        {goal.bullets.map((bullet) => (
                          <li key={bullet.id} className="text-sm text-gray-600">
                            {bullet.text}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {isEditing && (
          <button
            onClick={handleAddGoal}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <FaPlus />
            <span>Add Goal</span>
          </button>
        )}
      </div>
    </section>
  );
} 
'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import {
  FiImage,
  FiInfo,
  FiSearch,
  FiLayout,
  FiStar,
  FiFilter,
  FiChevronDown,
  FiList,
  FiUser,
  FiCalendar,
  FiTarget,
  FiPaperclip,
  FiPlus,
  FiMoreHorizontal,
  FiActivity,
  FiZap,
} from 'react-icons/fi';
import { FaSort } from 'react-icons/fa';

export default function ApprovalPage() {
  const [projects, setProjects] = useState([
    { name: 'Design Meta Advert', start: '03/24/2025', end: '03/14/2025', status: 'In Progress', priority: 'High' },
    { name: 'Finish Q3 Product Launch Video', start: '01/20/2025', end: '03/14/2025', status: 'Not Started', priority: 'Medium' },
    { name: 'Work on Summer Collection Instagram Reels', start: '04/09/2025', end: '03/14/2025', status: 'Complete', priority: 'Low' },
    { name: 'Design Packaging for New Product Line', start: '03/05/2025', end: '03/25/2025', status: 'Not Started', priority: 'Medium' },
    { name: 'Schedule Social Media Posts for April', start: '03/15/2025', end: '03/28/2025', status: 'Not Started', priority: 'Low' },
    { name: 'Conduct User Feedback Survey', start: '02/20/2025', end: '03/19/2025', status: 'Complete', priority: 'Medium' },
    { name: 'Prepare Monthly Analytics Report', start: '03/10/2025', end: '03/21/2025', status: 'In Progress', priority: 'High' },
    { name: 'Revamp Brand Guidelines Document', start: '02/18/2025', end: '03/23/2025', status: 'In Progress', priority: 'Medium' }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const [sortType, setSortType] = useState<'status' | 'priority' | null>('priority');
  const [sortDirection, setSortDirection] = useState<'desc' | 'asc'>('desc');

  const [newTaskName, setNewTaskName] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newStatus, setNewStatus] = useState('Not Started');

  const formatDateForDisplay = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('-');
    if (parts.length === 3) return `${parts[1]}/${parts[2]}/${parts[0]}`;
    return dateStr;
  };

  const parseDateForInput = (dateStr: string) => {
    if (!dateStr) return '';
    const parts = dateStr.split('/');
    if (parts.length === 3) return `${parts[2]}-${parts[0]}-${parts[1]}`;
    return dateStr;
  };

  const openNewTaskModal = () => {
    setEditingIndex(null);
    setNewTaskName('');
    setNewStartDate('');
    setNewEndDate('');
    setNewPriority('Medium');
    setNewStatus('Not Started');
    setIsModalOpen(true);
  };

  const openEditModal = (index: number) => {
    const task = projects[index];
    setEditingIndex(index);
    setNewTaskName(task.name);
    setNewStartDate(parseDateForInput(task.start));
    setNewEndDate(parseDateForInput(task.end));
    setNewPriority(task.priority || 'Medium');
    setNewStatus(task.status || 'Not Started');
    setIsModalOpen(true);
  };

  const handleSaveTask = () => {
    if (!newTaskName.trim()) return;

    const savedTask = {
      name: newTaskName,
      start: newStartDate.includes('-') ? formatDateForDisplay(newStartDate) : newStartDate,
      end: newEndDate.includes('-') ? formatDateForDisplay(newEndDate) : newEndDate,
      status: newStatus,
      priority: newPriority
    };

    if (editingIndex !== null) {
      const updatedProjects = [...projects];
      updatedProjects[editingIndex] = savedTask;
      setProjects(updatedProjects);
    } else {
      setProjects([...projects, savedTask]);
    }
    setIsModalOpen(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'Low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const sortedProjects = [...projects].sort((a, b) => {
    if (!sortType) return 0;

    let weightA = 0;
    let weightB = 0;

    if (sortType === 'priority') {
      const pMap: Record<string, number> = { High: 3, Medium: 2, Low: 1 };
      weightA = pMap[a.priority as string] || 0;
      weightB = pMap[b.priority as string] || 0;
    } else if (sortType === 'status') {
      const sMap: Record<string, number> = { 'Not Started': 3, 'In Progress': 2, 'Complete': 1 };
      weightA = sMap[a.status as string] || 0;
      weightB = sMap[b.status as string] || 0;
    }

    if (sortDirection === 'desc') {
      return weightB - weightA;
    } else {
      return weightA - weightB;
    }
  });

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-r from-[#020617] via-[#0A0A3C] to-[#020024] bg-[length:300%_300%] animate-gradient text-white font-sans overflow-x-hidden">
      <Navbar />

      <main className="flex w-full max-w-[1600px] gap-8 relative p-8">
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl relative overflow-hidden overflow-x-auto min-h-[80vh]">

            <div className="flex items-center gap-4 text-xs font-medium text-gray-400 mb-6 hover:text-gray-300">
            </div>

            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl text-blue-500 bg-blue-500/10 p-2 rounded-lg"><FiList></FiList></span>
              <h1 className="text-4xl font-bold text-white tracking-wide">Approval</h1>
            </div>

            <p className="text-gray-300 text-sm mb-10 ml-2"></p>

            <div className="flex flex-wrap gap-4 items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-4 overflow-x-auto">
                <button
                  onClick={() => setSortType('status')}
                  className={`flex items-center gap-2 text-sm whitespace-nowrap transition-colors rounded-md px-3 py-1.5 ${sortType === 'status' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white'}`}>
                  <FiLayout /> Sort By Status
                </button>
                <div className="h-4 w-[1px] bg-white/10 mx-1"></div>
                <button
                  onClick={() => setSortType('priority')}
                  className={`flex items-center gap-2 text-sm whitespace-nowrap transition-colors rounded-md px-3 py-1.5 ${sortType === 'priority' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white'}`}>
                  <FiLayout /> Sort By Priority
                </button>
              </div>

              <div className="flex items-center gap-5 text-gray-400">
                <button
                  onClick={() => setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')}
                  className={`hover:text-white transition-colors ${sortDirection === 'asc' ? 'text-white' : ''}`}
                  title={`Toggle sort direction (currently ${sortDirection})`}
                >
                  <FaSort className="w-4 h-4" />
                </button>
                <div className="flex items-center bg-blue-600 hover:bg-blue-500 text-white rounded-md overflow-hidden transition-colors ml-2 shadow-lg shadow-blue-500/20">
                  <button onClick={openNewTaskModal} className="px-3 py-1.5 text-sm font-medium">New Task</button>
                  <div className="w-[1px] h-4 bg-blue-400/50"></div>
                </div>
              </div>
            </div>

            <div className="w-full text-sm text-gray-300 overflow-x-auto pb-6">
              <div className="min-w-[1100px]">
                <div className="grid grid-cols-[3fr_1.5fr_1.2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 pb-3 border-b border-white/10 font-medium text-gray-400/80 uppercase text-[10px] tracking-wider items-center">
                  <div className="flex items-center gap-2 text-sm normal-case tracking-normal text-gray-400">
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 border border-gray-500 rounded text-gray-400">Task</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm normal-case tracking-normal"><FiUser className="w-4 h-4" /> Assignee</div>
                  <div className="flex items-center gap-2 text-sm normal-case tracking-normal"><FiActivity className="w-4 h-4" /> Status</div>
                  <div className="flex items-center gap-2 text-sm normal-case tracking-normal"><FiCalendar className="w-4 h-4" /> Start date</div>
                  <div className="flex items-center gap-2 text-sm normal-case tracking-normal"><FiCalendar className="w-4 h-4" /> End date</div>
                  <div className="flex items-center gap-2 text-sm normal-case tracking-normal"><FiTarget className="w-4 h-4" /> Priority</div>
                </div>

                <div className="flex flex-col">
                  {sortedProjects.map((proj, i) => (
                    <div
                      key={i}
                      onClick={() => openEditModal(projects.findIndex(p => p === proj))}
                      className="grid grid-cols-[3fr_1.5fr_1.2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors items-center group cursor-pointer"
                    >
                      <div className="text-white font-medium truncate pr-4 group-hover:text-blue-400 transition-colors">{proj.name}</div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-[10px] text-white font-semibold tracking-wider">J</div>
                        <span className="truncate text-gray-300">John Doe</span>
                      </div>
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#3f3f46]/30 text-gray-300 text-xs border border-white/10 whitespace-nowrap">
                          <span className={`w-1.5 h-1.5 rounded-full ${proj.status === 'In Progress' ? 'bg-blue-400' : proj.status === 'Complete' ? 'bg-green-400' : 'bg-gray-400'}`}></span> {proj.status}
                        </span>
                      </div>
                      <div className="text-gray-400">{proj.start || <span className="text-gray-600">-</span>}</div>
                      <div className="text-gray-400">{proj.end}</div>
                      <div>
                        {proj.priority && (
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs border ${getPriorityColor(proj.priority)}`}>
                            {proj.priority}
                          </span>
                        )}
                      </div>
                      <div></div>
                      <div></div>
                      <div className="text-transparent group-hover:text-gray-500 transition-colors flex justify-end gap-2 pr-2">
                        <FiMoreHorizontal />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Edit / New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0A0A3C] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <h2 className="text-xl font-bold text-white mb-6">
              {editingIndex !== null ? 'Edit Task' : 'Create New Task'}
            </h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Task Name</label>
                <input
                  type="text"
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g. Design Meta Advert"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                  >
                    <option value="Not Started" className="bg-[#0A0A3C] text-white">Not Started</option>
                    <option value="In Progress" className="bg-[#0A0A3C] text-white">In Progress</option>
                    <option value="Complete" className="bg-[#0A0A3C] text-white">Complete</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                  >
                    <option value="Low" className="bg-[#0A0A3C] text-white">Low</option>
                    <option value="Medium" className="bg-[#0A0A3C] text-white">Medium</option>
                    <option value="High" className="bg-[#0A0A3C] text-white">High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300 focus:outline-none focus:border-blue-500 transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">End Date</label>
                  <input
                    type="date"
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300 focus:outline-none focus:border-blue-500 transition-colors [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTask}
                  className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors shadow-lg shadow-blue-500/20"
                >
                  {editingIndex !== null ? 'Save Changes' : 'Add Task'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

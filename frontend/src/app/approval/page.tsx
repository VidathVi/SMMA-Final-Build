'use client';

import React from 'react';
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
  const [projects, setProjects] = React.useState([
    { name: 'Design Meta Advert', start: '03/24/2025', end: '03/14/2025', status: 'In Progress' },
    { name: 'Finish Q3 Product Launch Video', start: '01/20/2025', end: '03/14/2025', status: 'Not Started' },
    { name: 'Work on Summer Collection Instagram Reels', start: '04/09/2025', end: '03/14/2025', status: 'Complete' }
  ]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newTaskName, setNewTaskName] = React.useState('');
  const [newStartDate, setNewStartDate] = React.useState('');
  const [newEndDate, setNewEndDate] = React.useState('');

  const handleAddTask = () => {
    if (!newTaskName.trim()) return;

    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const parts = dateStr.split('-');
      if (parts.length === 3) return `${parts[1]}/${parts[2]}/${parts[0]}`;
      return dateStr;
    };

    setProjects([...projects, {
      name: newTaskName,
      start: formatDate(newStartDate),
      end: formatDate(newEndDate),
      status: 'Not started'
    }]);
    setNewTaskName('');
    setNewStartDate('');
    setNewEndDate('');
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-r from-[#020617] via-[#0A0A3C] to-[#020024] bg-[length:300%_300%] animate-gradient text-white font-sans overflow-x-hidden">
      <Navbar />

      <main className="flex w-full max-w-[1600px] gap-8 relative p-8">
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl relative overflow-hidden overflow-x-auto min-h-[80vh]">

            {/* Header section from image */}
            <div className="flex items-center gap-4 text-xs font-medium text-gray-400 mb-6 hover:text-gray-300">
            </div>

            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl text-blue-500 bg-blue-500/10 p-2 rounded-lg"><FiList></FiList></span>
              <h1 className="text-4xl font-bold text-white tracking-wide">Tasks</h1>
            </div>

            <p className="text-gray-300 text-sm mb-10 ml-2"></p>

            {/* Toolbar section */}
            <div className="flex flex-wrap gap-4 items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-4 overflow-x-auto">
                <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors whitespace-nowrap">
                  <FiLayout /> Sort By Status
                </button>
                <div className="h-4 w-[1px] bg-white/10 mx-1"></div>
                <button className="flex items-center gap-2 text-sm text-white bg-white/10 px-3 py-1.5 rounded-md whitespace-nowrap">
                  <FiLayout /> Sort By Date
                </button>
              </div>

              <div className="flex items-center gap-5 text-gray-400">
                <button className="hover:text-white transition-colors"><FaSort className="w-4 h-4" /></button>
                <button className="hover:text-white transition-colors"><FiSearch className="w-4 h-4" /></button>
                <div className="flex items-center bg-blue-600 hover:bg-blue-500 text-white rounded-md overflow-hidden transition-colors ml-2 shadow-lg shadow-blue-500/20">
                  <button onClick={() => setIsModalOpen(true)} className="px-3 py-1.5 text-sm font-medium">New Task</button>
                  <div className="w-[1px] h-4 bg-blue-400/50"></div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="w-full text-sm text-gray-300 overflow-x-auto pb-6">
              <div className="min-w-[1100px]">
                <div className="grid grid-cols-[3fr_1.5fr_1.2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 pb-3 border-b border-white/10 font-medium text-gray-400/80 uppercase text-[10px] tracking-wider items-center">
                  <div className="flex items-center gap-2 text-sm normal-case tracking-normal text-gray-400">
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 border border-gray-500 rounded text-gray-400">Aa</span> Project name
                  </div>
                  <div className="flex items-center gap-2 text-sm normal-case tracking-normal"><FiUser className="w-4 h-4" /> Assignee <FiInfo className="w-3 h-3" /></div>
                  <div className="flex items-center gap-2 text-sm normal-case tracking-normal"><FiActivity className="w-4 h-4" /> Status</div>
                  <div className="flex items-center gap-2 text-sm normal-case tracking-normal"><FiCalendar className="w-4 h-4" /> Start date</div>
                  <div className="flex items-center gap-2 text-sm normal-case tracking-normal"><FiCalendar className="w-4 h-4" /> End date</div>
                  <div className="flex items-center gap-2 text-sm normal-case tracking-normal"><FiTarget className="w-4 h-4" /> Priority</div>
                  <div className="flex items-center gap-2 text-sm normal-case tracking-normal"><FiList className="w-4 h-4" /> Team</div>
                  <div className="flex items-center justify-center gap-3 text-sm normal-case tracking-normal"><FiPlus /> <FiMoreHorizontal /></div>
                </div>

                <div className="flex flex-col">
                  {projects.map((proj, i) => (
                    <div key={i} className="grid grid-cols-[3fr_1.5fr_1.2fr_1fr_1fr_1fr_1fr_1fr_auto] gap-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors items-center group cursor-pointer">
                      <div className="text-white font-medium truncate pr-4 group-hover:text-blue-400 transition-colors">{proj.name}</div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-cyan-600 flex items-center justify-center text-[10px] text-white font-semibold tracking-wider">J</div>
                        <span className="truncate text-gray-300">John Doe</span>
                      </div>
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#3f3f46]/30 text-gray-300 text-xs border border-white/10 whitespace-nowrap">
                          <span className={`w-1.5 h-1.5 rounded-full ${proj.status === 'In Progress' ? 'bg-blue-400' : 'bg-gray-400'}`}></span> {proj.status}
                        </span>
                      </div>
                      <div className="text-gray-400">{proj.start || <span className="text-gray-600">-</span>}</div>
                      <div className="text-gray-400">{proj.end}</div>
                      <div></div>
                      <div></div>
                      <div></div>
                      <div className="text-transparent group-hover:text-gray-500 transition-colors flex justify-end gap-2 pr-2">
                        <FiPlus />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0A0A3C] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
            <h2 className="text-xl font-bold text-white mb-6">Create New Task</h2>

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
                  onClick={handleAddTask}
                  className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors shadow-lg shadow-blue-500/20"
                >
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

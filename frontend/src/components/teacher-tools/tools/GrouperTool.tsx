import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { ClassStudent } from '../../../types';

interface GrouperToolProps {
  classStudents: ClassStudent[];
}

export const GrouperTool: React.FC<GrouperToolProps> = ({ classStudents }) => {
  const [groupCount, setGroupCount] = useState<number>(3);
  const [generatedGroups, setGeneratedGroups] = useState<Array<{ name: string; members: string[] }>>([]);
  const [copiedGroupNotice, setCopiedGroupNotice] = useState(false);

  const generateRandomGroups = () => {
    if (classStudents.length === 0) return;
    const shuffled = [...classStudents].sort(() => Math.random() - 0.5);
    const groups: Array<{ name: string; members: string[] }> = Array.from(
      { length: groupCount },
      (_, i) => ({
        name: `Team ${String.fromCharCode(65 + i)}`,
        members: [],
      })
    );

    shuffled.forEach((student, idx) => {
      groups[idx % groupCount].members.push(`${student.avatar} ${student.name}`);
    });

    setGeneratedGroups(groups);
  };

  const copyGroupsToClipboard = () => {
    if (generatedGroups.length === 0) return;
    const text = generatedGroups
      .map((g) => `${g.name}:\n${g.members.map((m) => ` - ${m}`).join('\n')}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedGroupNotice(true);
    setTimeout(() => setCopiedGroupNotice(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-10 shadow-xl space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Random Student Team Grouper</h2>
          <p className="text-sm text-slate-500 mt-1">
            Instantly break your class roster into balanced random teams for group projects or live competitions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Teams:</label>
          <select
            value={groupCount}
            onChange={(e) => setGroupCount(Number(e.target.value))}
            className="px-4 py-2.5 rounded-2xl border-2 border-slate-200 bg-slate-50 text-slate-900 text-xs font-black cursor-pointer"
          >
            <option value={2}>2 Teams</option>
            <option value={3}>3 Teams</option>
            <option value={4}>4 Teams</option>
            <option value={5}>5 Teams</option>
          </select>

          <button
            onClick={generateRandomGroups}
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-2xl shadow-lg transition cursor-pointer"
          >
            Generate Teams
          </button>

          {generatedGroups.length > 0 && (
            <button
              onClick={copyGroupsToClipboard}
              className="px-4 py-2.5 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              {copiedGroupNotice ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedGroupNotice ? 'Copied!' : 'Copy'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {generatedGroups.map((group, idx) => (
          <div
            key={idx}
            className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 space-y-4 shadow-sm"
          >
            <h3 className="font-black text-lg text-emerald-900 border-b border-slate-200 pb-3 flex items-center justify-between">
              <span>{group.name}</span>
              <span className="text-xs font-bold text-slate-500 bg-slate-200/80 px-2.5 py-1 rounded-full">
                {group.members.length} Members
              </span>
            </h3>

            <ul className="space-y-2">
              {group.members.map((member, mIdx) => (
                <li
                  key={mIdx}
                  className="text-sm font-bold text-slate-800 bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-center gap-2"
                >
                  {member}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

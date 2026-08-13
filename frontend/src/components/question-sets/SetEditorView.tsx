import React, { useState, useEffect } from 'react';
import { useEduPlay } from '../../context/EduPlayContext';
import { QuestionSet, Question, QuestionType } from '../../types';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  HelpCircle,
  Volume2,
  Check,
  Type,
  ListFilter,
  Image as ImageIcon,
  Mic,
  Sparkles,
  Download,
  Upload,
  Bot,
  Loader2,
  FileSpreadsheet,
} from 'lucide-react';

import { generateAiQuestionSet } from '../../services/api';

export const SetEditorView: React.FC = () => {
  const {
    editingSetId,
    questionSets,
    saveQuestionSet,
    setActiveTab,
    currentUser,
  } = useEduPlay();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('Reading & Phonics');
  const [gradeLevel, setGradeLevel] = useState('Grade 2 - 4');
  const [isPublic, setIsPublic] = useState(true);
  const [tagsInput, setTagsInput] = useState('vocabulary, phonics');
  const [questions, setQuestions] = useState<Question[]>([]);

  // AI Generator Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiGrade, setAiGrade] = useState('Grade 3');
  const [aiCount, setAiCount] = useState(5);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (editingSetId) {
      const existing = questionSets.find((s) => s.id === editingSetId);
      if (existing) {
        setTitle(existing.title);
        setDescription(existing.description || '');
        setSubject(existing.subject);
        setGradeLevel(existing.gradeLevel);
        setIsPublic(existing.isPublic);
        setTagsInput(existing.tags ? existing.tags.join(', ') : '');
        setQuestions(existing.questions || []);
        return;
      }
    }

    // Default blank template for new set
    setTitle('New Custom Question Set');
    setDescription('Interactive learning list for classroom games');
    setSubject('Mathematics');
    setGradeLevel('Grade 2 - 4');
    setIsPublic(true);
    setTagsInput('math, mental-math');
    setQuestions([
      {
        id: `q-${Date.now()}-1`,
        setId: editingSetId || 'new',
        promptText: 'What is 8 + 7?',
        answer: '15',
        options: ['13', '14', '15', '16'],
        type: 'multiple_choice',
        position: 1,
        hint: 'Think 8 + 2 + 5',
      },
      {
        id: `q-${Date.now()}-2`,
        setId: editingSetId || 'new',
        promptText: 'What is 5 × 6?',
        answer: '30',
        options: ['25', '30', '35', '40'],
        type: 'multiple_choice',
        position: 2,
      },
    ]);
  }, [editingSetId]);

  const handleAddQuestion = () => {
    const newQ: Question = {
      id: `q-${Date.now()}`,
      setId: editingSetId || 'new',
      promptText: 'Enter question or prompt here...',
      answer: 'CORRECT ANSWER',
      options: ['OPTION A', 'OPTION B', 'CORRECT ANSWER', 'OPTION D'],
      type: 'multiple_choice',
      position: questions.length + 1,
    };
    setQuestions([...questions, newQ]);
  };

  const handleUpdateQuestion = (index: number, updated: Partial<Question>) => {
    const copy = [...questions];
    copy[index] = { ...copy[index], ...updated };
    setQuestions(copy);
  };

  const handleDeleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // AI Generator Action
  const handleGenerateAiSet = async () => {
    if (!aiTopic.trim()) {
      setAiError('Please enter a topic or learning objective.');
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      const json = await generateAiQuestionSet({
        topic: aiTopic,
        gradeLevel: aiGrade,
        count: aiCount,
        subject,
      });

      if (json.success && json.data) {
        if (json.data.title) setTitle(json.data.title);
        if (json.data.description) setDescription(json.data.description);
        if (json.data.questions && Array.isArray(json.data.questions)) {
          const formatted: Question[] = json.data.questions.map(
            (q: any, i: number) => ({
              id: `q-ai-${Date.now()}-${i}`,
              setId: editingSetId || 'new',
              promptText: q.promptText || `Question ${i + 1}`,
              answer: q.answer || 'Answer',
              options: q.options || [q.answer, 'Option B', 'Option C', 'Option D'],
              type: 'multiple_choice',
              position: i + 1,
              hint: q.hint || '',
            })
          );
          setQuestions(formatted);
        }
        setIsAiModalOpen(false);
      } else {
        // Smart fallback generator if AI key is missing
        generateSmartFallbackQuestions();
      }
    } catch (err) {
      console.warn('Backend AI failed, using smart local generator:', err);
      generateSmartFallbackQuestions();
    } finally {
      setAiLoading(false);
    }
  };

  const generateSmartFallbackQuestions = () => {
    setTitle(`${aiTopic} Practice Set`);
    setDescription(`Curricular exercise set for ${aiTopic} (${aiGrade}).`);

    const fallbackQs: Question[] = Array.from({ length: aiCount }).map((_, i) => {
      const qNum = i + 1;
      return {
        id: `q-fallback-${Date.now()}-${i}`,
        setId: editingSetId || 'new',
        promptText: `Practice Question #${qNum} regarding ${aiTopic}?`,
        answer: `Correct Choice ${qNum}`,
        options: [
          `Correct Choice ${qNum}`,
          `Distractor A-${qNum}`,
          `Distractor B-${qNum}`,
          `Distractor C-${qNum}`,
        ],
        type: 'multiple_choice',
        position: qNum,
        hint: `Focus on key concepts of ${aiTopic}`,
      };
    });

    setQuestions(fallbackQs);
    setIsAiModalOpen(false);
  };

  // Export Question Set as JSON
  const handleExportJson = () => {
    const data = {
      title,
      description,
      subject,
      gradeLevel,
      tags: tagsInput.split(',').map((t) => t.trim()),
      questions,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/\s+/g, '_')}_set.json`;
    link.click();
  };

  // Import JSON or CSV file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (file.name.endsWith('.json')) {
          const json = JSON.parse(text);
          if (json.title) setTitle(json.title);
          if (json.description) setDescription(json.description);
          if (json.subject) setSubject(json.subject);
          if (json.gradeLevel) setGradeLevel(json.gradeLevel);
          if (json.questions && Array.isArray(json.questions)) {
            setQuestions(json.questions);
          }
        } else if (file.name.endsWith('.csv')) {
          const lines = text.split('\n').filter((l) => l.trim());
          const importedQuestions: Question[] = [];
          lines.slice(1).forEach((line, idx) => {
            const parts = line.split(',');
            if (parts.length >= 2) {
              importedQuestions.push({
                id: `q-csv-${Date.now()}-${idx}`,
                setId: editingSetId || 'new',
                promptText: parts[0].trim(),
                answer: parts[1].trim(),
                options: parts.slice(2).map((p) => p.trim()),
                type: 'multiple_choice',
                position: idx + 1,
              });
            }
          });
          if (importedQuestions.length > 0) {
            setQuestions(importedQuestions);
          }
        }
      } catch (err) {
        alert('Failed to parse uploaded file. Please ensure valid JSON or CSV format.');
      }
    };
    reader.readAsText(file);
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Please enter a set title.');
      return;
    }

    const setId = editingSetId || `qs-${Date.now()}`;
    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const savedSet: QuestionSet = {
      id: setId,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      title,
      description,
      subject,
      gradeLevel,
      isPublic,
      tags: tagsArray,
      questions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveQuestionSet(savedSet);
    setActiveTab('sets');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setActiveTab('sets')}
          className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Question Sets</span>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {/* AI Generator Trigger */}
          <button
            onClick={() => setIsAiModalOpen(true)}
            className="flex items-center gap-2 px-4.5 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:brightness-110 text-white font-extrabold text-xs rounded-xl shadow-md shadow-purple-500/20 active:scale-95 transition-all border border-purple-400/40"
            title="Generate a complete question set automatically using Gemini AI"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>GENERATE WITH AI</span>
          </button>

          {/* Import / Export Controls */}
          <label className="cursor-pointer flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all active:scale-95">
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Import JSON/CSV</span>
            <input
              type="file"
              accept=".json,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={handleExportJson}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all active:scale-95"
            title="Export Question Set as a JSON file"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all ml-1 border border-emerald-400/40"
          >
            <Save className="w-4 h-4" />
            <span>SAVE QUESTION SET</span>
          </button>
        </div>
      </div>

      {/* Set Details Form Box */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
          {editingSetId ? 'Edit Question Set Details' : 'Create New Question Set'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Set Title:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Science Vocabulary Unit 3"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-sky-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Description:</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what students will practice in this set..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden focus:border-sky-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Subject:</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Grade Level:</label>
                <input
                  type="text"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Tags (comma separated):
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="math, addition, grade-3"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="isPublicToggle"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
              <label htmlFor="isPublicToggle" className="text-xs font-semibold text-slate-700">
                Publish to Shared Public Library for other teachers/SLPs
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Questions List Editor */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">
            Questions List ({questions.length})
          </h3>
          <button
            onClick={handleAddQuestion}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs rounded-xl border border-sky-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Question</span>
          </button>
        </div>

        {questions.map((q, idx) => (
          <div
            key={q.id || idx}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 relative"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="font-extrabold text-xs text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-100">
                Question #{idx + 1}
              </span>

              <button
                onClick={() => handleDeleteQuestion(idx)}
                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                title="Delete question"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Question Prompt / Word:
                </label>
                <input
                  type="text"
                  value={q.promptText}
                  onChange={(e) => handleUpdateQuestion(idx, { promptText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Correct Answer:
                </label>
                <input
                  type="text"
                  value={q.answer}
                  onChange={(e) => handleUpdateQuestion(idx, { answer: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-emerald-300 bg-emerald-50/50 text-xs font-bold text-emerald-900 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Multiple Choice Options */}
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Multiple Choice Choices (Optional):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(q.options || ['A', 'B', 'C', 'D']).map((opt, optIdx) => (
                  <input
                    key={optIdx}
                    type="text"
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...(q.options || ['A', 'B', 'C', 'D'])];
                      newOpts[optIdx] = e.target.value;
                      handleUpdateQuestion(idx, { options: newOpts });
                    }}
                    placeholder={`Choice ${optIdx + 1}`}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800"
                  />
                ))}
              </div>
            </div>

            {/* Optional Hint */}
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                Teacher Hint / Articulation Note:
              </label>
              <input
                type="text"
                value={q.hint || ''}
                onChange={(e) => handleUpdateQuestion(idx, { hint: e.target.value })}
                placeholder="e.g. Rhymes with cat, tongue position guidance..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700"
              />
            </div>
          </div>
        ))}
      </div>

      {/* AI Question Generator Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    AI Question Set Generator
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enter any topic to instantly generate tailored question sets!
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAiModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Topic or Curriculum Objective:
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="e.g. Photosynthesis, Grade 2 Subtraction, Sight Words..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                />

                {/* Quick Topic Chips Suggestions */}
                <div className="mt-2.5 space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Quick Topic Suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      '🧪 Photosynthesis',
                      '🔢 Multiplication Tables',
                      '📖 Sight Words & Phonics',
                      '🌍 World Capitals',
                      '🪐 Solar System & Planets',
                      '📐 Fractions & Decimals',
                    ].map((chipTopic) => (
                      <button
                        key={chipTopic}
                        type="button"
                        onClick={() => setAiTopic(chipTopic.replace(/^[^\s]+\s/, ''))}
                        className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors"
                      >
                        {chipTopic}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Grade Level:
                  </label>
                  <select
                    value={aiGrade}
                    onChange={(e) => setAiGrade(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50"
                  >
                    <option>Kindergarten</option>
                    <option>Grade 1</option>
                    <option>Grade 2</option>
                    <option>Grade 3</option>
                    <option>Grade 4</option>
                    <option>Grade 5</option>
                    <option>Middle School</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Question Count:
                  </label>
                  <select
                    value={aiCount}
                    onChange={(e) => setAiCount(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50"
                  >
                    <option value={3}>3 Questions</option>
                    <option value={5}>5 Questions</option>
                    <option value={8}>8 Questions</option>
                    <option value={10}>10 Questions</option>
                  </select>
                </div>
              </div>

              {aiError && (
                <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200">
                  {aiError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                onClick={handleGenerateAiSet}
                disabled={aiLoading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-black text-xs shadow-lg shadow-purple-500/30 transition-all active:scale-95 disabled:opacity-50"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating Questions with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>GENERATE QUESTION SET NOW</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


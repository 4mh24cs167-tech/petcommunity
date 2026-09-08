'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export default function QAPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadQA() {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          profiles (username)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading QA:', error);
      } else {
        setQuestions(data || []);
      }
      setLoading(false);
    }
    loadQA();
  }, [supabase]);

  const askQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('You must be logged in to ask a question');
      return;
    }

    const { error } = await supabase.from('questions').insert({
      user_id: user.id,
      title,
      content,
    });

    if (error) {
      alert(error.message);
    } else {
      setTitle('');
      setContent('');
      // Refresh
      const { data } = await supabase.from('questions').select(`*, profiles (username)`).order('created_at', { ascending: false });
      setQuestions(data || []);
      alert('Question posted!');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading Q&A...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-800">Vet-Verified Q&A</h1>
        <p className="text-gray-600">Get professional advice from certified veterinarians</p>
      </header>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Ask a Professional</h2>
        <form onSubmit={askQuestion} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What is your question?"
            className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Provide more details about your pet's situation..."
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            required
          />
          <div className="flex justify-end">
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
              Post Question
            </button>
          </div>
        </form>
      </section>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Recent Questions</h2>
        {questions.map((q) => (
          <div key={q.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{q.title}</h3>
                <p className="text-xs text-gray-500">Asked by {q.profiles?.username || 'User'} on {new Date(q.created_at).toLocaleDateString()}</p>
              </div>
              {q.is_answered && (
                <span className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">
                  Answered ✓
                </span>
              )}
            </div>
            <p className="text-gray-700 leading-relaxed">{q.content}</p>
            {q.answer && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-xs font-bold text-blue-600 uppercase mb-1">Expert Answer:</p>
                <p className="text-gray-800 italic">{q.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

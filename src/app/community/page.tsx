'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

export default function CommunityFeedPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadPosts() {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles (username, avatar_url),
          pets (name)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading posts:', error);
      } else {
        setPosts(data || []);
      }
      setLoading(false);
    }
    loadPosts();
  }, [supabase]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('You must be logged in to post');
      return;
    }

    const { error } = await supabase.from('community_posts').insert({
      user_id: user.id,
      content,
    });

    if (error) {
      alert(error.message);
    } else {
      setContent('');
      // Refresh feed
      const { data } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles (username, avatar_url),
          pets (name)
        `)
        .order('created_at', { ascending: false });
      setPosts(data || []);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading community feed...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-800">Community Feed</h1>
        <p className="text-gray-600">Share your pet stories and get advice from other owners</p>
      </header>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">What's on your mind?</h2>
        <form onSubmit={handlePost} className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share a story, ask a question, or post a photo..."
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] transition"
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Post to Feed
            </button>
          </div>
        </form>
      </section>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden">
                {post.profiles?.avatar_url ? (
                  <img src={post.profiles.avatar_url} alt={post.profiles.username} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                    {post.profiles?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-gray-800">{post.profiles?.username || 'Anonymous'}</p>
                <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed">{post.content}</p>
            {post.pet_id && (
              <div className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                🐾 {post.pets?.name}
              </div>
            )}
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No posts yet. Be the first to share something!</p>
        </div>
      )}
    </div>
  );
}

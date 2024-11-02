"use client";

import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';
import VideoEditor from '@/components/video-editor/VideoEditor';
import Header from '@/components/Header';

export default async function Home() {
  const supabase = await createClient();

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto py-8">
        <Header />
        <VideoEditor />
      </main>
    </div>
  );
}
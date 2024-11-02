"use client";

import { Player } from "@remotion/player";
import React, { useEffect, useState } from "react";
import { Main } from "../remotion/MyComp/Main";
import {
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../types/constants";
import { RenderControls } from "../components/RenderControls";
import { Tips } from "../components/Tips";
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Header from "@/components/Header";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {user.email}
            </h1>
            <p className="text-gray-600">Create your AI-powered music video below</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Player
              component={Main}
              inputProps={defaultMyCompProps}
              durationInFrames={DURATION_IN_FRAMES}
              fps={VIDEO_FPS}
              compositionHeight={VIDEO_HEIGHT}
              compositionWidth={VIDEO_WIDTH}
              style={{
                width: "100%",
              }}
              controls
              autoPlay
              loop
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <RenderControls
              text={defaultMyCompProps.title}
              setText={() => {}}
              inputProps={defaultMyCompProps}
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <Tips />
          </div>
        </div>
      </main>
    </div>
  );
}
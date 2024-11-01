"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import React, { useMemo, useState } from "react";
import { Main } from "../remotion/MyComp/Main";
import {
  CompositionProps,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../types/constants";
import { z } from "zod";
import { RenderControls } from "../components/RenderControls";
import { Tips } from "../components/Tips";
import { Spacing } from "../components/Spacing";
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const [text, setText] = useState<string>(defaultMyCompProps.title);

  const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
    return {
      title: text,
    };
  }, [text]);

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      redirect('/login');
    }

    return (
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        <div className="w-full min-h-screen">
          <div className="py-6 px-4">
            <h1 className="text-2xl font-bold">Welcome {user.email}</h1>
            <div className="max-w-screen-md m-auto mb-5">
              <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10 mt-16">
                <Player
                  component={Main}
                  inputProps={inputProps}
                  durationInFrames={DURATION_IN_FRAMES}
                  fps={VIDEO_FPS}
                  compositionHeight={VIDEO_HEIGHT}
                  compositionWidth={VIDEO_WIDTH}
                  style={{
                    // Can't use tailwind class for width since player's default styles take presedence over tailwind's,
                    // but not over inline styles
                    width: "100%",
                  }}
                  controls
                  autoPlay
                  loop
                />
              </div>
              <RenderControls
                text={text}
                setText={setText}
                inputProps={inputProps}
              ></RenderControls>
              <Spacing></Spacing>
              <Spacing></Spacing>
              <Spacing></Spacing>
              <Spacing></Spacing>
              <Tips></Tips>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error:', error);
    redirect('/login');
  }
}

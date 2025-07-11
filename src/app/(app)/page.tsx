/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-slate-700 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-600/30 to-slate-800/30"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-600/10 via-slate-700/0 to-slate-800/0"></div>
        
        <section className="text-center mb-8 md:mb-12 relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-100 leading-tight">
            Dive into the World of Anonymous Messages
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Shadow Script - Where your identity remains a secret.
          </p>
          <div className="mt-6 w-24 h-1 bg-slate-500 mx-auto rounded-full"></div>
        </section>

        {/* Carousel for Messages */}
        <div className="relative z-10">
          <Carousel
            plugins={[Autoplay({ delay: 2000 })]}
            className="w-full h-[50vh] max-w-lg md:max-w-xl"
          >
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="p-4">
                  <Card className="bg-slate-600/40 backdrop-blur-sm border-slate-500/30 hover:bg-slate-600/50 transition-all duration-300 shadow-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-white font-semibold text-lg">
                        {message.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                      <Mail className="flex-shrink-0 text-slate-300 w-5 h-5" />
                      <div className="flex-1">
                        <p className="text-slate-200 leading-relaxed">
                          {message.content}
                        </p>
                        <p className="text-xs text-slate-400 mt-2 opacity-75">
                          {message.received}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </main>
    </>
  );
}
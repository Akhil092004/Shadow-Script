'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Send, MessageSquare, Lightbulb, UserPlus, Sparkles, Copy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { useCompletion } from 'ai/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import { useSession } from 'next-auth/react';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;
  const { data: session } = useSession();

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-messages', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to sent message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete('');
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Handle error appropriately
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-6">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Send Anonymous Message
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Share your thoughts anonymously with{' '}
              <span className="font-semibold text-indigo-600">@{username}</span>
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Message Form - Left Column */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <Send className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-semibold text-slate-800">Your Message</h2>
                </div>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium text-slate-700">
                            Write your anonymous message
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Type your message here... Be kind and respectful!"
                              className="resize-none min-h-[150px] text-base border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl p-4 transition-all duration-200"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                          <div className="flex justify-between items-center text-sm text-slate-500 mt-2">
                            <span>Your message will be sent anonymously</span>
                            <span className={`${messageContent?.length > 500 ? 'text-red-500' : 'text-slate-400'}`}>
                              {messageContent?.length || 0}/500
                            </span>
                          </div>
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-center">
                      {isLoading ? (
                        <Button 
                          disabled 
                          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl"
                        >
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </Button>
                      ) : (
                        <Button 
                          type="submit" 
                          disabled={isLoading || !messageContent}
                          className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </div>
            </div>

            {/* Suggestions - Right Column */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Lightbulb className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-800">Need Ideas?</h3>
                </div>

                <Button
                  onClick={fetchSuggestedMessages}
                  disabled={isSuggestLoading}
                  className="w-full mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium rounded-xl py-3 transition-all duration-200"
                >
                  {isSuggestLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Get Suggestions
                    </>
                  )}
                </Button>

                <div className="space-y-3">
                  <p className="text-sm text-slate-600 flex items-center gap-2">
                    <Copy className="w-4 h-4" />
                    Click any suggestion to use it
                  </p>
                  
                  {error ? (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-600 text-sm">{error.message}</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {parseStringMessages(completion).map((message, index) => (
                        <button
                          key={index}
                          onClick={() => handleMessageClick(message)}
                          className="w-full p-3 text-left text-sm bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-lg transition-all duration-200 group"
                        >
                          <div className="flex items-start justify-between">
                            <span className="text-slate-700 group-hover:text-indigo-700 leading-relaxed">
                              {message}
                            </span>
                            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 flex-shrink-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Section */}
          {!session && (
            <>
              <Separator className="my-12" />
              <div className="text-center">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                    <UserPlus className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Want Your Own Message Board?</h3>
                  <p className="text-indigo-100 mb-6 max-w-md mx-auto">
                    Create your account and start receiving anonymous messages from friends, family, and followers.
                  </p>
                  <Link href={'/sign-up'}>
                    <Button 
                      size="lg"
                      className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <UserPlus className="mr-2 h-5 w-5" />
                      Create Your Account
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
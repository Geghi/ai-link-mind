"use client";

import { ArrowRight, BarChart, Bot, BrainCircuit, Briefcase, Code, DollarSign, Globe, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import { HeroBackground } from './HeroBackground';

const FADE_IN_ANIMATION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' } },
};

export default function MarketingContent() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-950 text-gray-100 overflow-x-hidden">

      <main className="flex-1">
        


        {/* Hero Section */}
        <motion.section
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          className="relative text-center pt-20 pb-24 md:pt-32 md:pb-40"
        >
          <HeroBackground />
          <div className="container mx-auto px-4">
            <motion.div variants={FADE_IN_ANIMATION_VARIANTS}>
              <h1 className={cn(
                      "text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-4 tracking-tighter",
                      "text-transparent bg-clip-text bg-gradient-to-br from-primary via-purple-500 to-orange-500",
                      "drop-shadow-lg"
                    )}>
                      LinkMindAI
                    </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-400">
                instantly creates an intelligent, conversational AI from your existing website content. No coding, no complex setup. just powerful, actionable insights for your entire organization.
              </p>
            </motion.div>
            <motion.div variants={FADE_IN_ANIMATION_VARIANTS} className="mt-8 flex justify-center gap-4">
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20">
                <Link href="/dashboard">
                  Unlock Your AI <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* How It Works Section */}
        <section className="py-20 bg-black/20 border-y border-gray-800">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold">From URL to AI in Seconds</h2>
            <p className="mt-2 text-gray-400">A seamless three-step process to activate your knowledge.</p>
            <div className="mt-12 grid md:grid-cols-3 gap-8 text-left">
              <StepCard icon={<Globe className="w-8 h-8 text-purple-400" />} title="1. Submit Your URL" description="Just provide your website's URL. Our system automatically crawls and ingests all your content." />
              <StepCard icon={<BrainCircuit className="w-8 h-8 text-purple-400" />} title="2. AI-Powered Indexing" description="We analyze, structure, and create a semantic index of your data, understanding context and relationships." />
              <StepCard icon={<Bot className="w-8 h-8 text-purple-400" />} title="3. Instant Conversation" description="Start asking questions immediately. Get precise, source-cited answers from your new AI expert." />
            </div>
          </div>
        </section>

        {/* Business Benefits Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold">The Unfair Advantage for Your Business</h2>
              <p className="mt-2 max-w-3xl mx-auto text-gray-400">
                Transform dormant content into a strategic asset that drives efficiency, accelerates growth, and empowers your teams.
              </p>
            </div>
            <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard icon={<Zap className="w-6 h-6 text-purple-400" />} title="Boost Team Productivity" description="Give your teams a centralized brain to get instant, accurate answers about products, processes, and documentation." />
              <FeatureCard icon={<DollarSign className="w-6 h-6 text-purple-400" />} title="Slash Onboarding Time" description="Let new hires learn at their own pace by asking the AI, reducing dependency on senior staff and accelerating their time-to-value." />
              <FeatureCard icon={<BarChart className="w-6 h-6 text-purple-400" />} title="Optimize Content Strategy" description="Discover what your users and teams are truly looking for. Identify content gaps and popular topics to inform your content creation." />
              <FeatureCard icon={<Briefcase className="w-6 h-6 text-purple-400" />} title="Supercharge Sales Enablement" description="Equip your sales force with instant access to case studies, competitor data, and technical specs to close deals faster." />
              <FeatureCard icon={<Code className="w-6 h-6 text-purple-400" />} title="Empower Developers" description="Turn your technical docs into an interactive API, allowing developers to find endpoints and code examples without leaving their editor." />
              <FeatureCard icon={<Bot className="w-6 h-6 text-purple-400" />} title="Elevate Customer Experience" description="Power a 24/7 support chatbot with your knowledge base, providing instant answers and freeing up human agents for complex issues." />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-black/20 border-y border-gray-800">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full mt-8">
              <AccordionItem value="item-1">
              <AccordionTrigger>What kind of websites can I use?</AccordionTrigger>
              <AccordionContent>LinkMindAI works with most publicly accessible websites, including marketing sites, knowledge bases, blogs, and documentation portals. It's designed to handle complex, multi-page sites.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
              <AccordionTrigger>Is my data secure?</AccordionTrigger>
              <AccordionContent>Absolutely. Your data is encrypted both in transit and at rest. Your data is never used for training or shared with other users.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
              <AccordionTrigger>How accurate are the answers?</AccordionTrigger>
              <AccordionContent>Our AI is optimized for high accuracy and provides source links back to the original content, so you can always verify the information. It's designed to reduce hallucinations and provide trustworthy answers based solely on your provided content.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
              <AccordionTrigger>Will there be API access?</AccordionTrigger>
              <AccordionContent>We are working on a new feature that will allow API access to start requests for public use, allowing you to integrate LinkMindAI capabilities into your own applications and workflows.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
              <AccordionTrigger>Can I embed the chat into my website?</AccordionTrigger>
              <AccordionContent>We are working on a new feature that will let you embed the HTML element of each chat directly into your website. Stay tuned—this is coming soon!</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
              <AccordionTrigger>Can I upload my own documents or knowledge base?</AccordionTrigger>
              <AccordionContent>
                This feature is currently in progress. Soon, you'll be able to upload your own custom documents or knowledge base directly into LinkMindAI, not just rely on web scraping. Stay tuned for updates!
              </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold">Ready to Build Your Second Brain?</h2>
            <p className="mt-2 text-gray-400">Start for free. No credit card required.</p>
            <div className="mt-8">
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20">
                <Link href="/register">
                  Create Your Free Account <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center py-6 border-t border-gray-800">
        <p className="text-gray-500">&copy; {new Date().getFullYear()} LinkMindAI. All rights reserved.</p>
      </footer>
    </div>
  );
};

const StepCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="p-6 bg-gray-900/50 rounded-lg border border-gray-800 shadow-lg">
    <div className="flex items-center gap-4">
      {icon}
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <p className="mt-2 text-gray-400">{description}</p>
  </div>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex gap-4 p-4 rounded-lg hover:bg-gray-900/50 transition-colors">
    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-gray-400">{description}</p>
    </div>
  </div>
);

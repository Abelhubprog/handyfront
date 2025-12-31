import React from 'react';
import { ShieldCheck, Zap, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-24 pb-24">
      {/* Hero */}
      <section className="pt-24 pb-12 px-4 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Accepting new orders for Fall 2023
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 mb-6 font-serif max-w-4xl mx-auto leading-[1.1]">
          Academic excellence, <br/>
          <span className="text-zinc-400 italic">delivered securely.</span>
        </h1>
        <p className="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Connect with vetted academic writers for research, editing, and content creation. Premium quality, zero plagiarism, guaranteed privacy.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          <Button size="lg" className="w-full md:w-auto text-lg h-14 px-10" onClick={() => navigate('/app/new')}>Start an Order</Button>
          <Button variant="outline" size="lg" className="w-full md:w-auto text-lg h-14 px-10" onClick={() => navigate('/services')}>View Samples</Button>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
              {[
                  { icon: ShieldCheck, title: "Private & Secure", desc: "Bank-level encryption and strict NDA protection for all your data." },
                  { icon: Zap, title: "Fast Turnaround", desc: "Get your drafts in as little as 24 hours for urgent deadlines." },
                  { icon: User, title: "Vetted Experts", desc: "Only Top 1% of applicants make it to our writing team." }
              ].map((f, i) => (
                  <div key={i} className="p-8 bg-white border border-zinc-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-900 mb-6">
                          <f.icon size={24} />
                      </div>
                      <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                      <p className="text-zinc-500 leading-relaxed">{f.desc}</p>
                  </div>
              ))}
          </div>
      </section>
    </div>
  );
};

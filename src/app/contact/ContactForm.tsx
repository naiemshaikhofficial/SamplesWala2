"use client";

import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, message })
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Network error. Please try again later.");
    }
  };

  return (
    <div className="comic-panel p-8 md:p-12 border-4 border-black shadow-[10px_10px_0px_#00BFFF] relative overflow-hidden bg-zinc-950">
      <div className="absolute top-0 right-0 p-8 opacity-5 text-[#00BFFF]">
        <Send size={120} />
      </div>

      {status === "success" ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 relative z-10">
          <div className="w-20 h-20 bg-studio-neon text-black border-4 border-black flex items-center justify-center rounded-sm shadow-[4px_4px_0px_black] rotate-6">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black uppercase italic comic-text text-white">Message Sent!</h3>
            <p className="text-white/60 text-xs font-black uppercase tracking-widest">Thank you! We'll get back to you shortly.</p>
          </div>
          <button 
            onClick={() => setStatus("idle")}
            className="studio-button hover:bg-studio-yellow transition-all"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Web3Forms Customization */}
          <input type="hidden" name="from_name" value="Sampleswala Contact" />
          <input type="hidden" name="subject" value="New Contact Message from Sampleswala" />
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Full Name</label>
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="YOUR NAME"
              className="w-full bg-black border-4 border-black p-4 rounded-sm focus:outline-none focus:border-studio-yellow text-xs font-black uppercase tracking-widest transition-all focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[4px_4px_0px_#FFE600] outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Email Address</label>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="YOU@EXAMPLE.COM"
              className="w-full bg-black border-4 border-black p-4 rounded-sm focus:outline-none focus:border-studio-yellow text-xs font-black uppercase tracking-widest transition-all focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[4px_4px_0px_#FFE600] outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Message</label>
            <textarea 
              name="message" 
              required 
              rows={5}
              placeholder="WRITE YOUR MESSAGE HERE..."
              className="w-full bg-black border-4 border-black p-4 rounded-sm focus:outline-none focus:border-studio-yellow text-xs font-black uppercase tracking-widest transition-all focus:translate-x-[-2px] focus:translate-y-[-2px] focus:shadow-[4px_4px_0px_#FFE600] outline-none resize-none"
            />
          </div>

          {status === "error" && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border-2 border-red-500/30 text-red-500 rounded-sm text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_black]">
              <AlertCircle size={16} />
              <p>{errorMessage}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={status === "sending"}
            className="studio-button w-full py-5 disabled:opacity-50 disabled:cursor-not-allowed group transition-all"
          >
            {status === "sending" ? (
              "Sending..."
            ) : (
              <>
                <span>Send Message</span>
                <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

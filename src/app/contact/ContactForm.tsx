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
    
    // Web3Forms Access Key
    formData.append("access_key", "854ad5d5-c25d-4329-8c46-d9e242a2a817");

    setStatus("sending");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setErrorMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      setStatus("error");
      setErrorMessage("Network error. Please try again later.");
    }
  };

  return (
    <div className="studio-panel p-8 md:p-12 rounded-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <Send size={120} />
      </div>

      {status === "success" ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
          <div className="w-20 h-20 bg-studio-neon/20 rounded-full flex items-center justify-center text-studio-neon">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black uppercase italic">Message Sent!</h3>
            <p className="text-white/60 text-sm">Thank you! We'll get back to you shortly.</p>
          </div>
          <button 
            onClick={() => setStatus("idle")}
            className="studio-button"
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
              placeholder="Your Name"
              className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-studio-yellow text-sm transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Email Address</label>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="you@example.com"
              className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-studio-yellow text-sm transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ml-1">Message</label>
            <textarea 
              name="message" 
              required 
              rows={5}
              placeholder="Write your message here..."
              className="w-full bg-black border border-white/10 p-4 rounded-sm focus:outline-none focus:border-studio-yellow text-sm transition-colors resize-none"
            />
          </div>

          {status === "error" && (
            <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-sm text-xs">
              <AlertCircle size={16} />
              <p>{errorMessage}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={status === "sending"}
            className="studio-button w-full py-5 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {status === "sending" ? (
              "Sending..."
            ) : (
              <>
                Send Message
                <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

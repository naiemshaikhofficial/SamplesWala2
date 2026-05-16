  'use client'
 import { useState, useEffect } from 'react'
 import { Download, Loader2, AlertTriangle, ShieldCheck, CheckCircle2, Globe } from 'lucide-react'
 import { getSecureDownloadUrl } from '@/app/packs/actions'
 import { motion, AnimatePresence } from 'framer-motion'
 
 export function DownloadButton({ itemId, type = 'pack' }: { itemId: string, type?: 'pack' | 'preset' }) {
   const [status, setStatus] = useState<'idle' | 'preparing' | 'handshaking' | 'starting' | 'success'>('idle')
   const [progress, setProgress] = useState(0)
   const [error, setError] = useState<string | null>(null)
 
   // Simulation of progress for a more "synced" feel
   useEffect(() => {
     let interval: any
     if (status === 'preparing' || status === 'handshaking' || status === 'starting') {
       interval = setInterval(() => {
         setProgress(prev => {
           if (prev >= 95) return prev // Wait at 95% for the actual success trigger
           const increment = status === 'preparing' ? 5 : status === 'handshaking' ? 2 : 1
           return Math.min(prev + increment, 95)
         })
       }, 200)
     } else if (status === 'success') {
       setProgress(100)
     } else {
       setProgress(0)
     }
     return () => clearInterval(interval)
   }, [status])
 
   const handleDownload = async () => {
     setStatus('preparing')
     setError(null)
     setProgress(0)
 
     try {
       const secureUrl = await getSecureDownloadUrl(itemId, type)
       
       if (secureUrl) {
         // Stage 2: Handshaking (Simulating server-to-storage connection)
         setTimeout(() => setStatus('handshaking'), 1500)
         
         // Stage 3: Starting the actual redirect
         setTimeout(() => {
           setStatus('starting')
           window.location.href = secureUrl
         }, 3000)
 
         // Stage 4: Syncing the "Success" message with the typical browser download delay (approx 6.5s total)
         setTimeout(() => {
           setStatus('success')
           // Reset to idle after 8 seconds
           setTimeout(() => setStatus('idle'), 8000)
         }, 6500)
 
       } else {
         throw new Error("No download link found")
       }
     } catch (err: any) {
       console.error("Download Failed:", err)
       setError(err.message || "DOWNLOAD_FAILED")
       setStatus('idle')
     }
   }
 
   return (
     <div className="w-full space-y-3">
       <div className="relative overflow-hidden border-4 border-black shadow-[6px_6px_0px_black] group">
         {/* Background Progress Bar */}
         <motion.div 
           className="absolute inset-0 bg-studio-neon/20 z-0 origin-left"
           initial={{ scaleX: 0 }}
           animate={{ scaleX: progress / 100 }}
           transition={{ duration: 0.3 }}
         />
 
         <button
           disabled={status !== 'idle'}
           onClick={handleDownload}
           className={`relative z-10 w-full h-16 font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 transition-all
             ${status === 'idle' ? 'bg-studio-neon text-black hover:bg-white' : 'cursor-wait'}
             ${status === 'success' ? 'bg-studio-blue text-white' : ''}
           `}
         >
           <AnimatePresence mode="wait">
             {status === 'idle' && (
               <motion.div 
                 key="idle"
                 initial={{ opacity: 0, y: 5 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -5 }}
                 className="flex items-center gap-3"
               >
                 <ShieldCheck size={20} className="text-black/40" />
                 <Download size={20} />
                 <span>SECURE DOWNLOAD</span>
               </motion.div>
             )}
 
             {(status === 'preparing' || status === 'handshaking' || status === 'starting') && (
               <motion.div 
                 key="loading"
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0 }}
                 className="flex items-center gap-3"
               >
                 {status === 'handshaking' ? <Globe className="animate-pulse text-black" size={20} /> : <Loader2 className="animate-spin" size={20} />}
                 <span>
                   {status === 'preparing' && 'AUTHENTICATING...'}
                   {status === 'handshaking' && 'HANDSHAKING...'}
                   {status === 'starting' && 'TRANSFERRING...'}
                 </span>
               </motion.div>
             )}
 
             {status === 'success' && (
               <motion.div 
                 key="success"
                 initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                 animate={{ opacity: 1, scale: 1, rotate: 0 }}
                 className="flex items-center gap-3"
               >
                 <CheckCircle2 size={20} className="text-white" />
                 <span>DOWNLOAD INITIALIZED!</span>
               </motion.div>
             )}
           </AnimatePresence>
         </button>
       </div>
 
       {status !== 'idle' && status !== 'success' && (
         <div className="flex flex-col gap-1 px-1">
           <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-white/40 italic">
             <span>{status}</span>
             <span>{progress}%</span>
           </div>
           <p className="text-[9px] font-black text-studio-neon uppercase tracking-widest text-center animate-pulse">
             {status === 'starting' ? 'BROWSER IS TAKING OVER...' : 'DO NOT CLOSE THIS TAB'}
           </p>
         </div>
       )}
 
       {error && (
         <div className="flex items-center justify-center gap-2 text-red-500">
           <AlertTriangle size={12} />
           <p className="text-[10px] font-black uppercase tracking-widest italic">{error}</p>
         </div>
       )}
     </div>
   )
 }

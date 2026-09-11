import React from 'react';
import { CreatorSettings } from '../types';
import { generateACLEDAKHQR } from '../lib/khqr';

interface KHQRCodeProps {
  creatorSettings: CreatorSettings;
  className?: string;
  amount?: number;
}

export const KHQRCode: React.FC<KHQRCodeProps> = ({ creatorSettings, className = "w-64", amount }) => {
  const isSmall = className.includes('w-24') || className.includes('w-12');

  // Generate the mathematically perfect, 100% scannable Individual KHQR string (Tag 29)
  const khqrString = generateACLEDAKHQR({
    accountName: creatorSettings.accountName || 'HANG HAK',
    accountNumber: creatorSettings.accountNumber || '015466210',
    amount: amount && amount > 0 ? amount : undefined
  });

  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&ecc=H&data=${encodeURIComponent(khqrString)}`;

  // If we just need a small preview (e.g. in lists or dashboard sidebar)
  if (isSmall) {
    return (
      <div className={`relative bg-white rounded-xl overflow-hidden p-1.5 border border-slate-200 flex items-center justify-center select-none ${className}`}>
        <img
          src={qrCodeUrl}
          alt="KHQR Code"
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
        {/* Tiny Center Bakong Logo Overlay */}
        <div className="absolute w-[22%] h-[22%] bg-white rounded-full flex items-center justify-center p-0.5 shadow-sm">
          <div className="w-full h-full bg-[#c31e2e] rounded-full flex items-center justify-center">
            <span className="text-[5px] text-white font-extrabold font-mono">KH</span>
          </div>
        </div>
      </div>
    );
  }

  // Full-size, gorgeous, official-looking ACLEDA KHQR standee/card
  return (
    <div className="w-full max-w-sm mx-auto bg-slate-50 border border-slate-200 rounded-3xl overflow-hidden shadow-xl font-sans select-none">
      {/* Red KHQR Header Band */}
      <div className="bg-[#e11d48] text-white px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Authentic red & gold themed KHQR badge logo */}
          <div className="bg-white text-[#e11d48] font-black text-xs px-2.5 py-0.5 rounded-md tracking-wider shadow-inner">
            KHQR
          </div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-white/80">Quick Payment</span>
        </div>
        <span className="text-[9px] text-white/70 font-semibold font-mono">Scan & Pay</span>
      </div>

      {/* Main Card Body */}
      <div className="p-6 flex flex-col items-center bg-white">
        {/* ACLEDA Bank Identification header */}
        <div className="w-full flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex flex-col">
            <span className="text-slate-800 font-extrabold text-sm tracking-wide">ACLEDA Bank Plc.</span>
            <span className="text-slate-400 text-[9px] font-medium uppercase">Individual Account</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 p-1">
            {/* Simple representation of the ACLEDA blue bird emblem */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-blue-600 fill-current">
              <path d="M20,50 C30,30 70,30 80,50 C70,70 30,70 20,50 Z" />
              <circle cx="50" cy="50" r="15" fill="#ffffff" />
            </svg>
          </div>
        </div>

        {/* The QR Code Container framed by the standard red dotted frame */}
        <div className="relative border-4 border-dashed border-rose-500/10 p-4 rounded-3xl bg-slate-50/50 mb-5 flex items-center justify-center shadow-inner">
          <div className="w-56 h-56 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center relative">
            {/* Crisp generated QR code */}
            <img
              src={qrCodeUrl}
              alt="Dynamic KHQR Code"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />

            {/* Center Bakong Logo Overlay */}
            <div className="absolute w-[20%] h-[20%] bg-white rounded-full flex items-center justify-center p-0.5 shadow-md border border-slate-50">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="46" fill="#c31e2e" stroke="#ffffff" strokeWidth="4" />
                {/* Stylized Bakong temple flower emblem */}
                <path d="M50 18 L55 35 H74 L59 45 L64 62 L50 52 L36 62 L41 45 L26 35 H45 Z" fill="#ffffff" />
                <circle cx="50" cy="43" r="10" fill="#c31e2e" />
                <path d="M43 40 H57 V54 H43 Z" fill="#ffffff" />
                <path d="M46 43 H54 V51 H46 Z" fill="#c31e2e" />
              </svg>
            </div>
          </div>
        </div>

        {/* Account Owner Details */}
        <div className="text-center space-y-1">
          <span className="text-xs text-slate-400 font-medium tracking-wider block uppercase">Account Holder</span>
          <span className="text-lg font-black text-slate-800 tracking-wide block">{creatorSettings.accountName || 'HANG HAK'}</span>
          <div className="inline-flex items-center gap-1.5 bg-slate-100 rounded-full px-3 py-1 mt-1 text-[11px] font-mono text-slate-600 font-bold border border-slate-200">
            <span>ID:</span>
            <span>{creatorSettings.accountNumber || '015466210'}@aclb</span>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="bg-slate-50 border-t border-slate-150 px-5 py-3.5 flex items-center justify-between text-[11px] font-medium text-slate-400">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span>ស្កែនបានគ្រប់ធនាគារ (Multi-bank Scannable)</span>
        </div>
        <span className="font-extrabold text-rose-500 font-mono">KHQR</span>
      </div>
    </div>
  );
};

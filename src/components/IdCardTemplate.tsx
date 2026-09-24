import React, { useRef, useState, useEffect } from 'react';
import { User, Maximize2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export interface IdCardData {
  indexNumber: string;
  fullName: string;
  photoUrl?: string | null;
  organization?: string | null;
  institutionName?: string | null;
  logoUrl?: string | null;
  role?: string | null;
  program?: string | null;
  motto?: string | null;
  status?: string | null;
  registeredStudent?: boolean;
}

export function GctuSeal({ className = "w-24 h-24" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Outer ring */}
      <circle cx="100" cy="100" r="96" fill="#0B1E48" stroke="#FACC15" strokeWidth="4" />
      <circle cx="100" cy="100" r="76" fill="#FACC15" stroke="#0B1E48" strokeWidth="2" />
      
      {/* Curved Text Top */}
      <path id="sealTextArcTop" d="M 28,100 A 72,72 0 1,1 172,100" fill="none" />
      <text fill="#FACC15" fontSize="10" fontWeight="800" letterSpacing="0.8">
        <textPath href="#sealTextArcTop" startOffset="50%" textAnchor="middle">
          GHANA COMMUNICATION TECHNOLOGY UNIVERSITY
        </textPath>
      </text>

      {/* Curved Text Bottom */}
      <path id="sealTextArcBottom" d="M 172,100 A 72,72 0 0,1 28,100" fill="none" />
      <text fill="#0B1E48" fontSize="8" fontWeight="800" letterSpacing="0.5">
        <textPath href="#sealTextArcBottom" startOffset="50%" textAnchor="middle">
          KNOWLEDGE COMES FROM LEARNING
        </textPath>
      </text>

      {/* Inner Shield */}
      <g transform="translate(60, 48)">
        <path
          d="M 0,0 L 80,0 L 80,45 C 80,75 40,95 40,95 C 40,95 0,75 0,45 Z"
          fill="#0B1E48"
          stroke="#FACC15"
          strokeWidth="2.5"
        />
        <rect x="5" y="5" width="70" height="35" fill="#FACC15" rx="1" />
        <path
          d="M 5,5 h70 v35 h-70 z"
          fill="none"
          stroke="#0B1E48"
          strokeWidth="2"
        />
        {/* Checkered pattern */}
        <rect x="5" y="5" width="17.5" height="17.5" fill="#0B1E48" />
        <rect x="40" y="5" width="17.5" height="17.5" fill="#0B1E48" />
        <rect x="22.5" y="22.5" width="17.5" height="17.5" fill="#0B1E48" />
        <rect x="57.5" y="22.5" width="17.5" height="17.5" fill="#0B1E48" />

        {/* Antenna Tower emblem */}
        <path d="M25,50 L35,75 M55,50 L45,75 M40,48 L40,75 M30,60 L50,60 M33,68 L47,68" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
        <circle cx="40" cy="46" r="3" fill="#FACC15" />
      </g>
      
      {/* Banner GCTU */}
      <rect x="70" y="146" width="60" height="18" rx="4" fill="#0B1E48" stroke="#FACC15" strokeWidth="1.5" />
      <text x="100" y="159" fill="#FACC15" fontSize="11" fontWeight="900" textAnchor="middle" letterSpacing="1">GCTU</text>
    </svg>
  );
}

export function IdCardTemplate({
  indexNumber,
  fullName,
  photoUrl,
  organization,
  institutionName = 'GHANA COMMUNICATION TECHNOLOGY UNIVERSITY',
  logoUrl,
  role = 'STUDENT',
  program,
  motto = 'Knowledge Comes From Learning',
  className = '',
}: IdCardData & { className?: string }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);

  useEffect(() => {
    const updateScale = () => {
      if (!outerRef.current) return;
      const containerWidth = outerRef.current.clientWidth;
      const targetWidth = 540; // Reference PC card width
      if (containerWidth < targetWidth && containerWidth > 0) {
        setScale(containerWidth / targetWidth);
      } else {
        setScale(1);
      }
    };

    updateScale();
    const observer = new ResizeObserver(() => updateScale());
    if (outerRef.current) {
      observer.observe(outerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Parse full name into surname (first word) and given names (remaining words)
  const nameParts = (fullName || '').trim().split(/\s+/);
  const surname = nameParts.length > 0 ? nameParts[0].toUpperCase() : '';
  const givenNames = nameParts.length > 1 ? nameParts.slice(1).join(' ').toUpperCase() : '';

  // Determine program display text (metadata program or organization or default)
  const programText = (program || organization || 'BSc. INFORMATION TECHNOLOGY').toUpperCase();

  const BASE_WIDTH = 540;
  const BASE_HEIGHT = 342;

  return (
    <div ref={outerRef} className={`w-full max-w-[540px] flex justify-center items-start overflow-hidden ${className}`}>
      <div
        style={{
          width: `${BASE_WIDTH}px`,
          height: `${BASE_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          marginBottom: scale < 1 ? `-${(1 - scale) * BASE_HEIGHT}px` : 0,
          marginRight: scale < 1 ? `-${(1 - scale) * BASE_WIDTH}px` : 0,
        }}
        className="bg-white text-slate-900 rounded-xl shadow-xl border-2 border-slate-900 overflow-hidden font-sans select-none flex flex-col justify-between flex-shrink-0 relative"
      >
        {/* Top Header Bar */}
        <div className="bg-[#0B1E48] text-[#FACC15] h-[44px] px-4 text-center border-b-2 border-[#FACC15] flex items-center justify-center flex-shrink-0">
          <h2 className="font-black text-[15px] tracking-wider uppercase font-sans drop-shadow-sm truncate">
            {institutionName}
          </h2>
        </div>

        {/* Card Body Grid */}
        <div className="flex-1 px-5 py-3 flex items-center justify-between gap-3 relative">
          {/* Left Column: Logo / Seal */}
          <div className="w-[155px] h-[155px] flex items-center justify-center flex-shrink-0">
            {logoUrl ? (
              <div className="w-[146px] h-[146px] rounded-full overflow-hidden flex items-center justify-center bg-transparent">
                <img src={logoUrl} alt="Institution Logo" className="w-full h-full object-contain scale-[1.6]" />
              </div>
            ) : (
              <GctuSeal className="w-[146px] h-[146px]" />
            )}
          </div>

          {/* Center Column: Role & Name */}
          <div className="flex-1 pl-3 pr-2 flex flex-col justify-center min-w-0">
            <div className="font-black text-[26px] text-black tracking-wider uppercase mb-2 font-sans leading-none">
              {role}
            </div>
            
            <div className="flex flex-col gap-1">
              {surname && (
                <div className="font-black text-[20px] text-black leading-tight uppercase font-sans tracking-tight truncate">
                  {surname}
                </div>
              )}
              {givenNames ? (
                <div className="font-extrabold text-[17px] text-black leading-tight uppercase font-sans tracking-tight line-clamp-2">
                  {givenNames}
                </div>
              ) : (
                !surname && (
                  <div className="font-extrabold text-[18px] text-black uppercase font-sans truncate">
                    {fullName.toUpperCase()}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right Column: Photo & Index Number */}
          <div className="w-[124px] flex flex-col items-center justify-center flex-shrink-0">
            <div
              onClick={() => photoUrl && setIsPhotoOpen(true)}
              className={`w-[120px] h-[142px] rounded-md overflow-hidden border-2 border-slate-900 shadow-md bg-slate-100 flex items-center justify-center relative ${
                photoUrl ? 'cursor-pointer group hover:border-blue-600 transition-all' : ''
              }`}
              title={photoUrl ? "Click or tap to view full photo" : undefined}
            >
              {photoUrl ? (
                <>
                  <img
                    src={photoUrl}
                    alt={fullName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-1 text-[11px] font-bold">
                    <Maximize2 className="w-4 h-4" />
                    <span>Enlarge</span>
                  </div>
                </>
              ) : (
                <User className="w-12 h-12 text-slate-400" />
              )}
            </div>
            <div className="w-full text-center mt-1.5 font-black text-[18px] text-black tracking-wide font-sans leading-none">
              {indexNumber}
            </div>
          </div>
        </div>

        {/* Bottom Area */}
        <div className="h-[38px] flex items-end justify-between w-full mt-auto flex-shrink-0">
          {/* Bottom Left: Program / Organization */}
          <div className="pl-5 pb-2.5 flex-1 min-w-0 pr-2">
            <div className="font-extrabold text-[13px] text-black uppercase tracking-tight font-sans truncate">
              {programText}
            </div>
          </div>

          {/* Bottom Right Banner: Slogan */}
          <div className="bg-[#FACC15] text-[#0B1E48] px-4 py-1.5 rounded-tl-lg font-extrabold italic text-[12px] text-right font-sans shadow-inner flex-shrink-0">
            {motto}
          </div>
        </div>
      </div>

      {/* Pure Image & Cancel Button Lightbox */}
      {photoUrl && (
        <Dialog open={isPhotoOpen} onOpenChange={setIsPhotoOpen}>
          <DialogContent className="sm:max-w-fit max-w-[92vw] max-h-[92vh] bg-transparent border-0 p-0 shadow-none overflow-hidden flex items-center justify-center focus:outline-none [&>button]:top-3 [&>button]:right-3 [&>button]:bg-black/70 [&>button]:hover:bg-black [&>button]:text-white [&>button]:p-2.5 [&>button]:rounded-full [&>button]:border [&>button]:border-white/30 [&>button]:shadow-lg [&>button]:transition-all [&>button]:z-50">
            <div className="relative flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl bg-black/80 border border-white/10">
              <img
                src={photoUrl}
                alt={fullName}
                className="max-h-[85vh] max-w-[90vw] sm:max-w-[480px] w-auto h-auto object-contain rounded-2xl"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

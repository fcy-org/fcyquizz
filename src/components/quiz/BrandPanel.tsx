'use client';

import { useEffect, useState } from 'react';
import Logo from './Logo';

const BULLETS = [
  'Geração contínua de oportunidades qualificadas',
  'Acompanhamento comercial com dados e tecnologia',
  'Estratégias de recompra e aumento de LTV',
  'Receita previsível para distribuidoras e indústrias',
];

// Animated data node flowing through a B2B pipeline
function PipelineSVG() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    let frame: number;
    let val = 0;
    const animate = () => {
      val = (val + 0.4) % 100;
      setOffset(val);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Nodes: 3 sources (top), 1 hub (center), 3 outputs (bottom)
  const sources = [{ x: 56, y: 44 }, { x: 150, y: 24 }, { x: 244, y: 44 }];
  const hub = { x: 150, y: 118 };
  const outputs = [{ x: 60, y: 192 }, { x: 150, y: 210 }, { x: 240, y: 192 }];

  return (
    <svg viewBox="0 0 300 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-xs mx-auto">
      {/* Connection lines — sources to hub */}
      {sources.map((s, i) => (
        <line key={`s${i}`}
          x1={s.x} y1={s.y} x2={hub.x} y2={hub.y}
          stroke="#C5FF4D" strokeWidth="1"
          strokeOpacity="0.25"
          strokeDasharray="4 4"
          strokeDashoffset={offset * (i % 2 === 0 ? 1 : -1)}
        />
      ))}
      {/* Connection lines — hub to outputs */}
      {outputs.map((o, i) => (
        <line key={`o${i}`}
          x1={hub.x} y1={hub.y} x2={o.x} y2={o.y}
          stroke="#C5FF4D" strokeWidth="1"
          strokeOpacity={i === 1 ? 0.5 : 0.2}
          strokeDasharray="4 4"
          strokeDashoffset={-offset * (i % 2 === 0 ? 1 : -1)}
        />
      ))}
      {/* Horizontal connectors between sources */}
      <line x1={sources[0].x} y1={sources[0].y} x2={sources[1].x} y2={sources[1].y}
        stroke="#C5FF4D" strokeWidth="0.5" strokeOpacity="0.12" />
      <line x1={sources[1].x} y1={sources[1].y} x2={sources[2].x} y2={sources[2].y}
        stroke="#C5FF4D" strokeWidth="0.5" strokeOpacity="0.12" />

      {/* Source nodes */}
      {sources.map((s, i) => (
        <g key={`sn${i}`}>
          <circle cx={s.x} cy={s.y} r="18" fill="#111111" stroke="#C5FF4D" strokeWidth="1" strokeOpacity="0.4" />
          <circle cx={s.x} cy={s.y} r="7" fill="#C5FF4D" fillOpacity="0.5" />
          <circle cx={s.x} cy={s.y} r="3.5" fill="#C5FF4D" />
        </g>
      ))}

      {/* Hub — pulsing rings */}
      <circle cx={hub.x} cy={hub.y} r="34" fill="#C5FF4D" fillOpacity="0.04" stroke="#C5FF4D" strokeWidth="0.5" strokeOpacity="0.2" />
      <circle cx={hub.x} cy={hub.y} r="24" fill="#C5FF4D" fillOpacity="0.08" stroke="#C5FF4D" strokeWidth="1" strokeOpacity="0.35" />
      <circle cx={hub.x} cy={hub.y} r="15" fill="#C5FF4D" fillOpacity="0.2" stroke="#C5FF4D" strokeWidth="1.5" />
      <circle cx={hub.x} cy={hub.y} r="8" fill="#C5FF4D" />

      {/* Output nodes */}
      {outputs.map((o, i) => (
        <g key={`on${i}`}>
          <circle cx={o.x} cy={o.y} r={i === 1 ? 20 : 15}
            fill="#111111"
            stroke="#C5FF4D"
            strokeWidth={i === 1 ? 1.5 : 1}
            strokeOpacity={i === 1 ? 0.7 : 0.35}
          />
          <circle cx={o.x} cy={o.y} r={i === 1 ? 8 : 5}
            fill="#C5FF4D" fillOpacity={i === 1 ? 0.7 : 0.4}
          />
        </g>
      ))}

      {/* Labels */}
      {[
        { x: sources[0].x, y: sources[0].y + 32, text: 'Social' },
        { x: sources[1].x, y: sources[1].y + 32, text: 'Busca' },
        { x: sources[2].x, y: sources[2].y + 32, text: 'Referral' },
        { x: hub.x, y: hub.y + 52, text: 'Pipeline' },
        { x: outputs[0].x, y: outputs[0].y + 26, text: 'Prospecção' },
        { x: outputs[1].x, y: outputs[1].y + 30, text: 'Receita' },
        { x: outputs[2].x, y: outputs[2].y + 26, text: 'Recompra' },
      ].map(({ x, y, text }) => (
        <text key={text} x={x} y={y} textAnchor="middle" fontSize="9"
          fill={text === 'Receita' || text === 'Pipeline' ? '#C5FF4D' : '#555555'}
          fontFamily="system-ui, sans-serif"
          fontWeight={text === 'Receita' ? '600' : '400'}
        >{text}</text>
      ))}
    </svg>
  );
}

export default function BrandPanel() {
  return (
    <aside
      className="hidden lg:flex flex-col justify-between p-10 xl:p-12 overflow-hidden relative"
      style={{
        width: '420px',
        minWidth: '420px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        backgroundColor: '#080808',
        borderRight: '1px solid #1A1A1A',
      }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:
          'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),' +
          'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
        backgroundSize: '36px 36px',
      }} />

      {/* Accent glow */}
      <div className="absolute pointer-events-none" style={{
        width: '280px', height: '280px',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(197,255,77,0.07) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />
      <div className="absolute pointer-events-none" style={{
        width: '160px', height: '160px',
        bottom: '-40px', left: '-40px',
        background: 'radial-gradient(circle, rgba(197,255,77,0.05) 0%, transparent 70%)',
        borderRadius: '50%',
      }} />

      {/* ── Top: logo ── */}
      <div className="relative z-10">
        <Logo size="md" />
      </div>

      {/* ── Middle: content ── */}
      <div className="relative z-10 flex flex-col gap-7 flex-1 justify-center">
        {/* Accent rule + headline */}
        <div className="flex flex-col gap-3">
          <div className="w-10 h-0.5 rounded-full" style={{ backgroundColor: '#C5FF4D' }} />
          <div>
            <h2 className="text-xl font-bold leading-snug" style={{ color: '#FFFFFF' }}>
              Diagnóstico de Crescimento
            </h2>
            <p className="text-base font-medium" style={{ color: '#C5FF4D' }}>
              para Distribuidoras e Indústrias
            </p>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: '#666666' }}>
            Entenda se sua empresa tem estrutura para criar um novo canal de vendas e transformar demanda em receita previsível.
          </p>
        </div>

        {/* Abstract pipeline visualization */}
        <div className="py-2">
          <PipelineSVG />
        </div>

        {/* Bullet points */}
        <ul className="flex flex-col gap-2.5">
          {BULLETS.map(b => (
            <li key={b} className="flex items-start gap-2.5">
              <div className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: '#C5FF4D' }} />
              <span className="text-sm leading-snug" style={{ color: '#888888' }}>{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Bottom: tagline ── */}
      <div className="relative z-10 flex flex-col gap-1 pt-4 border-t" style={{ borderColor: '#1A1A1A' }}>
        <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: '#C5FF4D' }}>
          Fonil Company
        </p>
        <p className="text-xs" style={{ color: '#444444' }}>
          Assessoria de Marketing e Tecnologia B2B
        </p>
      </div>
    </aside>
  );
}

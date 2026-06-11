import React, { useState, useEffect } from 'react';
import { getCardImage } from '../data/card-images';
import { gameById, setById } from '../data/games';

export default function CardArt({ item, w = 120, radius = 10, showFoil = true }) {
  const h = Math.round(w * 1.4);
  const art = item.art || '#334155';
  const g = gameById(item.game);
  const set = setById(item.set);
  const [realUrl, setRealUrl] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    setRealUrl(null);
    setLoaded(false);
    getCardImage(item, (url) => {
      if (alive && url) setRealUrl(url);
    });
    return () => { alive = false; };
  }, [item.game, item.name, item.number]);

  return (
    <div style={{
      width: w, height: h, borderRadius: radius, position: 'relative',
      overflow: 'hidden', flexShrink: 0, isolation: 'isolate',
      background: art,
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10)',
    }}>
      {/* Real card image (fades in over the placeholder once available) */}
      {realUrl && (
        <img src={realUrl} alt={item.name} onLoad={() => setLoaded(true)} style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
          borderRadius: radius, opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease', zIndex: 3,
        }} />
      )}

      {/* Card border frame */}
      <div style={{
        position: 'absolute', inset: Math.max(3, w * 0.045), borderRadius: radius * 0.6,
        boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.22)',
      }} />

      {/* Art window -- hatch placeholder */}
      <div style={{
        position: 'absolute', left: w * 0.10, right: w * 0.10, top: w * 0.13, height: h * 0.46,
        borderRadius: radius * 0.4, overflow: 'hidden',
        background: 'rgba(0,0,0,0.16)',
        backgroundImage: 'repeating-linear-gradient(135deg, rgba(255,255,255,0.07) 0 6px, transparent 6px 12px)',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)',
      }}>
        {showFoil && item.foil && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.28) 47%, transparent 60%)',
          }} />
        )}
      </div>

      {/* Name plate */}
      <div style={{
        position: 'absolute', left: w * 0.10, right: w * 0.10, top: h * 0.60,
        color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.4)',
      }}>
        <div style={{
          fontWeight: 700, fontSize: Math.max(8, w * 0.085),
          lineHeight: 1.1, letterSpacing: -0.2,
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {item.name}
        </div>
      </div>

      {/* Bottom strip: set / number */}
      <div style={{
        position: 'absolute', left: w * 0.10, right: w * 0.10, bottom: w * 0.10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        color: 'rgba(255,255,255,0.82)', fontFamily: 'var(--mono, monospace)', fontSize: Math.max(6.5, w * 0.055),
      }}>
        <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '64%' }}>
          {set ? set.name.replace(/\s*\(.*\)/, '') : ''}
        </span>
        <span>{item.number || ''}</span>
      </div>

      {/* Game pip */}
      {g && (
        <div style={{
          position: 'absolute', top: w * 0.085, right: w * 0.085,
          width: Math.max(14, w * 0.14), height: Math.max(14, w * 0.14), borderRadius: 999,
          background: g.tint, boxShadow: '0 1px 3px rgba(0,0,0,0.35), inset 0 0 0 1.5px rgba(255,255,255,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: Math.max(7, w * 0.075),
        }}>
          {g.name[0]}
        </div>
      )}
    </div>
  );
}

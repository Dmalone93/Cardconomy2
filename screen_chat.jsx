// ─────────────────────────────────────────────────────────────
// Chat / messaging screen
// ─────────────────────────────────────────────────────────────
const { T: TCH, money: moneyCH, Icon: IconCH, Sheet: SheetCH, CardArt: CardArtCH } = window;
const { byId: byIdCH } = window;

function buildMockMessages(seller, item) {
  const cardName = item ? item.name : 'the card';
  const price = item ? moneyCH(item.price) : null;
  const condition = item ? item.condition : 'Near Mint';

  const sets = [
    [
      { from: 'seller', text: 'Hi there! Thanks for your interest in ' + cardName + '. Happy to answer any questions.', time: '8m ago' },
      { from: 'buyer', text: 'Hi! Could you confirm the condition? The photos look great but I want to make sure before buying.', time: '6m ago' },
      { from: 'seller', text: 'Of course — it\'s genuinely ' + condition + '. No visible whitening on edges and the surface is clean. I grade conservatively.', time: '5m ago' },
      { from: 'buyer', text: 'Perfect, and how do you ship? I\'m happy to pay for tracked if needed.', time: '2m ago' },
    ],
    [
      { from: 'buyer', text: 'Hey, is ' + cardName + ' still available?', time: '10m ago' },
      { from: 'seller', text: 'Yes, still available! It\'s been sitting in a top loader since I pulled it.', time: '8m ago' },
      { from: 'buyer', text: 'Great. Any flexibility on the price' + (price ? ' of ' + price : '') + '?', time: '5m ago' },
      { from: 'seller', text: 'I\'m fairly firm — it\'s priced below market. But I can do free shipping if you go straight to Buy Now.', time: '2m ago' },
    ],
    [
      { from: 'seller', text: 'Hey! Just to let you know — this one has very slight edge wear on the bottom-left. Reflected in the price though.', time: '12m ago' },
      { from: 'buyer', text: 'Appreciate the heads up. Would you say it\'s closer to ' + condition + ' or one grade below?', time: '9m ago' },
      { from: 'seller', text: 'Honestly I\'d say ' + condition + ' by most grading standards. The wear is minimal — happy to send a close-up.', time: '6m ago' },
      { from: 'buyer', text: 'Yes please, that would be brilliant. Thanks!', time: '3m ago' },
    ],
  ];

  const idx = seller ? (seller.charCodeAt(0) + seller.length) % sets.length : 0;
  return sets[idx];
}

function ChatBubble({ msg }) {
  const isBuyer = msg.from === 'buyer';
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isBuyer ? 'flex-end' : 'flex-start',
      marginBottom: 10,
    }}>
      <div style={{
        maxWidth: '78%',
        padding: '10px 13px',
        borderRadius: isBuyer ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isBuyer ? 'var(--accent)' : TCH.surface,
        color: isBuyer ? '#fff' : TCH.ink,
        boxShadow: isBuyer ? 'none' : '0 1px 3px rgba(20,24,40,0.07)',
        fontFamily: TCH.sans,
        fontSize: 14,
        lineHeight: 1.45,
      }}>
        {msg.text}
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        marginTop: 3,
        fontFamily: TCH.sans,
        fontSize: 11,
        color: TCH.faint,
      }}>
        {msg.time}
        {isBuyer && (
          <span style={{ color: 'var(--accent)', fontSize: 11, fontWeight: 600 }}>
            {'✓✓'}
          </span>
        )}
      </div>
    </div>
  );
}

function ChatScreen({ app, params = {} }) {
  const seller = params.seller || 'Seller';
  const item = params.about ? byIdCH(params.about) : null;

  const [messages, setMessages] = React.useState(() => buildMockMessages(seller, item));
  const [input, setInput] = React.useState('');
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const timeStr = 'Just now';
    setMessages(ms => [...ms, { from: 'buyer', text, time: timeStr }]);
    setInput('');
    app.toast('Message sent');
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const initial = seller.charAt(0).toUpperCase();

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: TCH.bg,
      animation: 'ccPushIn 0.26s ease',
    }}>

      {/* ── Fixed header ── */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 12px 10px',
        background: TCH.surface,
        borderBottom: '1px solid var(--line)',
        boxShadow: '0 1px 3px rgba(20,24,40,0.05)',
        zIndex: 20,
      }}>
        <button
          onClick={() => app.nav.pop()}
          style={{
            width: 38, height: 38, borderRadius: 999,
            background: TCH.surface2, color: TCH.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-1)', flexShrink: 0,
          }}
        >
          {IconCH.back({})}
        </button>

        {/* seller avatar */}
        <div style={{
          width: 38, height: 38, borderRadius: 999,
          background: 'var(--fill)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: TCH.sans, fontWeight: 800, fontSize: 16, flexShrink: 0,
        }}>
          {initial}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: TCH.sans, fontWeight: 700, fontSize: 15, color: TCH.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {seller}
          </div>
          <div style={{ fontFamily: TCH.sans, fontSize: 11, color: 'var(--up)', fontWeight: 600 }}>
            Active now
          </div>
        </div>
      </div>

      {/* ── Card reference bar ── */}
      {item && (
        <button
          onClick={() => app.nav.push('listing', { id: item.id })}
          style={{
            flexShrink: 0,
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 14px',
            background: TCH.surface,
            borderBottom: '1px solid var(--line)',
            textAlign: 'left',
          }}
        >
          <div style={{ borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
            <CardArtCH item={item} w={36} radius={6} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: TCH.sans, fontWeight: 600, fontSize: 12, color: TCH.ink,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {item.name}
            </div>
            <div style={{ fontFamily: TCH.sans, fontSize: 11, color: TCH.muted }}>
              {item.condition} · {moneyCH(item.price)}
            </div>
          </div>
          <div style={{ fontFamily: TCH.sans, fontSize: 11, color: TCH.accent, fontWeight: 600, flexShrink: 0 }}>
            View listing
          </div>
        </button>
      )}

      {/* ── Scrollable message area ── */}
      <div
        ref={scrollRef}
        className="noscroll"
        style={{
          flex: 1,
          overflow: 'auto',
          padding: '16px 14px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* date divider */}
        <div style={{
          textAlign: 'center',
          fontFamily: TCH.sans,
          fontSize: 11,
          color: TCH.faint,
          fontWeight: 600,
          marginBottom: 14,
          letterSpacing: 0.3,
        }}>
          TODAY
        </div>

        {messages.map((msg, i) => (
          <ChatBubble key={i} msg={msg} />
        ))}
      </div>

      {/* ── Fixed bottom input bar ── */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 12px 28px',
        background: TCH.surface,
        borderTop: '1px solid var(--line)',
        boxShadow: '0 -1px 4px rgba(20,24,40,0.04)',
      }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={'Message ' + seller + '…'}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: 999,
            border: 'none',
            background: TCH.bg,
            boxShadow: 'inset 0 0 0 1px var(--line)',
            fontFamily: TCH.sans,
            fontSize: 14,
            color: TCH.ink,
            outline: 'none',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          style={{
            width: 40, height: 40,
            borderRadius: 999,
            background: input.trim() ? 'var(--accent)' : TCH.surface2,
            color: input.trim() ? '#fff' : TCH.faint,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.15s ease, color 0.15s ease',
            fontFamily: TCH.sans,
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          {/* send arrow using text */}
          <span style={{ lineHeight: 1, marginTop: -1 }}>{'↑'}</span>
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { ChatScreen });

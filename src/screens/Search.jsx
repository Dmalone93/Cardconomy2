import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Flex, Heading, Text, TextField, Button, Select, Badge, Checkbox } from '@radix-ui/themes';
import { Search as SearchIcon, SlidersHorizontal, Grid3X3, List, ArrowUpDown, X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GAMES, SETS, setById } from '../data/games';
import { LISTINGS } from '../data/listings';
import { money } from '../components/helpers';
import ListCard from '../components/ListCard';
import ListRow from '../components/ListRow';
import Sheet from '../components/Sheet';

const CONDITIONS = ['Any grade', 'Graded only', 'PSA 10', 'Raw / Ungraded'];
const SORTS = ['Best match', 'Price: low to high', 'Price: high to low', 'Ending soonest', 'Most watched'];
const SEARCH_EXAMPLES = [
  'Charizard ex', 'Black Lotus', 'Moonbreon PSA 10', 'Blue-Eyes White Dragon',
  'Surging Sparks booster box', 'Pikachu Illustration Rare', 'Ragavan, Nimble Pilferer',
  'Victor Wembanyama Prizm', 'Scarlet & Violet 151', 'Dark Magician',
  'Umbreon VMAX alt art', 'Monkey D. Luffy leader', 'PSA 10 graded slabs',
  'Modern Horizons 3', 'Omnimon alt art', 'Mewtwo 1st edition',
];
const POPULAR = ['Charizard ex', 'Moonbreon', 'Black Lotus', 'Blue-Eyes', '151', 'PSA 10'];

function FilterChip({ active, onClick, children }) {
  return (
    <Button
      variant={active ? 'solid' : 'outline'}
      size="1"
      onClick={onClick}
      style={{ borderRadius: 999, cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}
    >
      {children}
    </Button>
  );
}

function FilterGroup({ label, children }) {
  return (
    <Box mb="4">
      <Text size="2" weight="bold" color="gray" style={{ display: 'block', marginBottom: 8 }}>
        {label}
      </Text>
      {children}
    </Box>
  );
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const app = useApp();

  // State from URL params
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [game, setGame] = useState(searchParams.get('game') || 'all');
  const [setF, setSetF] = useState(searchParams.get('set') || 'all');

  // Filter state
  const [cond, setCond] = useState('Any grade');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [freeShip, setFreeShip] = useState(false);
  const [listType, setListType] = useState('all');
  const [sort, setSort] = useState('Best match');
  const [view, setView] = useState('grid');
  const [sheet, setSheet] = useState(null);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  // Animated placeholder text
  const [typed, setTyped] = useState('');
  useEffect(() => {
    let idx = 0, ch = 0, mode = 'type', timer;
    const tick = () => {
      const full = SEARCH_EXAMPLES[idx];
      if (mode === 'type') {
        ch++;
        setTyped(full.slice(0, ch));
        if (ch >= full.length) { mode = 'hold'; timer = setTimeout(tick, 1500); return; }
        timer = setTimeout(tick, 55 + Math.random() * 45);
      } else if (mode === 'hold') {
        mode = 'delete'; timer = setTimeout(tick, 40);
      } else {
        ch--;
        setTyped(full.slice(0, ch));
        if (ch <= 0) { mode = 'type'; idx = (idx + 1) % SEARCH_EXAMPLES.length; timer = setTimeout(tick, 320); return; }
        timer = setTimeout(tick, 28);
      }
    };
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort results
  const results = useMemo(() => {
    let res = LISTINGS.filter(l => {
      if (game !== 'all' && l.game !== game) return false;
      if (setF !== 'all' && l.set !== setF) return false;
      if (q.trim()) {
        const hay = (l.name + ' ' + (l.subtitle || '') + ' ' + (setById(l.set)?.name || '')).toLowerCase();
        if (!hay.includes(q.trim().toLowerCase())) return false;
      }
      if (cond === 'Graded only' && l.grade.company === 'raw') return false;
      if (cond === 'PSA 10' && !(l.grade.company === 'psa' && l.grade.grade === 10)) return false;
      if (cond === 'Raw / Ungraded' && l.grade.company !== 'raw') return false;
      if (minPrice && l.price < Number(minPrice)) return false;
      if (maxPrice && l.price > Number(maxPrice)) return false;
      if (freeShip && l.shipping !== 0) return false;
      if (listType !== 'all' && l.type !== listType) return false;
      return true;
    });

    if (sort === 'Price: low to high') res = [...res].sort((a, b) => a.price - b.price);
    if (sort === 'Price: high to low') res = [...res].sort((a, b) => b.price - a.price);
    if (sort === 'Ending soonest') res = [...res].sort((a, b) => (a.type === 'auction' ? 0 : 1) - (b.type === 'auction' ? 0 : 1));
    if (sort === 'Most watched') res = [...res].sort((a, b) => (b.watchers || 0) - (a.watchers || 0));

    return res;
  }, [q, game, setF, cond, minPrice, maxPrice, freeShip, listType, sort]);

  const activeFilters = [
    game !== 'all', setF !== 'all', cond !== 'Any grade',
    freeShip, listType !== 'all', minPrice !== '', maxPrice !== '',
  ].filter(Boolean).length;

  const resetFilters = () => {
    setGame('all');
    setSetF('all');
    setCond('Any grade');
    setMinPrice('');
    setMaxPrice('');
    setFreeShip(false);
    setListType('all');
  };

  const showSuggestions = focused && !q;

  return (
    <Flex direction="column" style={{ height: '100%', minHeight: 0 }}>
      {/* Search header */}
      <Box px="3" pt="3" pb="2" style={{ borderBottom: '1px solid var(--gray-a3)' }}>
        <Flex align="center" gap="2">
          <Flex
            align="center"
            gap="2"
            px="3"
            style={{
              flex: 1,
              background: 'var(--gray-a2)',
              borderRadius: 10,
              padding: '8px 12px',
              border: '1px solid var(--gray-a4)',
            }}
          >
            <SearchIcon size={18} style={{ color: 'var(--gray-9)', flexShrink: 0 }} />
            <input
              ref={inputRef}
              value={q}
              onChange={e => setQ(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder={'Try "' + typed + '"'}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 15,
                color: 'var(--gray-12)',
                minWidth: 0,
                fontFamily: 'inherit',
              }}
            />
            {q && (
              <button
                onClick={() => setQ('')}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--gray-9)', padding: 0, lineHeight: 1,
                }}
              >
                <X size={16} />
              </button>
            )}
          </Flex>
        </Flex>
      </Box>

      {/* Popular searches / browse by game (when focused + empty) */}
      {showSuggestions && (
        <Box style={{ flex: 1, overflow: 'auto', padding: '16px 16px 96px' }}>
          <Text size="1" weight="bold" color="gray" style={{ display: 'block', marginBottom: 10, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Popular Searches
          </Text>
          <Flex gap="2" wrap="wrap" mb="5">
            {POPULAR.map(p => (
              <FilterChip key={p} active={false} onClick={() => { setQ(p); setFocused(false); }}>
                {p}
              </FilterChip>
            ))}
          </Flex>

          <Text size="1" weight="bold" color="gray" style={{ display: 'block', marginBottom: 10, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Browse by Game
          </Text>
          <Flex direction="column" gap="2">
            {GAMES.map(g => (
              <Button
                key={g.id}
                variant="surface"
                size="2"
                style={{ cursor: 'pointer', justifyContent: 'flex-start' }}
                onClick={() => { setGame(g.id); setFocused(false); }}
              >
                <Flex align="center" gap="3" style={{ width: '100%' }}>
                  <span style={{
                    width: 12, height: 12, borderRadius: 999,
                    background: g.tint, flexShrink: 0,
                  }} />
                  <Text weight="medium" style={{ flex: 1, textAlign: 'left' }}>{g.name}</Text>
                </Flex>
              </Button>
            ))}
          </Flex>
        </Box>
      )}

      {/* Main content (filter bar + results) */}
      {!showSuggestions && (
        <>
          {/* Filter chip bar */}
          <Flex
            gap="2"
            px="3"
            py="2"
            align="center"
            style={{ overflowX: 'auto', flexShrink: 0 }}
          >
            <Button
              variant={activeFilters ? 'solid' : 'outline'}
              size="1"
              onClick={() => setSheet('filters')}
              style={{ borderRadius: 999, cursor: 'pointer', flexShrink: 0 }}
            >
              <SlidersHorizontal size={14} />
              Filters{activeFilters ? ` (${activeFilters})` : ''}
            </Button>
            <FilterChip active={listType === 'buynow'} onClick={() => setListType(listType === 'buynow' ? 'all' : 'buynow')}>
              Buy Now
            </FilterChip>
            <FilterChip active={listType === 'auction'} onClick={() => setListType(listType === 'auction' ? 'all' : 'auction')}>
              Auctions
            </FilterChip>
            <FilterChip active={cond === 'Graded only'} onClick={() => setCond(cond === 'Graded only' ? 'Any grade' : 'Graded only')}>
              Graded
            </FilterChip>
            <FilterChip active={freeShip} onClick={() => setFreeShip(!freeShip)}>
              Free Shipping
            </FilterChip>
          </Flex>

          {/* Result meta bar */}
          <Flex align="center" justify="between" px="3" pb="2">
            <Text size="1" color="gray">
              <Text weight="bold" size="1" style={{ color: 'var(--gray-12)' }}>{results.length}</Text>
              {' '}result{results.length !== 1 ? 's' : ''}
              {setF !== 'all' ? ' in ' + (setById(setF)?.name || '').replace(/\s*\(.*\)/, '') : ''}
            </Text>
            <Flex gap="2" align="center">
              <Button
                variant="ghost"
                size="1"
                onClick={() => setSheet('sort')}
                style={{ cursor: 'pointer', fontSize: 12 }}
              >
                <ArrowUpDown size={14} />
                {sort}
              </Button>
              <Button
                variant="ghost"
                size="1"
                onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
                style={{ cursor: 'pointer' }}
              >
                {view === 'grid' ? <List size={18} /> : <Grid3X3 size={18} />}
              </Button>
            </Flex>
          </Flex>

          {/* Results */}
          <Box style={{ flex: 1, overflow: 'auto', padding: '0 12px 100px' }}>
            {results.length === 0 ? (
              <Flex direction="column" align="center" justify="center" py="9" px="5">
                <Text size="8" style={{ marginBottom: 8 }}>🔍</Text>
                <Text size="3" weight="bold" style={{ marginBottom: 4 }}>No cards match</Text>
                <Text size="2" color="gray" align="center">
                  Try removing a filter or widening your price range.
                </Text>
              </Flex>
            ) : view === 'grid' ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {results.map(l => <ListCard key={l.id} item={l} />)}
              </div>
            ) : (
              <Flex direction="column" gap="1">
                {results.map(l => <ListRow key={l.id} item={l} />)}
              </Flex>
            )}
          </Box>
        </>
      )}

      {/* Filters sheet */}
      <Sheet open={sheet === 'filters'} onClose={() => setSheet(null)} title="Filters">
        <FilterGroup label="Game">
          <Flex gap="2" wrap="wrap">
            <FilterChip active={game === 'all'} onClick={() => setGame('all')}>All</FilterChip>
            {GAMES.map(g => (
              <FilterChip key={g.id} active={game === g.id} onClick={() => setGame(g.id)}>
                {g.short}
              </FilterChip>
            ))}
          </Flex>
        </FilterGroup>

        <FilterGroup label="Set">
          <Flex gap="2" wrap="wrap">
            <FilterChip active={setF === 'all'} onClick={() => setSetF('all')}>All sets</FilterChip>
            {SETS.filter(s => game === 'all' || s.game === game).map(s => (
              <FilterChip key={s.id} active={setF === s.id} onClick={() => setSetF(s.id)}>
                {s.name.replace(/\s*\(.*\)/, '')}
              </FilterChip>
            ))}
          </Flex>
        </FilterGroup>

        <FilterGroup label="Condition">
          <Flex gap="2" wrap="wrap">
            {CONDITIONS.map(c => (
              <FilterChip key={c} active={cond === c} onClick={() => setCond(c)}>
                {c}
              </FilterChip>
            ))}
          </Flex>
        </FilterGroup>

        <FilterGroup label="Price range">
          <Flex gap="2" align="center">
            <TextField.Root
              size="2"
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              style={{ flex: 1 }}
            />
            <Text size="2" color="gray">to</Text>
            <TextField.Root
              size="2"
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              style={{ flex: 1 }}
            />
          </Flex>
        </FilterGroup>

        <FilterGroup label="Listing type">
          <Flex gap="2">
            {[['all', 'All'], ['buynow', 'Buy Now'], ['auction', 'Auction']].map(([v, l]) => (
              <FilterChip key={v} active={listType === v} onClick={() => setListType(v)}>
                {l}
              </FilterChip>
            ))}
          </Flex>
        </FilterGroup>

        <Flex align="center" justify="between" py="3">
          <Text size="2" weight="medium">Free shipping only</Text>
          <Checkbox
            checked={freeShip}
            onCheckedChange={(checked) => setFreeShip(!!checked)}
          />
        </Flex>

        <Button
          size="3"
          style={{ width: '100%', cursor: 'pointer', marginTop: 8 }}
          onClick={() => setSheet(null)}
        >
          Show {results.length} result{results.length !== 1 ? 's' : ''}
        </Button>

        <Button
          variant="ghost"
          size="2"
          color="gray"
          style={{ width: '100%', cursor: 'pointer', marginTop: 4 }}
          onClick={resetFilters}
        >
          Reset all
        </Button>
      </Sheet>

      {/* Sort sheet */}
      <Sheet open={sheet === 'sort'} onClose={() => setSheet(null)} title="Sort by">
        <Flex direction="column">
          {SORTS.map(s => (
            <Flex
              key={s}
              align="center"
              justify="between"
              py="3"
              px="1"
              onClick={() => { setSort(s); setSheet(null); }}
              style={{
                cursor: 'pointer',
                borderBottom: '1px solid var(--gray-a3)',
              }}
            >
              <Text
                size="3"
                weight={sort === s ? 'bold' : 'regular'}
                color={sort === s ? undefined : 'gray'}
              >
                {s}
              </Text>
              {sort === s && <Check size={18} style={{ color: 'var(--accent-9)' }} />}
            </Flex>
          ))}
        </Flex>
      </Sheet>
    </Flex>
  );
}

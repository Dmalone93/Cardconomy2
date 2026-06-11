import React from 'react';
import { Flex, Button } from '@radix-ui/themes';
import { GAMES } from '../data/games';
import { useApp } from '../context/AppContext';

export default function GameChips({ selected, onSelect }) {
  const { prefs } = useApp();
  const visibleGames = GAMES.filter(g => prefs.includes(g.id));

  return (
    <Flex gap="2" wrap="wrap" py="2">
      <Button
        variant={selected == null ? 'solid' : 'outline'}
        size="1"
        radius="full"
        onClick={() => onSelect(null)}
      >
        All
      </Button>
      {visibleGames.map(g => (
        <Button
          key={g.id}
          variant={selected === g.id ? 'solid' : 'outline'}
          size="1"
          radius="full"
          onClick={() => onSelect(g.id)}
          style={selected === g.id ? { background: g.tint } : undefined}
        >
          {g.short}
        </Button>
      ))}
    </Flex>
  );
}

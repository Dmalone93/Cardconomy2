import React from 'react';
import { Flex, Text, Badge } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import CardArt from './CardArt';
import { gradeText } from '../data/games';
import { money } from './helpers';

export default function ListRow({ item }) {
  const navigate = useNavigate();
  const grade = item.grade;
  const isRaw = !grade || grade.company === 'raw';

  return (
    <Flex
      align="center"
      gap="3"
      py="2"
      px="3"
      style={{ cursor: 'pointer', borderBottom: '1px solid var(--gray-a3)' }}
      onClick={() => navigate(`/listing/${item.id}`)}
    >
      <CardArt item={item} w={56} radius={6} showFoil={false} />

      <Flex direction="column" gap="1" style={{ flex: 1, minWidth: 0 }}>
        <Text size="2" weight="bold" style={{
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {item.name}
        </Text>
        {item.subtitle && (
          <Text size="1" color="gray" style={{
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {item.subtitle}
          </Text>
        )}
        <Flex gap="1" align="center">
          {isRaw ? (
            <Badge variant="surface" color="gray" size="1">RAW</Badge>
          ) : (
            <Badge variant="solid" color={
              grade.company === 'psa' ? 'red' :
              grade.company === 'bgs' ? 'gray' :
              grade.company === 'cgc' ? 'blue' : 'gray'
            } size="1">
              {grade.company.toUpperCase()} {grade.grade}
            </Badge>
          )}
        </Flex>
      </Flex>

      <Flex direction="column" align="end" gap="1" style={{ flexShrink: 0 }}>
        <Text size="2" weight="bold">{money(item.price)}</Text>
        {item.shipping === 0 && (
          <Badge variant="soft" color="green" size="1">Free shipping</Badge>
        )}
      </Flex>
    </Flex>
  );
}

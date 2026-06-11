import React from 'react';
import { Card, Text, Flex, Badge } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import CardArt from './CardArt';
import { gradeText } from '../data/games';
import { money } from './helpers';

export default function ListCard({ item }) {
  const navigate = useNavigate();
  const grade = item.grade;
  const isRaw = !grade || grade.company === 'raw';
  const isAuction = item.type === 'auction';

  return (
    <Card
      size="1"
      style={{ cursor: 'pointer', padding: 0, overflow: 'hidden' }}
      onClick={() => navigate(`/listing/${item.id}`)}
    >
      <Flex direction="column" gap="2" p="2">
        <CardArt item={item} w={120} radius={8} />

        <Flex direction="column" gap="1" style={{ minWidth: 0 }}>
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

          <Flex gap="1" align="center" wrap="wrap">
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

          <Text size="3" weight="bold">{money(item.price)}</Text>

          {isAuction && item.timeLeft && (
            <Text size="1" color="orange">
              {item.bids} bids \u00b7 {item.timeLeft}
            </Text>
          )}
        </Flex>
      </Flex>
    </Card>
  );
}

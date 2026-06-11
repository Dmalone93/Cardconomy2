import React from 'react';
import { Dialog, Flex, Text, IconButton } from '@radix-ui/themes';
import { X } from 'lucide-react';

export default function Sheet({ open, onClose, title, children }) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <Dialog.Content
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          top: 'auto',
          margin: 0,
          borderRadius: '16px 16px 0 0',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          animation: 'none',
        }}
      >
        {/* Drag handle */}
        <Flex justify="center" pt="3" pb="1">
          <div style={{
            width: 36, height: 4, borderRadius: 999,
            background: 'var(--gray-a5)',
          }} />
        </Flex>

        {/* Title */}
        {title && (
          <Flex align="center" justify="between" px="4" pb="2">
            <Dialog.Title style={{ margin: 0 }}>
              <Text size="4" weight="bold">{title}</Text>
            </Dialog.Title>
            <Dialog.Close>
              <IconButton variant="ghost" size="1">
                <X size={18} />
              </IconButton>
            </Dialog.Close>
          </Flex>
        )}

        {/* Content */}
        <div style={{ overflow: 'auto', padding: '0 16px 24px', flex: 1 }}>
          {children}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}

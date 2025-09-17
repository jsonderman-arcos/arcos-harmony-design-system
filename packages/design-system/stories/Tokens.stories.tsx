import { Box, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { themeFlat } from '../src';

type TokenRecord = {
  name: string;
  cssVar: string;
  light?: string;
  dark?: string;
};

const tokenRows: TokenRecord[] = Object.values(themeFlat as Record<string, any>)
  .map((token: any) => ({
    name: token.name,
    cssVar: token.var,
    light: token.valuesByMode?.Light,
    dark: token.valuesByMode?.Dark
  }))
  .slice(0, 50);

const meta: Meta = {
  title: 'Tokens/Overview',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
};

type Story = StoryObj<typeof meta>;

export const First50: Story = {
  render: () => (
    <Box p={4} bgcolor="background.default" color="text.primary">
      <Typography variant="h4" gutterBottom>
        Lighthouse Tokens (first 50)
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Raw token values emitted from the Lighthouse Figma collections. Import the CSS files for
        the variable definitions in your application bundle.
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>CSS Var</TableCell>
            <TableCell>Light</TableCell>
            <TableCell>Dark</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tokenRows.map((token) => (
            <TableRow key={token.name}>
              <TableCell>{token.name}</TableCell>
              <TableCell>{token.cssVar}</TableCell>
              <TableCell>{token.light ?? '—'}</TableCell>
              <TableCell>{token.dark ?? '—'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  )
};

export default meta;

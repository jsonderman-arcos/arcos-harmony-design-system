import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Stack,
  Typography
} from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta: Meta = {
  title: 'Theme/Showcase',
  parameters: {
    layout: 'centered'
  }
};

type Story = StoryObj<typeof meta>;

export const Components: Story = {
  render: () => (
    <Stack spacing={4} maxWidth={720} width="100%">
      <Box>
        <Typography variant="h4" gutterBottom>
          Buttons
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <Button variant="contained">Primary</Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="text">Text</Button>
          <Button color="secondary" variant="contained">
            Secondary
          </Button>
        </Stack>
      </Box>

      <Box>
        <Typography variant="h4" gutterBottom>
          Cards
        </Typography>
        <Card>
          <CardHeader title="Example" subheader="MUI Card using Lighthouse overrides" />
          <CardContent>
            <Typography variant="body1">
              The component overrides generated from the lighthouse token pipeline are bundled into
              the published theme. This showcase renders with the exported ThemeOptions.
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box>
        <Typography variant="h4" gutterBottom>
          Elevated Surface
        </Typography>
        <Paper elevation={4} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Lighthouse Dialog Surface
          </Typography>
          <Typography variant="body2">
            Elevated surfaces pick up the `theme-base-background-elevations-highest` CSS variable by
            default, providing consistent contrast and styling across overlays.
          </Typography>
        </Paper>
      </Box>
    </Stack>
  )
};

export default meta;

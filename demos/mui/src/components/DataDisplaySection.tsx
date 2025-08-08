import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemAvatar,
  Avatar,
  ListItemButton,
  Chip,
  Badge,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack
} from '@mui/material';
import { 
  Mail as MailIcon, 
  Drafts as DraftsIcon, 
  Inbox as InboxIcon, 
  Delete as DeleteIcon,
  Face as FaceIcon,
  NotificationsActive as NotificationsIcon
} from '@mui/icons-material';

// Sample data for the table
const createData = (name: string, calories: number, fat: number, carbs: number, protein: number) => {
  return { name, calories, fat, carbs, protein };
};

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const DataDisplaySection: React.FC = () => {
  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Data Display
      </Typography>

      {/* Dividers */}
      <Typography variant="h6" gutterBottom>Dividers</Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" gutterBottom>
          Text above the divider
        </Typography>
        <Divider />
        <Typography variant="body1" sx={{ mt: 1 }}>
          Text below the divider
        </Typography>

        <Box sx={{ display: 'flex', my: 2 }}>
          <Typography variant="body1">Text before</Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
          <Typography variant="body1">Text after</Typography>
        </Box>
      </Box>

      {/* Lists */}
      <Typography variant="h6" gutterBottom>Lists</Typography>
      <Box sx={{ mb: 4 }}>
        <List>
          <ListItem>
            <ListItemText primary="Simple Item 1" secondary="Secondary text" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Simple Item 2" secondary="Secondary text" />
          </ListItem>
          
          <Divider />
          
          <ListItem>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText primary="Inbox" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <DraftsIcon />
            </ListItemIcon>
            <ListItemText primary="Drafts" />
          </ListItem>
          
          <Divider />
          
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <FaceIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="John Doe" secondary="john@example.com" />
          </ListItem>
          
          <Divider />
          
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary="Interactive List Item" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* Chips */}
      <Typography variant="h6" gutterBottom>Chips</Typography>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip label="Basic" />
          <Chip label="Primary" color="primary" />
          <Chip label="Success" color="success" />
          <Chip label="Warning" color="warning" />
          <Chip label="Error" color="error" />
        </Stack>
        
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Chip label="Outlined" variant="outlined" />
          <Chip label="Primary" color="primary" variant="outlined" />
          <Chip label="Deletable" onDelete={() => {}} />
          <Chip icon={<FaceIcon />} label="With Icon" />
          <Chip label="Clickable" onClick={() => {}} />
        </Stack>
      </Box>

      {/* Badges */}
      <Typography variant="h6" gutterBottom>Badges</Typography>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
          <Badge badgeContent={4} color="primary">
            <MailIcon />
          </Badge>
          <Badge badgeContent={10} color="secondary">
            <MailIcon />
          </Badge>
          <Badge badgeContent={100} max={99} color="error">
            <MailIcon />
          </Badge>
          <Badge badgeContent={0} showZero color="primary">
            <MailIcon />
          </Badge>
          <Badge color="success" variant="dot">
            <NotificationsIcon />
          </Badge>
        </Stack>
      </Box>

      {/* Tooltips */}
      <Typography variant="h6" gutterBottom>Tooltips</Typography>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2}>
          <Tooltip title="Delete">
            <DeleteIcon />
          </Tooltip>
          <Tooltip title="Basic tooltip with longer text that wraps">
            <Box>Hover me</Box>
          </Tooltip>
          <Tooltip title="Top placement" placement="top">
            <Box>Top</Box>
          </Tooltip>
          <Tooltip title="Right placement" placement="right">
            <Box>Right</Box>
          </Tooltip>
          <Tooltip title="Bottom placement" placement="bottom">
            <Box>Bottom</Box>
          </Tooltip>
          <Tooltip title="Left placement" placement="left">
            <Box>Left</Box>
          </Tooltip>
        </Stack>
      </Box>

      {/* Table */}
      <Typography variant="h6" gutterBottom>Table</Typography>
      <Box sx={{ mb: 4 }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Dessert (100g serving)</TableCell>
                <TableCell align="right">Calories</TableCell>
                <TableCell align="right">Fat&nbsp;(g)</TableCell>
                <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                <TableCell align="right">Protein&nbsp;(g)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Paper>
  );
};

export default DataDisplaySection;

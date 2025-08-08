import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs,
  Tab,
  Breadcrumbs,
  Link,
  Pagination,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack
} from '@mui/material';
import {
  NavigateNext as NavigateNextIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const NavigationSection: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [page, setPage] = useState(1);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Navigation & Layout
      </Typography>

      {/* Tabs */}
      <Typography variant="h6" gutterBottom>Tabs</Typography>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Tab One" />
            <Tab label="Tab Two" />
            <Tab label="Tab Three" />
          </Tabs>
        </Box>
        <TabPanel value={tabValue} index={0}>
          Content for Tab One
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          Content for Tab Two
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          Content for Tab Three
        </TabPanel>
      </Box>

      {/* Breadcrumbs */}
      <Typography variant="h6" gutterBottom>Breadcrumbs</Typography>
      <Box sx={{ mb: 4 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="#">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="#">
            Category
          </Link>
          <Typography color="text.primary">Current Page</Typography>
        </Breadcrumbs>

        <Breadcrumbs separator="›" sx={{ mb: 2 }}>
          <Link underline="hover" color="inherit" href="#">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="#">
            Category
          </Link>
          <Typography color="text.primary">Current Page</Typography>
        </Breadcrumbs>

        <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
          <Link underline="hover" color="inherit" href="#">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="#">
            Category
          </Link>
          <Typography color="text.primary">Current Page</Typography>
        </Breadcrumbs>
      </Box>

      {/* Pagination */}
      <Typography variant="h6" gutterBottom>Pagination</Typography>
      <Box sx={{ mb: 4 }}>
        <Stack spacing={2}>
          <Pagination count={10} page={page} onChange={handlePageChange} />
          <Pagination count={10} color="primary" />
          <Pagination count={10} color="secondary" />
          <Pagination count={10} disabled />
          <Pagination count={10} variant="outlined" shape="rounded" />
          <Pagination count={10} showFirstButton showLastButton />
          <Pagination count={10} size="small" />
          <Pagination count={10} size="large" />
        </Stack>
      </Box>

      {/* Cards */}
      <Typography variant="h6" gutterBottom>Cards</Typography>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardHeader
                title="Card Title"
                subheader="September 14, 2023"
              />
              <CardMedia
                component="img"
                height="140"
                image="https://source.unsplash.com/random/900×700/?nature"
                alt="green iguana"
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  This is a media card. You can use this section to describe the content. This content is a little bit longer.
                </Typography>
              </CardContent>
              <CardActions>
                <Box sx={{ ml: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Last updated 3 mins ago
                  </Typography>
                </Box>
              </CardActions>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Outlined Card
                </Typography>
                <Typography variant="body2">
                  This is an outlined card with some content.
                  <br />
                  {'"a benevolent smile"'}
                </Typography>
              </CardContent>
              <CardActions>
                <Box sx={{ ml: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Action text
                  </Typography>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Accordion */}
      <Typography variant="h6" gutterBottom>Accordions</Typography>
      <Box sx={{ mb: 4 }}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Accordion 1</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
              malesuada lacus ex, sit amet blandit leo lobortis eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Accordion 2</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
              malesuada lacus ex, sit amet blandit leo lobortis eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion disabled>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography>Disabled Accordion</Typography>
          </AccordionSummary>
        </Accordion>
      </Box>

      {/* Grid System */}
      <Typography variant="h6" gutterBottom>Grid System</Typography>
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: 'primary.light', color: 'white', textAlign: 'center' }}>
              xs=12
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, bgcolor: 'secondary.light', color: 'white', textAlign: 'center' }}>
              xs=6
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper sx={{ p: 2, bgcolor: 'secondary.light', color: 'white', textAlign: 'center' }}>
              xs=6
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'white', textAlign: 'center' }}>
              xs=3
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'white', textAlign: 'center' }}>
              xs=3
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'white', textAlign: 'center' }}>
              xs=3
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper sx={{ p: 2, bgcolor: 'error.light', color: 'white', textAlign: 'center' }}>
              xs=3
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default NavigationSection;

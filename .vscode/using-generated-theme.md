import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: true,
  shape: {
    borderRadiusRound: 999,
  },
  components: {
    MuiSwitch: {
      styleOverrides: {
        root: {
          '&.MuiSwitch-sizeMedium:has(.MuiSwitch-colorPrimary)': {
            '&:has(.Mui-checked):not(:has(.Mui-disabled)):not(:has(.Mui-focusVisible))':
              {
                width: '40px',
                height: '21px',
                padding: '0',
                '& .MuiSwitch-switchBase': {
                  transform: 'translateX(19px) translateY(2px)',
                  padding: '0',
                  '& .MuiSwitch-thumb': {
                    width: '17px',
                    height: '17px',
                    background: '#FAFAFA',
                  },
                  '& + .MuiSwitch-track': {
                    width: '38px',
                    height: '21px',
                    background: 'var(--mui-palette-success-light)',
                    borderRadius: 'var(--mui-shape-borderRadiusRound)',
                    opacity: '1',
                  },
                },
              },
          },
        },
      },
    },
  },
});

export default function MyApp(props) {
  const { Component, pageProps } = props;

  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

import React from 'react';
import './App.css';
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";

import Montserrat from '../../fonts/Montserrat/Montserrat-VariableFont_wght.ttf';
import {Home} from "../home/Home";


function App() {
    const theme = createTheme({
        components: {
            MuiCssBaseline: {
                styleOverrides: `
        @font-face {
          font-family: 'Montserrat';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: url(${Montserrat}) format('ttf');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
      `,
            },
        },
        palette: {
            type: 'light',
            primary: {
                main: '#c89110',
                light: '#f6f1ee',
                dark: '#80003e',
                contrastText: '#ffffff',
            },
            secondary: {
                main: '#619afc',
                light: '#99caff',
                dark: '#00326e',
                contrastText: '#ffffff',
            },
            info: {
                main: '#18ffff',
                light: '#76ffff',
                dark: '#00cbcc',
            },
        },
        typography: {
            fontFamily: 'Montserrat, Arial',
            h2: {
                lineHeight: 1,
                fontWeight: '500',
                fontSize: "3rem",
            },
            h3: {
                lineHeight: 1,
                fontWeight: '500',
                fontSize: "3rem",
            },
            h4: {
                lineHeight: 1,
                fontWeight: '500',
                fontSize: "2rem",
            },
            subtitle1: {
                fontSize: "1.2rem",
            },
            subtitle2: {
                fontWeight: '400',
                fontSize: "1.2rem",
            }
        }
    });
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Home/>
        </ThemeProvider>
    );
}

export default App;

import React from 'react';
import './App.css';
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {Home} from "../home/Home";


function App() {
    const theme = createTheme({
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

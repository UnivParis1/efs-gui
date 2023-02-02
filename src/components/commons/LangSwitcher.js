import React, {useContext} from 'react';
import {Context} from "./IntlWrapper";
import {Stack, styled, Switch, Typography} from "@mui/material";


const StyledSwitch = styled(Switch)(({theme}) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: '#fff',
        width: 32,
        height: 32,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));

const LangSwitcher = () => {
    const context = useContext(Context);
    return (
        <Stack direction="row" spacing={1} alignItems="center">
            <Typography>Fr</Typography>
            <StyledSwitch checked={context.locale === 'en'} inputProps={{'aria-label': 'choose language'}}
                          onChange={(e) => context.selectLanguage(e.target.checked ? 'en' : 'fr')}/>
            <Typography>En</Typography>
        </Stack>
    )
}

export default LangSwitcher
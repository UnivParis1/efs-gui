import React, {useContext} from 'react';
import {Context} from "./IntlWrapper";
import {Stack, Typography} from "@mui/material";
import StyledSwitch from "./StyledSwitch";


const LangSwitcher = (textProps) => {
    const context = useContext(Context);
    return (
        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ml: "3px"}}>
            <Typography {...textProps}>Fr</Typography>
            <StyledSwitch checked={context.locale === 'en'} inputProps={{'aria-label': 'choose language'}}
                          onChange={(e) => context.selectLanguage(e.target.checked ? 'en' : 'fr')}/>
            <Typography {...textProps}>En</Typography>
        </Stack>
    )
}

export default LangSwitcher
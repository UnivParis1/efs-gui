import React, {useContext} from 'react';
import {Context} from "./IntlWrapper";
import {Link, Stack, Typography} from "@mui/material";
import StyledSwitch from "./StyledSwitch";


const LangSwitcher = (textProps) => {
    const context = useContext(Context);
    return (<Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ml: "3px"}}>
        <Link color="inherit" sx={{textDecoration: "none", cursor: "pointer"}}
              onClick={() => context.selectLanguage('fr')}>
            <Typography {...textProps}>Fr</Typography>
        </Link>
        <StyledSwitch checked={context.locale === 'en'} inputProps={{'aria-label': 'choose language'}}
                      onChange={(e) => context.selectLanguage(e.target.checked ? 'en' : 'fr')}/>
        <Link color="inherit"
              sx={{textDecoration: "none", cursor: "pointer"}} onClick={() => context.selectLanguage('en')}>
            <Typography {...textProps}>En</Typography>
        </Link>
    </Stack>)
}

export default LangSwitcher
import {IconButton, styled, Tooltip, tooltipClasses, Typography} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import React from "react";
import {useIntl} from "react-intl";

export const HtmlTooltip = styled(({className, ...props}) => (
    <Tooltip {...props} classes={{popper: className}}/>
))(({theme}) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: '#f5f5f9',
        color: 'rgba(0, 0, 0, 0.87)',
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}));
const HelpTooltip = ({msgKey, ...props}) => {
    const intl = useIntl();
    return <HtmlTooltip
        enterTouchDelay={0}
        leaveTouchDelay={5000}
        {...props}
        title={
            <>
                <Typography
                    color='inherit'>{intl.formatMessage({id: `form.tooltip.${msgKey}.title`})}</Typography>
                <p>{intl.formatMessage({id: `form.tooltip.${msgKey}.description`})}</p>
            </>
        }
    >
        <IconButton>
            <HelpOutlineIcon/>
        </IconButton>
    </HtmlTooltip>
}

export default HelpTooltip
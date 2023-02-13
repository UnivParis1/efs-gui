import React from "react";
import Typography from "@mui/material/Typography";
import {FormattedMessage} from "react-intl";
import {Accordion, AccordionDetails, AccordionSummary, Link, useTheme} from "@mui/material";
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';

function ExpandMoreIcon() {
    return null;
}

const InformationPanel = () => {
    const theme = useTheme();
    return <React.Fragment>
        {[1, 2, 3, 4, 5, 6, 7].map((i) => {
            return <Accordion key={`information-panel-section${i}`}>
                <AccordionSummary
                    sx={{backgroundColor: i === 7 ? theme.palette.secondary.light : null}}
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls={`form.info.panel${i}-content`}
                    id={`form.info.panel${i}-header`}
                >
                    <Typography variant="subtitle1" component="h2"><FormattedMessage
                        id={`form.info.panel.title${i}`}/></Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1"><FormattedMessage id={`form.info.panel.desc${i}`}/>{(i === 7) &&
                        <Link target="_blank"
                              rel="noreferrer"
                              href="https://www.pantheonsorbonne.fr/espace-presse">
                            <LaunchTwoToneIcon sx={{verticalAlign: "text-bottom"}}
                                               fontSize="small"/></Link>}</Typography>

                </AccordionDetails>
            </Accordion>
        })}

    </React.Fragment>
}

export default InformationPanel
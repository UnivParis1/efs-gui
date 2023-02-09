import React from "react";
import Typography from "@mui/material/Typography";
import {FormattedMessage} from "react-intl";
import {Accordion, AccordionDetails, AccordionSummary} from "@mui/material";

function ExpandMoreIcon() {
    return null;
}

const InformationPanel = () => {
    return <React.Fragment>
        {[1, 2, 3, 4, 5].map((i) => {
            return <Accordion key={`information-panel-section${i}`}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls={`form.info.panel${i}-content`}
                    id={`form.info.panel${i}-header`}
                >
                    <Typography variant="subtitle1" component="h2"><FormattedMessage
                        id={`form.info.panel.title${i}`}/></Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant="body1"><FormattedMessage id={`form.info.panel.desc${i}`} /></Typography>
                </AccordionDetails>
            </Accordion>
        })}

    </React.Fragment>
}

export default InformationPanel
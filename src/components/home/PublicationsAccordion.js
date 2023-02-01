import * as React from 'react';
import {useCallback} from 'react';
import {styled} from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import isStringBlank from "is-string-blank";
import Highlighter from "react-highlight-words";
import {Box} from "@mui/material";

const Accordion = styled((props) => (
    <MuiAccordion disableGutters elevation={0} square {...props} ml={0}/>
))(({theme}) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}));

const AccordionSummary = styled((props) => (
    <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{fontSize: '0.9rem'}}/>}
        {...props}
    />
))(({theme}) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({theme}) => ({
    padding: theme.spacing(2),
    borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function PublicationsAccordions({publications, preferredLanguage}) {
    const [expanded, setExpanded] = React.useState('panel1');

    const handleChange =
        (panel) => (event, newExpanded) => {
            setExpanded(newExpanded ? panel : false);
        };

    const fieldInPreferredLanguage = useCallback((object, field, preferredLanguage) => {
        const otherLanguage = preferredLanguage === 'fr' ? 'en' : 'fr';
        const preferredFieldName = `${preferredLanguage}_${field}`;
        const otherFieldName = `${otherLanguage}_${field}`;
        return isStringBlank(object[preferredFieldName]) ? object[otherFieldName] : object[preferredFieldName];
    }, [])

    return <div>
        {Object.entries(publications).sort(([,a],[,b]) => b.score-a.score).map((entry) => {
            const key = entry[0];
            let publication = entry[1];
            let abstract = fieldInPreferredLanguage(publication, 'abstract', preferredLanguage);
            return <Accordion key={key} expanded={expanded === key} onChange={handleChange(key)}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography dangerouslySetInnerHTML={{__html: publication['citation_full']}}></Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography sx={{fontWeight: "bold"}}>
                        Titre : {fieldInPreferredLanguage(publication, 'title', preferredLanguage)}
                    </Typography>
                    <Box>
                        Résumé : {isStringBlank(abstract) ? "non disponible" : <Highlighter
                        highlightClassName="highlight"
                        searchWords={Object.values(publication.sents).map((sent) => sent.text)}
                        autoEscape={true}
                        textToHighlight={abstract}
                    />}
                    </Box>
                </AccordionDetails>
            </Accordion>
        })}
    </div>;
}
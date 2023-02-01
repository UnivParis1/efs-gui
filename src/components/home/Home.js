import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
    Box,
    Divider,
    Grid,
    IconButton,
    Slider,
    Stack,
    styled,
    Switch,
    TextField,
    Tooltip,
    tooltipClasses,
    Typography,
    useTheme
} from "@mui/material";
import axios from "axios";
import ColorScheme from "color-scheme"
import isStringBlank from "is-string-blank"
import ReactWordcloud from "react-wordcloud";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import env from "react-dotenv";
import PublicationsAccordions from "./PublicationsAccordion";
import {LoadingButton} from "@mui/lab";

export function Home() {
    const theme = useTheme();
    const [sentence, setSentence] = useState('');
    const [submit, setSubmit] = useState(false);
    const [result, setResult] = useState([]);
    const [filteredResult, setFilteredResult] = useState([]);
    const [publications, setPublications] = useState([]);
    const [precision, setPrecision] = useState(2.0);
    const [name, setName] = useState('');
    const [score, setScore] = useState(0);
    const [colors, setColors] = useState([]);
    const [adaModel, setAdaModel] = useState(false);
    const [includeCoAuthors, setIncludeCoAuthors] = useState(false);
    const [validationEnabled, setValidationEnabled] = useState(true);

    const randomColor = useCallback(() => colors[Math.floor(Math.random() * colors.length)], [colors])

    const HtmlTooltip = styled(({className, ...props}) => (
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

    useEffect(() => {
        const fetchData = () => {
            setValidationEnabled(false)
            axios.post(`${env.API_URL}/search`, {
                sentence: sentence,
                precision: precision,
                model: adaModel ? 'ada' : 'sbert'
            })
                .then(response => {
                    setResult(() => {
                        return Object.values(response.data).map((result) => {
                            return {
                                "text": result.name,
                                "value": result.score,
                                "pubs": result.pubs,
                                "own_inst": result.own_inst,
                                color: randomColor()
                            }
                        })
                    });
                    setSubmit(false)
                });

        };
        if (submit) {
            setPublications([])
            setName("")
            fetchData();
        }
    }, [submit, sentence, precision, randomColor, adaModel])

    useEffect(() => {
        if (includeCoAuthors) {
            setFilteredResult(result);

        } else {
            setFilteredResult(result.filter((e) => e.own_inst === "True"))
        }
    }, [result, includeCoAuthors])

    useEffect(() => {
        const scheme = new ColorScheme();
        scheme.from_hue(21)
            .scheme('triade')
            .variation('soft');
        setColors(scheme.colors());
    }, [])

    useEffect(() => {
        setValidationEnabled(!adaModel && sentence && !isStringBlank(sentence))
    }, [adaModel, sentence])


    const sentencePanel = useMemo(() => {
        return publications ? <PublicationsAccordions publications={publications} preferredLanguage={'fr'}/> : ""
    }, [publications])

    const wordClick = useCallback(word => {
        setPublications(word.pubs);
        setName(word.text);
        setScore(word.value);
    }, [])

    const callbacks = useMemo(() => {
        return {
            onWordClick: wordClick,
            getWordTooltip: word => `Score : ${word.value}`,
            getWordColor: word => {
                return word.text === name ? "black" : `#${word.color}`;
            },
        }
    }, [wordClick, name])

    const cloud = useMemo(() => {
        return <ReactWordcloud
            words={filteredResult}
            callbacks={callbacks}
            options={{"deterministic": true}}
        />
    }, [filteredResult, callbacks])

    return (<Grid container spacing={24}>
            <Grid item md={3}></Grid>
            <Grid item md={6}>
                <Grid container direction="column">
                    <Grid container direction="row" spacing={theme.spacing(4)}>
                        <Grid item md={6}>
                            <Typography variant="h2" sx={{fontSize: "20px", mt: "2em"}}>Recherche d'expertise assistée
                                par l'intelligence artificielle
                            </Typography>
                            <Divider sx={{m: theme.spacing(1)}}/>
                            <Typography variant="h2" sx={{fontSize: "20px", marginY: "0em"}}>AI Powered expert finder
                                system
                            </Typography>
                        </Grid>
                        <Grid item md={6} mt={theme.spacing(3)}>
                            <img src="./p1.svg" width="100%" alt="Paris 1 Panthéon-Sorbonne"/>
                        </Grid>
                    </Grid>
                    <Grid item md={12} mt={theme.spacing(4)}>

                        <Box
                            component="form"
                            noValidate
                            autoComplete="off"
                        ><Grid container direction="row">
                            <Grid item md={6}>
                                <label>Veuillez saisir une phrase (sujet, projet de recherche ou
                                    d'article...) dans la langue de votre choix. La casse du texte est prise en
                                    compte.</label>
                            </Grid>

                            <Grid item md={6} textAlign="end">
                                <Stack direction="row" spacing={1} justifyContent="end">
                                    <Typography>S-Bert</Typography>
                                    <Switch checked={adaModel} inputProps={{'aria-label': 'Choose adaModel'}}
                                            onChange={() => setAdaModel(!adaModel)}/>
                                    <Typography>GPT-3</Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                            <TextField
                                id="outlined-multiline-static"
                                label={<div>
                                    <Typography variant="caption">
                                        Ex. L'animal dans les rites funéraires à l'âge du fer; Corporate governance and
                                        Corporate Social Responsibility.
                                    </Typography>
                                </div>}
                                multiline
                                rows={4}
                                value={sentence}
                                onChange={e => {
                                    setValidationEnabled(true)
                                    setSentence(e.target.value);
                                }}
                                fullWidth
                                sx={{my: theme.spacing(3)}}
                            />
                            <Grid container direction="row" spacing={theme.spacing(2)}>
                                <Grid item md={4}>
                                    <Stack direction="row" alignItems="center" sx={{alignContent: "center"}}>
                                        <HtmlTooltip
                                            my={theme.spacing(3)}
                                            title={
                                                <>
                                                    <Typography color="inherit">Précision</Typography>
                                                    <p>Plus ce paramètre est élevé, plus grande sera la distance
                                                        sémantique de recherche autour de l'énoncé que vous avez
                                                        soumis.</p>
                                                    <ul>
                                                        <li>Un seuil faible favorise la découverte d'auteurs ayant
                                                            produit <em>de rares énoncés</em>&nbsp;<b>très proches
                                                                de
                                                                votre sujet</b>.
                                                        </li>
                                                        <li>Un seuil élevé permet au contraire de détecter des
                                                            auteurs ayant écrit <em>un grand nombre de textes</em>
                                                            &nbsp;<b>plus ou moins en rapport avec votre sujet</b>.
                                                        </li>
                                                    </ul>
                                                </>
                                            }
                                        >
                                            <IconButton>
                                                <HelpOutlineIcon/>
                                            </IconButton>
                                        </HtmlTooltip>
                                        <Typography id="input-slider" mr={2} ml={0}>
                                            Extension
                                        </Typography>
                                        <Slider
                                            aria-label="Extension"
                                            value={precision}
                                            valueLabelDisplay="auto"
                                            valueLabelFormat={(value) => {
                                                const steps = new Map(Object.entries({
                                                    0.2: "Très précis",
                                                    0.3: "Précis",
                                                    0.4: "Approximatif",
                                                    0.5: "Très approximatif",
                                                    1: "Aleatoire",
                                                }))
                                                let minKey = 10;
                                                let selectedLabel;
                                                for (const [key, label] of steps) {
                                                    if (value < key && key < minKey) {
                                                        selectedLabel = label;
                                                        minKey = key;
                                                    }
                                                }
                                                return selectedLabel;
                                            }}
                                            step={0.1}
                                            min={0.1}
                                            max={0.7}
                                            onChange={(e) => {
                                                setValidationEnabled(true)
                                                setPrecision(e.target.value);
                                            }}
                                        />

                                    </Stack>
                                </Grid>
                                <Grid item md={2}><LoadingButton onClick={() => setSubmit(true)} loading={submit}
                                                                 disabled={!validationEnabled}
                                                                 variant="outlined">Valider</LoadingButton></Grid>
                                <Grid item md={6}><Stack direction="row">
                                    <Typography>Limiter aux unités de recherche de Paris 1
                                        Panthéon-Sorbonne</Typography>
                                    <Switch checked={includeCoAuthors}
                                            inputProps={{'aria-label': 'Limit to Paris 1 Pantheon-Sorbonne authors'}}
                                            onChange={() => setIncludeCoAuthors(!includeCoAuthors)}/>
                                    <Typography>Inclure les coauteurs</Typography>
                                </Stack></Grid>

                            </Grid>
                            <Grid container direction="column">
                                <Grid item md={12} sx={{opacity: submit ? 0.3 : 1}}>
                                    {cloud}
                                </Grid>
                                {name &&
                                    <Grid container sx={{mt: theme.spacing(4)}}>
                                        <Grid item xs>
                                            <Typography variant="h5" component="div">
                                                {name}
                                            </Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography gutterBottom variant="h6" component="div">
                                                {score}
                                            </Typography>
                                        </Grid>
                                        <Typography color="text.secondary" variant="body2">
                                            Le degré d'expertise présumé de cet auteur vis à vis de votre requête a été
                                            inféré à partir des titres ou résumés de publications ci-dessous :
                                        </Typography>
                                    </Grid>}
                                <Grid item md={12} sx={{padding: 0}}>
                                    {sentencePanel}
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>

        </Grid>
    );
}

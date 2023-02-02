import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Box, Container, Grid, IconButton, Slider, Stack, TextField, Typography, useTheme} from "@mui/material";
import axios from "axios";
import isStringBlank from "is-string-blank"
import ReactWordcloud from "react-wordcloud";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import env from "react-dotenv";
import PublicationsAccordions from "./PublicationsAccordion";
import {LoadingButton} from "@mui/lab";
import {FormattedMessage, useIntl} from "react-intl";
import LangSwitcher from "../commons/LangSwitcher";
import P1Logo from "./P1Logo";
import StyledSwitch from "../commons/StyledSwitch";
import {BsPeople, BsPeopleFill, BsPerson, BsPersonFill} from "react-icons/bs";
import HelpTooltip, {HtmlTooltip} from "../commons/HelpTooltip";

const COLORS = ["c89108", "927b4b", "6b6760", "46546C", "00326e", "e55302", "9f5740", "765458", "394a59", "00326e"];


export function Home() {
    const intl = useIntl();
    const theme = useTheme();
    const [sentence, setSentence] = useState('');
    const [submit, setSubmit] = useState(false);
    const [result, setResult] = useState([]);
    const [filteredResult, setFilteredResult] = useState([]);
    const [publications, setPublications] = useState([]);
    const [precision, setPrecision] = useState(2.0);
    const [name, setName] = useState('');
    const [color, setColor] = useState("000000");
    const [adaModel, setAdaModel] = useState(false);
    const [includeCoAuthors, setIncludeCoAuthors] = useState(false);
    const [validationEnabled, setValidationEnabled] = useState(true);

    const randomColor = useCallback(() => COLORS[Math.floor(Math.random() * COLORS.length)], [])


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
        setValidationEnabled(!adaModel && sentence && !isStringBlank(sentence))
    }, [adaModel, sentence])


    const sentencePanel = useMemo(() => {
        return publications ? <PublicationsAccordions publications={publications} preferredLanguage={'fr'}/> : ""
    }, [publications])

    const wordClick = useCallback(word => {
        setPublications(word.pubs);
        setName(word.text);
        setColor(word.color);
    }, [])

    const callbacks = useMemo(() => {
        return {
            onWordClick: wordClick,
            getWordColor: word => {
                return word.text === name ? "black" : `#${word.color}`;
            },
        }
    }, [wordClick, name])

    const cloud = useMemo(() => {
        return <ReactWordcloud
            words={filteredResult}
            callbacks={callbacks}
            options={{"deterministic": true, "rotations": 50, "transitionDuration": 500, "enableTooltip": false}}
        />
    }, [filteredResult, callbacks])

    return (
        <Grid container spacing={0}>
            <Grid item md={12} bgcolor={theme.palette.secondary.dark}>
                <Container maxWidth="md">
                    <Grid container direction="row" alignItems="center">
                        <Grid item md={6} xs={5}><Typography component="h1" variant="h3"
                                                             sx={{
                                                                 margin: {md: 1, xs: 1},
                                                                 fontSize: {md: "36px", xs: "24px"},
                                                                 color: theme.palette.secondary.contrastText
                                                             }}>
                            <FormattedMessage
                                id="home.title"
                            /></Typography></Grid>
                        <Grid item md={1} xs={2} sx={{marginLeft: 1, marginRight: 2}}>
                            <P1Logo width="100%" alt="Paris 1 Panthéon-Sorbonne"/>
                        </Grid>
                        <Grid item md={4} xs={4}>
                            <Typography variant="h2"
                                        sx={{
                                            fontSize: {md: "20px", xs: "14px"},
                                            color: theme.palette.secondary.contrastText
                                        }}>
                                <FormattedMessage
                                    id="home.subtitle"
                                />
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Grid>
            <Grid item md={12} bgcolor={theme.palette.primary.light} pt={theme.spacing(2)}>
                <Container maxWidth="md">
                    <Stack direction="column">
                        <Grid container direction="row">
                            <Grid item md={8} xs={12}>
                                <FormattedMessage id="form.help"/>
                            </Grid>
                            <Grid item md={4} xs={12}>
                                <Stack direction="column">
                                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                                        <LangSwitcher/>
                                    </Stack>
                                    <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                                        <HelpTooltip msgKey={"bert-model"}/>
                                        <Typography>S-Bert</Typography>
                                        <StyledSwitch checked={adaModel}
                                                      inputProps={{'aria-label': intl.formatMessage({id: 'form.aria.choose-model'})}}
                                                      onChange={() => setAdaModel(!adaModel)}/>
                                        <Typography>GPT-3</Typography>
                                        <HelpTooltip msgKey={"ada-model"}/>
                                    </Stack>
                                </Stack>
                            </Grid>
                        </Grid>
                        <TextField
                            id="outlined-multiline-static"
                            label={<div>
                                <Typography variant="caption">
                                    <FormattedMessage id="form.aria.placeholder"/>
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
                            sx={{my: theme.spacing(3), backgroundColor: "#FFFFFF"}}
                        />
                        <Grid container direction="row" spacing={theme.spacing(4)} pb={2}>
                            <Grid item md={4}>
                                <Stack direction="row" alignItems="center" sx={{alignContent: "center"}}>
                                    <HtmlTooltip
                                        enterTouchDelay={0}
                                        leaveTouchDelay={5000}
                                        my={theme.spacing(3)}
                                        title={
                                            <>
                                                <Typography
                                                    color='inherit'>{intl.formatMessage({id: 'form.tooltip.extension.title'})}</Typography>
                                                <p>{intl.formatMessage({id: 'form.tooltip.extension.description'})}</p>
                                                <ul>
                                                    <li>{intl.formatMessage({id: 'form.tooltip.extension.li1'})}</li>
                                                    <li>{intl.formatMessage({id: 'form.tooltip.extension.li2'})}</li>
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
                                                             variant="contained">Valider</LoadingButton></Grid>
                            <Grid item md={6}><Stack direction="row" alignItems="center" justifyContent="end"
                                                     spacing={2}>
                                <HelpTooltip msgKey={"include-coauthors"}/>
                                {!includeCoAuthors && <BsPersonFill fontSize="28px"/>}
                                {includeCoAuthors && <BsPerson fontSize="28px"/>}
                                <StyledSwitch checked={includeCoAuthors}
                                              inputProps={{'aria-label': 'Limit to Paris 1 Pantheon-Sorbonne authors'}}
                                              onChange={() => setIncludeCoAuthors(!includeCoAuthors)}/>
                                {includeCoAuthors && <BsPeopleFill fontSize="28px"/>}
                                {!includeCoAuthors && <BsPeople fontSize="28px"/>}
                                <HelpTooltip msgKey={"exclude-coauthors"}/>
                            </Stack></Grid>

                        </Grid>

                    </Stack>
                </Container>
            </Grid>
            <Container maxWidth="md">
                <Box
                    component="form"
                    noValidate
                    autoComplete="off"
                ><Grid container direction="column">
                    <Grid item md={12} sx={{opacity: submit ? 0.3 : 1, mt: 2, mb: 2}}>
                        {cloud}
                    </Grid>
                    {name &&
                        <Grid container direction={"row"}>
                            <Grid item md={4} xs={12}>
                                <Typography variant="h5" sx={{color: `#${color}`}} component="div">
                                    {name}
                                </Typography>
                            </Grid>
                            <Grid item md={8}  xs={12}>
                                <Typography color="text.secondary" variant="body2">
                                    <FormattedMessage id="result.help.scoring"/>
                                </Typography>
                            </Grid>
                        </Grid>}
                    <Grid item md={12} sx={{padding: 0, mt: 1}}>
                        {sentencePanel}
                    </Grid>
                </Grid>
                </Box>
            </Container>
        </Grid>
    )
}

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
    Box,
    Button,
    Chip,
    Divider,
    Grid,
    IconButton,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
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

export function Home() {
    const theme = useTheme();
    const [sentence, setSentence] = useState('');
    const [submit, setSubmit] = useState(false);
    const [result, setResult] = useState([]);
    const [sentences, setSentences] = useState([]);
    const [precision, setPrecision] = useState(2.0);
    const [name, setName] = useState('');
    const [score, setScore] = useState(0);
    const [colors, setColors] = useState([]);
    const [adaModel, setAdaModel] = useState(false);
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
                        return response.data.map((result) => {
                            return {
                                "text": result.name,
                                "value": result.score,
                                "sentences": result.texts,
                                color: randomColor()
                            }
                        })
                    });
                    setSubmit(false)
                });

        };
        if (submit) {
            setSentences([])
            setName("")
            fetchData();
        }
    }, [submit, sentence, precision, randomColor, adaModel])

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
        return sentences.map((sentence) => {
            return <>
                <ListItem key={Math.random()}>
                    <ListItemText primary={sentence}/>
                </ListItem>
                <Divider/>
            </>
        })
    }, [sentences])

    const wordClick = useCallback(word => {
        setSentences(word.sentences);
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
            words={result}
            callbacks={callbacks}
            options={{"deterministic": true}}
        />
    }, [result, callbacks])

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
                                    <Typography>Bert</Typography>
                                    <Switch checked={adaModel} inputProps={{'aria-label': 'Choose adaModel'}}
                                            onChange={() => setAdaModel(!adaModel)}/>
                                    <Typography>OpenAI</Typography>
                                </Stack>
                                <Stack direction="column" spacing={1} textAlign="center">
                                    {adaModel &&
                                        <Typography>Ce modèle de langage n'est pas disponible actuellement
                                            :</Typography>}
                                    {!adaModel && <Typography>Vous utilisez le modèle de langage :</Typography>}
                                    {adaModel && <Chip label="OpenAI / text-embedding-ada-002"
                                                       variant="filled"/>}
                                    {!adaModel && <Chip label="SentenceBert / paraphrase-multilingual-mpnet-base-v2"
                                                        variant="outlined"/>}
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
                                <Grid item md={5}>
                                    <Grid container direction="row" spacing={theme.spacing(2)}>
                                        <Grid item md={2}>
                                            <HtmlTooltip
                                                my={theme.spacing(3)}
                                                title={
                                                    <React.Fragment>
                                                        <Typography color="inherit">Extension sémantique</Typography>
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
                                                    </React.Fragment>
                                                }
                                            >
                                                <IconButton>
                                                    <HelpOutlineIcon/>
                                                </IconButton>
                                            </HtmlTooltip>

                                        </Grid>
                                        <Grid item md={10}>
                                            <Typography id="input-slider" gutterBottom>
                                                Extension sémantique
                                            </Typography>
                                            <Slider
                                                aria-label="Précision"
                                                value={precision}
                                                valueLabelDisplay="auto"
                                                step={0.1}
                                                marks
                                                min={1}
                                                max={4}
                                                onChange={(e) => {
                                                    setValidationEnabled(true)
                                                    setPrecision(e.target.value);
                                                }}
                                            /></Grid>

                                    </Grid>
                                </Grid>
                                <Grid item md={2}><Button onClick={() => setSubmit(true)} disabled={!validationEnabled}
                                                          variant="outlined">Valider</Button></Grid>
                                <Grid item md={4}
                                      sx={{visibility: submit ? "visible" : "hidden"}}><LinearProgress/></Grid>

                            </Grid>
                            <Grid container direction="column" spacing={theme.spacing(2)}>
                                <Grid item md={12}>
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
                                            inféré à partir des titres ou extraits de résumés d'articles ci-dessous :
                                        </Typography>
                                    </Grid>}
                                <Grid item md={12}>
                                    <List aria-label="texts pieces">
                                        {sentencePanel}
                                    </List></Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Grid>

        </Grid>
    );
}

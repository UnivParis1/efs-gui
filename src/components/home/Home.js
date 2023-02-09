import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
    Alert,
    AlertTitle,
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia, Chip,
    Container,
    Fade,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    Link,
    Slider,
    Snackbar,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import axios from "axios";
import isStringBlank from "is-string-blank"
import ReactWordcloud from "react-wordcloud";
import RICIBs from 'react-individual-character-input-boxes';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import PublicationsAccordions from "./PublicationsAccordion";
import {LoadingButton} from "@mui/lab";
import {FormattedMessage, useIntl} from "react-intl";
import LangSwitcher from "../commons/LangSwitcher";
import P1Logo from "./P1Logo";
import StyledSwitch from "../commons/StyledSwitch";
import {BsPeople, BsPeopleFill, BsPerson, BsPersonFill} from "react-icons/bs";
import HelpTooltip, {HtmlTooltip} from "../commons/HelpTooltip";
import {MdCloud, MdOutlineCloud, MdOutlineList, MdOutlineSearch, MdOutlineViewList} from "react-icons/md";
import ResultsList from "../commons/ResultsList";
import InformationPanel from "../commons/InformationPanel";

const COLORS = ["c89108", "927b4b", "6b6760", "46546C", "00326e", "e55302", "9f5740", "765458", "394a59", "00326e"];


const CODE_LENGTH = 4;

const MAX_SENTENCE_LENGTH = 400;

export function Home() {
    const intl = useIntl();
    const theme = useTheme();
    const large = useMediaQuery((theme) => theme.breakpoints.up('sm'));
    const [sentence, setSentence] = useState('');
    const [submit, setSubmit] = useState(false);
    const [result, setResult] = useState([]);
    const [filteredResult, setFilteredResult] = useState([]);
    const [selectedAuthor, setSelectedAuthor] = useState(undefined)
    const [publications, setPublications] = useState([]);
    const [precision, setPrecision] = useState(0.2);
    const [name, setName] = useState('');
    const [color, setColor] = useState("000000");
    const [adaModel, setAdaModel] = useState(false);
    const [displayMode, setDisplayMode] = useState('cloud');
    const [includeCoAuthors, setIncludeCoAuthors] = useState(false);
    const [validationEnabled, setValidationEnabled] = useState(true);
    const [rateLimitAlert, setRateLimitAlert] = React.useState(false);
    const [errorAlert, setErrorAlert] = React.useState(false);
    const [noResultsAlert, setNoResultsAlert] = React.useState(false);
    const [displayInfoPanel, setDisplayInfoPanel] = React.useState(true);
    const [firstDisplay, setFirstDisplay] = React.useState(true);
    const [errorMessage, setErrorMessage] = React.useState("");
    const [maintenanceMessage, setMaintenanceMessage] = React.useState(undefined);
    const [captchaSalt, setCaptchaSalt] = React.useState(Math.random());
    const [captchaCode, setCaptchaCode] = React.useState('');
    const [offlineApp, setOfflineApp] = React.useState(false);

    const randomColor = useCallback(() => COLORS[Math.floor(Math.random() * COLORS.length)], [])

    useEffect(() => {
        if (process.env.REACT_APP_APP_STATE === 'offline') {
            setOfflineApp(true)
            setMaintenanceMessage("home.offline.message")
        }
    }, [])


    useEffect(() => {
        const fetchData = () => {
            setValidationEnabled(false)
            axios.post(`${process.env.REACT_APP_API_URL}/search`, {
                sentence: sentence, precision: precision, model: adaModel ? 'ada' : 'sbert', code: captchaCode
            }, {
                withCredentials: true,
                headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'}
            })
                .then(response => {
                    setResult(() => {
                        return Object.values(response.data).map((result) => {
                            return {
                                "text": result.name,
                                "value": result.score,
                                "pubs": result.pubs,
                                "own_inst": result.own_inst,
                                "max_score": result.max_score,
                                "min_dist": result.min_dist,
                                "identifier": result.identifier,
                                color: randomColor()
                            }
                        })
                    });
                    renewCaptcha();
                    setFirstDisplay(false);
                    setDisplayInfoPanel(false);
                    setSubmit(false)
                }).catch(error => {
                const errorData = error.toJSON();
                if (errorData.status === 429) {
                    setRateLimitAlert(true);
                } else if (errorData.status === 422) {
                    setErrorAlert(true);
                    setErrorMessage("form.error.captcha")
                    renewCaptcha();
                } else {
                    setErrorAlert(true);
                    setErrorMessage("form.error.unknown");
                }
                setSubmit(false);
                setValidationEnabled(true);
            });

        };
        if (submit) {
            setSelectedAuthor(undefined);
            setPublications([])
            setName(undefined)
            fetchData();
        }
    }, [submit, sentence, precision, randomColor, adaModel, captchaCode])

    const renewCaptcha = () => {
        setCaptchaCode('');
        setCaptchaSalt(Math.random());
    }

    useEffect(() => {
        let computedResult = result
        if (!includeCoAuthors) {
            computedResult = computedResult.filter((e) => e.own_inst === "True")
        }
        setFilteredResult(computedResult);
        setNoResultsAlert(computedResult.length === 0)
    }, [result, includeCoAuthors])

    useEffect(() => {
        setValidationEnabled(precision && sentence && !isStringBlank(sentence) && !(adaModel && captchaCode.length !== CODE_LENGTH) && !offlineApp)
    }, [adaModel, sentence, captchaCode, precision, offlineApp])


    const sentencePanel = useMemo(() => {
        return publications ? <PublicationsAccordions publications={publications} preferredLanguage={'fr'}/> : ""
    }, [publications])

    const wordClickList = useCallback(word => {
        if (selectedAuthor === word.identifier) {
            setSelectedAuthor(undefined);
            setPublications([]);
            setName(undefined);
            setColor(undefined);
        } else {
            setSelectedAuthor(word.identifier);
            setPublications(word.pubs);
            setName(word.text);
            setColor(word.color);
        }

    }, [selectedAuthor])

    const wordClickCloud = useCallback(word => {
        setSelectedAuthor(word.identifier);
        setPublications(word.pubs);
        setName(word.text);
        setColor(word.color);


    }, [])

    const callbacks = useMemo(() => {
        return {
            onWordClick: wordClickCloud, getWordColor: word => {
                return word.text === name ? "black" : `#${word.color}`;
            },
        }
    }, [wordClickCloud, name])

    const cloud = useMemo(() => {
        return <ReactWordcloud
            words={filteredResult}
            callbacks={callbacks}
            options={{"deterministic": true, "rotations": 50, "transitionDuration": 500, "enableTooltip": false}}
        />
    }, [filteredResult, callbacks])

    const handleClose = useCallback(() => {
        setRateLimitAlert(false);
        setErrorAlert(false);
    }, []);

    const rateAlertSnack = useMemo(() => {
        return <Snackbar open={rateLimitAlert} autoHideDuration={2000} onClose={handleClose} anchorOrigin={{
            vertical: 'top', horizontal: 'center',
        }}>
            <Alert onClose={handleClose} severity="warning" variant="filled" sx={{width: '100%'}}>
                <FormattedMessage id="form.error.rate_limit"/>
            </Alert>
        </Snackbar>
    }, [rateLimitAlert, handleClose])

    const errorAlertSnack = useMemo(() => {
        return <Snackbar open={errorAlert} autoHideDuration={10000} onClose={handleClose} anchorOrigin={{
            vertical: 'top', horizontal: 'center',
        }}>
            <Alert onClose={handleClose} severity="error" variant="filled" sx={{width: '100%'}}>
                <FormattedMessage id={errorMessage}/>
            </Alert>
        </Snackbar>
    }, [errorAlert, errorMessage, handleClose])

    const maintenanceAlert = useMemo(() => {
        return <Alert severity="error" variant="filled" sx={{width: '100%', justifyContent: 'center', borderRadius: 0}}>
            <FormattedMessage id={maintenanceMessage}/>
        </Alert>
    }, [maintenanceMessage])

    const list = useMemo(() => {
        return <ResultsList
            authors={filteredResult}
            selectedAuthor={selectedAuthor}
            onClick={wordClickList}
            publicationsPanel={sentencePanel}
        />
    }, [filteredResult, sentencePanel, selectedAuthor, wordClickList])

    const captcha = useMemo(() => {
            return <Grid item md={4} xs={12} mt={{md: 3, xs: 1}} justifyContent={{xs: "center"}}>
                <Card sx={{maxWidth: {md: 245}}}>
                    < CardMedia
                        sx={{height: 110}}
                        image={`${process.env.REACT_APP_API_URL}/captcha?salt=${captchaSalt}`}
                        title="green iguana"
                    />
                    <CardContent sx={{mb: 0, pb: 0, pt: 0, textAlign: 'center'}}>
                        <Typography gutterBottom variant="body2" component="div">
                            <FormattedMessage id="form.help.captcha"/>
                        </Typography>
                        <RICIBs
                            amount={CODE_LENGTH}
                            inputRegExp={/^[A-Za-z0-9]$/}
                            handleOutputString={setCaptchaCode}
                            inputProps={
                                {
                                    className: "1fa-box",
                                    style: {"color": "orange", width: "40px"},
                                    placeholder: "_"
                                }}
                        />

                    </CardContent>
                    <CardActions sx={{justifyContent: "center"}}>
                        <Button size="medium" onClick={renewCaptcha}>Changer de code</Button>
                    </CardActions>
                </Card></Grid>
        }, [captchaSalt]
    )

    return (<>{maintenanceMessage && maintenanceAlert}
            {rateAlertSnack}
            {errorAlertSnack}
            <Grid container spacing={0}>
                <Grid item md={12} bgcolor={theme.palette.secondary.dark}>
                    <Container maxWidth="md">
                        <Grid container direction="row" alignItems="center">
                            <Grid item md={6} xs={5} sx={{display: {xs: "none", sm: "block"}}}>
                                <Stack direction="row"><Typography
                                    component="h1"
                                    variant="h3"
                                    sx={{
                                        fontWeight: "bold",
                                        margin: {
                                            md: 1, xs: 1
                                        }, fontSize: {
                                            md: "30px", sm: "32px", xs: "20px"
                                        }, color: theme.palette.secondary.contrastText
                                    }}>
                                    <FormattedMessage
                                        id="home.title"
                                    />{process.env.REACT_APP_STATE}</Typography><Chip label="bêta" size="small"
                                                                                      sx={{
                                                                                          backgroundColor: theme.palette.secondary.contrastText,
                                                                                          color: theme.palette.secondary.dark
                                                                                      }}
                                                                                      variant="filled"/></Stack> </Grid>
                            <Grid item md={1} xs={2} sx={{marginLeft: 1, marginRight: 2}}>
                                <P1Logo width="100%" alt="Paris 1 Panthéon-Sorbonne"/>
                            </Grid>
                            <Grid item md={4} sm={4} xs={9}>
                                <Typography variant="h2"
                                            sx={{
                                                fontSize: {md: "20px", sm: "20px", xs: "16px"},
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
                                <Grid item md={8} xs={12} sx={{mb: {xs: 2}}}>
                                    <FormattedMessage id="form.help"/>
                                    <br/>{!firstDisplay && <Button
                                    variant="text"
                                    onClick={() => setDisplayInfoPanel((!displayInfoPanel))}>{intl.formatMessage({id: displayInfoPanel ? "form.help.mask_information" : "form.help.display_information"})}</Button>}
                                </Grid>
                                <Grid item md={4} xs={12}>
                                    <Stack direction="column">
                                        <LangSwitcher/>
                                        <Stack direction="row" justifyContent="center" alignItems="center">
                                            <HelpTooltip msgKey={"bert-model"}>
                                                <Typography variant="caption"><a href="http://arxiv.org/abs/1908.10084"
                                                                                 target="_blank" rel="noreferrer">Reimers,
                                                    Nils et al. "Sentence-BERT: Sentence Embeddings
                                                    using Siamese BERT-Networks." Proceedings of the 2019 Conference on
                                                    Empirical Methods in Natural Language Processing. Association for
                                                    Computational Linguistics, 2019.</a></Typography>
                                            </HelpTooltip>
                                            <Link color="inherit" sx={{textDecoration: "none", cursor: "pointer"}}
                                                  onClick={() => setAdaModel(false)}>
                                                <Typography>S-Bert</Typography></Link>
                                            <StyledSwitch checked={adaModel}
                                                          inputProps={{'aria-label': intl.formatMessage({id: 'form.aria.choose-model'})}}
                                                          onChange={() => setAdaModel(!adaModel)}/>
                                            <Link color="inherit" sx={{textDecoration: "none", cursor: "pointer"}}
                                                  onClick={() => setAdaModel(true)}>
                                                <Typography>GPT-3</Typography>
                                            </Link>
                                            <HelpTooltip msgKey={"ada-model"}/>
                                        </Stack>
                                    </Stack>
                                </Grid>
                            </Grid>
                            <Grid container spacing={theme.spacing(2)}>
                                <Grid item md={adaModel ? 8 : 12} xs={12}>
                                    <FormControl fullWidth sx={{
                                        my: {md: theme.spacing(3)}
                                    }}>
                                        <TextField
                                            id="outlined-multiline-static"
                                            label={<div>
                                                <Typography variant="caption">
                                                    <FormattedMessage id="form.aria.placeholder"/>
                                                </Typography>
                                            </div>}
                                            multiline
                                            rows={!large ? 2 : (adaModel ? 8 : 2)}
                                            value={sentence}
                                            onChange={e => {
                                                setSentence(e.target.value);
                                            }}
                                            inputProps={{maxLength: MAX_SENTENCE_LENGTH}}
                                            sx={{
                                                backgroundColor: "#FFFFFF"
                                            }}
                                        />
                                        <FormHelperText id="form-helper-text"
                                                        sx={{textAlign: "right"}}>{`${sentence.length} cars / ${MAX_SENTENCE_LENGTH}`}</FormHelperText>
                                    </FormControl></Grid>{adaModel && captcha}
                            </Grid>
                            <Grid container direction="row" pb={2} pt={{xs: 2, md: 0}} sx={{alignItems: "center"}}>
                                <Grid item md={4} xs={7}>
                                    <Stack direction="row" alignItems="center" sx={{alignItems: "center"}}>
                                        <HtmlTooltip
                                            enterTouchDelay={0}
                                            leaveTouchDelay={5000}
                                            my={theme.spacing(3)}
                                            title={<>
                                                <Typography
                                                    color='inherit'>{intl.formatMessage({id: 'form.tooltip.extension.title'})}</Typography>
                                                <p>{intl.formatMessage({id: 'form.tooltip.extension.description'})}</p>
                                                <ul>
                                                    <li>{intl.formatMessage({id: 'form.tooltip.extension.li1'})}</li>
                                                    <li>{intl.formatMessage({id: 'form.tooltip.extension.li2'})}</li>
                                                </ul>
                                            </>}
                                        >
                                            <IconButton sx={{p: {xs: 0.5}}}>
                                                <HelpOutlineIcon/>
                                            </IconButton>
                                        </HtmlTooltip>
                                        <Typography id="input-slider" mr={0.5} ml={0}>
                                            Extension
                                        </Typography>
                                        <Slider
                                            aria-label="Extension"
                                            value={precision}
                                            valueLabelDisplay="auto"
                                            valueLabelFormat={(value) => {
                                                const steps = new Map(Object.entries({
                                                    0.2: intl.formatMessage({id: 'form.help.precision.step1'}),
                                                    0.3: intl.formatMessage({id: 'form.help.precision.step2'}),
                                                    0.4: intl.formatMessage({id: 'form.help.precision.step3'}),
                                                    0.5: intl.formatMessage({id: 'form.help.precision.step4'}),
                                                    1: intl.formatMessage({id: 'form.help.precision.step5'}),
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
                                                setPrecision(e.target.value);
                                            }}
                                        />

                                    </Stack>
                                </Grid>
                                <Grid item md={2} xs={4}
                                      sx={{pl: {xs: theme.spacing(1), md: theme.spacing(2)}}}><LoadingButton
                                    onClick={() => setSubmit(true)} loading={submit}
                                    disabled={!validationEnabled}
                                    size="small"
                                    startIcon={<MdOutlineSearch/>}
                                    variant="contained"><FormattedMessage id="form.help.search.button"/></LoadingButton></Grid>
                                <Grid item md={4} xs={12}><Stack direction="row" alignItems="center"
                                                                 justifyContent="center"
                                                                 spacing={1}>
                                    <HelpTooltip msgKey={"exclude-coauthors"}/>
                                    <IconButton onClick={() => setIncludeCoAuthors(false)}>
                                        {!includeCoAuthors && <BsPersonFill fontSize="28px"/>}
                                        {includeCoAuthors && <BsPerson fontSize="28px"/>}
                                    </IconButton>
                                    <StyledSwitch checked={includeCoAuthors}
                                                  inputProps={{'aria-label': 'Limit to Paris 1 Pantheon-Sorbonne authors'}}
                                                  onChange={() => setIncludeCoAuthors(!includeCoAuthors)}/>
                                    <IconButton onClick={() => setIncludeCoAuthors(true)}>
                                        {includeCoAuthors && <BsPeopleFill fontSize="28px"/>}
                                        {!includeCoAuthors && <BsPeople fontSize="28px"/>}
                                    </IconButton>
                                    <HelpTooltip msgKey={"include-coauthors"}/>
                                </Stack></Grid>

                            </Grid>

                        </Stack>
                    </Container>
                </Grid>
                <Container maxWidth="md">
                    <Grid container direction="column">
                        {!noResultsAlert && !displayInfoPanel &&
                            <Grid item md={12} sx={{mt: 2}}><Stack direction="row" alignItems="center"
                                                                   justifyContent="center"
                                                                   spacing={2}>
                                <IconButton onClick={() => setDisplayMode('cloud')}>
                                    {displayMode === 'cloud' && <MdCloud fontSize="28px"/>}
                                    {displayMode === 'list' && <MdOutlineCloud fontSize="28px"/>}
                                </IconButton>
                                <StyledSwitch checked={displayMode === 'list'}
                                              inputProps={{'aria-label': 'Choose view mode, cloud or list'}}
                                              onChange={(e) => setDisplayMode(e.target.checked ? 'list' : 'cloud')}/>
                                <IconButton onClick={() => setDisplayMode('list')}>
                                    {displayMode === 'list' && <MdOutlineViewList fontSize="28px"/>}
                                    {displayMode === 'cloud' && <MdOutlineList fontSize="28px"/>}
                                </IconButton>
                            </Stack></Grid>}
                        <Grid item md={12} sx={{opacity: submit ? 0.3 : 1, mt: 1, mb: 2}}>
                            {displayInfoPanel && <InformationPanel/>}
                            {noResultsAlert && !displayInfoPanel &&
                                <Fade in={noResultsAlert && !displayInfoPanel} mountOnEnter
                                      unmountOnExit={false}>
                                    <Alert severity="warning">
                                        <AlertTitle><FormattedMessage id="results.alert.no-results.title"/></AlertTitle>
                                        <FormattedMessage id="results.alert.no-results.text"/>
                                    </Alert></Fade>}
                            {!noResultsAlert && !displayInfoPanel && displayMode === 'cloud' && cloud}
                            {!noResultsAlert && !displayInfoPanel && displayMode === 'list' && list}
                        </Grid>
                        {(displayMode === 'cloud' && selectedAuthor !== undefined && !displayInfoPanel) &&
                            <Grid container direction={"row"}>
                                <Grid item md={4} xs={12}>
                                    <Typography variant="h5" sx={{color: `#${color}`}} component="div">
                                        {name}
                                    </Typography>
                                </Grid>
                                <Grid item md={8} xs={12}>
                                    <Typography color="text.secondary" variant="body2">
                                        <FormattedMessage id="result.help.scoring"/>
                                    </Typography>
                                </Grid>
                            </Grid>}
                        {(displayMode === 'cloud' && selectedAuthor !== undefined && !displayInfoPanel) &&
                            <Grid item md={12} sx={{padding: 0, mt: 1}}>
                                {sentencePanel}
                            </Grid>}
                    </Grid>
                </Container>
            </Grid></>
    )
}

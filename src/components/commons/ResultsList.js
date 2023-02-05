import React from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Collapse, LinearProgress} from "@mui/material";
import {AiOutlineFolder, AiOutlineFolderOpen} from "react-icons/ai";

const ResultsList = ({authors, onClick, publicationsPanel, selectedAuthor}) => {
    return <List>
        {authors.sort((a, b) => a.min_dist - b.min_dist).map((author) => {

            const labelId = `checkbox-list-label-${author.identifier}`;

            return (
                <React.Fragment key={`result-list-entry-${author.identifier}`}><ListItem
                    onClick={() => {
                        onClick(author);
                    }}
                    disablePadding
                >
                    <ListItemButton role={undefined} dense>
                        <ListItemIcon>
                            {selectedAuthor === author.identifier ? <AiOutlineFolderOpen fontSize="24px"/> :
                                <AiOutlineFolder fontSize="24px"/>}
                        </ListItemIcon>
                        <ListItemText id={labelId} primary={author.text}
                                      secondary={<LinearProgress variant="determinate"
                                                                 value={(0.7 - author.min_dist) * 100}/>}/>
                    </ListItemButton>
                </ListItem>
                    <Collapse in={selectedAuthor === author.identifier} mountOnEnter
                              unmountOnExit>{publicationsPanel}</Collapse>
                </React.Fragment>
            );
        })}
    </List>
}

export default ResultsList
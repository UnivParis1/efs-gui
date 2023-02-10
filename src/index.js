import React from 'react';
import ReactDOM from 'react-dom/client';
import createCache from "@emotion/cache";
import './index.css';
import App from './components/app/App';
import reportWebVitals from './reportWebVitals';
import IntlWrapper from "./components/commons/IntlWrapper";
import {CacheProvider} from "@emotion/react";

const container = document.querySelector('#root');
const shadowContainer = container.attachShadow({mode: 'open'});
const emotionRoot = document.createElement('style');
const shadowRootElement = document.createElement('div');
shadowContainer.appendChild(emotionRoot);
shadowContainer.appendChild(shadowRootElement);

const cache = createCache({
    key: 'css',
    prepend: true,
    container: emotionRoot,
});
const root = ReactDOM.createRoot(shadowRootElement);


root.render(
    <React.StrictMode>
        <CacheProvider value={cache}>
            <IntlWrapper>
                <App shadowRootElement={shadowRootElement}/>
            </IntlWrapper>
        </CacheProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

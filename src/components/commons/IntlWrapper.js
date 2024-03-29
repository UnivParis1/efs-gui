import React, {useState} from 'react';
import {IntlProvider} from 'react-intl';
import French from '../../lang/fr.json';
import English from '../../lang/en.json';

export const Context = React.createContext();

const local = navigator.language;
let lang;
if (local === 'en') {
    lang = English;
} else {
    lang = French;
}
const IntlWrapper = (props) => {
    const [locale, setLocale] = useState(local);
    const [messages, setMessages] = useState(lang);

    const selectLanguage = newLocale => {
        setLocale(newLocale);
        if (newLocale === 'en') {
            setMessages(English);
        } else {
            setMessages(French);
        }
    };

    return (
        <Context.Provider value={{locale, selectLanguage}}>
            <IntlProvider messages={messages} locale={locale}>
                {props.children}
            </IntlProvider>
        </Context.Provider>
    );
}
export default IntlWrapper;
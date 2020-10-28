import {fileURLToPath} from 'url';
import {dirname} from 'path';
import pl from 'date-fns/locale/pl/index.js';
import datefns from 'date-fns';

export function __filename(importURL = import.meta.url) {
    return fileURLToPath(importURL)
}

export function __dirname(importURL = import.meta.url) {
    return dirname(__filename(importURL))
}

export function formatDate(formatStr, date = new Date()) {
    return datefns.format(date, formatStr, {locale: getLocale()})
}

export function getLocale() {
    return pl
}

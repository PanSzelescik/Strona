import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import hbs from 'express-handlebars';
import compression from 'compression';
import chalk from 'chalk';
import * as Helpers from './helpers.js';

const __dirname = Helpers.__dirname(import.meta.url);
const server = express();

server.set('view engine', 'hbs');
server.engine('hbs', hbs({
    extname: 'hbs',
    defaultView: 'default',
    layoutsDir: __dirname + '/views/pages/',
    partialsDir: __dirname + '/views/partials/'
}));

server.use(logger((tokens, req, res) => [
    Helpers.formatDate('[yyyy-MM-dd HH:mm:ss]'),
    chalk.white('[EXPRESS]'),
    tokens.method(req, res),
    getStatusWithColor(tokens.status(req, res)),
    tokens.url(req, res),
    tokens['response-time'](req, res) + ' ms'
].join(' ')));

server.use(express.json());
server.use(express.urlencoded({extended: false}));
server.use(cookieParser());
server.use(compression());

server.use('/index', (req, res) => res.redirect(301, '/src'));
server.use('/src', express.static(path.join(__dirname, '../src')));

server.use((req, res, next) => next(createError(404)));

server.use((err, req, res) => {
    console.error(err);
    res.locals.message = err.message;
    res.locals.error = err;

    res.status(err.status || 500).render('error', {
        layout: 'default',
        template: 'home-template',
        title: `Błąd ${err.status || 500}`,
        description: 'Wystąpił błąd!'
    })
});

function getStatusWithColor(status) {
    return status >= 500 ? chalk.red.bold(status) // red
        : status >= 400 ? chalk.yellow.bold(status) // yellow
            : status >= 300 ? chalk.cyan.bold(status) // cyan
                : status >= 200 ? chalk.green(status) // green
                    : status // no color
}

export default server

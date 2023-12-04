const webpack = require ('webpack');
const TsconfigPathsPlugin = require ('tsconfig-paths-webpack-plugin');
const ESLintPlugin = require ('eslint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require ('fork-ts-checker-webpack-plugin');
const WarningsToErrorsPlugin = require ('warnings-to-errors-webpack-plugin');
const {merge} = require ('webpack-merge');
const CopyPlugin = require ('copy-webpack-plugin');

const APP_PORT = 30000;
const path = require ('path');
const fs = require ('fs');

// Minimal, dependency-free loader for a local (git-ignored) `.env` file so that
// secrets such as the Firebase configuration are never committed to source.
(function loadEnvFile () {
    const envPath = path.resolve (__dirname, '.env');
    if (!fs.existsSync (envPath)) {
        return;
    }
    const lines = fs.readFileSync (envPath, 'utf8').split ('\n');
    for (const rawLine of lines) {
        const line = rawLine.trim ();
        if (!line || line.startsWith ('#')) {
            continue;
        }
        const eq = line.indexOf ('=');
        if (eq === -1) {
            continue;
        }
        const key = line.slice (0, eq).trim ();
        let value = line.slice (eq + 1).trim ();
        value = value.replace (/^['"]|['"]$/g, '');
        if (!(key in process.env)) {
            process.env[key] = value;
        }
    }
}) ();

const buildVersion =
  process.env.npm_config_buildVersion ||
  `local-build:${new Date ().toISOString ()}`;
const isProduction = process.env.NODE_ENV === 'production';

const lintConfigProduction = {
    context: './src',
    extensions: ['ts', 'tsx'],
    emitWarning: true,
    failOnWarning: false,
    failOnError: false,
};

const lintConfigDevelopment = {
    context: './src',
    extensions: ['ts', 'tsx'],
    exclude: ['public', 'node_modules', 'base/extends', 'moduleBuilder.js'],
    failOnError: false,
    failOnWarning: false,
    emitError: true,
    emitWarning: true,
};

let plugins = [];

if (isProduction || process.env.ES_LINT === 'pre-push') {
    plugins = plugins.concat ([
        new ESLintPlugin (
            isProduction ? lintConfigProduction : lintConfigDevelopment
        ),
    ]);
}

plugins = plugins.concat ([
    new ForkTsCheckerWebpackPlugin (),
    new webpack.DefinePlugin ({
        'process.env.BUILD_VERSION': JSON.stringify (buildVersion),
        'process.env.BUILD_NUMBER': JSON.stringify (
            (buildVersion || ':none').split (':').pop ()
        ),
        // Firebase credentials are injected from the environment at build time.
        // Configure them locally via a (git-ignored) .env file or your CI/CD
        // secret store. See .env.example for the full list.
        'process.env.FIREBASE_API_KEY': JSON.stringify (process.env.FIREBASE_API_KEY),
        'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify (process.env.FIREBASE_AUTH_DOMAIN),
        'process.env.FIREBASE_DATABASE_URL': JSON.stringify (process.env.FIREBASE_DATABASE_URL),
        'process.env.FIREBASE_PROJECT_ID': JSON.stringify (process.env.FIREBASE_PROJECT_ID),
        'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify (process.env.FIREBASE_STORAGE_BUCKET),
        'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify (process.env.FIREBASE_MESSAGING_SENDER_ID),
        'process.env.FIREBASE_APP_ID': JSON.stringify (process.env.FIREBASE_APP_ID),
        'process.env.FIREBASE_MEASUREMENT_ID': JSON.stringify (process.env.FIREBASE_MEASUREMENT_ID),
    }),
    new CopyPlugin ({
        patterns: [
            {from: 'public/icons', to: 'icons'},
            {from: 'public/manifest.json', to: 'manifest.json'},
            {from: 'public/favicon.ico', to: 'favicon.ico'},
            {from: 'public/assets/images', to: 'assets/images'},
            {from: 'public/assets/lottie', to: 'assets/lottie'},
            {from: 'public/404.html', to: '404.html'},
        ],
    }),
]);

const HtmlWebpackPlugin = require ('html-webpack-plugin');

plugins.push (
    new HtmlWebpackPlugin ({
        template: path.resolve (__dirname, 'public', 'index.html'),
        process,
    })
);

if (isProduction) {
    plugins = plugins.concat ([new WarningsToErrorsPlugin ()]);
}

const rules = [
    {
        test: /\.(tsx|ts)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
            transpileOnly: true,
        },
    },
    {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
        },
    },
];

rules.push ({
    test: /\.(s[ac]|c)ss$/i,
    use: [
        'style-loader',
        'css-loader?url=false',
        'postcss-loader',
        'sass-loader',
    ],
});
module.exports = merge ({
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: {
        index: path.resolve (__dirname, 'index.tsx'),
    },
    devtool: isProduction ? undefined : 'cheap-module-source-map',
    output: {
        publicPath: process.env.NODE_ENV === 'production'
            ? '/'
            : `http://localhost:${APP_PORT}/`,
        filename: '[name].bundle.js',
        chunkFilename: '[name].bundle.js?h=[chunkhash]',
    },
    module: {
        rules,
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx', '.jsx', '.json'],
        plugins: [new TsconfigPathsPlugin ({})],
    },
    plugins,
    optimization: isProduction
        ? {
            splitChunks: {
                minSize: 20000,
                maxSize: 500000,
                maxInitialRequests: 20, // for HTTP2
                maxAsyncRequests: 20, // for HTTP2
                chunks: 'all',
            },
        }
        : undefined,
    performance: {
        hints: false, // isProduction ? 'error' : false,
        maxAssetSize: isProduction ? 1100000 : Infinity,
        maxEntrypointSize: isProduction ? 1100000 : Infinity,
    },
    devServer: {
        port: APP_PORT,
        host: '0.0.0.0',
        historyApiFallback: true,
        hot: true,
        devMiddleware: {
            stats: {
                colors: true,
                hash: false,
                version: false,
                assets: false,
                chunks: false,
                modules: false,
                reasons: false,
                children: false,
                source: false,
                publicPath: false,
            },
        },
    },
});

const path = require('path');
const nodeExternals = require('webpack-node-externals');

const mode = process.env.NODE_ENV;
console.log('mode: ', mode);

const config = {
    devServer: {
        inline: true,
        host: '0.0.0.0',
        port: 8008,
        disableHostCheck: true,
        allowedHosts: [
          '192.168.1.3',
          '192.168.1.233'
        ]
    },
    entry: {
        app: './src/app.ts'
    },
    mode: mode,
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader'
                    },
                    'sass-loader?sourceMap'
                ]
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.ts', '.js', '.tsx']
    },
    externals: [
        nodeExternals({
            whitelist: [
                'ansi-regex',
                'base64-js',
                'component-emitter',
                'debug',
                'ieee754',
                'indexof',
                'isarray',
                'loglevel',
                'ms',
                'querystring',
                'rxjs',
                'rxjs/operators',
                'punycode',
                'strip-ansi',
                'tslib',
                'url',
            ],
            importType: 'var'
        }),
        {
            'socket.io.slim': 'socket.io-client',
            'd3': 'd3',
        }
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
}

module.exports = () => {
    if (mode === 'development') {
        config.externals = [
            nodeExternals({
                whitelist: [
                    /.*sockjs.*/,
                    'ansi-regex',
                    'ansi-html',
                    'base64-js',
                    'component-emitter',
                    'debug',
                    'html-entities',
                    'ieee754',
                    'indexof',
                    'isarray',
                    'loglevel',
                    'ms',
                    'querystring',
                    'rxjs',
                    'rxjs/operators',
                    'punycode',
                    'strip-ansi',
                    'tslib',
                    'url',
                ],
                importType: 'var'
            }),
            {
                'socket.io.slim': 'socket.io-client',
                'd3': 'd3',
            }
        ];
    }

    return config;
};

var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');

var providePlugin = new webpack.ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery",
    jqxBaseFramework: 'jquery',
    _: 'underscore',
    "window._": "underscore",
    'React': 'react'
})

var HappyPack = require('happypack');

var context = path.join(__dirname, '/framework/src/js/');
var folderPublic = path.join(__dirname, '/public/');

function Config(entry, outputName) {
    outputName = outputName || './';
    this.context = context;
    this.entry = entry;
    this.output = {
        path: path.join(__dirname, '_build/', outputName),
        publicPath: path.join('/', outputName),
        filename: '[name].js',
        chunkFilename: "js/[id].js"
    }
    this.externals = {
        jquery: 'jQuery',
        react: 'React',
        i18next: 'i18next',
        echarts: 'echarts',
        'jquery-i18next': 'jqueryI18next',
        'react-dom': 'ReactDOM',
        'react-i18next': 'window["react-i18next"]',
        'i18next-xhr-backend': 'i18nextXHRBackend',
        // 'angular':'angular',
        // 'angular-route':'angular-route',

        /* should not require('jquery-ui'), remove followings */
        'jquery-ui': 0,
        'fancytree-all': 0,
        'utility/fancytree/jquery.fancytree-all': 0,
        'utility/fancytree/extensions/jquery.fancytree.filter': 0,
        'utility/fancytree/extensions/jquery.fancytree.childcounter': 0,
        'jquery.magnific-popup': 0,
        'utility/magnific-popup/jquery.magnific-popup': 0
    }
    this.module = {
        loaders: [{
            test: /\.jsx$/,
            loader: 'happypack/loader'
        }, {
            test: /\.html?$/,
            loader: 'tpl-loader'
        }, {
            test: /\.less$/,
            loader: 'style!css!less'
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.json$/,
            loader: 'json'
        }]
    }
    this.resolveLoader = {
        root: path.join(__dirname, "node_modules"),
        alias: {
            "tpl-loader": path.join(__dirname, "./devtools/webpack-loaders/tpl-loader")
        }
    }
    this.resolve = {
        // 便于跨业务引用资源
        root: [context, __dirname],
        modulesDirectories: ['node_modules', folderPublic],
        extensions: ["", ".js", ".html", ".jsx", '.es', ".css", ".less"],
        alias: {
            // 'q': context + 'lib/q',
            // 'jquery': context + 'lib/jquery',
            // 'underscore': context + 'lib/underscore',
            // 'jquery-ui': context + 'lib/jquery-ui',
            // 'bootstrap': context + 'lib/bootstrap',
            'bootstrap-multiselect': folderPublic + 'utility/bootstrap/bootstrap-multiselect',
            'jquery.validate': folderPublic + 'utility/jquery/jquery.validate.min',
            // 'fancytree-all': context + 'utility/fancytree/jquery.fancytree-all',
            'pnotify': folderPublic + 'utility/pnotify/pnotify',
            // 'History': context + 'lib/jquery.history',
            // 'bootbox': context + 'utility/bootbox/bootbox',
            'moment': folderPublic + 'utility/moment/moment',
            'moment-locale': folderPublic + 'utility/moment/locale/zh-cn',

            'udp-dropzone': context + 'module/udp/dropzone',
            'jquery.datatables': folderPublic + 'utility/jquery/jquery.datatables.min',
            'datatables.colResize': folderPublic + 'utility/datatables/datatables.colResize',
            'datatables.bootstrap': folderPublic + 'utility/datatables/datatables.bootstrap',
            'datetimepicker': folderPublic + 'utility/datepicker/bootstrap-datetimepicker',

            // tagsinput, 涉及页面较多暂留。但新模块不建议require
            'tagsinput': folderPublic + 'utility/tagsinput/tagsinput',
            'bootstrap-tagsinput': folderPublic + 'utility/tagsinput/bootstrap-tagsinput',
            'nova-alert': folderPublic + 'widget/dialog/nova-alert',
            'nova-dialog': folderPublic + 'widget/dialog/nova-dialog',
            'nova-iframe-dialog': folderPublic + 'widget/dialog/nova-iframe-dialog',
            'nova-double-bootbox-dialog': 'widget/dialog/nova-double-bootbox-dialog',
            'nova-bootbox-dialog': folderPublic + 'widget/dialog/nova-bootbox-dialog',
            'nova-home-dialog': folderPublic + 'widget/dialog/nova-home-dialog',
            'nova-empty-dialog': folderPublic + 'widget/dialog/nova-empty-dialog',
            'nova-notify': folderPublic + 'widget/dialog/nova-notify',
            'udp-file-util': context + 'widget/udp-file-util',

            'nova-code': path.join(__dirname, '/utils/code.js'),
            'nova-map-dialog': folderPublic + 'widget/dialog/nova-map-dialog',

            'config': path.join(__dirname, '/config/config.js'),
            'config-system': path.join(__dirname, '/utils/config-system.js'),
            'bootstrap-colorpicker': folderPublic + 'utility/bootstrap/bootstrap-colorpicker.js',
            'jquery.mousewheel': folderPublic + 'utility/jquery/jquery.mousewheel'
        }
    }
    this.plugins = [
        //new webpack.HotModuleReplacementPlugin(),
        providePlugin,
        new HappyPack({
            loaders: ['babel']
        })
        /*new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            except: ['$super', '$', 'exports', 'require']
        })*/
    ]

}

var defaultConfig = new Config({
    'js/vendor': [
        // './lib/jquery',
        // './lib/underscore',
        // './lib/jquery-ui',
        // './lib/bootstrap',
        // './index.js',
        './i18n.js'
    ],
    'js/index': './index.js',
    'js/home': './pages/home.jsx'
});

function createConfig(dev) {
    /*if (dev) {
        var frameworkConfig = require('./framework.config');
        var out = [];
        _.each(frameworkConfig, function(dir, name) {
            var entryPath = path.join(__dirname, dir, 'entry.js');
            var entry = {};
            if (fs.statSync(entryPath).isFile()) {
                var entryConfig = require(entryPath);
                _.each(entryConfig, function(value, key) {
                    entry[key] = path.join(__dirname, dir, 'src/js', value);
                });
            }
            if(name === 'main') {
                defaultConfig.entry = _.extend({}, defaultConfig.entry, entry);
            } else {
                out.push(new Config(entry, name));
            }
        })
        out.unshift(defaultConfig);
        return out;
    } else {*/
        var copyedConfig = _.clone(defaultConfig);
        // add framework
        var frameworkConfig = require('./framework.config');
        _.each(frameworkConfig, function(dir, name) {
            var entryPath = path.join(__dirname, dir, 'entry.js');
            if (fs.statSync(entryPath).isFile()) {
                var entryConfig = require(entryPath);
                // put framework entry to webpack entry
                _.each(entryConfig, function(value, key) {
                    copyedConfig.entry[name + '/js/' + key] = path.join(__dirname, dir, 'src/js', value);
                });
            }
        });
        if (!dev) {
            copyedConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
                sourceMap: false,
                compress: {
                    warnings: false
                },
                except: ['$super', '$', 'exports', 'require']
            }));
        }
        return copyedConfig;
    // }
}

module.exports.config = defaultConfig;
module.exports.createConfig = createConfig;

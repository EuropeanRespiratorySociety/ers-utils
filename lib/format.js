'use strict';

const parser = require('marked');
const _ = require('lodash');
const renderer = new parser.Renderer()

renderer.heading = function (text, level) {
    return `<h${level}>${text}</h${level}>\n`;
},

renderer.paragraph = function(text) {
    return `<p>${text}</p>\n`;
};

parser.setOptions({
    renderer: renderer,
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
});

const self = module.exports = {

    /**
     * Everything that comes after the | in a title is displayed only
     * in the CMS, not on any website, thus we remove it.
     * @param {Object} item - Article/Item object
     * @returns {Object}
     */
    title: (item) => {
        item.title = item.title ? item.title.split('|')[0].trim() : false;
        return item;
    },

    typeColor: () => {

    },

    /**
     * Parse markdown to html
     * 
     * @param {Object} item
     * @param {Object[]} fields
     * @param {Object[]|Object} [subfileds]
     * @return {Object}
     */
    markDownToHtml: (item, fields, subfields) => {
        subfields = subfields || [];

        return _.mapValues(item, (v, k, o) => {
            if(fields.indexOf(k)!=-1 && o[k]) {
                 o[k] = parser(o[k]);
            }
            if(_.indexOf(subfields, k) != -1 
                &&  !_.isArray(o[k])
                && o[k]){
                    o[k] = _.mapValues(o[k], (v,k) => parse(v,k))
                }

                if(_.indexOf(subfields, k) != -1 
                    && _.isArray(o[k]
                    && o[k])){
                  o[k] = _.map(o[k], v => {
                        return _.mapValues(v, (v,k) => parse(v,k));
                    });
                }
                return o[k];
        });
    },

    /**
     * Map an item to the content Model
     * @param {Object} Model
     * @param {Object} item
     * @return {Object}
     */
    mapModel: (Model, item) => {
        return _.assign({}, Model, item)
    },

    /**
     * Truncate a string wrapping words and apppend ... to be under the max length
     * @param {String} string
     * @param {Number} [length]
     * @param {String} [append]
     */
    truncate: (string, length, append) => {
        length = length || 80;
        append = append || "...";
        const options = {
            length: length,
            omission: append,
            separator: ' '
        };

        return _.truncate(string, options);
    },

    /**
     * returns the url of a document or an image
     * @param {string} baseUrl - the path to your node server used to server images and documents
     * @param {string} type - the type of assets (static or preview)
     * @param {string} attachement - the node to query
     * @param {number} [mimetype] - (optional) e.g. image/jpeg
     * @param {number} [size] - (optional) the size of the image (width)
     * @return {string} - the fully qualified url
     */
    attachementUrl: (baseUrl, type, attachement, size, mimetype) => {
        mimetype = mimetype || false;
        size = size || false;
        let qualifiedPath = '/' + type + '?node=' + attachement.id;

        if(type == 'preview') {
            qualifiedPath += '&name=img' + size + '&size=' + size;
        }

        if(mimetype){
             qualifiedPath += '&mimetype=' + mimetype;
        }

        return baseUrl + qualifiedPath;

    },

    /**
     * @param {Object} item - the cloudcms Object
     * @param {Array} [images] - array of properties to parse 
     * @param {Array} [documents] - array of properties to parse
     */
    parseAttachements: (item, images, documents) => {
        images = images || [];
        documents = documents || []; 
        const baseUrl = 'https://www.ersnet.org/assets';

        return _.mapValues(item, (v, k, o) => {
            const parse = baseUrl => preview => (attachement, size) => 
                            self.attachementUrl(baseUrl, preview, attachement, size);
            const parsePreview = parse(baseUrl)('preview');
            const parseStatic = parse(baseUrl)('static');

            if(k === 'highResImage') {
                return parsePreview(o[k], 1800);
            }

            if(images.indexOf(k) != -1 && !_.isArray(o[k]) ) {
                return parsePreview(o[k], 500);
            }

            if(images.indexOf(k) != -1 && _.isArray(o[k])) {
                return  _.map(o[k], c => { 
                            if(c.image) {  
                                c.image = parsePreview(c.image, 500);
                            }               
                            return c;
                    }
                )         
            }

            if(documents.indexOf(k) != -1) {
                return parseStatic(o[k]);
            }
        });
    }
};

/**
 * -------------------------------------------
 * Private methods                           |
 * -------------------------------------------
 */

/**
 * Parse a value if it is one of ['info', 'text'] or return untouched original
 */
const parse = (value, key) => {
    if(_.indexOf(['info','text'], key) != -1 ){
        return parser(value);
    }
    return value;  
}
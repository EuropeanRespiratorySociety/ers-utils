'use strict';

const parser = require('marked');
const video = require('embed-video');
const sanitizeHtml = require('sanitize-html');
const _ = require('lodash');
const renderer = new parser.Renderer();
// Markdown renderer configuration
renderer.heading = (text, level) => `<h${level}>${text}</h${level}>\n`;
renderer.paragraph = (text) => `<p>${text}</p>\n`;

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
    title: item => {
        item.title = item.title ? item.title.split('|')[0].trim() : false;
        return item;
    },

    /**
     * Convinience method to clean api hooks
     * @param {Object} item - Article/Item object
     * @return {Object}
     */
    setTypeColor: (item, types, label) => {
        if(_.isUndefined(item.typeColor) || !item.typeColor){
            item.typeColor = self.typeColor(item.type, types, label);
        }
        return item;
    },

    /**
     * Returns formated flags (also truncates the string length)
     * @param {Object} item -Article/Item object
     * @return {Object}
     */
    setFlags: item => {
        if(_.isUndefined(item.flags)) item.flags = [];
        if(item.flags.length > 0){
            item.flags = _.map(item.flags, f => {
                return {
                    text: f.text ? self.truncate(f.text, 40) : false,
                    color: f.color ? f.color : false
                }
            })
        }
        if(_.isEmpty(item.flags)) item.flags.push({text:false, color:false});
        return item;
    },

    /**
     * Set a shortLead property on an item/article that is shortenend to 145 characters
     * and contains no HTML.
     * @param {Object} item - item/article from Cloud CMS
     */
    setShortLead: item => {
        if(!_.isUndefined(item.leadParagraph)){
            item.shortLead = self.truncate(self.clean(item.leadParagraph), 145);
        }
        return item;
    },

    /**
     * This methods add a property to the model used by scientific.
     * @param {string} type - cloudcms property
     * @param {Object[]} types - array of types to apply a class
     * @param {string} label - css class to apply
     * @return {boolean|string}
     * @todo {Object[]} classes - abstract away zip arrays
     */
    typeColor: (type, types, label) => {
        if(type) {
            return types.indexOf(type) != -1 ? 
                label : false;
        }
        return false;
    },

    /**
     * Parse markdown to html
     * 
     * @param {Object} item
     * @param {Object[]} fields - Fields that need parsing
     * @param {Object[]|Object} [subfileds] - subfields that need parsing
     * @return {Object}
     */
    markDownToHtml: (item, fields, subfields) => {
        subfields = subfields || [];

        return _.mapValues(item, (v, k) => {
            if(fields.indexOf(k)!=-1 && v) {
                return parser(v);
            }
            if(_.indexOf(subfields, k) != -1 
                &&  !_.isArray(v)
                && v){
                    return _.mapValues(v, (v,k) => parse(v,k))
                }

                if(_.indexOf(subfields, k) != -1 
                    && _.isArray(v
                    && v)){
                    return _.map(v, v => {
                        return _.mapValues(v, (v,k) => parse(v,k));
                    });
                }
                return v;
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
     * Parse attachements (cloudcms way) and returns an object with
     * the url of available document and images well formated
     * @param {Object} item - the cloudcms Object
     * @param {Object[]} [images] - array of image properties to parse (recursive)
     * @param {Object[]} [documents] - array of documents properties to parse
     * @return {Object}
     * @todo make documents recursive
     */
    parseAttachements: (item, baseUrl, images, documents) => {
        images = images || [];
        documents = documents || []; 

        return _.mapValues(item, (v, k) => {
            const parse = baseUrl => preview => (attachement, size) => 
                            self.attachementUrl(baseUrl, preview, attachement, size);
            const parsePreview = parse(baseUrl)('preview');
            const parseStatic = parse(baseUrl)('static');

             if(images.indexOf(k) != -1 && k === 'highResImage' && v) { 
                 return parsePreview(v, 1800) 
                } ;
                
            if(images.indexOf(k) != -1) {
                if(_.isArray(v) ) {
                    return  _.map(v, c => { 
                            if(c.image) {  
                                c.image = parsePreview(c.image, 500);
                            }       
                            return c;
                    }); 
                }
                if(k !== 'highResImage') { return parsePreview(v, 500); }
            }

            if(documents.indexOf(k) != -1 && v) {
                return parseStatic(v);
            }

            //make sure to return false for those properties that were untouched
            if(documents.indexOf(k) != -1 || images.indexOf(k) != -1)
            { return false; }

            //make sure to return all other values untouched
            return v;
        });
    },

    /**
     * Parse video (generate html partial) The opts object takes two optional 
     * properties query is an object and each property will be serialised
     * in the url, attr which takes any properties they will be added 
     * to the iframe e.g. width: 400 becomes width="400"
     * @param {string} url 
     * @param {Object} [opts] - {query: {portrait: 0, color: '333'}, attr: {width: 400, height:200}}
     * @return {string}
     */
    parseVideo: (url, opts) => {
        opts = opts || {};
        return video(url, opts);
    },

    /**
     * Serialize an object in to a query string
     * @param {Object} obj
     * @return {string}
     */
    serializeQuery: (obj) => {
        let r = [];
        _.mapValues(obj, (v, k) => { r.push(k + '=' + v) })
        return '?' + r.join('&');
    },

    /**
     * Filters an object based on an array
     * @param {Object} obj
     * @param {Object[]} array
     * @return {Object}
     */
    filter: (obj, array) => {
        return _.pick(obj, array)     

    },

    /**
     * Removes any html
     * @param {string} string
     * @return {string}
     */
    clean: string => sanitizeHtml(string, {
         allowedTags: [],
         allowedAttributes: []
        }),

    /**
     * Set the limit of a query based on the limit query parameter
     * @param {string} limit - query parameters
     * @param {Object} pagination - properties default and max
     * @return {int}
     */    
    setLimit: (limit, pagination) => {
        limit = parseInt(limit);
        if(_.isNaN(limit)) return pagination.default;
        return limit <= pagination.max ? limit : pagination.max;
    },
    
    /**
     * [Convinience method] wrapper (not to import lodash)
     * @param {Object[]} source
     * @param {Object[]} filter
     */
    sortBy: (source, filter) => {
        return _.sortBy(source, filter);
    }

};

/**
 * -------------------------------------------
 * Private methods                           |
 * -------------------------------------------
 */

/**
 * Parse a value if it is one of ['info', 'text'] or returns untouched original
 */
const parse = (value, key) => {
    if(_.indexOf(['info','text'], key) != -1 ){
        return parser(value);
    }
    return value;  
}
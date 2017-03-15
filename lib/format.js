'use strict';

const parser = require('marked');
const video = require('embed-video');
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
    title: item => {
        item.title = item.title ? item.title.split('|')[0].trim() : false;
        return item;
    },

    /**
     * Convinience method to clean api hooks
     * @param {Object} item - Article/Item object
     * @return {Object}
     */
    setTypeColor: (item, typesToMatch) => {
        item.typeColor = self.typeColor(item.type, typesToMatch);
        return item;
    },

    /**
     * Returns formated flags (also truncates the string length)
     * @param {Object} item -Article/Item object
     * @return {Object}
     */
    setFlags: item => {
        return _.mapValues(item, f => {
            if(f.length > 0){
                return f.map(o => {
                    return {
                        text: o.text ? self.truncate(o.text, 40) : false,
                        color: o.color ? o.color : false
                    }
                });
            }
            f.push({text:false,color:false});
            return f;
        });
    },

    /**
     * This methods add a property to the model used by scientific.
     * It needs to be improved to set better classes as for now
     * if the type is "news" the label-scientific is set...
     * @param {string} type - cloudcms property
     * @param {Object[]} typeToMatch
     * @return {boolean|string}
     * @todo {Object[]} classes - abstract away zip arrays
     */
    typeColor: (type, typesToMatch) => {
        if(type) {
            return _.indexOf(typesToMatch, type) != -1 ? 'label-school' : 'label-scientific';
        }
        return false;
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
    serializeQuery: (obj) => _.reduce(obj, (r, v) => {
        _.mapValues(v, (v, k) => r.push(k + '=' + encodeURIComponent(v)))
        return '?' + r.join('&'); }, [])    
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
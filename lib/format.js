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

module.exports = {

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

    /**
     * Parse markdown to html
     * 
     * @param {Object} item
     * @param {Object[]} fields
     * @param {Object[]|Object} [subfileds]
     * @return {Object}
     */
    markDownToHtml: function(item, fields, subfields){
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
    mapModel: function(Model, item) {
        return _.assign({}, Model, item)
    },

    /**
     * Truncate a string wrapping words and apppend ... to be under the max length
     * @param {String} string
     * @param {Number} [length]
     * @param {String} [append]
     */
    truncate: function(string, length, append){
        length = length || 80;
        append = append || "...";
        const options = {
            length: length,
            omission: append,
            separator: ' '
        };

        return _.truncate(string, options);
    }
};

function parse(value, key){
    if(_.indexOf(['info','text'], key) != -1 ){
        return parser(value);
    }
    return value;  
}
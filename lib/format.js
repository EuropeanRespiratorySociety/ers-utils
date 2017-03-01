'use strict';

const parser = require('marked');
const renderer = new parser.Renderer()

renderer.heading = function (text, level) {
    return `<h${level}>${text}</h${level}>`;
},

renderer.paragraph = function(text) {
    return `<p>${text}</p>`;
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
    title: function(item) {
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
        Object.keys(item).map(k => {
                let type = Object.prototype.toString.call(item[k]);

                if(fields.indexOf(k) != -1 && item[k]){
                    item[k] = parser(item[k]); 
                }

                if(subfields.indexOf(k) != -1 &&  type == '[object Object]'){
                    if(item[k].info && item[k].info != "undefined"){
                        item[k].info = parser(item[k].info);
                    }        
                    if(item[k].text && item[k].text != "undefined"){
                        item[k].text = parser(item[k].text);
                    }        
                }

                if(subfields.indexOf(k) != -1 && type == '[object Array]'){
                    item[k].forEach(current => {
                        if(current.info && current.info != "undefined"){
                            current.info = parser(current.info);
                        }
                                
                        if(current.text && current.text != "undefined"){
                            current.text = parser(current.text);
                        }    
                    });
                }
            }
        )
        return item;
    },

    /**
     * Map an item to the content Model
     * @param {Object} Model
     * @param {Object} item
     * @return {Object}
     */
    mapModel: function(Model, item) {
        return Object.assign({}, Model, item)
    }
};
'use strict';

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
     * Parse markdown to html using provided parser
     * 
     * @param {Object} parser
     * @param {Object} item
     * @param {Object[]} fields
     * @param {Object[]|Object} [subfileds]
     * @return {Object}
     */
    markDownToHtml: function(parser, item, fields, subfields){
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
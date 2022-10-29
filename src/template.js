/*
 * Copyright (c) 2022 Michael Ko
 * 
 * This work is licensed under the terms of the MIT license.
 * For a copy, see <https://opensource.org/licenses/MIT>.
 */

/* global define, Function, global */


var DEFAULT_START_TAG = "${";
var DEFAULT_END_TAG = "}";

/**
 * Creates a compiled template function that can interpolate values into placeholders in the template.
 * @param {string} strTemplate The string template to compile.
 * @param {Object} [options] The compilation options.
 * @param {string} [options.startTag] The start tag for a placeholder.
 * @param {string} [options.endTag] The end tag for a placeholder.
 * @returns {Function} The compiled template function.
 * @example
 * var greet = template("Hello, ${name}");
 * 
 * greet({name: "John"}); // => Hello, John
 * @example <caption>Custom tags</caption>
 * var greet = template("Hello, <%name%>", {startTag: "<%", endTag: "%>"});
 * 
 * greet({name: "John"}); // => Hello, John
 * @since 1.0.0
 */
function template(strTemplate, options) {
    var startTag = options instanceof Object && options.hasOwnProperty("startTag") ? options.startTag : DEFAULT_START_TAG;
    var endTag = options instanceof Object && options.hasOwnProperty("endTag") ? options.endTag : DEFAULT_END_TAG;

    var offset = 0;
    var start = -1, end = -1;
    var name, parts = [], indice = {};

    if (strTemplate != null) {
        while ((start = strTemplate.indexOf(startTag, offset)) >= 0) {
            end = strTemplate.indexOf(endTag, start + startTag.length);

            if (end >= 0) {
                name = strTemplate.substring(start + startTag.length, end).trim();
                if (start > offset) {
                    parts.push(strTemplate.substring(offset, start));
                }
                if (name.length > 0) {
                    indice[name] = parts.length;
                    parts.push(null);
                }
                offset = end + endTag.length;
            } else {
                break;
            }
        }

        if (parts.length === 0 && end === -1) {
            parts.push(strTemplate);
        } else if (end + endTag.length < strTemplate.length) {
            parts.push(strTemplate.substring(end + endTag.length));
        }
    }

    return function (values) {
        if (values instanceof Object) {
            var tokens = parts.slice();
            var key, keys = Object.keys(values);
            for (var i = 0; i < keys.length; i++) {
                key = keys[i];
                if (indice[key] >= 0) {
                    tokens[indice[key]] = values[key];
                }
            }
            return tokens.join("");
        }
        return parts.join("");
    };
}

module.exports = template;
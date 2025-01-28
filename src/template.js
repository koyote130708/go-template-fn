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
 * @param {string} [options.startTag="${"] The start tag for a placeholder.
 * @param {string} [options.endTag="}"] The end tag for a placeholder.
 * @param {boolean} [options.returnAsFragments=false] If `true`, returns the output as an array of fragments; if `false`, joins the fragments and returns as a concatenated string.
 * @returns {Function} The compiled template function.
 * @example
 * const greet = template("Hello, ${name}");
 * 
 * greet({ name: "John" }); // => Hello, John
 * 
 * @example <caption>Custom tags</caption>
 * const greet = template("Hello, <%name%>", {startTag: "<%", endTag: "%>"});
 * 
 * greet({ name: "John" }); // => Hello, John
 * 
 * @example <caption>Returning the result as a fragments array</caption>
 * const greet = template("Hello, ${name}! You've turned ${age} today.", { returnAsFragments: true });
 * greet({ name: "John", age: 20 }); // => ["Hello, ", "John", "! You've turned ", 20, " today."]
 * @since 1.0.0
 */
function template(strTemplate, options) {
    var startTag = DEFAULT_START_TAG;
    var endTag = DEFAULT_END_TAG;
    var returnAsFragments = false;

    if (options != null) {
        if (options.startTag !== undefined) {
            startTag = options.startTag;
        }

        if (options.endTag !== undefined) {
            endTag = options.endTag;
        }

        if (options.returnAsFragments !== undefined) {
            returnAsFragments = options.returnAsFragments;
        }
    }

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
        var fragments = parts.slice();

        if (values != null && typeof values === "object") {
            var key, keys = Object.keys(values);
            for (var i = 0; i < keys.length; i++) {
                key = keys[i];
                if (indice[key] >= 0) {
                    fragments[indice[key]] = values[key];
                }
            }
        }

        return returnAsFragments ? fragments : fragments.join("");
    };
}

module.exports = template;
"use strict";

var assert = require("chai").assert;

var template = require("../src/template");

suite("go/string-template", function () {

    test("Template creation", function () {
        assert.equal(typeof template(), "function");

        assert.equal(typeof template(null), "function");

        assert.equal(typeof template(""), "function");
    });


    test("Empty template string returns empty results", function () {
        var t = template("");

        assert.equal(t(), "");
        assert.equal(t(null), "");
        assert.equal(t({name: "John"}), "");
        assert.equal(t({name: "John"}), ""); // ensure the same output
    });


    test("Template without placeholders returns the same content", function () {
        var t = template("Hello");

        assert.equal(t(), "Hello");
        assert.equal(t(null), "Hello");
        assert.equal(t({name: "John"}), "Hello");
        assert.equal(t({name: "John"}), "Hello"); // ensure the same output
    });


    test("Template with a single placeholder and no text", function () {
        var t = template("${message}");

        assert.equal(t(), "");
        assert.equal(t(null), "");
        assert.equal(t({message: "Hello World!"}), "Hello World!");
        assert.equal(t({message: "Hello World!"}), "Hello World!"); // ensure the same output
    });


    test("Template with one placeholder and text", function () {
        var t = template("Hello, ${name}.");
        assert.equal(t(), "Hello, .");
        assert.equal(t(null), "Hello, .");
        assert.equal(t({name: "John"}), "Hello, John.");
        assert.equal(t({name: "John"}), "Hello, John."); // ensure the same output
        assert.equal(t({name: "Jane"}), "Hello, Jane.");
    });


    test("Template with two placeholders and text", function () {
        var t = template("Hello ${ name }, please deposit $${ amount }.");

        assert.equal(t(), "Hello , please deposit $.");
        assert.equal(t({name: "John"}), "Hello John, please deposit $.");
        assert.equal(t({name: "John", amount: 10}), "Hello John, please deposit $10.");
        assert.equal(t({name: "John", amount: 10}), "Hello John, please deposit $10."); // ensure the same output
        assert.equal(t({name: "Jane", amount: 20}), "Hello Jane, please deposit $20.");
    });


    test("Template with numbered placeholders", function () {
        var t = template("name: ${0}, amount: $${1}");

        assert.equal(t(), "name: , amount: $");
        assert.equal(t(null), "name: , amount: $");
        assert.equal(t(["John", 10]), "name: John, amount: $10");
        assert.equal(t(["John", 10]), "name: John, amount: $10"); // ensure the same output
        assert.equal(t(["Jane", 20]), "name: Jane, amount: $20");
    });


    test("Template with custom delimiters for placeholders", function () {
        var t = template("Hello <%=name%>, please deposit $<%=amount%>.", {startTag: "<%=", endTag: "%>"});

        assert.equal(t(), "Hello , please deposit $.");
        assert.equal(t({name: "John"}), "Hello John, please deposit $.");
        assert.equal(t({name: "John", amount: 10}), "Hello John, please deposit $10.");
        assert.equal(t({name: "John", amount: 10}), "Hello John, please deposit $10."); // ensure the same output
        assert.equal(t({name: "Jane", amount: 20}), "Hello Jane, please deposit $20.");
    });


    test("Template with fragments array as the output", function () {
        var t = template("Hello ${name}, please deposit $${amount}.", {returnAsFragments: true});

        assert.deepEqual(t(), ["Hello ", null, ", please deposit $", null, "."]);
        assert.deepEqual(t({name: "John"}), ["Hello ", "John", ", please deposit $", null, "."]);
        assert.deepEqual(t({name: "John", amount: 10}), ["Hello ", "John", ", please deposit $", 10, "."]);
    });


    test("Templates with unusual or exceptional formats", function () {
        assert.equal(template("")(), "");
        assert.equal(template("${")(), "${");
        assert.equal(template("}")(), "}");
        assert.equal(template("${}}")(), "}");
        assert.equal(template("${}")({"": "Hello"}), "");
        assert.equal(template("${name")(), "${name");
        assert.equal(template("{name}")(), "{name}");
        assert.equal(template("${name{}$")(), "$");
    });
});
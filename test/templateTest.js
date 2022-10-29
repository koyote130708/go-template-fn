"use strict";

var assert = require("chai").assert;

var template = require("../src/template");

suite("go/string-template", function () {
    var str0 = "";
    var str1 = "Hello";
    var str2 = "${message}";
    var str3 = "Hello, ${name}.";
    var str4 = "Hello ${ name }, please deposit $${ amount }.";
    var str5 = "name: ${0}, amount: $${1}";
    var str6 = "Hello <%=name%>, please deposit $<%=amount%>.";


    var t0 = template(str0);
    var t1 = template(str1);
    var t2 = template(str2);
    var t3 = template(str3);
    var t4 = template(str4);
    var t5 = template(str5);
    var t6 = template(str6, {startTag: "<%=", endTag: "%>"});



    test("template creation", function () {
        assert.equal(typeof template(), "function");

        assert.equal(typeof template(null), "function");

        assert.equal(typeof template(""), "function");
    });


    test("template 0 - empty string", function () {
        assert.equal(t0(), "");
        assert.equal(t0(null), "");
        assert.equal(t0({name: "John"}), "");
        assert.equal(t0({name: "John"}), ""); // ensure the same output
    });


    test("template 1 - no placeholders", function () {
        assert.equal(t1(), "Hello");
        assert.equal(t1(null), "Hello");
        assert.equal(t1({name: "John"}), "Hello");
        assert.equal(t1({name: "John"}), "Hello"); // ensure the same output
    });


    test("template 2 - placeholder only", function () {
        assert.equal(t2(), "");
        assert.equal(t2(null), "");
        assert.equal(t2({message: "Hello World!"}), "Hello World!");
        assert.equal(t2({message: "Hello World!"}), "Hello World!"); // ensure the same output
    });


    test("template 3 - 1 placeholder", function () {
        assert.equal(t3(), "Hello, .");
        assert.equal(t3(null), "Hello, .");
        assert.equal(t3({name: "John"}), "Hello, John.");
        assert.equal(t3({name: "John"}), "Hello, John."); // ensure the same output
        assert.equal(t3({name: "Jane"}), "Hello, Jane.");
    });


    test("template 4 - 2 placeholders", function () {
        assert.equal(t4(), "Hello , please deposit $.");
        assert.equal(t4({name: "John"}), "Hello John, please deposit $.");
        assert.equal(t4({name: "John", amount: 10}), "Hello John, please deposit $10.");
        assert.equal(t4({name: "John", amount: 10}), "Hello John, please deposit $10."); // ensure the same output
        assert.equal(t4({name: "Jane", amount: 20}), "Hello Jane, please deposit $20.");
    });


    test("template 5 - numbered placeholders", function () {
        assert.equal(t5(), "name: , amount: $");
        assert.equal(t5(null), "name: , amount: $");
        assert.equal(t5(["John", 10]), "name: John, amount: $10");
        assert.equal(t5(["John", 10]), "name: John, amount: $10"); // ensure the same output
        assert.equal(t5(["Jane", 20]), "name: Jane, amount: $20");
    });


    test("template 6 - custom tags", function () {
        assert.equal(t6(), "Hello , please deposit $.");
        assert.equal(t6({name: "John"}), "Hello John, please deposit $.");
        assert.equal(t6({name: "John", amount: 10}), "Hello John, please deposit $10.");
        assert.equal(t6({name: "John", amount: 10}), "Hello John, please deposit $10."); // ensure the same output
        assert.equal(t6({name: "Jane", amount: 20}), "Hello Jane, please deposit $20.");
    });


    test("exceptional templates", function () {
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
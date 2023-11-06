"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FormBuild_1 = require("plugin-form/FormBuild");
const Dom_1 = require("Dom");
class FormPost {
    static field(context, name) {
        let decision;
        for (let n = 0; n < context._inputs.length; n++) {
            const i_ = context._inputs[n];
            if (i_._name == name && i_._type !== "error") {
                decision = i_._child;
            }
        }
        return (0, Dom_1.default)(decision);
    }
    static value(context, name, value) {
        if (value) {
            context.field(name).value(value);
            return this;
        }
        else {
            if (name) {
                return context.field(name).value();
            }
            else {
                let data = new FormData();
                for (let n = 0; n < context._inputs.length; n++) {
                    const input = context._inputs[n];
                    if (input._type == "input") {
                        const i_ = input._child;
                        if (input._option.type == "file") {
                            data[input._name] = context._fileBuffer[input._name];
                        }
                        else {
                            data[input._name] = FormBuild_1.default._valConv(i_.value);
                        }
                    }
                    else if (input._type == "textarea") {
                        const i_ = input._child;
                        data[input._name] = FormBuild_1.default._valConv(i_.value);
                    }
                    else if (input._type == "select") {
                        const i_ = input._child;
                        data[input._name] = FormBuild_1.default._valConv(i_.value);
                    }
                    else if (input._type == "radio") {
                        const is_ = input._child;
                        for (let n2 = 0; n2 < is_.length; n2++) {
                            if (is_[n2].checked) {
                                data[input._name] = FormBuild_1.default._valConv(is_[n2].value);
                            }
                        }
                    }
                    else if (input._type == "checkbox") {
                        const is_ = input._child;
                        let checkedList = [];
                        for (let n2 = 0; n2 < is_.length; n2++) {
                            if (is_[n2].checked) {
                                checkedList.push(FormBuild_1.default._valConv(is_[n2].value));
                            }
                        }
                        data[input._name] = checkedList;
                    }
                }
                return data;
            }
        }
    }
    static setValues(context, data) {
        let c = Object.keys(data);
        for (let n = 0; n < context._inputs.length; n++) {
            const input = context._inputs[n];
            const name = input._name;
            if (input._type !== "error" && c.indexOf(name) > -1) {
                context.field(name).value(data[name]);
            }
        }
        return context;
    }
    static reset(context) {
        let c = Object.keys(context._defaultValues);
        for (let n = 0; n < context._inputs.length; n++) {
            const input = context._inputs[n];
            const name = input._name;
            if (input._type !== "error" && c.indexOf(name) > -1) {
                context.field(name).value(context._defaultValues[name]);
            }
        }
        context._fileBuffer = {};
        return context;
    }
}
exports.default = FormPost;

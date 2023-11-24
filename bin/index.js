"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FormBuild_1 = require("plugin-form/FormBuild");
const FormPost_1 = require("plugin-form/FormPost");
const Util_1 = require("Util");
window.addEventListener("submit", function (e) {
    e.preventDefault();
});
class FormData extends Object {
}
class Form {
    constructor(name) {
        this.name = null;
        this.handleSubmit = null;
        this.handleReset = null;
        this.handleOpen = null;
        this.vfm_ = null;
        this._inputs = [];
        this._defaultValues = {};
        this._fileBuffer = {};
        if (name) {
            this.name = name;
        }
        if (this.name) {
            this.open();
        }
    }
    /**
     * #### (static) open
     * @returns {Form} Form class object
     */
    static open() {
        const f_ = new this();
        f_.open();
        return f_;
    }
    /**
     * ####  open
     * @returns {Form} Form class object
     */
    open() {
        this.vfm_ = document.querySelector("v-form[name=\"" + this.name + "\"]");
        if (!this.vfm_) {
            return;
        }
        this.vfm_.removeAttribute("name");
        this.vfm_.innerHTML = "<form>" + this.vfm_.innerHTML + "</form>";
        this._inputs = [];
        // input
        const inputs = this.vfm_.querySelectorAll("v-input");
        for (let n = 0; n < inputs.length; n++) {
            const input = inputs[n];
            this.setInput(input);
            this._inputs.push(input);
        }
        // textarea
        const textareas = this.vfm_.querySelectorAll("v-textarea");
        for (let n = 0; n < textareas.length; n++) {
            const textarea = textareas[n];
            this.setTextarea(textarea);
            this._inputs.push(textarea);
        }
        // select
        const selects = this.vfm_.querySelectorAll("v-select");
        for (let n = 0; n < selects.length; n++) {
            const select = selects[n];
            this.setSelect(select);
            this._inputs.push(select);
        }
        // radio
        const radios = this.vfm_.querySelectorAll("v-radio");
        for (let n = 0; n < radios.length; n++) {
            const radio = radios[n];
            this.setRadio(radio);
            this._inputs.push(radio);
        }
        // checkbox
        const checkboxs = this.vfm_.querySelectorAll("v-checkbox");
        for (let n = 0; n < checkboxs.length; n++) {
            const checkbox = checkboxs[n];
            this.setCheckbox(checkbox);
            this._inputs.push(checkbox);
        }
        // error
        const errors = this.vfm_.querySelectorAll("v-error");
        for (let n = 0; n < errors.length; n++) {
            const error = errors[n];
            this.setError(error);
            this._inputs.push(error);
        }
        const vfma_ = this.vfm_.childNodes[0];
        vfma_.addEventListener("submit", (e) => {
            e.preventDefault();
            let data = this.value();
            if (this.handleSubmit) {
                this.handleSubmit(data);
            }
        });
        vfma_.addEventListener("reset", (e) => {
            let data = this.value();
            if (this.handleReset) {
                this.handleReset(data);
            }
            this.reset();
        });
        vfma_.addEventListener("change", (e) => {
            if (!e.target.files) {
                return;
            }
            const files = e.target.files;
            const parent = e.target.parentNode;
            if (!parent._name) {
                return;
            }
            const name = parent._name;
            for (let n = 0; n < files.length; n++) {
                const file = files[n];
                var frd = new FileReader();
                frd.addEventListener('load', (e2) => {
                    // @ts-ignore
                    file.result = Util_1.default.base64Encode(e2.target.result);
                    if (!this._fileBuffer[name]) {
                        this._fileBuffer[name] = [];
                    }
                    this._fileBuffer[name].push(file);
                });
                frd.readAsText(file);
            }
        });
        if (this.handleOpen) {
            this.handleOpen();
        }
        return this;
    }
    setInput(arg1, option) {
        return FormBuild_1.default.setInput(this, arg1, option);
    }
    setTextarea(arg1, option) {
        return FormBuild_1.default.setTextarea(this, arg1, option);
    }
    setSelect(arg1, values, option) {
        return FormBuild_1.default.setSelect(this, arg1, values, option);
    }
    setRadio(arg1, values, option) {
        return FormBuild_1.default.setRadio(this, arg1, values, option);
    }
    setCheckbox(arg1, values, option) {
        return FormBuild_1.default.setCheckbox(this, arg1, values, option);
    }
    setError(arg1, message, option) {
        return FormBuild_1.default.setError(this, arg1, message, option);
    }
    resetError() {
        return FormBuild_1.default.resetError(this);
    }
    field(name) {
        return FormPost_1.default.field(this, name);
    }
    value(name, value) {
        return FormPost_1.default.value(this, name, value);
    }
    setValues(data) {
        return FormPost_1.default.setValues(this, data);
    }
    reset() {
        return FormPost_1.default.reset(this);
    }
}
exports.default = Form;

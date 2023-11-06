import FormBuild from "plugin-form/FormBuild";
import FormPost from "plugin-form/FormPost";
import Util from "Util";
import DomControl from "@flagfw/front/bin/DomControl";

window.addEventListener("submit", function(e){
    e.preventDefault();
});

class FormData extends Object{}

export default class Form{

    public name : String = null;

    public handleSubmit = null;

    public handleReset = null;

    public handleOpen = null;

    private vfm_ = null;

    private _inputs = [];

    private _defaultValues = {};

    private _fileBuffer = {};

    constructor(name? : String){

        if(name){
            this.name = name;
        }

        if(this.name){
            this.open();
        }
    }

    public open() : Form{

        this.vfm_ = document.querySelector("v-form[name=\"" + this.name + "\"]");
        
        if(!this.vfm_){
            return;
        }

        this.vfm_.removeAttribute("name");
        this.vfm_.innerHTML = "<form>" + this.vfm_.innerHTML + "</form>";
    
        this._inputs = [];

        // input
        const inputs = this.vfm_.querySelectorAll("v-input");
        for(let n = 0 ; n < inputs.length ; n++){
            const input = inputs[n];
            this.setInput(input);
            this._inputs.push(input);
        }

        // textarea
        const textareas = this.vfm_.querySelectorAll("v-textarea");
        for(let n = 0 ; n < textareas.length ; n++){
            const textarea = textareas[n];
            this.setTextarea(textarea);
            this._inputs.push(textarea);
        }

        // select
        const selects = this.vfm_.querySelectorAll("v-select");
        for(let n = 0 ; n < selects.length ; n++){
            const select = selects[n];
            this.setSelect(select);
            this._inputs.push(select);
        }

        // radio
        const radios = this.vfm_.querySelectorAll("v-radio");
        for(let n = 0 ; n < radios.length ; n++){
            const radio = radios[n];
            this.setRadio(radio);
            this._inputs.push(radio);
        }

        // checkbox
        const checkboxs = this.vfm_.querySelectorAll("v-checkbox");
        for(let n = 0 ; n < checkboxs.length ; n++){
            const checkbox = checkboxs[n];
            this.setCheckbox(checkbox);
            this._inputs.push(checkbox);
        }

        // error
        const errors = this.vfm_.querySelectorAll("v-error");
        for(let n = 0 ; n < errors.length ; n++){
            const error = errors[n];
            this.setError(error);
            this._inputs.push(error);
        }

        const vfma_ = this.vfm_.childNodes[0];
        vfma_.addEventListener("submit", (e)=>{
            e.preventDefault();

            let data : FormData = this.value();
            if(this.handleSubmit){
                this.handleSubmit(data);
            }
        });
        
        vfma_.addEventListener("reset", (e)=>{
            let data : FormData = this.value();
            if(this.handleReset){
                this.handleReset(data);
            }
            this.reset();
        });

        vfma_.addEventListener("change", (e)=>{

            if(!e.target.files){
                return;
            }

            const files = e.target.files;
            const parent = e.target.parentNode;

            if(!parent._name){
                return;
            }

            const name = parent._name;

            for(let n = 0 ; n < files.length ; n++){
                const file = files[n];

                var frd = new FileReader();
                frd.addEventListener('load', (e2) => {
                    // @ts-ignore
                    file.result = Util.base64Encode(e2.target.result);
                    if(!this._fileBuffer[name]){
                        this._fileBuffer[name] = [];
                    }
                    this._fileBuffer[name].push(file);
                });
                frd.readAsText(file);
            }
        });
        
        if(this.handleOpen){
            this.handleOpen();
        }

        return this;
    }

    setInput(name : String) : Form;

    setInput(vinputElement : Element) : Form;

    setInput(name : String, option : any) : Form;

    setInput(arg1 : String | Element, option? : any) : Form{
        return FormBuild.setInput(this, arg1, option);
    }

    setTextarea(name : String) : Form;

    setTextarea(vTextareaElement : Element) : Form;

    setTextarea(name : String, option : any) : Form;

    setTextarea(arg1 : String | Element, option? : any) : Form{
        return FormBuild.setTextarea(this, arg1, option);
    }

    setSelect(name : String) : Form;

    setSelect(vSelectElement : Element) : Form;

    setSelect(name : String, values : any) : Form;

    setSelect(name : String, values : any, option : any) : Form;

    setSelect(arg1 : String | Element, values? : any, option? : any) : Form{
        return FormBuild.setSelect(this, arg1, values, option);
    }

    setRadio(name : String) : Form;

    setRadio(vRadioElement : Element) : Form;

    setRadio(name : String, values: any) : Form;

    setRadio(name : String, values: any, option : any) : Form;

    setRadio(arg1 : String | Element, values? : any, option? : any) : Form{
        return FormBuild.setRadio(this, arg1, values, option);
    }

    setCheckbox(name : String) : Form;

    setCheckbox(vRadioElement : Element) : Form;

    setCheckbox(name : String, values: any) : Form;

    setCheckbox(name : String, values: any, option : any) : Form;

    setCheckbox(arg1 : String | Element, values? : any, option? : any) : Form{
        return FormBuild.setCheckbox(this, arg1, values, option);
    }

    setError(name : String) : Form;

    setError(vErrorElement : Element) : Form;

    setError(name : String, message : String) : Form;

    setError(name : String, message : String, option : any) : Form;

    setError(arg1 : String | Element, message? : String, option? : any) : Form{
        return FormBuild.setError(this, arg1, message, option);
    }

    resetError() : Form{
        return FormBuild.resetError(this);
    }

    field(name : String) : DomControl;

    field(name : String) : DomControl{
        return FormPost.field(this, name);
    }

    value() : FormData;

    value(name : String) : FormData;

    value(name : String, value: String | Number | Boolean) : Form;

    value(name? : String, value? : String | Number | Boolean) : FormData | Form{
        return FormPost.value(this, name, value);
    }
    
    setValues(data : FormData) : Form{
        return FormPost.setValues(this, data);
    }

    reset() : Form{
        return FormPost.reset(this);
    }
}
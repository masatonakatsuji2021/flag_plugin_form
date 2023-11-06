import FormBuild from "plugin-form/FormBuild";
import Dom from "Dom";

export default class FormPost{

    static field(context, name : String){
        let decision;
        for(let n = 0 ; n < context._inputs.length ; n++){
            const i_ = context._inputs[n];
            if(i_._name == name && i_._type !== "error"){
                decision = i_._child;
            }
        }

        return Dom(decision);
    }

    static value(context, name? : String, value? : String | Number | Boolean){
        if(value){
            context.field(name).value(value);
            return this;
        }
        else{
            if(name){
                return context.field(name).value();
            }
            else{
                let data = new FormData();
                for(let n = 0 ; n < context._inputs.length ; n++){
                    const input = context._inputs[n];
    
                    if(input._type == "input"){
                        const i_ = input._child;
                        if(input._option.type == "file"){
                            data[input._name] = context._fileBuffer[input._name];
                        }
                        else{
                            data[input._name] = FormBuild._valConv(i_.value);
                        }
                    }
                    else if(input._type == "textarea"){
                        const i_ = input._child;
                        data[input._name] = FormBuild._valConv(i_.value);
                    }
                    else if(input._type == "select"){
                        const i_ = input._child;
                        data[input._name] = FormBuild._valConv(i_.value);                    
                    }
                    else if(input._type == "radio"){
                        const is_ = input._child;
                        for(let n2 = 0 ; n2 < is_.length ; n2++){
                            if(is_[n2].checked){
                                data[input._name] = FormBuild._valConv(is_[n2].value);
                            }
                        }
                    }
                    else if(input._type == "checkbox"){
                        const is_ = input._child;
                        let checkedList = [];
                        for(let n2 = 0 ; n2 < is_.length ; n2++){
                            if(is_[n2].checked){
                                checkedList.push(FormBuild._valConv(is_[n2].value));
                            }
                        }
                        data[input._name] = checkedList;
                    }
    
                }
                return data;
            }
        }


    }

    static setValues(context, data){

        let c = Object.keys(data);
        for(let n = 0 ; n < context._inputs.length ; n++){
            const input = context._inputs[n];
            const name = input._name;
            if(input._type !== "error" && c.indexOf(name) > -1){
                context.field(name).value(data[name]);
            }
        }

        return context;
    }

    static reset(context){
        let c = Object.keys(context._defaultValues);
        for(let n = 0 ; n < context._inputs.length ; n++){
            const input = context._inputs[n];
            const name = input._name;
            if(input._type !== "error" && c.indexOf(name) > -1){
                context.field(name).value(context._defaultValues[name]);
            }
        }
        context._fileBuffer = {};
        return context;
    }
}
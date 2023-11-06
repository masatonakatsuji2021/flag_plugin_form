export default class FormBuild{

    static _valConv(value){
        let res;
        if(isNaN(value)){
            res = value;
        }
        else{
            if(value){
                res = parseFloat(value);
            }
            else{
                res = null;
            }
        }
        return res;
    }

    static _setAttribute(targetElement : Element, option : any, ignores? : any) : void{
        const c = Object.keys(option);
        for(let n = 0 ; n < c.length ; n++){
            const key = c[n];
            const val = option[key];
            if(val === null || val === undefined || val === false){
                targetElement.removeAttribute(key);
            }
            else{
                targetElement.setAttribute(key, val);
            }
        }

        if(ignores){
            for(let n = 0 ; n < ignores.length ; n++){
                const ignore = ignores[n];
                targetElement.removeAttribute(ignore);
            }
        }
    }

    static setInput(context, arg1 : String | Element, option? : any){
        if(!option){
            option = {};
        }

        let input_;
        let input;
        let inputName;
        if(typeof arg1 == "string"){
            inputName = arg1;

            for(let n = 0 ; n < context._inputs.length ; n++){
                const i_ = context._inputs[n];
                if(i_._name == inputName){
                    // @ts-ignore
                    input_ = i_;
                }
            }

            if(!input_){
                input_ = context.vfm_.querySelector("v-input[:name=\"" + inputName + "\"]");
            }

            if(!input_){
                return;
            }

            input_.innerHTML = "<input>";
            input = input_.childNodes[0];

            if(option.value){
                context._defaultValues[inputName] = option.value;
            }
        }
        else{
            // @ts-ignore
            input_  = arg1;
            input_.innerHTML = "<input>";
            input = input_.childNodes[0];
            let attrs = input_.attributes;
            let inputDeleteAttr = [];
            for(let n = 0 ; n < attrs.length ; n++){
                const attr = attrs[n];
                const key = attr.name;
                const val = attr.value;
    
                if(key.indexOf(":") === 0){

                    if(key == ":name"){
                        inputName = val;
                    }

                    if(key == ":value"){
                        context._defaultValues[inputName] = key;
                    }

                    if(!option[key.substring(1)]){
                        option[key.substring(1)] = val;
                    }
                    inputDeleteAttr.push(key);
                }
            }

            for(let n = 0 ; n < inputDeleteAttr.length ; n++){
                input_.removeAttribute(inputDeleteAttr[n]);
            }
        }

        // @ts-ignore
        input_._option = option;
        // @ts-ignore
        input_._type = "input";
        // @ts-ignore
        input_._name = inputName;
        // @ts-ignore
        input_._child = input;

        const ignore = [
            "name",
        ];
        FormBuild._setAttribute(input, option, ignore);

        return context;
    }

    static setTextarea(context, arg1 : String | Element, option? : any){

        if(!option){
            option = {};
        }

        let textarea_;
        let textarea;
        let textareaName;
        if(typeof arg1 == "string"){
            textareaName = arg1;

            for(let n = 0 ; n < context._inputs.length ; n++){
                const i_ = context._inputs[n];
                if(i_._name == textareaName){
                    // @ts-ignore
                    textarea_ = i_;
                }
            }

            if(!textarea_){
                textarea_ = context.vfm_.querySelector("v-textarea[:name=\"" + textareaName + "\"]");
            }

            if(!textarea_){
                return;
            }

            textarea_.innerHTML = "<textarea></textarea>";
            textarea = textarea_.childNodes[0];


            if(option.value){
                textarea.innerHTML = option.value;
                context._defaultValues[textareaName] = option.value;
                delete option.value;
            }
        }
        else{
            // @ts-ignore
            textarea_ = arg1;
            textarea_.innerHTML = "<textarea></textarea>";
            textarea = textarea_.childNodes[0];

            let attrs = textarea_.attributes;
            let inputDeleteAttr = [];
            for(let n = 0 ; n < attrs.length ; n++){
                const attr = attrs[n];
                const key = attr.name;
                const val = attr.value;
                
                if(key.indexOf(":") === 0){
                    if(key == ":value"){
                        textarea.innerHTML = val;
                        context._defaultValues[textareaName] = val;
                    }
                    else{
                        if(key == ":name"){
                            textareaName = val;
                        }

                        if(!option[key.substring(1)]){
                            option[key.substring(1)] = val;
                        }    
                    }
                    inputDeleteAttr.push(key);
                }

            }

            for(let n = 0 ; n < inputDeleteAttr.length ; n++){
                textarea_.removeAttribute(inputDeleteAttr[n]);
            }
        }

        // @ts-ignore
        textarea_._option = option;
        // @ts-ignore
        textarea_._type = "textarea";
        // @ts-ignore
        textarea_._name = textareaName;
        // @ts-ignore
        textarea_._child = textarea;

        const ignore = [
            "name",
        ];

        FormBuild._setAttribute(textarea, option, ignore);

        return context;
    }

    static setSelect(context, arg1 : String | Element, values? : any, option? : any){

        if(!values){
            values = {};
        }

        if(!option){
            option = {};
        }

        let select_;
        let select;
        let selectName;
        let selected = null;
        let empty = null;
        if(typeof arg1 == "string"){
            selectName = arg1;

            for(let n = 0 ; n < context._inputs.length ; n++){
                const i_ = context._inputs[n];
                if(i_._name == selectName){
                    // @ts-ignore
                    select_ = i_;
                }
            }

            if(!select_){
                select_ = context.vfm_.querySelector("v-select[:name=\"" + selectName + "\"]");
            }

            if(!select_){
                return;
            }

            select_.innerHTML = "<select></select>";
            select = select_.childNodes[0];

            if(option.values){
                values = option.values;
                delete option.values;
            }

            if(option.selected){
                selected = option.selected;
                delete option.selected;
            }

            if(option.empty){
                empty = option.empty;
                delete option.empty;
            }
        }
        else{
            // @ts-ignore
            select_ = arg1;
            select_.innerHTML = "<select></select>";
            select = select_.childNodes[0];

            let attrs = select_.attributes;
            let inputDeleteAttr = [];

            for(let n = 0 ; n < attrs.length ; n++){
                const attr = attrs[n];
                const key = attr.name;
                const val = attr.value;
                
                if(key.indexOf(":") === 0){
                    if(key == ":values"){
                        const valueBuffer = val.split(",");
                        for(let n2 = 0 ; n2 < valueBuffer.length ; n2++){
                            const vbf_ = valueBuffer[n2].split(":");
                            const valuesKey = vbf_[0].trim();
                            const valuesVal = vbf_[1].trim();
                            if(!values[valuesKey]){
                                values[valuesKey] = valuesVal;
                            }
                        }
                    }
                    else if(key == ":selected"){
                        selected = val;
                    }
                    else if(key == ":empty"){
                        empty = val;
                    }
                    else{
                        if(key == ":name"){
                            selectName = val;
                        }

                        if(!option[key.substring(1)]){
                            option[key.substring(1)] = val;
                        }    
                    }
                    inputDeleteAttr.push(key);
                }
            }

            for(let n = 0 ; n < inputDeleteAttr.length ; n++){
                select_.removeAttribute(inputDeleteAttr[n]);
            }
        }

        // @ts-ignore
        select_._option = option;
        // @ts-ignore
        select_._type = "select";
        // @ts-ignore
        select_._name = selectName;
        // @ts-ignore
        select_._child = select;
        
        const ignore = [
            "name",
        ];

        FormBuild._setAttribute(select, option, ignore);

        if(empty !== null){
            let optDom = document.createElement("option");
            optDom.innerText = empty;
            optDom.setAttribute("value", "");
            select.appendChild(optDom);
        }

        const c = Object.keys(values);
        for(let n = 0 ; n < c.length ; n++){
            const key = c[n];
            const val = values[key];

            let optDom = document.createElement("option");
            optDom.setAttribute("value", key);
            optDom.innerText = val;
            if(selected !== null){
                if(selected == key){
                    optDom.selected = true;
                }
            }
            select.appendChild(optDom);
        }

        if(selected){
            context._defaultValues[selectName] = selected;
        }

        return context;
    }

    static setRadio(context, arg1 : String | Element, values? : any, option? : any){
        
        if(!values){
            values = {};
        }

        if(!option){
            option = {};
        }

        let radio;
        let radioName;
        let checked = null;
        if(typeof arg1 == "string"){
            radioName = arg1;

            for(let n = 0 ; n < context._inputs.length ; n++){
                const i_ = context._inputs[n];
                if(i_._name == radioName){
                    // @ts-ignore
                    radio = i_;
                }
            }

            if(!radio){
                radio = context.vfm_.querySelector("v-radio[:name=\"" + radioName + "\"]");
            }

            if(!radio){
                return;
            }

            if(option.values){
                values = option.values;
                delete option.values;
            }

            if(option.checked){
                checked = option.checked;
                delete option.checked;
            }
        }
        else{
            // @ts-ignore
            radio = arg1;
            let attrs = radio.attributes;
            let inputDeleteAttr = [];
            
            for(let n = 0 ; n < attrs.length ; n++){
                const attr = attrs[n];
                const key = attr.name;
                const val = attr.value;
                
                if(key.indexOf(":") === 0){
                    
                    if(key == ":name"){
                        radioName = val;
                    }
                    else if(key == ":values"){
                        const valueBuffer = val.split(",");
                        for(let n2 = 0 ; n2 < valueBuffer.length ; n2++){
                            const vbf_ = valueBuffer[n2].split(":");
                            const valuesKey = vbf_[0].trim();
                            const valuesVal = vbf_[1].trim();
                            if(!values[valuesKey]){
                                values[valuesKey] = valuesVal;
                            }
                        }
                    }
                    else if(key == ":checked"){
                        checked = val;
                    }
                    else{
                        if(!option[key.substring(1)]){
                            option[key.substring(1)] = val;
                        }    
                    }
                    inputDeleteAttr.push(key);
                }
            }

            for(let n = 0 ; n < inputDeleteAttr.length ; n++){
                radio.removeAttribute(inputDeleteAttr[n]);
            }
        }

        // @ts-ignore
        radio._option = option;
        // @ts-ignore
        radio._type = "radio";
        // @ts-ignore
        radio._name = radioName;

        radio.innerHTML = "";
        radio._child = [];

        const c = Object.keys(values);
        for(let n = 0 ; n < c.length ; n++){
            const key = c[n];
            const val = values[key];

            const rid = radioName + key;

            let radioDom = document.createElement("input");
            radioDom.setAttribute("type", "radio");
            radioDom.setAttribute("name", radioName);
            radioDom.setAttribute("value", key);
            radioDom.setAttribute("id", rid);

            FormBuild._setAttribute(radioDom, option);

            if(checked !== null){
                if(checked == key){
                    radioDom.checked = true;
                }
            }

            radio.appendChild(radioDom);

            let labelDom = document.createElement("label");
            labelDom.innerText = val;
            labelDom.setAttribute("for", rid);

            radio.appendChild(labelDom);

            radio._child.push(radioDom);
        }

        return context;
    }

    static setCheckbox(context, arg1 : String | Element, values? : any, option? : any){

        if(!values){
            values = {};
        }

        if(!option){
            option = {};
        }

        let checkbox;
        let checkboxName;
        let checked = [];
        if(typeof arg1 == "string"){
            checkboxName = arg1;

            for(let n = 0 ; n < context._inputs.length ; n++){
                const i_ = context._inputs[n];
                if(i_._name == checkboxName){
                    // @ts-ignore
                    checkbox = i_;
                }
            }

            if(!checkbox){
                checkbox = context.vfm_.querySelector("v-checkbox[:name=\"" + checkboxName + "\"]");
            }

            if(!checkbox){
                return;
            }

            if(option.values){
                values = option.values;
                delete option.values;
            }

            if(option.checked){
                checked = option.checked;
                delete option.checked;
            }
        }
        else{
            // @ts-ignore
            checkbox = arg1;
            let attrs = checkbox.attributes;
            let inputDeleteAttr = [];
            
            for(let n = 0 ; n < attrs.length ; n++){
                const attr = attrs[n];
                const key = attr.name;
                const val = attr.value;
                
                if(key.indexOf(":") === 0){
                    
                    if(key == ":name"){
                        checkboxName = val;
                    }
                    else if(key == ":values"){
                        const valueBuffer = val.split(",");
                        for(let n2 = 0 ; n2 < valueBuffer.length ; n2++){
                            const vbf_ = valueBuffer[n2].split(":");
                            const valuesKey = vbf_[0].trim();
                            const valuesVal = vbf_[1].trim();
                            if(!values[valuesKey]){
                                values[valuesKey] = valuesVal;
                            }
                        }
                    }
                    else if(key == ":checked"){
                        checked = val.split(",");
                    }
                    else{
                        if(!option[key.substring(1)]){
                            option[key.substring(1)] = val;
                        }    
                    }
                    inputDeleteAttr.push(key);
                }
            }

            for(let n = 0 ; n < inputDeleteAttr.length ; n++){
                checkbox.removeAttribute(inputDeleteAttr[n]);
            }
        }

        // @ts-ignore
        checkbox._option = option;
        // @ts-ignore
        checkbox._type = "checkbox";

        checkbox.innerHTML = "";
        checkbox._name = checkboxName;
        checkbox._child = [];

        const c = Object.keys(values);
        for(let n = 0 ; n < c.length ; n++){
            const key = c[n];
            const val = values[key];

            const rid = checkboxName + key;

            let checkboxDom = document.createElement("input");
            checkboxDom.setAttribute("type", "checkbox");
            checkboxDom.setAttribute("name", checkboxName);
            checkboxDom.setAttribute("value", key);
            checkboxDom.setAttribute("id", rid);

            FormBuild._setAttribute(checkboxDom, option);

            if(checked !== null){
                for(let n2 = 0 ; n2 < checked.length ; n2++){
                    if(checked[n2].toString() === key.toString()){
                        checkboxDom.checked = true;
                    }                    
                }
            }

            checkbox.appendChild(checkboxDom);

            let labelDom = document.createElement("label");
            labelDom.innerText = val;
            labelDom.setAttribute("for", rid);

            checkbox.appendChild(labelDom);

            checkbox._child.push(checkboxDom);
        }

        return context;
    }

    static setError(context, arg1 : String | Element, message? : String, option? : any){

        if(!option){
            option = {};
        }

        let errorElement_;
        let errorElement;
        let errorName;
        if(typeof arg1 == "string"){
            errorName = arg1;

            for(let n = 0 ; n < context._inputs.length ; n++){
                const i_ = context._inputs[n];
                if(i_._name == errorName){
                    if(i_._type == "error"){
                        // @ts-ignore
                        errorElement_ = i_;
                    }
                    else{
                        if(message){
                            i_.setAttribute("error","");
                        }
                        else{
                            i_.removeAttribute("error");
                        }
                    }
                }
            }

            if(!errorElement_){
                errorElement_ = context.vfm_.querySelector("v-error[:name=\"" + errorName + "\"]");
            }

            if(!errorElement_){
                return;
            }            

        }
        else{
            errorElement_ = arg1;

            let attrs = errorElement_.attributes;
            let inputDeleteAttr = [];
            for(let n = 0 ; n < attrs.length ; n++){
                const attr = attrs[n];
                const key = attr.name;
                const val = attr.value;
                
                if(key.indexOf(":") === 0){
                    
                    if(key == ":name"){
                        errorName = val;
                    }
                    else{
                        if(!option[key.substring(1)]){
                            option[key.substring(1)] = val;
                        }    
                    }
                    inputDeleteAttr.push(key);
                }
            }
    
            for(let n = 0 ; n < inputDeleteAttr.length ; n++){
                errorElement_.removeAttribute(inputDeleteAttr[n]);
            }
        }

        // @ts-ignore
        errorElement_._option = option;
        // @ts-ignore
        errorElement_._type = "error";
        // @ts-ignore
        errorElement_._name = errorName;

        if(message){
            errorElement_.innerHTML = "<error>" + message + "</error>";
            errorElement = errorElement_.childNodes[0];
            errorElement_._child = errorElement;
            FormBuild._setAttribute(errorElement, option);
        }
        else{
            errorElement_.innerHTML = "";
        }

        return context;
    }

    static resetError(context){

        for(let n = 0 ; n < context._inputs.length ; n++){
            const i_ = context._inputs[n];
            if(i_._type == "error"){
                i_.innerHTML = "";
            }
            else{
                i_.removeAttribute("error");
            }
        }
        return context;
    }

}
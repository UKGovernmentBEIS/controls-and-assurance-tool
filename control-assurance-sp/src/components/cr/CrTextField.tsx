import * as React from 'react';
import styles from '../../styles/cr.module.scss';
import { TextField, MaskedTextField } from 'office-ui-fabric-react/lib/TextField';
import { TextFieldCharCounter, FieldHistory, FieldErrorMessage } from './FieldDecorators';

export interface ICrTextFieldProps {
    label?: string;
    className?: string;
    value: string;
    disabled?: boolean;
    readOnly?: boolean;
    required?: boolean;
    placeholder?: string;
    multiline?: boolean;
    rows?: number;
    maxLength?: number;
    onChanged?: (value: string) => void;
    onBlur?: (ev:any) => void;
    history?: string;
    charCounter?: boolean;
    errorMessage?: string;
    suffix?: string;
    numbersOnly?: boolean;
    style? :React.CSSProperties;
}

export class CrTextField extends React.Component<ICrTextFieldProps, {}> {
    public render(): JSX.Element {
        let val: string;
        if (this.props.value === null) val = ''; else val = this.props.value; // Hack to make textfield clear on value reset to null. Known bug in UI Fabric 5.83.0
        return (
            <div className={this.props.className}>
                {/* <TextField
                    label={this.props.label}
                    className={this.props.errorMessage && styles.textFieldInvalid}
                    required={this.props.required}
                    disabled={this.props.disabled}
                    placeholder={this.props.placeholder}
                    multiline={this.props.multiline || false}
                    rows={this.props.rows}
                    maxLength={this.props.maxLength}
                    value={val}
                    onChanged={this.props.onChanged}
                    suffix={this.props.suffix}
                /> */}

                {this.renderTextField(val)}
                {this.props.charCounter && this.props.maxLength && <TextFieldCharCounter maxChars={this.props.maxLength} text={this.props.value} />}
                {this.props.history && <FieldHistory value={this.props.history} />}
                {this.props.errorMessage && <FieldErrorMessage value={this.props.errorMessage} />}
            </div>
        );
    }

    private renderTextField(val: string): JSX.Element{
        let x: JSX.Element;
        if(this.props.numbersOnly === true){
            x = this.renderMaskedTextFieldNumbersOnly2(val);
            //bug in masked field, could not use
            //x = this.renderStdTextField(val);
        }
        else
            x = this.renderStdTextField(val);
        return(x);
    }

    private renderStdTextField(val: string): JSX.Element{
        





        return(
            <TextField
            label={this.props.label}
            className={this.props.errorMessage && styles.textFieldInvalid}
            style={this.props.style && this.props.style}
            required={this.props.required}
            disabled={this.props.disabled}
            placeholder={this.props.placeholder}
            multiline={this.props.multiline || false}
            rows={this.props.rows}
            maxLength={this.props.maxLength}
            value={val}
            onChanged={this.props.onChanged}
            onBlur={this.props.onBlur}
            suffix={this.props.suffix}
            readOnly={this.props.readOnly}
            
            />
        );
    }

    private renderMaskedTextFieldNumbersOnly2(val: string): JSX.Element{
        const maskFormat: { [key: string]: RegExp } = {
            '*': /[0-9]/,
          };


        let maskVal: string = "";
        if(this.props.maxLength){
            for (let i = 0; i < this.props.maxLength; i++) { 
                maskVal += "*";
              }
        }
        else{
            //just a default value to allow to enter enough digits
            maskVal = "****************************************************************";
        }

        let vv = String(val);
        return(
            <MaskedTextField
            //key={ this.generateKey("textfield")}
            label={this.props.label}
            className={this.props.errorMessage && styles.textFieldInvalid}
            style={this.props.style && this.props.style}
            required={this.props.required}
            disabled={this.props.disabled}
            placeholder={this.props.placeholder}
            multiline={this.props.multiline || false}
            rows={this.props.rows}
            maxLength={this.props.maxLength}
            value={vv}
            onBlur={this.props.onBlur}
            onChanged={this.props.onChanged}
            suffix={this.props.suffix}
            maskChar=""
            mask={maskVal}
            maskFormat={maskFormat}
            readOnly={this.props.readOnly}
            
            />
        );




    }

    private renderMaskedTextFieldNumbersOnly(val: string): JSX.Element{
        let maskVal: string = "";
        if(this.props.maxLength){
            for (let i = 0; i < this.props.maxLength; i++) { 
                maskVal += "9";
              }
        }
        else{
            //just a default value to allow to enter enough digits
            maskVal = "999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999";
        }

        let vv = "";
        if(val)
            {
                //to sort the bug in MaskedTextField value
                vv = String(val); 
                return(
                    <MaskedTextField
                    key={ this.generateKey("textfield")}
                    label={this.props.label}
                    className={this.props.errorMessage && styles.textFieldInvalid}
                    required={this.props.required}
                    disabled={this.props.disabled}
                    placeholder={this.props.placeholder}
                    multiline={this.props.multiline || false}
                    rows={this.props.rows}
                    maxLength={this.props.maxLength}
                    value={vv}
                
                    onChanged={this.props.onChanged}
                    suffix={this.props.suffix}
                    maskChar=""
                    mask={maskVal}
                    />
                );
            }
        else{
            console.log("in falsy");
            return(
                <MaskedTextField
                key={ this.generateKey("textfield")}
                label={this.props.label}
                className={this.props.errorMessage && styles.textFieldInvalid}
                required={this.props.required}
                disabled={this.props.disabled}
                placeholder={this.props.placeholder}
                multiline={this.props.multiline || false}
                rows={this.props.rows}
                maxLength={this.props.maxLength}
                value=""
            
                onChanged={this.props.onChanged}
                suffix={this.props.suffix}
                maskChar=""
                mask={maskVal}
                />
            );
        }



    }
    public generateKey(prefix:string): string {
        return `${ prefix }_${ new Date().getTime() }`;
    }
}
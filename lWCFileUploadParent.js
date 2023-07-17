import { LightningElement, api,track } from 'lwc';
import saveFiles from '@salesforce/apex/GenericController.saveFiles';
import getFiles from '@salesforce/apex/GenericController.returnFiles';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';

export default class FileUploadLWC extends LightningElement {
    @api recordId;
    @track filesUploaded = [];
    @track showLoadingSpinner;
    @api checkBoxValue = false;
    @track filesUploaded = [];
    @track showLoadingSpinner;

    get acceptedFormats() {
        return ['.pdf', '.png','.jpg','.jpeg'];
    }
    handleChange(event) {
    this.checkBoxValue = event.target.checked;
    }
    handleUploadFinished(event) {
        this.showLoadingSpinner = true;
        //alert('fired'+JSON.stringify(event.detail.files[0]));
        const uploadedFiles = event.detail.files;
        let uploadedFileNames = '';
        for(let i = 0; i < uploadedFiles.length; i++) {
            console.log(uploadedFiles[i].documentId);
            //name: '42224096_1.PNG', documentId: '0695h00000IVd7AAAT', contentVersionId: '0685h00000IhzW8AAJ', contentBodyId: '05T5h00000pQDFUEA4', mimeType: 'image/png'
            this.filesUploaded.push({
                name : uploadedFiles[i].name,
                documentId : uploadedFiles[i].documentId,
                contentVersionId : uploadedFiles[i].contentVersionId,
                contentBodyId : uploadedFiles[i].contentBodyId,
                mimeType : uploadedFiles[i].mimeType
            });
            //uploadedFileNames += uploadedFiles[i].name + ', ';
        }
        console.log(this.filesUploaded);
        this.connectedCallback();
    }

    connectedCallback() {
        saveFiles({filesToInsert:this.filesUploaded,childCheckBox:this.checkBoxValue,recordId : this.recordId})
        .then(result=>{
            this.checkBoxValue = false; 
            this.error = undefined;
            this.showLoadingSpinner = false;
        }).catch(error=>{
            this.checkBoxValue = false; 
            this.error = error;
            this.showLoadingSpinner = false;
        })
    }
}
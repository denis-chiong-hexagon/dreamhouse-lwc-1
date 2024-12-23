import { LightningElement, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { loadScript } from 'lightning/platformResourceLoader';
import signaturePadURL from '@salesforce/resourceUrl/signature_pad';
import saveSignature from '@salesforce/apex/SignaturePadController.saveSignature';

export default class SignaturePad extends LightningElement {
    @api recordId;
    sigPadInitialized = false;
    canvasWidth = 400;
    canvasHeight = 200;

    renderedCallback() {
        if (this.sigPadInitialized) {
            return;
        }
        this.sigPadInitialized = true;

        Promise.all([loadScript(this, signaturePadURL)])
            .then(() => {
                this.initialize();
            })
            .catch((error) => {
                console.log(error);
            });
    }

    initialize() {
        const canvas = this.template.querySelector('canvas.signature-pad');
        this.signaturePad = new window.SignaturePad(canvas);
    }

    handleClick() {
        const signatureImage = this.signaturePad.toDataURL();

        this.parseBase64Image(signatureImage);

        //Attach the signature to the record
        saveSignature({ recordId: this.recordId, base64Data: signatureImage })
            .then(() => {
                console.log('Signature saved');
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Signature saved successfully',
                        variant: 'success',
                    })
                );
            })
            .catch((error) => {
                console.error('Error saving signature', error);
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error saving signature',
                        message: error.body.message,
                        variant: 'error',
                    })
                );
            });
    }

    parseBase64Image(signaturePadResponse) {
        //In the response we have data:image/png;base64,iVBORw0KGgoAAAANSU...
        //We need to extract just the base64 part

        const base64Image = signaturePadResponse.split(',')[1];
        console.log('base64Image', base64Image);

        signaturePadResponse = base64Image;
    }
}

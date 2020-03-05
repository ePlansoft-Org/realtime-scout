class Analysis {
    constructor(filename, filesize, parameters) {
        this.pdf = {
            filename: filename,
            filesize: filesize,
            numPages: 0,
            outlines: null,
            results: [],
            pages: [],
            pageDimensions: {}
        };
        this._parameters = parameters;
    }

    /**
     * Get plain javascript object without prototypes 
     * @return {Object} 
     */
    toObject() {
        return Object.assign({}, this.pdf);
    }

    /**
     * Get Status codes based on parameters, 'success', 'suspicious' or 'failed' 
     * @return {String} 
     */
    getStatus() {
        const statusSets = [];
        const results = this.get('results');
        results.forEach((item) => {
            statusSets.push(this._isResultPassed(item, true))
        });
        return (statusSets.includes('failed')) ? 'failed' :
            (statusSets.includes('suspicious')) ? 'suspicious' : 'success';
    }

    setPDFDoc(pdfDoc) {
        this._pdfDoc = pdfDoc;
    }

    getFailedParameters(includeAllowFailed = true) {
        return this.get('results')
            .filter(item => !item.success)
            .filter(item => {
                return (includeAllowFailed) ? true : !this._isResultPassed(item, false);
            });
    }

    /**
     * Check if this analysis is passed based on parameters
     * @return {Boolean} 
     */
    isPassed() {
        const results = this.get('results');
        for (let i = 0; i < results.length; i++) {
            if (!this._isResultPassed(results[i])) {
                return false;
            }
        }
        return true;
    }

    addResult(key, success = Boolean, value = null) {
        this.pdf.results.push({
            key,
            success,
            value
        });
    }

    getPage(pageNumber) {
        return this.pdf.pages[pageNumber - 1];
    }

    isResultPassed(resultItem = {}, returnCode = false) {
        const parameter = this._getParameter(resultItem.key);
        if (resultItem.success) {
            return (returnCode) ? 'success' : true;
        } else
        if (!resultItem.success && parameter.allowFailed) {
            return (returnCode) ? 'suspicious' : true;
        } else {
            return (returnCode) ? 'failed' : false;
        }
    }

    getParameter(key) {
        return this._parameters.find((item) => {
            return item.key === key;
        });
    }

    setPDFDoc(pdfDoc) {
        this._pdfDoc = pdfDoc;
    }

    getPDFDoc() {
        return this._pdfDoc;
    }

        /**
     * get value by property name
     * @param {String} property name
     * @return {Mixed} property value 
     */
    get(prop) {
        return this.pdf[prop];
    }

    /**
     * set value by property name
     * @param {String} property name
     * @param {Mixed} new property value 
     */
    set(prop, value) {
        this.pdf[prop] = value;
    }
}

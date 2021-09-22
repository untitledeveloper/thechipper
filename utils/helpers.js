const { split } = require("lodash");

/* TBC */
 

module.exports = {
    ddmmyyyyToDate: (ddmmyyyy, delimiter) => {
        let delim = delimiter ? delimiter : '/';
        let dateParts = ddmmyyyy.split(delim);
        return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
    }
}
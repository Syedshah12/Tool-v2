export function filterData(jsonData, userProvidedDate) {
    const fieldsToFilter = {
        "Entity Type:": "CARRIER",
        "Phone:": null,
        "MC/MX/FF Number(s):": "MC-",
        "Legal Name:": null,
        "Physical Address:": null,
        "USDOT Number:": null,
        "Power Units:": null,
        "MCS-150 Form Date:": null,
        "Operating Status:": null,
    };

    const filteredObject = {};

    // Parse the user-provided date
  
    const userDate = new Date(userProvidedDate);
  

    jsonData.forEach(item => {
        const key = Object.keys(item)[0];
        const value = item[key];
        if (fieldsToFilter.hasOwnProperty(key)) {
            switch (key) {
                case "Power Units:":
                    filteredObject[key] = parseInt(value) >= 1 ? value : false;
                    break;
                case "Entity Type:":
                    filteredObject[key] = value.toLowerCase() === "carrier" ? "CARRIER" : false;
                    break;
                case "Operating Status:":
                    filteredObject[key] = value.toLowerCase().includes("inactive") ? false : value;
                    break;
                case "MC/MX/FF Number(s):":
                    if (value.startsWith("MC-")) {
                        filteredObject[key] = value.substring("MC-".length);
                    }
                    break;
                    case "MCS-150 Form Date:":
                        const dateParts = value.split('/');
                        const date = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
                        // Compare with the user-provided date
                        filteredObject[key] = date < userDate ? value : false;
                        break;
                default:
                    filteredObject[key] = value;
                    break;
            }
        } else if (key === 'Inspections') {
            filteredObject['totalIEPInspections'] = value.totalIEPInspections.toString();
            filteredObject['totalInspections'] = value.totalInspections.toString();
        }
    });

    return filteredObject;
}

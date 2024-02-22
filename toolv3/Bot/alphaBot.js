import { scrapeTableData } from './modifiedBot.js';
import { filterData } from './funcFilterData.js';




export async function handleSearch(limit,input,date) {
    const result=[];
    let myInput = input; // Starting input value
    let limitVar=0;
    let currentInput = myInput; // Initialize the current input value

    try {
      
        // Continue searching until currentInput reaches the limit
        while (!(limitVar===limit)) {
           console.log(limitVar);
            const tableData = await scrapeTableData(currentInput.toString());

            if (tableData.error) {
                console.log(tableData.error);
            } else {
                const filteredData = filterData(tableData,date);
                console.log('Filtered Data for input:', currentInput);
                console.log(filteredData);

                // Check if all values in the filteredData object are true
                // const allValuesTrue = Object.values(filteredData).every(value => value === true);
                const allValuesTrue = Object.keys(filteredData).length > 0 && 
                               Object.values(filteredData).every(value => value !== false);

                // If all values are true, increment currentInput
                if (allValuesTrue) {
                    limitVar++;
                    result.push(filteredData);
                }
            }
            
            currentInput++;
       
        }

        console.log('Reached the input limit:', currentInput);
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}

// // Usage example:
// const myResult=await handleSearch(1,'27658','12/29/2020 '); // This will continue searching until the currentInput reaches input + 2
// console.log(myResult);

 
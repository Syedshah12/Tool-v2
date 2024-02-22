// puppeteer_scraper.js
import puppeteer from 'puppeteer';


export async function scrapeTableData(companyCode) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let Inspections = {};
    try {
        await page.goto('https://safer.fmcsa.dot.gov/CompanySnapshot.aspx');

        const radioButton = await page.$('input[type="radio"][id="2"]');
        await radioButton.click();

        const inputElement = await page.$('input[name="query_string"]');
        await inputElement.type(companyCode.toString(), { delay: 100 });

        await Promise.all([
            page.waitForNavigation(), // Ensure navigation is complete
            page.click('input[type="submit"][value="Search"]')
        ]);

        // Wait for the table to be available on the page with a timeout of 3000 milliseconds
        const tableSelector = 'table[summary="For formatting purpose"]';
        await page.waitForSelector(tableSelector, { timeout: 1000 });
        await page.waitForSelector('font[size="2"][face="arial"]');
        const fontElements = await page.$$('font[size="2"][face="arial"]');


        for (const fontElement of fontElements) {
            const childElements = await fontElement.$$('font[color="#0000C0"]'); // Selecting child elements with specific color
        
            // Check if the font element contains the desired child elements
            const hasDesiredChildElements = await fontElement.evaluate((element) => {
                return element.innerHTML.includes('Total Inspections: <font color="#0000C0">') &&
                     element.innerHTML.includes('Total IEP Inspections: <font color="#0000C0">');
            });
        
            // If the font element contains the desired child elements, extract its inner text
            if (hasDesiredChildElements) {
              const textContent = await fontElement.evaluate(element => element.innerText);
              
              // Extract Total Inspections and Total IEP Inspections values
              const totalInspections = parseInt(textContent.match(/Total Inspections: (\d+)/)[1]);
              const totalIEPInspections = parseInt(textContent.match(/Total IEP Inspections: (\d+)/)[1]);
    
              // Update the Inspections object
              Inspections.totalIEPInspections = totalIEPInspections;
              Inspections.totalInspections = totalInspections;
    
              
            }
          }
    


        let tableData = await page.evaluate((tableSelector,Inspections) => {
            const table = document.querySelector(tableSelector);
            const data = [];

            // Iterate over each row in the table
            table.querySelectorAll('tr').forEach(row => {
                let rowData = {};

                // Iterate over each cell in the row
                row.querySelectorAll('th, td').forEach((cell, index) => {
                    // Check if it's a header or data cell
                    if (cell.tagName.toLowerCase() === 'th') {
                        // If it's a th cell, create a new object
                        rowData[cell.innerText.trim()] = '';
                    } else {
                        // If it's a td cell, add its content to the last object
                        const keys = Object.keys(rowData);
                        const lastKey = keys[keys.length - 1];
                        rowData[lastKey] = cell.innerText.trim();
                    }
                });
  rowData={...rowData,Inspections}
                // Push rowData to data array
                data.push(rowData);
            });

            return data;
        }, tableSelector,Inspections);

        await browser.close();

        // Return the tableData
        // tableData = { ...tableData,Inspections };
        
        return tableData;
    } catch (error) {
        console.error('Error occurred while scraping table data:', error);
        await browser.close();
        return { error: 'Table data not found' }; // Return custom error message
    }
}


// scrapeTableData('54391')
//     .then(tableData => {
//         if (tableData.error) {
//             console.log(tableData.error);
//         } else {
//          const filteredData=   filterData(tableData); // Do something with the table data
//             console.log(filteredData);
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });

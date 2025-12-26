APPLICATION SPECIFICATION
CONTRACT NUMBER GENERATOR – DISPUPR
1. Purpose
This module is used to automatically generate contract numbers, replacing manual book records, and ensuring:
•	No duplicate numbers
•	Sequential numbering according to defined rules
•	Correct official format
•	Complete history for audit purposes
________________________________________
2. Contract Numbering Principles
1.	A contract number is a system registration number
2.	The sequence number is assigned only when the user clicks “Generate Contract Number”
3.	The sequence must NOT be based on the contract date
4.	Once generated, the number cannot be edited
________________________________________
3. Sequence Rules
•	Sequence is per category/prefix per year
•	Number format:
o	01–09 → leading zero required
o	10, 11, 21, 111 → no leading zero
________________________________________
4. Prefix Components
Component	Option	Code
Location	Karimun Island	621
	Outside Karimun Island	622
Work Type	Physical Work	BM
	Consultancy	BM-KONS
Procurement Type	Tender	SP
	Direct Procurement	SPK
Department	—	DISPUPR
________________________________________
5. Contract Number Format
{LOCATION_CODE}/DISPUPR/{BM or BM-KONS}/{SP or SPK}/{SEQUENCE}/{ROMAN_MONTH}/{YEAR}
________________________________________
6. Contract Input Form
•	Project / Work Name
•	Contract Date (used for Roman month and year only)
•	Location
•	Work Type
•	Procurement Type
•	Button: “Generate Contract Number”
________________________________________
7. Contract Number Examples
•	621/DISPUPR/BM/SPK/01/X/2025
•	622/DISPUPR/BM/SP/12/VI/2025
•	621/DISPUPR/BM-KONS/SPK/03/III/2025
________________________________________
8. Stored Data (Digital Replacement for Manual Book)
•	Contract number
•	Project / work name
•	Contract date
•	System registration date & time
•	User / operator (optional)
________________________________________
9. Restrictions (MANDATORY)
❌ Sequence based on contract date
❌ Manual editing of generated numbers
❌ Shared counter with BAST numbers


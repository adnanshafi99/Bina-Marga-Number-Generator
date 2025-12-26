📄 APPLICATION SPECIFICATION
BAST NUMBER GENERATOR – DISPUPR
1. Purpose
This module is used to automatically generate BAST numbers, fully replacing manual BAST registration books.
________________________________________
2. BAST Numbering Principles
1.	A BAST number is a system registration number
2.	The sequence number is assigned only when the user clicks “Generate BAST Number”
3.	The sequence must NOT be based on the BAST date
4.	Once generated, the number cannot be edited
________________________________________
3. Sequence Rules
•	One global counter per year
•	Automatically resets when the year changes
•	Number format:
o	01–09 → leading zero required
o	10, 11, 21, 111 → no leading zero
________________________________________
4. BAST Number Format
{SEQUENCE}/BAST-BM/{ROMAN_MONTH}/{YEAR}
________________________________________
5. BAST Input Form
•	Project / work name
•	BAST date (used for Roman month and year only)
•	Button: “Generate BAST Number”
________________________________________
6. BAST Number Examples
•	01/BAST-BM/X/2025
•	15/BAST-BM/XII/2025
________________________________________
7. Stored Data (Digital Replacement for Manual Book)
•	BAST number
•	Project / work name
•	BAST date
•	System registration date & time
•	User / operator (optional)
________________________________________
8. Important Note
A BAST document with an earlier BAST date may receive a higher number if it is registered later.
This behavior is intentional and administratively correct, because numbering follows system registration order, not event chronology.
________________________________________
9. Restrictions (MANDATORY)
❌ Sequence based on BAST date
❌ Manual editing of generated numbers
❌ Using BAST counter for contract numbers
________________________________________
✅ FINAL CONFIRMATION FOR DEVELOPERS
•	Contract and BAST modules must be completely separated
•	Each module has its own counter logic
•	Counters must never be shared
•	Treat them as two independent systems within one application


# **App Name**: SalesAI Insights

## Core Features:

- Data Upload and Parsing: Allow users to upload a CSV or Excel file, then parse and validate the data, extracting company names, website URLs, and offers. Show progress in UI.
- Website Content Extraction: Fetch the content from the company's website using the provided URL. Extract visible text while removing HTML tags for AI analysis.
- AI Report Generation: Use Gemini API to analyze the extracted website text, company information, and the provided offer to generate a 15-section business report covering key aspects. The prompt passed to Gemini API will incorporate instructions acting like a tool such that Gemini decides how to structure its reponse.
- Report Storage: Store the generated reports in Firebase Storage as PDFs or Google Docs and save the file link and metadata in Firestore.
- Results Dashboard: Display generated report links in a table, with a button to download all reports as a ZIP file. Indicate processing state.
- Admin Notification (Optional): Optionally send an email notification with the report link to the admin/CEO after the report has been generated and stored.
- Asynchronous Processing & Retry Logic: Ensure each company is processed asynchronously to prevent timeouts, and add retry logic if a website fails to load, including status updates on the UI.

## Style Guidelines:

- Primary color: Dark purple (#6246EA) for a sophisticated and trustworthy feel, reflecting intelligence and automation.
- Background color: Light gray (#F0F0F3) to provide a clean and neutral backdrop.
- Accent color: Teal (#2EC4B6) to highlight key interactive elements and call to action.
- Body and headline font: 'Inter', a sans-serif font known for its clean and readable design, well-suited for both headlines and body text.
- Use modern and professional icons to represent different data points and actions.
- Clean and structured layout with clear visual hierarchy, making it easy for users to navigate and understand the information.
- Subtle animations and transitions to enhance the user experience during data processing and report generation.
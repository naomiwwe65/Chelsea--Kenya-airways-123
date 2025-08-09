Kenya Airways Inventory Management System Product Requirements Document (PRD)
1. Goals and Background Context
Goals
Reduce Aircraft-On-Ground (AOG) incidents due to parts unavailability by 20% within the first year.
Decrease the time required for the part ordering and fulfillment cycle by 30%.
Improve inventory count accuracy to 99.5%.
Enable users to find any specific part in the system in under 15 seconds.
Reduce the time to create a new part order by 75% compared to the current process.
Allow maintenance engineers to log parts used for an MRO job in under 2 minutes.
Background Context
This system addresses the significant operational challenges in managing Kenya Airways' vast and critical inventory of aviation parts. The primary problem is a lack of real-time visibility, which leads to costly stockouts, inefficient manual processes, and a disconnect between inventory levels and active maintenance (MRO) jobs.
This PRD outlines the requirements for a modern, centralized web application that will provide a single source of truth for parts logistics. By creating this system, we aim to increase operational efficiency, minimize aircraft downtime, and provide data-driven insights to optimize the entire parts lifecycle.
Change Log
Date	Version	Description	Author
August 01, 2025	1.0	Initial PRD draft	John, Product Manager
2. Requirements
Functional
FR1: The system shall require users to authenticate via an email and password to access the application.
FR2: The system shall provide a dashboard view that displays key statistics: Total Parts, In Stock, Low Stock, and Pending Orders.
FR3: The dashboard shall display a table of all parts currently at or below their defined minimum quantity threshold.
FR4: Users shall be able to view a complete list of all inventory parts.
FR5: Users shall be able to search the inventory list by Part Number or Name.
FR6: Users shall be able to add a new part to the inventory, including fields for Part No, Name, Category, Quantity, and Minimum Quantity.
FR7: Users shall be able to edit the details of an existing part.
FR8: Users shall be able to create new part orders, specifying the part, quantity, and order type (Issue / Restock).
FR9: Users shall be able to view a list of all past and present orders with their current status.
FR10: Users shall be able to manually update the status of an order (e.g., from 'Pending' to 'Completed').
Non-Functional
NFR1: The application must be responsive and fully functional on desktop, tablet, and mobile web browsers.
NFR2: All pages should achieve a target load time of under 2 seconds.
NFR3: API and database queries should respond in under 500ms on average.
NFR4: The system shall use Next.js for the frontend and Supabase (PostgreSQL) for the backend.
NFR5: User authentication and session management must be secure, protecting against common web vulnerabilities.
3. User Interface Design Goals
Overall UX Vision
The user experience will be centered on efficiency and clarity, delivered through a sophisticated "glassmorphism" interface. The design will be clean and modern, using transparency, blur effects, and a dark theme to create a sense of depth and focus. The goal is to present complex data in a visually engaging and easily digestible format.
Key Interaction Paradigms
The application will implement the interaction patterns established in the first prototype (sidebar, modals, data tables) but rendered with the new glass aesthetic.
Core Screens and Views
The implementation will match the screens detailed in the initial project description and the first HTML prototype.
Branding & Style Guide
The visual design is definitively established by the combination of the two prototypes. All development must adhere to these specifications:
Overall Theme: Dark mode "glassmorphism".
Background: A dark, linear-gradient background (#1a1a1a -> #2d2d2d -> #EC2227) with subtle, animated particle effects.
Panels & Cards: All primary containers (header, cards, content areas) will use the "glass" effect:
background: rgba(255, 255, 255, 0.15)
backdrop-filter: blur(20px)
border: 1px solid rgba(255, 255, 255, 0.2)
border-radius: 20px
Color Palette:
Primary Text & Highlights: white and rgba(255, 255, 255, 0.8)
Accent Gradients: A mix of ka-red (#EC2227) and ka-green (#228B22) for key elements like progress bars and icons.
Typography:
Font Family: Inter, sans-serif.
Iconography:
Icon Library: Font Awesome 6.
Target Device and Platforms: Web Responsive
The application will be fully responsive, ensuring the glass effects and layout adapt gracefully to desktops, tablets, and mobile devices.
4. Technical Assumptions
Repository Structure: Monorepo
To streamline development and dependency management between the Next.js frontend and the Python analysis scripts, a monorepo structure is recommended. This will keep all related code in a single repository, simplifying the build process and ensuring consistency.
Service Architecture
The architecture will be service-oriented, leveraging a Backend-as-a-Service (BaaS) model:
Primary Application: A Next.js full-stack application will handle all UI rendering, routing, and direct user interactions.
Backend Services: Supabase will provide the core backend infrastructure, including the database, user authentication, and auto-generated APIs for all standard CRUD (Create, Read, Update, Delete) operations.
Data Analysis Service: Python scripts will run as separate, serverless functions or scheduled jobs. They will connect directly to the Supabase database to perform complex data analysis and generate reports, without being part of the primary application's request/response cycle.
Testing Requirements
The project will adhere to a full testing pyramid to ensure quality and reliability:
Unit Tests: Each individual component and utility function will be covered by unit tests.
Integration Tests: Tests will be written to verify the integration between the Next.js frontend and the Supabase backend APIs.
End-to-End (E2E) Tests: Automated tests will cover critical user flows from the UI to the database.
Additional Technical Assumptions and Requests
The Supabase instance will be the single source of truth for all inventory, order, and MRO data.
The Next.js application will primarily interact with the auto-generated Supabase APIs for data management.
The Python scripts will have direct, secure access to the Supabase PostgreSQL database.
5. Epic List
Epic 1: Foundation & Core Inventory Management
Goal: Establish the foundational application with secure user access and provide the core functionality for managing the aviation parts inventory.
Epic 2: Order Management & Dashboard Integration
Goal: Implement the complete parts ordering and tracking lifecycle and enhance the dashboard with real-time order and stock-level alerts.
Epic 3: MRO & Advanced Features
Goal: Introduce the Maintenance (MRO) Job Tracker, a full-featured analytics suite, and bulk data upload capabilities to complete the system's primary feature set.
Epic 1: Foundation & Core Inventory Management
Epic Goal: To establish the foundational Next.js application, integrate it with Supabase for authentication and data storage, and implement the core features for viewing and managing the aviation parts inventory. This epic delivers the essential backbone of the system, providing immediate value by enabling users to track parts digitally.
Story 1.1: Project Setup & User Authentication
As a system administrator, I want the initial Next.js project to be set up with Supabase integration and a secure sign-in page, so that authorized users can securely access the application.
Acceptance Criteria:
A new Next.js project is initialized with the specified folder structure.
The Supabase client is installed and configured with the correct project URL and keys.
A "Sign In" page is created that matches the provided UI design.
Users can successfully sign in using their email and password, which are verified against the Supabase auth.users table.
Upon successful login, the user is redirected to the main application dashboard.
Users who are not authenticated cannot access any page other than the Sign In page.
Story 1.2: Application Layout & Dashboard Shell
As a user, I want to see the main application layout with a sidebar and header after logging in, so that I can navigate the application and see a consistent interface.
Acceptance Criteria:
The main application layout, including the top header and left sidebar, is implemented as per the HTML prototype.
The sidebar displays all the navigation links (Dashboard, Inventory, Orders, etc.) with correct icons.
The header displays the logo, a static search bar, a notification icon, and a user avatar.
The "Dashboard" page is created and displays the four main stat cards (e.g., "Total Inventory Items") with static, placeholder data.
The layout is responsive and adapts correctly to desktop and mobile screen sizes.
Story 1.3: View Inventory List
As an inventory manager, I want to view a complete list of all parts in the inventory, so that I can see the current stock levels and part details.
Acceptance Criteria:
The "Inventory" page is created.
On page load, the application fetches all records from the parts table in the Supabase database.
The fetched parts are displayed in a table with columns for Part No, Name, Category, Quantity, Min Qty, and Status.
The table includes a functional search bar that filters the list in real-time by Part No or Name.
A loading state is displayed while the data is being fetched.
An empty state is displayed if there are no parts in the inventory.
Story 1.4: Add & Edit Inventory Parts
As an inventory manager, I want to add new parts and edit existing parts, so that I can keep the inventory data accurate and up-to-date.
Acceptance Criteria:
An "Add Part" button is present on the Inventory page.
Clicking "Add Part" opens a modal form with input fields for Part No, Name, Category, Quantity, and Minimum Quantity.
Submitting the form creates a new record in the Supabase parts table.
The inventory table on the page updates to show the new part without requiring a page refresh.
Each row in the inventory table has an "Edit" action that opens the same modal, pre-filled with the data for that part.
Submitting the form in edit mode updates the corresponding record in the Supabase parts table.
Story 1.5: Implement Live Dashboard Data
As an inventory manager, I want the dashboard to display live data, so that I can get an accurate, at-a-glance overview of the inventory status.
Acceptance Criteria:
The "Total Inventory Items" stat card on the dashboard displays the total count of records from the parts table.
The "In Stock" stat card displays the sum of the quantity for all parts.
The "Low Stock" stat card displays the count of parts where quantity is less than or equal to min_quantity.
A "Low Stock Alert Table" is added to the dashboard, displaying the list of all parts that are below their minimum quantity threshold.
All dashboard data automatically updates when changes are made to the inventory.
Epic 2: Order Management & Dashboard Integration
Epic Goal: To implement the complete parts ordering and tracking lifecycle, from creation to completion. This epic will also integrate order data into the main dashboard, providing a more holistic, real-time view of all inventory and logistics operations.
Story 2.1: Create Part Orders
As a logistics coordinator, I want to create new orders for parts, so that I can formally track parts being issued for MRO jobs or being restocked.
Acceptance Criteria:
An "Orders" page is created and accessible from the sidebar.
A "+ Create Order" button is prominently displayed on the page.
Clicking the button opens a modal form for creating a new order.
The form includes a searchable dropdown to select a part from the existing inventory (parts table).
The form has an input field for Quantity and a selector for Order Type ('Issue' or 'Restock').
Submitting the form creates a new record in a new orders table in Supabase with a default status of 'Pending'.
Story 2.2: View and Manage Orders
As a logistics coordinator, I want to view a list of all orders and update their status, so that I can track the progress of each order from creation to completion.
Acceptance Criteria:
The "Orders" page displays a table listing all records from the orders table.
The table includes columns for Order ID, Part Name, Quantity, Type, Status, and Date Created.
Each order row contains an action (e.g., a dropdown menu) to update the Status to 'Completed' or 'Cancelled'.
Updating the status of an order immediately updates the corresponding record in the Supabase orders table.
The order table on the page updates in real-time to reflect the status change.
Story 2.3: Integrate Order Completion with Inventory Levels
As an inventory manager, I want the inventory stock levels to automatically update when an order is completed, so that the inventory count is always accurate and reflects real-world movement.
Acceptance Criteria:
When an order's status is updated to 'Completed':
If the order type is 'Issue', the quantity of the corresponding part in the parts table is automatically decreased by the order quantity.
If the order type is 'Restock', the quantity of the corresponding part in the parts table is automatically increased by the order quantity.
This transactional logic is handled securely and reliably (e.g., using a Supabase Database Function) to prevent data inconsistencies.
All relevant views (Inventory page, Dashboard stats) immediately reflect the updated stock levels.
Story 2.4: Enhance Dashboard with Order Data
As an inventory manager, I want the dashboard to show key statistics about orders, so that I have a complete operational overview in one place.
Acceptance Criteria:
The "Pending Orders" stat card on the dashboard now displays a live count of all orders with a 'Pending' status.
A "Recent Activity" feed is added to the dashboard as per the UI prototype.
The feed displays the last 5-10 significant events, such as "Order #101 Completed" or "Part #ABC Restocked".
The activity feed is dynamically generated from the orders and parts tables.
Epic 3: MRO & Advanced Features
Epic Goal: To complete the system's primary feature set by introducing the Maintenance, Repair, and Overhaul (MRO) Job Tracker, a full-featured analytics suite, bulk data upload capabilities, and user-facing settings. This epic transforms the tool from a simple inventory tracker into a comprehensive logistics and operations management platform.
Story 3.1: MRO Job Creation and Tracking
As a maintenance engineer, I want to create and track MRO jobs, so that I have a centralized record of all maintenance tasks for aircraft.
Acceptance Criteria:
An "MRO Job Tracker" page is created and accessible from the sidebar.
A "+ Add MRO Job" button opens a modal to create a new job.
The form includes fields for Job Title, Aircraft Reg No, Assigned Engineer, and Maintenance Date.
Submitting the form creates a new record in a new mro_jobs table in Supabase with a default status of 'In Progress'.
The MRO page displays a table of all jobs with their details and status.
Users can update the status of a job to 'Completed' or 'Delayed'.
Story 3.2: Associate Parts with MRO Jobs
As a maintenance engineer, I want to log the specific parts used for each MRO job, so that part usage is accurately tracked against maintenance activities.
Acceptance Criteria:
When viewing or editing an MRO job, there is an option to "Add/Log Parts Used".
This action allows the user to select multiple parts from the inventory and specify the quantity used for each.
Logging the parts creates records in a new mro_parts_usage table, linking the job, the part, and the quantity.
The system automatically creates a corresponding 'Issue' order in the orders table for the parts used, which is immediately marked as 'Completed' to ensure inventory levels are updated correctly.
The MRO Job details view displays a list of all parts used for that specific job.
Story 3.3: Implement Analytics Page
As a manager, I want to view a dedicated analytics page with detailed charts, so that I can analyze trends and make data-driven decisions about inventory and operations.
Acceptance Criteria:
An "Analytics" page is created and accessible from the sidebar.
The page includes summary cards for "Most Ordered," "Most Restocked," and "Fastest Moving" parts.
A pie chart displays the breakdown of inventory parts by category.
A line chart shows the trend of stock levels over time.
All charts are populated with live data from the Supabase database, calculated using Python analysis scripts or Supabase database functions.
Story 3.4: Implement Excel Upload Functionality
As an inventory manager, I want to upload an Excel file to perform bulk stock updates, so that I can efficiently manage large-scale inventory changes.
Acceptance Criteria:
An "Upload Excel" page is created.
The page features a file dropzone for uploading Excel or CSV files.
After upload, the system displays a preview of the data in a table format.
A "Validate" button checks the data for errors (e.g., missing columns, incorrect data types) and highlights any issues.
A "Submit" button, enabled only after successful validation, updates the parts table in the database with the new stock information.
Story 3.5: Implement Settings Page
As a user, I want a settings page, so that I can configure my personal preferences and system defaults.
Acceptance Criteria:
A "Settings" page is created and accessible from the sidebar.
The page includes a toggle for the UI theme (Light/Dark), which persists for the user.
The page allows an inventory manager to set a default minimum quantity for new parts.
The page includes options to configure notification preferences (e.g., enable/disable email alerts for low stock).
Story 3.6: Add Sign-up Page and Animation
As a new user, I want to be able to sign up for a new account and see an engaging animation, so that the onboarding process is welcoming and straightforward.
Acceptance Criteria:
A "Sign Up" page is created, accessible from the "Sign In" page.
The page includes a form for email and password registration.
A short, looping video animation is displayed on the sign-up page as per the project brief.
Successful registration creates a new user in the Supabase auth.users table and redirects to the Sign In page.
6. Next Steps
UX Expert Prompt
"Please review this completed PRD, paying close attention to the UI Design Goals (Section 3) and the detailed story breakdowns. Create a comprehensive UI/UX Specification document that includes detailed user flows, information architecture, and any further visual or interaction design details required for implementation."
Architect Prompt
"Using this completed PRD and the forthcoming UI/UX Specification as inputs, please create a comprehensive Fullstack Architecture Document. Your architecture must support all functional and non-functional requirements, align with the specified technology stack (Next.js, Supabase, Python), and provide a clear blueprint for the development team and AI agents."
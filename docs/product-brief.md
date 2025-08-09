Project Brief: Kenya Airways Aviation Parts Inventory Management System
Executive Summary
This project will create a modern, web-based inventory management system for Kenya Airways, specifically designed for aviation parts logistics. The system will replace outdated or manual tracking methods with a real-time, centralized platform, enabling efficient inventory tracking, streamlined ordering, and data-driven decision-making through analytics. The primary value proposition is to increase operational efficiency, reduce aircraft-on-ground (AOG) situations caused by stockouts, and provide management with clear visibility into parts lifecycle and maintenance operations.
Problem Statement
Currently, managing the vast and critical inventory of aviation parts at Kenya Airways likely faces several challenges. These may include a lack of real-time visibility into stock levels, leading to potential stockouts of critical components and costly AOG situations. Manual tracking processes are error-prone and time-consuming, while bulk stock updates are inefficient. Furthermore, there is a disconnect between inventory data and maintenance (MRO) activities, making it difficult to forecast parts demand accurately and track usage against specific repair jobs. Existing solutions lack the specialized focus on aviation logistics and the data analysis capabilities required to optimize operations.
Proposed Solution
We propose a full-stack web application built with Next.js for the frontend. The system will provide a centralized, single source of truth for all aviation parts.
Key features will include:
Real-time Inventory Tracking: A dynamic dashboard and detailed inventory pages to monitor stock levels, locations, and statuses.
Order Management: A module for creating, tracking, and managing part orders (both for issuing to MRO and restocking from suppliers).
Bulk Data Management: An Excel/CSV upload feature to handle large-scale stock updates efficiently.
Proactive Alerts: Automated low-stock notifications to prevent shortages of critical parts.
MRO Job Tracker: A dedicated section to log maintenance jobs and associate them with the specific parts used, linking inventory directly to operational usage.
Analytics & Reporting: A visual dashboard providing insights into inventory turnover, part usage trends, and order fulfillment metrics.
Engaging User Experience: A modern, responsive interface featuring a brief video animation on the sign-up page to enhance user onboarding.
Target Users
Inventory Manager: Responsible for overall stock levels, managing thresholds, and overseeing the ordering process. Needs a high-level dashboard and detailed reporting.
Logistics Coordinator: Executes the ordering and receiving of parts. Primarily uses the Order and Upload modules.
Maintenance Engineer/Technician: Requests and logs the usage of parts for specific MRO jobs. Primarily uses the Inventory and MRO Tracker modules.
Management/Analyst: Views analytics dashboards to make strategic decisions about procurement, budget, and operational efficiency.
Goals & Success Metrics
Business Objectives
Reduce Aircraft-On-Ground (AOG) incidents due to parts unavailability by 20% within the first year.
Decrease the time required for the part ordering and fulfillment cycle by 30%.
Improve inventory count accuracy to 99.5%.
User Success Metrics
Users can find any specific part in the system in under 15 seconds.
The time to create a new part order is reduced by 75% compared to the current process.
Maintenance engineers can log parts used for an MRO job in under 2 minutes.
Key Performance Indicators (KPIs)
Inventory Turnover Rate: To measure the efficiency of inventory usage.
Stockout Percentage: The frequency of stockouts for critical parts.
Order Fulfillment Time: The average time from order creation to completion.
User Adoption Rate: Percentage of the target team actively using the system weekly.
MVP Scope
To ensure a focused initial launch, the MVP will concentrate on the most critical inventory and order management functionalities.
Core Features (Must Have)
User Authentication: Secure Sign-In and user roles (Admin, Manager, User).
Dashboard: A simplified dashboard showing key stats: Total Parts, In Stock, and a Low Stock alert table.
Inventory Management: Ability to view the full inventory list with search and filter. Full CRUD (Create, Read, Update, Delete) functionality for individual parts via a modal.
Order Management: Ability to create and view orders (Issue/Restock). The status of orders can be manually updated.
Low Stock Alerts: A visible list or table of all parts that have fallen below their minimum quantity threshold.
Out of Scope for MVP
Advanced Analytics Page: The full analytics page with multiple charts will be deferred. The dashboard will provide the most critical data.
MRO Job Tracker: This is a significant module and will be a primary feature in Phase 2.
Automated Excel Upload: Bulk uploads will be handled manually or via database seeding for the MVP to focus on core logic first.
Settings Page: System settings will be configured directly in the backend for the MVP.
Sign-up Page Animation: The video animation will be added post-MVP to prioritize core functionality.
Post-MVP Vision
Phase 2 Features
Full MRO Job Tracker module.
Comprehensive Analytics page with customizable reports.
Automated Excel/CSV upload with data validation.
Long-term Vision
Integration with Kenya Airways' existing flight operations and maintenance scheduling systems for predictive parts demand.
AI-powered forecasting for part needs based on historical data and flight schedules.
A mobile-native application for technicians to use on the go.
Technical Considerations
Platform Requirements
Target Platforms: Web Responsive (Desktop, Tablet, Mobile).
Performance Requirements: Pages should load in under 2 seconds; database queries should respond in under 500ms.
Technology Preferences
Frontend: Next.js (React)
Backend: Supabase. This will provide the core backend services including the PostgreSQL database, user authentication, auto-generated RESTful APIs for CRUD operations, and file storage.
Data Analysis: Python will be used for advanced data analysis, reporting, and any complex business logic that runs separately and interacts with the Supabase database.
Database: PostgreSQL (provided and managed by Supabase).
Hosting/Infrastructure: Vercel for the Next.js frontend, with Supabase providing the fully hosted backend infrastructure.
Constraints & Assumptions
Constraints
The system must be able to integrate with or import data from existing inventory spreadsheets or databases.
The user interface must adhere to Kenya Airways' branding guidelines if they exist.
Key Assumptions
We will have access to subject matter experts from Kenya Airways' logistics and maintenance teams.
Historical inventory and order data is available for migration and to power initial analytics.
Users are willing to adopt a new system and provide feedback.
Risks & Open Questions
Key Risks
Data Migration: Migrating data from the old system could be complex and time-consuming.
User Adoption: Resistance to change from staff accustomed to current workflows.
Integration Complexity: If the system needs to integrate with other legacy Kenya Airways systems, this could pose unforeseen challenges.
Kenya Airways Inventory Management System Fullstack Architecture Document
1. Introduction
This document outlines the complete fullstack architecture for the Kenya Airways Inventory Management System, including backend systems, frontend implementation, and their integration. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack.
This unified approach combines what would traditionally be separate backend and frontend architecture documents, streamlining the development process for a modern fullstack application where these concerns are tightly integrated.
Starter Template or Existing Project
N/A - This is a greenfield project that will be built from scratch following the patterns defined in this document.
Change Log
Date	Version	Description	Author
August 01, 2025	1.0	Initial Architecture draft	Winston, Architect
2. High-Level Architecture
Technical Summary
The system will be a modern, full-stack web application built on a serverless architecture, leveraging a monorepo structure. The frontend will be a responsive Next.js application hosted on Vercel, providing a dynamic and performant user experience. The backend will be powered by Supabase, which offers a managed PostgreSQL database, user authentication, and auto-generated APIs, significantly accelerating development. For complex, data-intensive tasks, separate Python serverless functions will be used, interacting directly with the Supabase database. This architecture is designed for scalability, low operational overhead, and rapid, iterative development.
Platform and Infrastructure Choice
Platform: The recommended platform is a combination of Vercel for the frontend and Supabase for the backend.
Rationale: This stack is exceptionally well-suited for Next.js applications. Vercel provides a best-in-class developer experience, seamless CI/CD, and a global edge network for optimal performance. Supabase offers a complete backend-as-a-service, handling the database, authentication, and basic APIs out of the box, which allows us to focus on building the application's unique features.
Key Services:
Vercel: Hosting, CI/CD, Serverless Functions (for Next.js API routes).
Supabase: PostgreSQL Database, User Authentication, Auto-generated REST APIs, File Storage.
Deployment Host and Regions: Vercel (Global Edge Network), Supabase (Region to be selected based on proximity to Kenya Airways' primary operations, e.g., eu-west-2 London).
Repository Structure
Structure: Monorepo.
Rationale: A monorepo is ideal for this project as it will contain the Next.js frontend and the Python data analysis scripts in a single repository. This simplifies dependency management, promotes code sharing (e.g., for types), and streamlines the CI/CD pipeline.
Monorepo Tool: We will use pnpm workspaces for its efficiency and native support within the Node.js ecosystem.
High-Level Architecture Diagram
Generated mermaid
graph TD
    subgraph User
        U[User Browser]
    end

    subgraph Vercel Global Edge Network
        CDN[Next.js Frontend]
    end

    subgraph Supabase
        Auth[Authentication]
        API[Auto-generated APIs]
        DB[(PostgreSQL Database)]
        Storage[File Storage]
    end

    subgraph "AWS Lambda / Vercel Functions (Python)"
        Py[Python Data Analysis Functions]
    end

    U -- HTTPS --> CDN
    CDN -- Supabase API --> API
    CDN -- Supabase Auth --> Auth
    API -- SQL --> DB
    Py -- Direct Connection --> DB
    Storage -- Manages --> DB
Use code with caution.
Mermaid
Architectural Patterns
Jamstack Architecture: The frontend will be built following Jamstack principles (JavaScript, APIs, and Markup). This approach maximizes performance, security, and scalability by pre-rendering pages and leveraging APIs for dynamic content.
Backend as a Service (BaaS): We will leverage Supabase as a BaaS provider to handle core backend functionality, reducing the amount of custom backend code we need to write and maintain.
Serverless Functions: Both the Next.js API routes and the Python analysis scripts will be deployed as serverless functions. This provides automatic scaling and a pay-per-use cost model, which is highly efficient.
Component-Based UI: The frontend will be built using a library of reusable React components, ensuring a consistent and maintainable user interface.
3. Tech Stack
Technology Stack Table
Category	Technology	Version	Purpose & Rationale
Frontend Language	TypeScript	~5.4.5	Provides essential type safety for a scalable and maintainable frontend codebase.
Frontend Framework	Next.js	~14.2.3	The core React framework for building the UI. Chosen for its performance, serverless capabilities, and seamless integration with Vercel.
Styling	Tailwind CSS	~3.4.3	A utility-first CSS framework that will be used to implement the custom "glassmorphism" design provided in the prototypes.
UI Components	Shadcn/UI & Radix UI	Latest	A collection of accessible, unstyled components (Radix) with a CLI (Shadcn) to add them to our project, styled with Tailwind. This provides maximum design flexibility.
State Management	Zustand	~4.5.2	A simple and powerful state management library for handling global state (e.g., user session) with minimal boilerplate.
Backend Platform	Supabase	Latest	The primary backend, providing the database, authentication, and auto-generated APIs as a service (BaaS).
Database	PostgreSQL	15.x	The robust and reliable relational database managed by Supabase.
Authentication	Supabase Auth	Latest	Handles all user authentication, session management, and security using JWTs. Tightly integrated with the database for row-level security.
Data Analysis	Python	~3.11	Used for complex, data-intensive analysis and reporting tasks that run as separate serverless functions.
Frontend Testing	Vitest & React Testing Library	Latest	A modern, fast testing stack for unit and integration testing of React components.
Backend Testing	Pytest	Latest	The standard, powerful framework for testing the Python data analysis scripts.
E2E Testing	Playwright	~1.44.0	A modern end-to-end testing framework for verifying critical user flows across the entire application.
CI/CD & Hosting	Vercel	Latest	Provides a seamless, Git-based workflow for continuous integration, deployment, and hosting of the Next.js application.
4. Data Models
Users
Purpose: Manages user authentication and profiles via Supabase.
TypeScript Interface:
Generated typescript
export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
}
Use code with caution.
TypeScript
Parts
Purpose: The central inventory of unique aviation parts.
TypeScript Interface:
Generated typescript
export interface Part {
  id: string;
  part_number: string;
  name: string;
  category: string;
  quantity: number;
  min_quantity: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  created_at: string;
  updated_at: string;
}
Use code with caution.
TypeScript
Orders
Purpose: Tracks the issuance and restocking of parts from the main inventory.
TypeScript Interface:
Generated typescript
export interface Order {
  id: string;
  part_id: string;
  user_id: string;
  quantity: number;
  type: 'Issue' | 'Restock';
  status: 'Pending' | 'Completed' | 'Cancelled';
  created_at: string;
}
Use code with caution.
TypeScript
Job Tracker (Customer Repair Orders)
Purpose: Tracks the administrative and repair lifecycle of a specific part received from a customer.
TypeScript Interface:
Generated typescript
export interface JobTracker {
  id: string;
  customer: string;
  description: string;
  part_number?: string;
  serial_number?: string;
  lpo_date?: string;
  lpo_number?: string;
  ro_number?: string;
  kq_repair_order_date?: string;
  job_card_no: string;
  job_card_date?: string;
  kq_works_order_wo_no?: string;
  kq_works_order_date?: string;
  job_status: 'Pending' | 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled';
  job_status_date?: string;
  job_card_shared_with_finance: 'Yes' | 'No';
  created_at: string;
}
Use code with caution.
TypeScript
Internal MRO Jobs (Internal Maintenance)
Purpose: Represents a specific internal maintenance job on a Kenya Airways aircraft.
TypeScript Interface:
Generated typescript
export interface InternalMroJob {
  id: string;
  title: string;
  aircraft_reg_no: string;
  assigned_engineer: string;
  maintenance_date: string;
  status: 'In Progress' | 'Completed' | 'Delayed';
  created_at: string;
}
Use code with caution.
TypeScript
Internal MRO Parts Usage (Join Table)
Purpose: Links multiple parts from the main inventory to the specific internal MRO job in which they were used.
TypeScript Interface:
Generated typescript
export interface InternalMroPartUsage {
  id: string;
  internal_mro_job_id: string; // Foreign Key to InternalMroJob
  part_id: string;             // Foreign Key to Part
  quantity_used: number;
  created_at: string;
}
Use code with caution.
TypeScript
5. API Specification
REST API Specification (via Supabase)
The system will expose a RESTful API that is automatically generated by Supabase. All interactions will be secured using JWTs provided by Supabase Auth, which must be included in the Authorization header of every request.
Generated yaml
openapi: 3.0.0
info:
  title: Kenya Airways Inventory API
  version: 1.0.0
  description: API for managing aviation parts, orders, and MRO jobs.

servers:
  - url: https://{your-project-ref}.supabase.co/rest/v1
    description: Supabase Edge Network

security:
  - bearerAuth: []

paths:
  /parts:
    get:
      summary: List all inventory parts
      responses:
        '200':
          description: A list of parts.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Part'
    post:
      summary: Create a new part
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Part'
      responses:
        '201':
          description: Part created successfully.

  /orders:
    get:
      summary: List all orders
      responses:
        '200':
          description: A list of orders.
    post:
      summary: Create a new order
      responses:
        '201':
          description: Order created successfully.

  /job_tracker:
    get:
      summary: List all job tracker entries
      responses:
        '200':
          description: A list of job tracker entries.
    post:
      summary: Create a new job tracker entry
      responses:
        '201':
          description: Job tracker entry created successfully.

  /internal_mro_jobs:
    get:
      summary: List all internal MRO jobs
      responses:
        '200':
          description: A list of internal MRO jobs.
    post:
      summary: Create a new internal MRO job
      responses:
        '201':
          description: Internal MRO job created successfully.

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    Part:
      type: object
      properties:
        id: { type: string, format: uuid }
        part_number: { type: string }
        name: { type: string }
        category: { type: string }
        quantity: { type: integer }
        min_quantity: { type: integer }
        status: { type: string, enum: ['In Stock', 'Low Stock', 'Out of Stock'] }

    JobTracker:
      type: object
      properties:
        id: { type: string, format: uuid }
        customer: { type: string }
        description: { type: string }
        job_card_no: { type: string }
        job_status: { type: string, enum: ['Pending', 'In Progress', 'Completed', 'On Hold', 'Cancelled'] }
        job_card_shared_with_finance: { type: string, enum: ['Yes', 'No'] }
Use code with caution.
Yaml
6. Database Schema
The following SQL script should be executed in your Supabase project's SQL Editor to set up the required database structure.
Generated sql
-- Enable the UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PARTS TABLE
-- Stores the core inventory of all aviation parts.
CREATE TABLE public.parts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    quantity INTEGER NOT NULL DEFAULT 0,
    min_quantity INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'In Stock' CHECK (status IN ('In Stock', 'Low Stock', 'Out of Stock')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ
);
-- Add index for searching by name and part number
CREATE INDEX idx_parts_name ON public.parts(name);
CREATE INDEX idx_parts_part_number ON public.parts(part_number);
COMMENT ON TABLE public.parts IS 'Central inventory of all aviation parts.';

-- 2. ORDERS TABLE
-- Tracks transactions for issuing or restocking parts from inventory.
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    part_id UUID NOT NULL REFERENCES public.parts(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    type TEXT NOT NULL CHECK (type IN ('Issue', 'Restock')),
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Completed', 'Cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Add index for filtering by status and type
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_part_id ON public.orders(part_id);
COMMENT ON TABLE public.orders IS 'Tracks part issue and restock transactions.';

-- 3. JOB TRACKER TABLE
-- Tracks customer repair orders and their administrative lifecycle.
CREATE TABLE public.job_tracker (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer TEXT NOT NULL,
    description TEXT NOT NULL,
    part_number TEXT,
    serial_number TEXT,
    lpo_date DATE,
    lpo_number TEXT,
    ro_number TEXT,
    kq_repair_order_date DATE,
    job_card_no TEXT NOT NULL,
    job_card_date DATE,
    kq_works_order_wo_no TEXT,
    kq_works_order_date DATE,
    job_status TEXT NOT NULL DEFAULT 'Pending' CHECK (job_status IN ('Pending', 'In Progress', 'Completed', 'On Hold', 'Cancelled')),
    job_status_date DATE,
    job_card_shared_with_finance TEXT NOT NULL DEFAULT 'No' CHECK (job_card_shared_with_finance IN ('Yes', 'No')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Add index for filtering by customer and status
CREATE INDEX idx_job_tracker_customer ON public.job_tracker(customer);
CREATE INDEX idx_job_tracker_status ON public.job_tracker(job_status);
COMMENT ON TABLE public.job_tracker IS 'Tracks customer repair orders.';

-- 4. INTERNAL MRO JOBS TABLE
-- Tracks internal maintenance jobs on Kenya Airways aircraft.
CREATE TABLE public.internal_mro_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    aircraft_reg_no TEXT NOT NULL,
    assigned_engineer TEXT,
    maintenance_date DATE,
    status TEXT NOT NULL DEFAULT 'In Progress' CHECK (status IN ('In Progress', 'Completed', 'Delayed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE public.internal_mro_jobs IS 'Tracks internal maintenance jobs on KQ aircraft.';

-- 5. INTERNAL MRO PARTS USAGE (JOIN TABLE)
-- Links parts from inventory to the internal MRO jobs where they were used.
CREATE TABLE public.internal_mro_parts_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    internal_mro_job_id UUID NOT NULL REFERENCES public.internal_mro_jobs(id) ON DELETE CASCADE,
    part_id UUID NOT NULL REFERENCES public.parts(id) ON DELETE RESTRICT,
    quantity_used INTEGER NOT NULL CHECK (quantity_used > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Add index for efficient lookups
CREATE INDEX idx_mro_parts_usage_job_id ON public.internal_mro_parts_usage(internal_mro_job_id);
CREATE INDEX idx_mro_parts_usage_part_id ON public.internal_mro_parts_usage(part_id);
COMMENT ON TABLE public.internal_mro_parts_usage IS 'Join table linking parts to internal MRO jobs.';

-- CRITICAL: Enable Row-Level Security (RLS) on all tables
-- This is a foundational security measure in Supabase.
-- Policies must be created to define who can access and modify data.
ALTER TABLE public.parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_tracker ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_mro_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_mro_parts_usage ENABLE ROW LEVEL SECURITY;

-- Example RLS Policy: Allow authenticated users to see all parts.
-- More specific policies (e.g., based on user roles) will be required.
CREATE POLICY "Allow authenticated read access to parts"
ON public.parts
FOR SELECT
TO authenticated
USING (true);
Use code with caution.
SQL
7. Unified Project Structure
Generated plaintext
kq-inventory-monorepo/
├── apps/
│   ├── web/                    # Next.js Frontend Application
│   │   ├── app/                # App Router: pages, layouts, components
│   │   ├── components/         # Shared UI components (Shadcn/UI)
│   │   ├── lib/                # Utility functions, Supabase client
│   │   ├── public/             # Static assets (images, videos)
│   │   └── ...
│   └── python-analysis/        # Python scripts for data analysis
│       ├── scripts/            # Individual analysis scripts
│       ├── venv/               # Python virtual environment
│       └── requirements.txt    # Python dependencies
├── packages/
│   └── shared-types/           # Shared TypeScript types
│       └── index.ts
├── .gitignore
├── package.json                # Root package file with workspaces
├── pnpm-workspace.yaml
└── README.md
Use code with caution.
8. Development Workflow
Local Development Setup
Prerequisites
Node.js (v20.x or later)
pnpm (v9.x or later)
Python (v3.11 or later)
A Supabase account and a new project created.
Initial Setup
Clone the repository.
Create a .env.local file in apps/web/ by copying .env.example.
Populate .env.local with your Supabase Project URL and Anon Key.
Run pnpm install in the root directory to install all dependencies for the monorepo.
Set up the Python virtual environment: cd apps/python-analysis && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt.
Development Commands
Start Frontend Dev Server: pnpm --filter web dev
Run Python Scripts: cd apps/python-analysis && python scripts/your_script.py
Run All Tests: pnpm test
Environment Configuration
Required Environment Variables (apps/web/.env.local)
Generated bash
# Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL="https://your-project-ref.supabase.co"

# Supabase Anonymous Key (this is safe to expose in the browser)
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
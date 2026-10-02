# Changelog - FBR Digital Invoicing System

All notable changes and updates to the **FBR Digital Invoicing System** application are documented in this file.

---

## [v2.1.0] - Modular Components Suite Integration

### 🧩 Overview
Integrated the modular, reusable component architecture (`components/` directory) into the root application without breaking changes:
- **`TableComponent`**: Generic, data-driven table renderer supporting sorting, search filtering, dynamic pagination, and status-conditional row actions.
- **`FilterComponent`**: Reusable filter control bar generating dropdowns, search input with debounce, and date ranges.
- **`ExportComponent`**: Universal data exporter with built-in JSON, CSV/Excel, and vector PDF summary table generation.
- **`tableConfigs`**: Declarative column schemas for Invoices, Products, Sellers, and Buyers.
- **`components.css`**: Compact icon-only action buttons with animated tooltips, dropdown menus, and complete Dark/Light mode theming.
- **`componentTests`**: On-demand in-browser unit/integration test suite (`window.runComponentTests()`).

---

## [v2.0.0] - Standalone PRAL DI API v1.12 & v1.6 Integration & Upgrade

### 🚀 Overview
Modernized and upgraded the FBR Digital Invoicing System into a high-performance, modular standalone web application adhering to the official **PRAL Digital Invoicing API Specification (v1.12 / v1.6)**, and integrated comprehensive sample data seeding, dynamic invoice rendering, PDF generation fixes, and CRUD action workflows.

---

### 🌐 Master Catalog of FBR Digital Invoicing API Endpoints

| # | Endpoint Name | HTTP Method | Sandbox URL | Production URL | Description | Key Request Params / Payload |
|---|---|---|---|---|---|---|
| 1 | **Validate Invoice** | `POST` | `https://gw.fbr.gov.pk/di_data/v1/di/validateinvoicedata_sb` | `https://gw.fbr.gov.pk/di_data/v1/di/validateinvoicedata` | Validates complete invoice JSON payload against business rules without filing | JSON Body (`invoiceType`, `sellerNTNCNIC`, `buyerNTNCNIC`, `items[]`, etc.) |
| 2 | **Post / Submit Invoice** | `POST` | `https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata_sb` | `https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata` | Posts and officially registers the invoice on the FBR portal, returning official FBR Invoice Number | JSON Body with authorization bearer token |
| 3 | **Get Invoice Status** | `GET` | `https://gw.fbr.gov.pk/di_data/v1/di/getinvoicedata_sb` | `https://gw.fbr.gov.pk/di_data/v1/di/getinvoicedata` | Retrieves status and details of previously submitted invoices | `invoiceNumber` or `invoiceRefNo` |
| 4 | **Active Taxpayer List (ATL)** | `POST` | `https://gw.fbr.gov.pk/dist/v1/statl` | `https://gw.fbr.gov.pk/dist/v1/statl` | Checks taxpayer active/inactive registration status | `{ "Registration_No": "7908224" }` |
| 5 | **Get Registration Type** | `POST` | `https://gw.fbr.gov.pk/dist/v1/Get_Reg_Type` | `https://gw.fbr.gov.pk/dist/v1/Get_Reg_Type` | Fetches registration type (Registered / Unregistered / Corporate) | `{ "Registration_No": "7908224" }` |
| 6 | **Provinces List** | `GET` | `https://gw.fbr.gov.pk/pdi/v1/provinces` | `https://gw.fbr.gov.pk/pdi/v1/provinces` | Returns list of valid Pakistani provinces & territorial codes | None (Bearer Token header) |
| 7 | **Document Type Codes** | `GET` | `https://gw.fbr.gov.pk/pdi/v1/doctypecode` | `https://gw.fbr.gov.pk/pdi/v1/doctypecode` | Returns document types (Sale Invoice, Debit Note, Credit Note) | None (Bearer Token header) |
| 8 | **HS Codes / Item Desc** | `GET` | `https://gw.fbr.gov.pk/pdi/v1/itemdesccode` | `https://gw.fbr.gov.pk/pdi/v1/itemdesccode` | Returns Harmonized System (HS) product & service codes | None (Bearer Token header) |
| 9 | **Units of Measurement (UoM)** | `GET` | `https://gw.fbr.gov.pk/pdi/v1/uom` | `https://gw.fbr.gov.pk/pdi/v1/uom` | Retrieves valid Units of Measurement (KG, Meter, Number, etc.) | None (Bearer Token header) |
| 10 | **Transaction Type Codes** | `GET` | `https://gw.fbr.gov.pk/pdi/v1/transtypecode` | `https://gw.fbr.gov.pk/pdi/v1/transtypecode` | Retrieves valid transaction type codes (Standard, Export, 3rd Schedule) | None (Bearer Token header) |
| 11 | **Sales Type to Rate Mapping** | `GET` | `https://gw.fbr.gov.pk/pdi/v2/SaleTypeToRate` | `https://gw.fbr.gov.pk/pdi/v2/SaleTypeToRate` | Maps sales type and province to tax rates | Query: `date`, `transTypeId`, `originationSupplier` |
| 12 | **HS to UoM Mapping** | `GET` | `https://gw.fbr.gov.pk/pdi/v2/HS_UOM` | `https://gw.fbr.gov.pk/pdi/v2/HS_UOM` | Retrieves valid UoM for a given HS code | Query: `hs_code` |
| 13 | **SRO Schedule List** | `GET` | `https://gw.fbr.gov.pk/pdi/v1/SroSchedule` | `https://gw.fbr.gov.pk/pdi/v1/SroSchedule` | Retrieves statutory exemption / reduced rate SRO schedules | Query: `rate_id`, `date` |
| 14 | **SRO Item Code (v1)** | `GET` | `https://gw.fbr.gov.pk/pdi/v1/sroitemcode` | `https://gw.fbr.gov.pk/pdi/v1/sroitemcode` | Retrieves serial numbers for an SRO schedule | Query: `sro_id` |
| 15 | **SRO Item Code (v2)** | `GET` | `https://gw.fbr.gov.pk/pdi/v2/SROItem` | `https://gw.fbr.gov.pk/pdi/v2/SROItem` | Version 2 of SRO Item details and notification values | Query: `annexure_id`, `sro_id` |

---

### 🛠️ Key Improvements & Fixes

1. **Standalone Architecture & Separation**:
   - Created clean, independent repository in `f:\apps\FBR-Digital-Invoicing-System`.
   - Added npm package configuration (`package.json`) with `npm start` and `npm run dev` convenience scripts.
   - Cleaned up obsolete dependencies while retaining modular vanilla JS/IndexedDB architecture.

2. **Database Seeding & Immediate Live Dashboard**:
   - Integrated `seedDatabaseFromBackup()` utility capable of loading `fbr-invoice-backup-2025-08-26_17-27-15.json` on initial startup or via 1-click button in the UI.
   - Added **⚡ Load Sample Data** quick action in the navigation header and in the Application Settings tab.
   - Preloads verified sellers (Syed Imran Hussain Shah, Hussaini Logistics), buyers (Continental Biscuits, Pakistan State Oil), active products, and past submitted FBR invoices.
   - Time analytics (Today, Yesterday, This Week, This Month, This Year) and dashboard widgets now immediately calculate and display live figures.

3. **Invoice Preview & PDF Download Bug Fixes**:
   - **Root Cause**: Previously, previewing an invoice loaded the active form data or threw `ReferenceError: viewInvoice is not defined`. Downloading a PDF from the preview modal re-queried form inputs rather than the invoice record being previewed.
   - **Fix**:
     - Implemented `window.viewInvoice(invoiceId)` with automatic IndexedDB lookup and stored payload normalization.
     - Updated `renderInvoicePreview(invoice)` and `generateInvoicePDF(invoice, isDummy, isPreview)` with multi-tier seller & buyer resolution:
       1. Explicit seller/buyer objects.
       2. NTN lookup from `STORE_NAMES.sellers` / `STORE_NAMES.buyers` IndexedDB.
       3. Reconstructing business metadata from payload fields (`sellerBusinessName`, `sellerNTNCNIC`, `sellerAddress`, `sellerProvince`).
       4. Fallback to active select element only for new, unsaved draft forms.
     - PDF download button in preview modal now directly uses `window.currentInvoiceData`.

4. **Complete CRUD Action Handlers**:
   - `window.viewInvoice(id)`: Opens preview modal with full formatted invoice, QR code, line items, and totals.
   - `window.editInvoice(id)`: Loads complete invoice payload and line items into the form and switches to Create Invoice tab.
   - `window.duplicateInvoice(id)`: Clones invoice payload into form with a fresh reference number.
   - `window.confirmDeleteInvoice(id)`: Deletes invoice from IndexedDB and refreshes tables and dashboard.
   - `window.editProduct(id)` / `window.confirmDeleteProduct(id)`: Full product catalog management.
   - `window.addProductToInvoiceFromTable(id)`: 1-click add product from catalog to active invoice draft.

---

### 📚 References & Specifications Grounded
- **PRAL Digital Invoicing API v1.12 Complete Guide** (LogicLayer): OAuth Bearer token headers, validation rules, JSON schemas.
- **EZ Invoice Developer Guide for FBR E-Invoicing Integration** (ezinvoice.pk): Production & Sandbox endpoints, ATL verification, SRO schedules.
- **DICRM Portal & PRAL Documentation**: `docs/` v1.6 and v1.12 manuals.

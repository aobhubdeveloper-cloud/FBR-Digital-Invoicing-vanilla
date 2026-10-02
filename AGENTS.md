# 🤖 AGENTS.md — Developer & AI Agent Guide

Welcome to the **FBR PRAL Digital Invoicing System** codebase. This document outlines the architectural blueprints, coding standards, database schemas, API contracts, and implementation rules for AI agents and developers contributing to this repository.

---

## 🏛️ Project Identity & Architecture

- **Project Name**: FBR PRAL Digital Invoicing System
- **Repository**: `https://github.com/aobhubdeveloper-cloud/FBR-Digital-Invoicing-vanilla.git`
- **Core Technology**: 100% Client-Side Vanilla JavaScript (ES6+), Semantic HTML5, CSS3 Custom Tokens.
- **Persistence Engine**: Native Browser IndexedDB (`FBRInvoiceDB` / `fbr_invoice_app` v4).
- **External Dependencies**:
  - `DOMPurify` (HTML Sanitization & XSS Prevention)
  - `jsPDF` (Pixel-perfect client-side vector PDF rendering)
  - `QRCode.js` (High-density QR Code Version 2.0 generation)
  - `FontAwesome 6.4.0` (Icon system)

---

## 📂 File Map & Responsibilities

```
├── index.html          # Main application UI, modal templates, tab structures, and SVG icons
├── index.css           # Design tokens, theme variables (Dark/Light mode), and layout styling
├── app.js              # Core application logic, IndexedDB controller, PRAL API client, and event handlers
├── package.json        # Standalone project metadata and launch scripts
├── CHANGELOG.md        # Comprehensive version changelog & PRAL DI API endpoint catalog
├── README.md           # User-facing overview, features, and setup instructions
├── AGENTS.md           # Developer & AI Agent architecture and implementation specifications
└── App Logic.md        # Technical application logic documentation
```

---

## 💾 IndexedDB Schema & Data Storage

Database Name: **`fbr_invoice_app`** (Version `4`)

```javascript
const STORE_NAMES = {
  sellers: 'sellers',         // Business profiles, NTN/CNIC, STRN, Sandbox/Prod tokens
  buyers: 'buyers',           // Customers, NTN/CNIC, registration type, province
  invoices: 'invoices',       // Full invoice documents, FBR invoice numbers, line items
  products: 'products',       // HS codes, item descriptions, rates, UoM, default SROs
  preferences: 'preferences', // User settings, active theme (light/dark), default mode
  logs: 'logs'                // Audit trail, submission logs, API call history
};
```

### IndexedDB Core Helpers
- `dbGet(storeName, key)`: Retrieve record by primary key (`id` or `ntn`).
- `dbGetAll(storeName)`: Retrieve all records as an Array.
- `dbPut(storeName, record)`: Insert or update record.
- `dbDelete(storeName, key)`: Delete record.
- `seedDatabaseFromBackup()`: Auto-populates all stores from initial backup if empty or upon manual trigger.

---

## 🌐 Master PRAL Digital Invoicing API (v1.12 & v1.6)

All outbound API calls to PRAL must use `fetchWithAuth(endpoint, options)` to ensure proper `Bearer <Token>` formatting and automatic Sandbox/Production routing.

### 1. Invoice Operations
- **Validate Invoice**:
  - Sandbox: `https://gw.fbr.gov.pk/di_data/v1/di/validateinvoicedata_sb`
  - Production: `https://gw.fbr.gov.pk/di_data/v1/di/validateinvoicedata`
  - Method: `POST` | Header: `Authorization: Bearer <token>`, `Content-Type: application/json`
  - Payload: Complete Invoice JSON object.
- **Post / Submit Invoice**:
  - Sandbox: `https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata_sb`
  - Production: `https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata`
  - Method: `POST` | Returns: `{ invoiceNo: "...", status: "Valid", ... }`
- **Get Invoice Data**:
  - Sandbox: `https://gw.fbr.gov.pk/di_data/v1/di/getinvoicedata_sb`
  - Production: `https://gw.fbr.gov.pk/di_data/v1/di/getinvoicedata`
  - Method: `GET` | Query: `?invoiceNumber=<fbr_invoice_no>`

### 2. Taxpayer Verification & ATL
- **Active Taxpayer List (ATL)**: `https://gw.fbr.gov.pk/dist/v1/statl`
  - Method: `POST` | Body: `{"regno":"0788762","date":"2025-05-18"}`
- **Get Registration Type**: `https://gw.fbr.gov.pk/dist/v1/Get_Reg_Type`
  - Method: `POST` | Body: `{"Registration_No":"0788762"}`

### 3. Master & Reference Data
- **Provinces**: `GET` `https://gw.fbr.gov.pk/pdi/v1/provinces`
- **Document Types**: `GET` `https://gw.fbr.gov.pk/pdi/v1/doctypecode`
- **HS Codes / Descriptions**: `GET` `https://gw.fbr.gov.pk/pdi/v1/itemdesccode`
- **Units of Measure (UoM)**: `GET` `https://gw.fbr.gov.pk/pdi/v1/uom`
- **Transaction Types**: `GET` `https://gw.fbr.gov.pk/pdi/v1/transtypecode`
- **Sales Type to Rate**: `GET` `https://gw.fbr.gov.pk/pdi/v2/SaleTypeToRate?date={date}&transTypeId={id}&originationSupplier={prov}`
- **HS Code to UoM**: `GET` `https://gw.fbr.gov.pk/pdi/v2/HS_UOM?hs_code={hs_code}&annexure_id={id}`
- **SRO Schedule**: `GET` `https://gw.fbr.gov.pk/pdi/v1/SroSchedule?rate_id={id}&date={date}&origination_supplier_csv={csv}`
- **SRO Item (v1)**: `GET` `https://gw.fbr.gov.pk/pdi/v1/sroitemcode`
- **SRO Item (v2)**: `GET` `https://gw.fbr.gov.pk/pdi/v2/SROItem?date={date}&sro_id={sro_id}`

---

## ⚙️ Core Modules & Global Function Bindings

To ensure seamless onclick handling across generated DOM tables and modals, the following handlers are bound to `window`:

### Invoice Actions
- `window.viewInvoice(id)`: Fetches invoice record from `STORE_NAMES.invoices`, populates `currentInvoiceData`, renders dynamic HTML preview, generates 25×25 QR code, and opens modal.
- `window.editInvoice(id)`: Loads stored invoice into form, reconstructs line items table, updates UI header state to "Editing Invoice", and navigates to Create Invoice tab.
- `window.duplicateInvoice(id)`: Clones payload into form with a fresh reference number.
- `window.confirmDeleteInvoice(id)`: Prompts confirmation modal and removes invoice from IndexedDB.

### Product Actions
- `window.editProduct(id)`: Opens product modal prefilled with product data.
- `window.confirmDeleteProduct(id)`: Deletes product from catalog.
- `window.addProductToInvoiceFromTable(id)`: Adds product directly as a line item in active invoice draft.

### PDF & Print Handlers
- `window.generateInvoicePDF(invoiceData, isDummy, isPreview)`: Produces vector PDF invoice using jsPDF. Fallback hierarchy handles seller/buyer whether passed as objects, payload strings, or database lookups.
- `window.downloadInvoicePDF()`: Downloads PDF for the currently open preview modal.

---

## 📋 Strict Implementation Rules for Agents

1. **Do Not Introduce Node/Bundler Build Steps**: The application must run as pure Vanilla HTML/CSS/JS without requiring Babel, Webpack, or Vite compiles.
2. **Preserve DOMPurify Sanitization**: Always sanitize dynamic user text before injecting via `innerHTML`.
3. **Preserve Seller Token Resolution**: In `fetchWithAuth`, ensure fallback to the first available seller token in IndexedDB if none is explicitly selected in the active dropdown.
4. **Environment Isolation**: Always check `DOMElements.modeToggle.checked` to determine whether to call Sandbox or Production URLs.
5. **Keep Changelog & Docs in Sync**: Whenever new endpoints or database stores are added, update `CHANGELOG.md`, `README.md`, `App Logic.md`, and this `AGENTS.md` file.

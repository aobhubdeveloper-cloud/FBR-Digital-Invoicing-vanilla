# FBR Digital Invoicing System — Technical Architecture & App Logic

## 1. System Overview
The **FBR Digital Invoicing System** is a standalone, client-side enterprise web application designed to integrate with Pakistan's **Federal Board of Revenue (FBR)** and **Pakistan Revenue Automation Limited (PRAL)** Digital Invoicing Web Services (API v1.12 & v1.6).

The entire application runs in the browser without server-side compute, utilizing IndexedDB for local data persistence and calling PRAL REST APIs directly via secure HTTPS.

---

## 2. Technology Stack & Client-Side Dependencies

- **Core Scripting**: Vanilla JavaScript (ES6+ Modules, async/await, arrow functions).
- **Styling Architecture**: Vanilla CSS3 using custom CSS variables (Design Tokens for Light & Dark mode).
- **Client-Side Persistence**: Browser HTML5 IndexedDB (`FBRInvoiceDB` / database `fbr_invoice_app` v4).
- **Libraries & CDNs**:
  - `DOMPurify` (HTML Sanitization for XSS mitigation)
  - `jsPDF 2.5.1` (Client-side vector PDF invoice rendering)
  - `QRCode.js 1.5.3` (PRAL-compliant Version 2.0 25×25 QR code generator)
  - `FontAwesome 6.4.0` (UI iconography)

---

## 3. Data Model & IndexedDB Storage (`FBRInvoiceDB`)

Database Name: `fbr_invoice_app` | Schema Version: `4`

```javascript
const STORE_NAMES = {
  sellers: 'sellers',         // Business entities, NTN, STRN, addresses, tokens
  buyers: 'buyers',           // Buyer directory, NTN/CNIC, registration type, province
  invoices: 'invoices',       // Stored invoice documents, payloads, status, line items
  products: 'products',       // Inventory catalog, HS codes, standard UoM, tax rates
  preferences: 'preferences', // Local configurations, theme settings, UI state
  logs: 'logs'                // Audit trail of API validations and submissions
};
```

### Automatic Seeding Engine (`seedDatabaseFromBackup`)
On initialization, the app verifies if `STORE_NAMES.sellers` has records. If empty, or when the user clicks **⚡ Load Sample Data** in the header or Settings tab, it seeds the database from `fbr-invoice-backup-2025-08-26_17-27-15.json` to immediately provide:
- Configured seller businesses with tokens.
- Buyer directory with active ATL status.
- Standard product inventory mapped to HS codes.
- Pre-submitted FBR invoices for instant dashboard analytics.

---

## 4. Master PRAL API Catalog & Network Layer

All API calls flow through `fetchWithAuth(endpoint, options)` which injects the `Authorization: Bearer <token>` header, handles Sandbox vs. Production URLs, and falls back to available tokens:

```javascript
const API_URLS = {
  validate: {
    sandbox: "https://gw.fbr.gov.pk/di_data/v1/di/validateinvoicedata_sb",
    production: "https://gw.fbr.gov.pk/di_data/v1/di/validateinvoicedata"
  },
  submit: {
    sandbox: "https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata_sb",
    production: "https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata"
  },
  invoiceStatus: {
    sandbox: "https://gw.fbr.gov.pk/di_data/v1/di/getinvoicedata_sb",
    production: "https://gw.fbr.gov.pk/di_data/v1/di/getinvoicedata"
  },
  hsCodes: "https://gw.fbr.gov.pk/pdi/v1/itemdesccode",
  provinces: "https://gw.fbr.gov.pk/pdi/v1/provinces",
  transactionTypes: "https://gw.fbr.gov.pk/pdi/v1/transtypecode",
  uom: "https://gw.fbr.gov.pk/pdi/v1/uom",
  saleTypeToRate: "https://gw.fbr.gov.pk/pdi/v2/SaleTypeToRate",
  hsUom: "https://gw.fbr.gov.pk/pdi/v2/HS_UOM",
  doctypecode: "https://gw.fbr.gov.pk/pdi/v1/doctypecode",
  sroitemcode: "https://gw.fbr.gov.pk/pdi/v1/sroitemcode",
  SroSchedule: "https://gw.fbr.gov.pk/pdi/v1/SroSchedule",
  SROItem: "https://gw.fbr.gov.pk/pdi/v2/SROItem",
  statl: "https://gw.fbr.gov.pk/dist/v1/statl",
  getRegType: "https://gw.fbr.gov.pk/dist/v1/Get_Reg_Type"
};
```

---

## 5. Core Application Modules

### 1. 📊 Real-Time Analytics Engine
- Computes metrics across dynamic time slices: `Today`, `Yesterday`, `This Week`, `Last Week`, `This Month`, `Last Month`, `This Year`, `Last Year`, and `Lifetime`.
- Calculates:
  - **Gross Sales** (excluding sales tax)
  - **Sales Tax Applicable**
  - **Sales Tax Withheld**
  - **Net Total Payable**
  - **Invoice Count & Status Ratios** (Submitted, Validated, Draft, Cancelled)

### 2. 📝 Invoice Form & Calculation Flow
1. **Header & Context**: Select seller, buyer, invoice type (`Sale Invoice`, `Debit Note`), date, and payment terms.
2. **Dynamic Line Items**:
   - `hsCode` selection auto-populates description and allowable `uoM`.
   - `saleType` queries `SaleTypeToRate` API based on supplier origin province and transaction type.
   - `sroSchedule` and `sroItem` populates for concessionary/exempt rate items.
   - Real-time arithmetic calculates `valueSalesExcludingST`, `salesTaxApplicable`, `extraTax`, `furtherTax`, `discount`, and `totalValues`.
3. **Pre-Submission Validation**: Tests payload against `/validateinvoicedata`.
4. **FBR Submission**: Posts payload to `/postinvoicedata` and stores returned FBR Invoice Number and registration timestamps.

### 3. 👁️ Dynamic Invoice Preview & PDF Generation
- **`renderInvoicePreview(invoice)`**: Renders invoice receipt inside the modal with multi-tier seller/buyer resolution (supporting stored object models, payload fields, and IndexedDB lookups).
- **`QRCode.js`**: Generates QR code Version 2.0 (25×25) with dimensions 1.0" × 1.0" containing the official verification string.
- **`generateInvoicePDF(invoice, isDummy, isPreview)`**: Creates vector PDF with company header, QR code, line items grid, tax summary breakdown, and signature footer.

### 4. 🧪 Interactive "Test APIs" Suite
A workbench for testing all 15 PRAL DI API endpoints:
- Dynamic parameter fields activate based on chosen endpoint (Rate ID, Dates, Origin Supplier, HS Code, Annexure ID, SRO ID, Registration No, Invoice No, Invoice JSON Payload).
- Pre-populates sample JSON payloads for validation and posting.
- Formats response JSON and allows 1-click clipboard copy.

---

## 6. Global Action Handlers (`window` Exports)

The following functions are explicitly bound to `window` for reliable HTML event binding:

```javascript
window.viewInvoice = async (id) => { /* opens preview modal */ };
window.editInvoice = async (id) => { /* loads into form for modification */ };
window.duplicateInvoice = async (id) => { /* clones into form with new ref */ };
window.confirmDeleteInvoice = async (id) => { /* deletes invoice */ };
window.editProduct = async (id) => { /* opens product modal */ };
window.confirmDeleteProduct = async (id) => { /* deletes product */ };
window.addProductToInvoiceFromTable = async (id) => { /* adds line item */ };
window.generateInvoicePDF = generateInvoicePDF;
window.downloadInvoicePDF = () => { /* downloads current modal PDF */ };
window.seedDatabaseFromBackup = seedDatabaseFromBackup;
```

---

## 7. Security & Business Rules

1. **72-Hour Freeze Rule**: Under PRAL v1.6 guidelines, invoices older than 72 hours or from closed tax periods are locked against cancellation.
2. **10% Cancellation Cap**: Invoice cancellations may not exceed 10% of the previous month's gross turnover.
3. **XSS Sanitization**: All user-supplied fields rendered in tables or preview modals pass through `DOMPurify.sanitize()`.
4. **Credential Isolation**: Tokens remain strictly inside client-side IndexedDB storage.

# 🇵🇰 FBR PRAL Digital Invoicing System (Vanilla JS Edition)

[![PRAL DI API v1.12](https://img.shields.io/badge/PRAL%20DI%20API-v1.12%20%7C%20v1.6-007acc.svg)](https://gw.fbr.gov.pk)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Stack-Vanilla%20JS%20%7C%20IndexedDB-yellow.svg)](app.js)
[![Dual Environment](https://img.shields.io/badge/Mode-Sandbox%20%26%20Production-blue.svg)](index.html)

A high-performance, modular enterprise web application for generating, validating, submitting, and tracking **Federal Board of Revenue (FBR) Pakistan** Digital Invoices in real-time. Built entirely in pure Vanilla JavaScript (ES6+), CSS3 custom design tokens, and browser-native IndexedDB for complete data sovereignty, speed, and offline resilience.

Fully compliant with the latest **PRAL Technical Specifications (v1.12 & v1.6)** and Pakistan Sales Tax Rules (SRO 709(I)/2025).

---

## 🌟 Key Highlights

- **⚡ Zero Framework Overhead**: Pure Vanilla JS with no heavy bundler requirements. Run instantly via any HTTP server or statically.
- **🛡️ 100% PRAL API v1.12 / v1.6 Compliant**: Supports all 15 official endpoints for real-time validation, posting, status checks, ATL lookups, HS codes, and SRO schedules.
- **🔄 Dual Environment Architecture**: 1-click toggle between **Sandbox** (`https://gw.fbr.gov.pk/..._sb`) and **Production** (`https://gw.fbr.gov.pk/...`).
- **📊 Real-Time Analytics Dashboard**: Automatic calculations for gross sales, sales tax applicable, tax withheld, and volume breakdowns across Today, Yesterday, This Week, This Month, and This Year.
- **💾 Automatic & 1-Click Database Seeding**: Instant initialization with verified sample business records (sellers, buyers, products, and submitted invoices).
- **👁️ Dynamic Invoice Preview & PDF Generation**: View and print official invoices with high-density QR codes (Version 2.0 25×25), line items, statutory tax summaries, and buyer/seller details.
- **🧪 Interactive "Test APIs" Suite**: Built-in visual API workbench to test all 15 FBR endpoints with customizable parameters and JSON payloads.

---

## 🌐 Master Catalog of PRAL Digital Invoicing API Endpoints

The application integrates with the complete set of PRAL Digital Invoicing Web Services:

| # | Endpoint Name | HTTP Method | Sandbox URL | Production URL | Description & Parameters |
|---|---|---|---|---|---|
| 1 | **Validate Invoice** | `POST` | `https://gw.fbr.gov.pk/di_data/v1/di/validateinvoicedata_sb` | `https://gw.fbr.gov.pk/di_data/v1/di/validateinvoicedata` | Validates complete invoice JSON payload against business rules without filing |
| 2 | **Post / Submit Invoice** | `POST` | `https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata_sb` | `https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata` | Posts and officially registers the invoice on FBR portal, returning official FBR Invoice Number |
| 3 | **Get Invoice Data** | `GET` | `https://gw.fbr.gov.pk/di_data/v1/di/getinvoicedata_sb` | `https://gw.fbr.gov.pk/di_data/v1/di/getinvoicedata` | Queries submitted invoice record by `invoiceNumber` or reference |
| 4 | **Active Taxpayer List (ATL)** | `POST` | `https://gw.fbr.gov.pk/dist/v1/statl` | `https://gw.fbr.gov.pk/dist/v1/statl` | Verifies Active / Inactive taxpayer status for given NTN/CNIC and date |
| 5 | **Get Registration Type** | `POST` | `https://gw.fbr.gov.pk/dist/v1/Get_Reg_Type` | `https://gw.fbr.gov.pk/dist/v1/Get_Reg_Type` | Determines whether buyer is Registered / Unregistered / Corporate |
| 6 | **Provinces** | `GET` | `https://gw.fbr.gov.pk/pdi/v1/provinces` | `https://gw.fbr.gov.pk/pdi/v1/provinces` | Retrieves list of Pakistani provincial and territorial codes |
| 7 | **Document Types** | `GET` | `https://gw.fbr.gov.pk/pdi/v1/doctypecode` | `https://gw.fbr.gov.pk/pdi/v1/doctypecode` | Retrieves document type definitions (`Sale Invoice`, `Debit Note`, `Credit Note`) |
| 8 | **HS Codes / Item Desc** | `GET` | `https://gw.fbr.gov.pk/pdi/v1/itemdesccode` | `https://gw.fbr.gov.pk/pdi/v1/itemdesccode` | Returns official Harmonized System (HS) product and service classifications |
| 9 | **Units of Measurement** | `GET` | `https://gw.fbr.gov.pk/pdi/v1/uom` | `https://gw.fbr.gov.pk/pdi/v1/uom` | Standard Unit of Measurement codes (`KG`, `Numbers`, `Meter`, `MT`, etc.) |
| 10 | **Transaction Types** | `GET` | `https://gw.fbr.gov.pk/pdi/v1/transtypecode` | `https://gw.fbr.gov.pk/pdi/v1/transtypecode` | Standard and special tax transaction types |
| 11 | **Sales Type to Rate** | `GET` | `https://gw.fbr.gov.pk/pdi/v2/SaleTypeToRate` | `https://gw.fbr.gov.pk/pdi/v2/SaleTypeToRate` | Maps transaction types and originating provinces to applicable tax rates |
| 12 | **HS Code to UoM (v2)** | `GET` | `https://gw.fbr.gov.pk/pdi/v2/HS_UOM` | `https://gw.fbr.gov.pk/pdi/v2/HS_UOM` | Returns allowed UoM mapping for given HS code and sales annexure |
| 13 | **SRO Schedule (v1)** | `GET` | `https://gw.fbr.gov.pk/pdi/v1/SroSchedule` | `https://gw.fbr.gov.pk/pdi/v1/SroSchedule` | Statutory exemption and concessionary schedules |
| 14 | **SRO Item Code (v1)** | `GET` | `https://gw.fbr.gov.pk/pdi/v1/sroitemcode` | `https://gw.fbr.gov.pk/pdi/v1/sroitemcode` | Serial items under active SROs |
| 15 | **SRO Item (v2)** | `GET` | `https://gw.fbr.gov.pk/pdi/v2/SROItem` | `https://gw.fbr.gov.pk/pdi/v2/SROItem` | Version 2 SRO item details and dates |

---

## 💻 Tech Stack & Architecture

- **Frontend Core**: Semantic HTML5, Vanilla JavaScript (ES6+ Modules, async/await), Vanilla CSS3 (Custom design tokens, Dark/Light mode theme engine).
- **Local Storage / Persistence**: HTML5 IndexedDB (`FBRInvoiceDB`) with zero reliance on external backends for offline storage.
- **PDF Generation**: `jsPDF` for client-side pixel-perfect vector invoices.
- **Security & Sanitization**: `DOMPurify` to eliminate XSS risks during payload rendering and table updates.
- **QR Code Encoding**: `QRCode.js` with ECC Level M for official 1.0" × 1.0" receipt compliance.
- **Icons & Visuals**: FontAwesome 6.4.0 SVG icon set.

---

## 🚀 Quick Start Guide

### Prerequisites
- Any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).
- Any local static HTTP server (e.g. Node `http-server`, Python `http.server`, or VS Code Live Server).

### 1. Clone the Repository
```bash
git clone https://github.com/aobhubdeveloper-cloud/FBR-Digital-Invoicing-vanilla.git
cd FBR-Digital-Invoicing-vanilla
```

### 2. Start Local Server
Run with Python:
```bash
python -m http.server 8080
```
Or run with Node / npm:
```bash
npx serve .
# or
npm start
```

### 3. Open in Browser
Visit `http://localhost:8080` in your web browser.

---

## 📖 Application Modules

### 1. 📊 Dashboard Analytics
- Overview cards: **Gross Sales**, **Sales Tax Applicable**, **Tax Withheld**, **Total Invoices Issued**.
- Time-slice filters: Real-time filtering across Today, Yesterday, This Week, This Month, This Year, or Lifetime.
- Interactive charts: Sales tax trends, top products by volume, top buyers, and scenario breakdown.

### 2. 📝 Create & Submit Invoices
- Multi-tier seller selection with automatic token binding.
- Real-time NTN / CNIC verification via ATL and Registration Type APIs.
- Dynamic line items editor with automatic tax calculation, extra tax, further tax, discount, and SRO schedule mapping.
- Pre-submission validation against PRAL business rules with instant error modal breakdown.

### 3. 📋 Manage Invoices
- Comprehensive list of stored drafts, validated invoices, and submitted PRAL invoices.
- Status badges: `Submitted`, `Validated`, `Draft`, `Cancelled`, `Partially Cancelled`.
- Actions: **View Preview**, **Download PDF**, **Edit**, **Duplicate / Clone**, and **Delete**.

### 4. 👥 Entity Management (Sellers, Buyers, Products)
- **Sellers**: Manage business NTN/CNIC, STRN, addresses, business sectors, and Sandbox/Production API Bearer tokens.
- **Buyers**: Customer database with real-time ATL status indicators and province assignment.
- **Products**: Catalog of HS codes, standard UoMs, rates, and default SRO schedules.

### 5. 🧪 Interactive Test APIs Suite
- Built-in visual testing workbench for all 15 FBR API endpoints.
- Auto-populates sample JSON payloads for invoice validation and submission.
- Real-time response inspection with 1-click clipboard copy.

### 6. ⚙️ Settings & Data Seeding
- **1-Click Seed Sample Data**: Populate complete database with verified sellers, buyers, products, and past invoices.
- **Backup & Restore**: Export complete IndexedDB database to JSON, or import previous backups.
- **Theme Settings**: Seamless toggle between Dark Mode and Light Mode.

---

## 🔒 Security Best Practices

1. **Token Protection**: Bearer tokens are stored exclusively in the user's local browser IndexedDB and are never transmitted to any third-party server other than official FBR gateway endpoints (`gw.fbr.gov.pk`).
2. **Payload Sanitization**: All user-entered text is sanitized through `DOMPurify` before DOM insertion.
3. **Environment Segregation**: Clear visual indicators prevent accidental submissions to Production while in Sandbox mode.

---

## 📄 License & Compliance

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

*Note: This application is an independent client-side integration tool designed to interface with the Federal Board of Revenue (FBR) Pakistan Digital Invoicing System. Users must obtain authorized credentials and IP whitelisting from PRAL / FBR for production compliance.*
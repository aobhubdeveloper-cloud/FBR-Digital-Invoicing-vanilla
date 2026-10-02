/**
 * Reusable Export Component
 * Handles CSV, Excel, JSON, and PDF export functionality for any data type
 * 
 * @class ExportComponent
 */
class ExportComponent {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.options = {
      dataType: options.dataType || 'data',
      displayName: options.displayName || 'Data',
      formats: options.formats || ['json', 'excel', 'pdf'],
      customExportFunction: options.customExportFunction || null,
      buttonClass: options.buttonClass || 'btn btn-primary',
      dropdownClass: options.dropdownClass || 'dropdown-menu',
      ...options
    };
    
    this.render();
  }

  /**
   * Render the export component HTML
   */
  render() {
    const container = document.getElementById(this.containerId);
    if (!container) {
      console.error(`ExportComponent: Container with ID '${this.containerId}' not found`);
      return;
    }

    const exportHTML = `
      <div class="export-component">
        <div class="dropdown" style="display: inline-block; position: relative;">
          <button class="${this.options.buttonClass} dropdown-toggle" 
                  type="button" 
                  id="export${this.options.dataType}Btn" 
                  data-toggle="dropdown"
                  aria-haspopup="true" 
                  aria-expanded="false"
                  onclick="this.nextElementSibling.classList.toggle('show')">
            <i class="fas fa-download"></i> Export ${this.options.displayName}
          </button>
          <div class="${this.options.dropdownClass}" aria-labelledby="export${this.options.dataType}Btn">
            ${this.generateFormatOptions()}
          </div>
        </div>
      </div>
    `;

    container.innerHTML = exportHTML;
    this.attachEventListeners();
  }

  /**
   * Generate format options based on available formats
   */
  generateFormatOptions() {
    const formatIcons = {
      json: 'fas fa-file-code',
      excel: 'fas fa-file-excel', 
      csv: 'fas fa-file-csv',
      pdf: 'fas fa-file-pdf'
    };

    const formatLabels = {
      json: 'JSON',
      excel: 'Excel (CSV)',
      csv: 'CSV', 
      pdf: 'PDF'
    };

    return this.options.formats.map(format => `
      <a class="dropdown-item export-option" 
         href="#" 
         data-format="${format}"
         data-type="${this.options.dataType}">
        <i class="${formatIcons[format] || 'fas fa-file'}"></i> ${formatLabels[format] || format.toUpperCase()}
      </a>
    `).join('');
  }

  /**
   * Attach event listeners for export options
   */
  attachEventListeners() {
    const container = document.getElementById(this.containerId);
    const exportOptions = container.querySelectorAll('.export-option');
    
    exportOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        const dropdown = option.closest('.dropdown-menu');
        if (dropdown) dropdown.classList.remove('show');
        const format = e.currentTarget.getAttribute('data-format');
        const dataType = e.currentTarget.getAttribute('data-type');
        this.handleExport(dataType, format);
      });
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        const menu = container.querySelector('.dropdown-menu');
        if (menu) menu.classList.remove('show');
      }
    });
  }

  /**
   * Handle export functionality
   */
  async handleExport(dataType, format) {
    try {
      if (this.options.customExportFunction) {
        await this.options.customExportFunction(dataType, format);
        return;
      }
      await exportData(dataType, format);
    } catch (error) {
      console.error('ExportComponent: Export error:', error);
      this.showToast('error', 'Export Failed', error.message || 'Failed to export data');
    }
  }

  /**
   * Show toast notification
   */
  showToast(type, title, message) {
    if (typeof window.showToast === 'function') {
      window.showToast(type, title, message);
    } else {
      alert(`${title}: ${message}`);
    }
  }

  /**
   * Update export options dynamically
   */
  updateOptions(newOptions) {
    this.options = { ...this.options, ...newOptions };
    this.render();
  }

  /**
   * Enable/disable specific export formats
   */
  setFormats(formats) {
    this.options.formats = formats;
    this.render();
  }

  /**
   * Destroy component and clean up
   */
  destroy() {
    const container = document.getElementById(this.containerId);
    if (container) {
      container.innerHTML = '';
    }
  }
}

/**
 * Universal Data Export Engine
 * @param {string} storeName - Store name or data type (e.g. 'invoices', 'products', 'sellers', 'buyers')
 * @param {string} format - 'json', 'csv', 'excel', or 'pdf'
 */
async function exportData(storeName, format) {
  try {
    let records = [];
    if (typeof window.dbGetAll === 'function') {
      records = await window.dbGetAll(storeName);
    }
    
    if (!records || records.length === 0) {
      if (typeof window.showToast === 'function') {
        window.showToast('warning', 'Export Notice', `No records found in ${storeName} to export.`);
      }
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${storeName}_export_${timestamp}`;

    if (format === 'json') {
      const jsonStr = JSON.stringify(records, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      triggerDownload(blob, `${filename}.json`);
      if (typeof window.showToast === 'function') {
        window.showToast('success', 'Export Complete', `Exported ${records.length} records as JSON.`);
      }
    } else if (format === 'csv' || format === 'excel') {
      const csvStr = convertArrayToCSV(records);
      const blob = new Blob(['\ufeff' + csvStr], { type: 'text/csv;charset=utf-8;' });
      triggerDownload(blob, `${filename}.csv`);
      if (typeof window.showToast === 'function') {
        window.showToast('success', 'Export Complete', `Exported ${records.length} records as CSV/Excel.`);
      }
    } else if (format === 'pdf') {
      generateTableSummaryPDF(storeName, records, filename);
    }
  } catch (error) {
    console.error('Export error:', error);
    if (typeof window.showToast === 'function') {
      window.showToast('error', 'Export Failed', error.message || 'Export error');
    }
  }
}

/**
 * Converts array of objects to CSV string
 */
function convertArrayToCSV(data) {
  if (!data || data.length === 0) return '';
  
  // Extract all unique headers
  const headers = [];
  data.forEach(item => {
    Object.keys(item).forEach(key => {
      if (!headers.includes(key) && typeof item[key] !== 'object') {
        headers.push(key);
      }
    });
  });

  const rows = [];
  rows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','));

  data.forEach(item => {
    const row = headers.map(header => {
      const val = item[header];
      if (val === undefined || val === null) return '""';
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    rows.push(row.join(','));
  });

  return rows.join('\r\n');
}

/**
 * Triggers browser download of a Blob
 */
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Generates a summary PDF for tabular records using jsPDF
 */
function generateTableSummaryPDF(storeName, records, filename) {
  try {
    const doc = new (window.jsPDF || window.jspdf.jsPDF)('l', 'pt', 'a4');
    doc.setFontSize(16);
    doc.text(`${storeName.toUpperCase()} REPORT`, 40, 40);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()} | Total Records: ${records.length}`, 40, 60);

    let y = 90;
    const headers = Object.keys(records[0]).filter(k => typeof records[0][k] !== 'object').slice(0, 7);

    // Header row
    doc.setFillColor(30, 60, 114);
    doc.rect(40, y - 15, 760, 20, 'F');
    doc.setTextColor(255, 255, 255);
    headers.forEach((h, idx) => {
      doc.text(String(h).toUpperCase().substring(0, 15), 45 + idx * 105, y);
    });

    y += 20;
    doc.setTextColor(50, 50, 50);

    records.forEach((row, rIdx) => {
      if (y > 540) {
        doc.addPage();
        y = 50;
      }
      if (rIdx % 2 === 0) {
        doc.setFillColor(245, 247, 250);
        doc.rect(40, y - 12, 760, 16, 'F');
      }
      headers.forEach((h, idx) => {
        const val = row[h] !== undefined && row[h] !== null ? String(row[h]).substring(0, 18) : '';
        doc.text(val, 45 + idx * 105, y);
      });
      y += 18;
    });

    doc.save(`${filename}.pdf`);
    if (typeof window.showToast === 'function') {
      window.showToast('success', 'PDF Exported', `Exported ${records.length} records as PDF summary.`);
    }
  } catch (e) {
    console.error('PDF Summary generation failed:', e);
    // Fallback to CSV if PDF generation fails
    const csvStr = convertArrayToCSV(records);
    const blob = new Blob(['\ufeff' + csvStr], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, `${filename}.csv`);
  }
}

// Global Exports
window.exportData = exportData;
window.exportInvoices = (format) => exportData('invoices', format);
window.exportProducts = (format) => exportData('products', format);
window.exportSellers = (format) => exportData('sellers', format);
window.exportBuyers = (format) => exportData('buyers', format);
window.ExportComponent = ExportComponent;
window.createExportComponent = (containerId, options) => new ExportComponent(containerId, options);

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ExportComponent, exportData };
}
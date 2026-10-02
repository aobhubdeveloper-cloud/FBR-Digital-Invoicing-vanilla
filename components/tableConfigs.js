/**
 * Table Configurations for FBR Digital Invoices
 * Defines the configuration for each table component
 */

// Utility function for date formatting (fallback if main app function not available)
function safeFormatDate(dateValue) {
  if (!dateValue) return '';
  
  if (typeof window.formatDateForDisplay === 'function') {
    return window.formatDateForDisplay(dateValue);
  }
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return dateValue.toString();
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  } catch (error) {
    return dateValue.toString();
  }
}

// Invoices Table Configuration
const invoicesTableConfig = {
  dataType: 'invoices',
  displayName: 'Invoices',
  icon: 'fas fa-file-invoice-dollar',
  dataSource: async () => {
    if (typeof window.dbGetAll === 'function') {
      const store = window.STORE_NAMES ? window.STORE_NAMES.invoices : 'invoices';
      return await window.dbGetAll(store);
    }
    return [];
  },
  columns: [
    {
      key: 'dated',
      label: 'Date',
      type: 'date',
      sortable: true,
      valueFunction: (item) => safeFormatDate(item.dated || item.invoiceDate)
    },
    {
      key: 'invoiceRefNo',
      label: 'Reference / Invoice #',
      sortable: true,
      valueFunction: (item) => item.invoiceNumber || item.invoiceRefNo || `INV-${item.id || ''}`
    },
    {
      key: 'buyerBusinessName',
      label: 'Buyer',
      sortable: true,
      valueFunction: (item) => item.buyerBusinessName || (item.buyer ? item.buyer.businessName : '')
    },
    {
      key: 'totalAmount',
      label: 'Total Value (PKR)',
      type: 'currency',
      sortable: true,
      valueFunction: (item) => {
        const val = item.totalAmount !== undefined ? item.totalAmount : (item.grandTotal || 0);
        return parseFloat(val || 0).toFixed(2);
      }
    },
    {
      key: 'status',
      label: 'Status',
      type: 'status',
      sortable: true,
      valueFunction: (item) => item.status || 'Submitted'
    }
  ],
  filters: {
    status: {
      label: 'Status',
      width: '130px',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'Submitted', label: 'Submitted' },
        { value: 'Validated', label: 'Validated' },
        { value: 'Draft', label: 'Draft' },
        { value: 'Cancelled', label: 'Cancelled' }
      ]
    }
  },
  searchPlaceholder: 'Search invoices by buyer, ref, or status...',
  showDateFilter: true,
  dateField: 'dated',
  exportFormats: ['json', 'excel', 'pdf'],
  addButtonConfig: {
    text: 'Create Invoice',
    icon: 'fas fa-plus',
    class: 'btn btn-success',
    onclick: 'document.querySelector(\'[data-tab="invoice-tab"]\')?.click()'
  },
  customRowActions: [
    {
      text: 'View',
      icon: 'fas fa-eye',
      class: 'btn btn-sm btn-info',
      onclick: 'window.viewInvoice',
      title: 'View Invoice Preview'
    },
    {
      text: 'Edit',
      icon: 'fas fa-edit',
      class: 'btn btn-sm btn-warning',
      onclick: 'window.editInvoice',
      title: 'Edit Invoice'
    },
    {
      text: 'Duplicate',
      icon: 'fas fa-copy',
      class: 'btn btn-sm btn-secondary',
      onclick: 'window.duplicateInvoice',
      title: 'Duplicate Invoice'
    },
    {
      text: 'Delete',
      icon: 'fas fa-trash',
      class: 'btn btn-sm btn-danger',
      onclick: 'window.confirmDeleteInvoice',
      title: 'Delete Invoice'
    }
  ],
  emptyMessage: 'No invoices found in record'
};

// Products Table Configuration
const productsTableConfig = {
  dataType: 'products',
  displayName: 'Products & Services',
  icon: 'fas fa-box',
  dataSource: async () => {
    if (typeof window.dbGetAll === 'function') {
      const store = window.STORE_NAMES ? window.STORE_NAMES.products : 'products';
      return await window.dbGetAll(store);
    }
    return [];
  },
  columns: [
    {
      key: 'hsCode',
      label: 'HS Code',
      sortable: true,
      valueFunction: (item) => item.hsCode || ''
    },
    {
      key: 'productDescription',
      label: 'Product / Description',
      sortable: true,
      valueFunction: (item) => item.productDescription || item.productName || item.name || ''
    },
    {
      key: 'saleType',
      label: 'Type',
      sortable: true,
      valueFunction: (item) => item.saleType || item.productType || 'Services'
    },
    {
      key: 'uoM',
      label: 'UoM',
      sortable: true,
      valueFunction: (item) => item.uoM || item.uom || ''
    },
    {
      key: 'saleRate',
      label: 'Sale Rate',
      type: 'currency',
      sortable: true,
      valueFunction: (item) => (item.saleRate !== undefined ? item.saleRate : (item.price || 0)).toFixed(2)
    },
    {
      key: 'taxRate',
      label: 'Tax Rate',
      sortable: true,
      valueFunction: (item) => `${item.taxRate !== undefined ? item.taxRate : '15'}%`
    },
    {
      key: 'status',
      label: 'Status',
      type: 'status',
      sortable: true,
      valueFunction: (item) => item.status || 'Active'
    }
  ],
  filters: {
    saleType: {
      label: 'Type',
      width: '130px',
      options: [
        { value: 'all', label: 'All Types' },
        { value: 'Goods', label: 'Goods' },
        { value: 'Services', label: 'Services' }
      ]
    },
    status: {
      label: 'Status',
      width: '120px',
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' }
      ]
    }
  },
  searchPlaceholder: 'Search products by description or HS code...',
  exportFormats: ['json', 'excel', 'pdf'],
  addButtonConfig: {
    text: 'Add Product',
    icon: 'fas fa-plus',
    class: 'btn btn-success',
    onclick: 'document.getElementById("addProductBtn")?.click()'
  },
  customRowActions: [
    {
      text: 'Add to Invoice',
      icon: 'fas fa-cart-plus',
      class: 'btn btn-sm btn-primary',
      onclick: 'window.addProductToInvoiceFromTable',
      title: 'Add to Invoice Draft'
    },
    {
      text: 'Edit',
      icon: 'fas fa-edit',
      class: 'btn btn-sm btn-warning',
      onclick: 'window.editProduct',
      title: 'Edit Product'
    },
    {
      text: 'Delete',
      icon: 'fas fa-trash',
      class: 'btn btn-sm btn-danger',
      onclick: 'window.confirmDeleteProduct',
      title: 'Delete Product'
    }
  ],
  emptyMessage: 'No products found in catalog'
};

// Sellers Table Configuration
const sellersTableConfig = {
  dataType: 'sellers',
  displayName: 'Sellers',
  icon: 'fas fa-user-tie',
  dataSource: async () => {
    if (typeof window.dbGetAll === 'function') {
      const store = window.STORE_NAMES ? window.STORE_NAMES.sellers : 'sellers';
      return await window.dbGetAll(store);
    }
    return [];
  },
  columns: [
    {
      key: 'ntn',
      label: 'NTN / CNIC',
      sortable: true,
      valueFunction: (item) => item.ntn || item.sellerNTNCNIC || ''
    },
    {
      key: 'businessName',
      label: 'Business Name',
      sortable: true,
      valueFunction: (item) => item.businessName || item.sellerBusinessName || ''
    },
    {
      key: 'province',
      label: 'Province',
      sortable: true,
      valueFunction: (item) => item.province || item.sellerProvince || ''
    },
    {
      key: 'registrationStatus',
      label: 'ATL Status',
      type: 'status',
      sortable: true,
      valueFunction: (item) => item.registrationStatus || item.status || 'Active'
    },
    {
      key: 'registrationType',
      label: 'Reg Type',
      sortable: true,
      valueFunction: (item) => item.registrationType || 'Registered'
    }
  ],
  filters: {
    province: {
      label: 'Province',
      width: '140px',
      options: [
        { value: 'all', label: 'All Provinces' },
        { value: 'PUNJAB', label: 'PUNJAB' },
        { value: 'SINDH', label: 'SINDH' },
        { value: 'KPK', label: 'KPK' },
        { value: 'BALOCHISTAN', label: 'BALOCHISTAN' },
        { value: 'ISLAMABAD', label: 'ISLAMABAD' }
      ]
    }
  },
  searchPlaceholder: 'Search sellers by NTN or business name...',
  exportFormats: ['json', 'excel', 'pdf'],
  addButtonConfig: {
    text: 'Add Seller',
    icon: 'fas fa-plus',
    class: 'btn btn-success',
    onclick: 'document.getElementById("addSellerBtn")?.click()'
  },
  customRowActions: [
    {
      text: 'Edit',
      icon: 'fas fa-edit',
      class: 'btn btn-sm btn-warning',
      onclick: 'window.editSeller',
      title: 'Edit Seller'
    },
    {
      text: 'Delete',
      icon: 'fas fa-trash',
      class: 'btn btn-sm btn-danger',
      onclick: 'window.deleteSeller',
      title: 'Delete Seller'
    }
  ],
  emptyMessage: 'No sellers registered in system'
};

// Buyers Table Configuration
const buyersTableConfig = {
  dataType: 'buyers',
  displayName: 'Buyers',
  icon: 'fas fa-users',
  dataSource: async () => {
    if (typeof window.dbGetAll === 'function') {
      const store = window.STORE_NAMES ? window.STORE_NAMES.buyers : 'buyers';
      return await window.dbGetAll(store);
    }
    return [];
  },
  columns: [
    {
      key: 'ntn',
      label: 'NTN / CNIC',
      sortable: true,
      valueFunction: (item) => item.ntn || item.buyerNTNCNIC || ''
    },
    {
      key: 'businessName',
      label: 'Business Name',
      sortable: true,
      valueFunction: (item) => item.businessName || item.buyerBusinessName || ''
    },
    {
      key: 'province',
      label: 'Province',
      sortable: true,
      valueFunction: (item) => item.province || item.buyerProvince || ''
    },
    {
      key: 'registrationStatus',
      label: 'ATL Status',
      type: 'status',
      sortable: true,
      valueFunction: (item) => item.registrationStatus || item.status || 'Active'
    },
    {
      key: 'registrationType',
      label: 'Reg Type',
      sortable: true,
      valueFunction: (item) => item.registrationType || 'Registered'
    }
  ],
  filters: {
    province: {
      label: 'Province',
      width: '140px',
      options: [
        { value: 'all', label: 'All Provinces' },
        { value: 'PUNJAB', label: 'PUNJAB' },
        { value: 'SINDH', label: 'SINDH' },
        { value: 'KPK', label: 'KPK' },
        { value: 'BALOCHISTAN', label: 'BALOCHISTAN' },
        { value: 'ISLAMABAD', label: 'ISLAMABAD' }
      ]
    }
  },
  searchPlaceholder: 'Search buyers by NTN or name...',
  exportFormats: ['json', 'excel', 'pdf'],
  addButtonConfig: {
    text: 'Add Buyer',
    icon: 'fas fa-plus',
    class: 'btn btn-success',
    onclick: 'document.getElementById("addBuyerBtn")?.click()'
  },
  customRowActions: [
    {
      text: 'Edit',
      icon: 'fas fa-edit',
      class: 'btn btn-sm btn-warning',
      onclick: 'window.editBuyer',
      title: 'Edit Buyer'
    },
    {
      text: 'Delete',
      icon: 'fas fa-trash',
      class: 'btn btn-sm btn-danger',
      onclick: 'window.deleteBuyer',
      title: 'Delete Buyer'
    }
  ],
  emptyMessage: 'No buyers registered in directory'
};

// Global table configurations object
window.tableConfigs = {
  invoices: invoicesTableConfig,
  products: productsTableConfig,
  sellers: sellersTableConfig,
  buyers: buyersTableConfig
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    invoicesTableConfig,
    productsTableConfig,
    sellersTableConfig,
    buyersTableConfig,
    tableConfigs: window.tableConfigs
  };
}
/**
 * Component Initialization & Bridge Script
 * Seamlessly manages TableComponent, FilterComponent, and ExportComponent instances
 */

// Global table component registry
window.tableInstances = window.tableInstances || {};

/**
 * Initializes all table components if their respective container elements exist in the DOM
 */
function initializeTableComponents() {
  console.log('Initializing modular TableComponents...');

  if (!window.tableConfigs) {
    console.warn('tableConfigs not loaded yet. Skipping component initialization.');
    return;
  }

  // 1. Invoices Table
  if (document.getElementById('invoicesTableContainer')) {
    try {
      window.tableInstances.invoices = new TableComponent('invoicesTableContainer', window.tableConfigs.invoices);
      console.log('✓ Invoices TableComponent mounted');
    } catch (e) {
      console.warn('Failed to initialize Invoices TableComponent:', e);
    }
  }

  // 2. Products Table
  if (document.getElementById('productsTableContainer')) {
    try {
      window.tableInstances.products = new TableComponent('productsTableContainer', window.tableConfigs.products);
      console.log('✓ Products TableComponent mounted');
    } catch (e) {
      console.warn('Failed to initialize Products TableComponent:', e);
    }
  }

  // 3. Sellers Table
  if (document.getElementById('sellersTableContainer')) {
    try {
      window.tableInstances.sellers = new TableComponent('sellersTableContainer', window.tableConfigs.sellers);
      console.log('✓ Sellers TableComponent mounted');
    } catch (e) {
      console.warn('Failed to initialize Sellers TableComponent:', e);
    }
  }

  // 4. Buyers Table
  if (document.getElementById('buyersTableContainer')) {
    try {
      window.tableInstances.buyers = new TableComponent('buyersTableContainer', window.tableConfigs.buyers);
      console.log('✓ Buyers TableComponent mounted');
    } catch (e) {
      console.warn('Failed to initialize Buyers TableComponent:', e);
    }
  }
}

/**
 * Refreshes all active table component instances
 */
function refreshAllTableComponents() {
  Object.values(window.tableInstances).forEach(instance => {
    if (instance && typeof instance.loadData === 'function') {
      instance.loadData();
    }
  });
}

/**
 * Refreshes a specific table component by name ('invoices', 'products', 'sellers', 'buyers')
 */
function refreshTableComponent(type) {
  if (window.tableInstances[type] && typeof window.tableInstances[type].loadData === 'function') {
    window.tableInstances[type].loadData();
  }
}

// Global functions
window.initializeTableComponents = initializeTableComponents;
window.refreshAllTableComponents = refreshAllTableComponents;
window.refreshTableComponent = refreshTableComponent;

// Automatic initialization hook after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeTableComponents, 300);
  });
} else {
  setTimeout(initializeTableComponents, 300);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeTableComponents,
    refreshAllTableComponents,
    refreshTableComponent
  };
}
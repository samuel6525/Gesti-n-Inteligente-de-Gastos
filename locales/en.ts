

const en = {
    header: {
        title: "Kimi Expense Report",
        subtitle: "Generate and manage your employee expense submissions.",
        toggleTheme: "Toggle theme",
        help: "Help",
        helpTooltip: "Show user guide",
        save: "Save",
        saveTooltip: "Save the report in the browser",
        export: "Export to CSV",
        exportTooltip: "Download the report as a CSV file"
    },
    viewSwitcher: {
        table: "Table",
        dashboard: "Dashboard",
        projection: "Projections"
    },
    footer: {
        copyright: "© {{year}} Kimi Corp. All rights reserved."
    },
    summary: {
      totalExpense: "Total Expense"
    },
    filters: {
        search: "Search",
        searchPlaceholder: "Search by description, invoice...",
        category: "Category",
        allCategories: "All",
        status: "Status",
        allStatuses: "All",
        clear: "Clear Filters",
        dateRange: "Date Range"
    },
    table: {
        date: "Date",
        description: "Description",
        category: "Category",
        invoiceNumber: "Invoice #",
        amount: "Amount",
        status: "Status",
        receipt: "Receipt",
        noExpenses: "No expenses recorded.",
        addExpensePrompt: "Click \"+ Add Expense\" to get started.",
        addExpense: "Add Expense",
        descriptionPlaceholder: "e.g. Client dinner",
        invoiceNumberPlaceholder: "e.g. INV-123",
        specifyPlaceholder: "Specify...",
        attach: "Attach",
        selectExpenseAria: "Select expense: {{description}}",
        removeReceiptAria: "Remove receipt",
        deleteExpenseAria: "Delete expense"
    },
    bulkActions: {
        selected_one: "{{count}} expense selected",
        selected_other: "{{count}} expenses selected",
        approve: "Approve",
        reject: "Reject",
        delete: "Delete"
    },
    dashboard: {
        approvedTotal: "Total Approved Spend",
        approvedTotalDesc: "Sum of all approved expenses",
        pendingTotal: "Pending Expenses",
        pendingTotalDesc: "Sum of expenses awaiting approval",
        receiptPercentage: "% of Expenses with Receipt",
        receiptPercentageDesc: "{{receiptCount}} of {{totalCount}} expenses have a receipt",
        noReceipt: "Expenses without Receipt",
        noReceiptDesc: "Expenses that require a receipt",
        categoryDistribution: "Expenses by Category (Distribution)",
        categoryTotal: "Expenses by Category (Total)",
        monthlyTrend: "Monthly Expense Trend (Approved)",
        topExpenses: "Top 5 Highest Value Expenses",
        noData: "No data to display.",
        noDataForChart: "No data to display in the chart.",
        noApprovedData: "No approved expense data to display."
    },
    projectionDashboard: {
        title: "Expense Analysis and Projection",
        monthlyBudgetLabel: "Monthly Budget",
        analysisTitle: "Analysis & Projection",
        avgSpendLabel: "Avg. Monthly Spend (Last 6M)",
        trendLabel: "Monthly Trend",
        projectedSpendLabel: "Total Projected Spend (Next 3M)",
        increase: "Increase",
        decrease: "Decrease",
        stable: "Stable",
        chartTitle: "Expense Projection (vs. Historical)",
        noData: "Insufficient data for projection.",
        tooltipHistorical: "Historical",
        tooltipProjected: "Projected",
        tooltipBudget: "Monthly Budget: {{amount}}"
    },
    modals: {
        delete: {
            title: "Confirm Deletion",
            message: "Are you sure you want to delete this expense? This action cannot be undone."
        },
        bulkDelete: {
            title: "Confirm Bulk Deletion",
            message: "Are you sure you want to delete the selected {{count}} expenses?"
        },
        cancel: "Cancel",
        confirmDelete: "Delete"
    },
    notifications: {
        saveSuccess: "Report saved successfully.",
        saveError: "Error saving the report.",
        fileSizeError: "File exceeds the 5MB size limit.",
        fileTypeError: "Invalid format. Use JPG, PNG, or PDF.",
        fileReadError: "Error reading the file."
    },
    categories: {
        Viajes: "Travel",
        Comidas: "Meals",
        Suministros: "Supplies",
        Transporte: "Transport",
        Alojamiento: "Lodging",
        Otros: "Other"
    },
    statuses: {
        Pendiente: "Pending",
        Aprobado: "Approved",
        Rechazado: "Rejected"
    },
    csv: {
        date: "Date",
        description: "Description",
        category: "Category",
        invoiceNumber: "Invoice Number",
        amount: "Amount",
        status: "Status",
        receiptAttached: "Receipt Attached",
        yes: "Yes",
        no: "No"
    },
    monthsShort: {
        0: "Jan", 1: "Feb", 2: "Mar", 3: "Apr", 4: "May", 5: "Jun",
        6: "Jul", 7: "Aug", 8: "Sep", 9: "Oct", 10: "Nov", 11: "Dec"
    }
};

export default en;
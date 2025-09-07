

const es = {
    header: {
        title: "Informe de Gastos Kimi",
        subtitle: "Genere y gestione sus envíos de gastos de empleado.",
        toggleTheme: "Cambiar tema",
        help: "Ayuda",
        helpTooltip: "Mostrar guía de usuario",
        save: "Guardar",
        saveTooltip: "Guardar el informe en el navegador",
        export: "Exportar a CSV",
        exportTooltip: "Descargar el informe como archivo CSV"
    },
    viewSwitcher: {
        table: "Tabla",
        dashboard: "Dashboard",
        projection: "Proyecciones"
    },
    footer: {
        copyright: "© {{year}} Kimi Corp. Todos los derechos reservados."
    },
    summary: {
      totalExpense: "Gasto Total"
    },
    filters: {
        search: "Buscar",
        searchPlaceholder: "Buscar por descripción, factura...",
        category: "Categoría",
        allCategories: "Todas",
        status: "Estado",
        allStatuses: "Todos",
        clear: "Limpiar Filtros",
        dateRange: "Rango de Fechas"
    },
    table: {
        date: "Fecha",
        description: "Descripción",
        category: "Categoría",
        invoiceNumber: "Nº Factura",
        amount: "Monto",
        status: "Estado",
        receipt: "Factura",
        noExpenses: "No hay gastos registrados.",
        addExpensePrompt: "Haga clic en \"+ Añadir Gasto\" para comenzar.",
        addExpense: "Añadir Gasto",
        descriptionPlaceholder: "Ej. Cena con cliente",
        invoiceNumberPlaceholder: "Ej. F-123",
        specifyPlaceholder: "Especificar...",
        attach: "Adjuntar",
        selectExpenseAria: "Seleccionar gasto: {{description}}",
        removeReceiptAria: "Eliminar factura",
        deleteExpenseAria: "Eliminar gasto"
    },
    bulkActions: {
        selected_one: "{{count}} gasto seleccionado",
        selected_other: "{{count}} gastos seleccionados",
        approve: "Aprobar",
        reject: "Rechazar",
        delete: "Eliminar"
    },
    dashboard: {
        approvedTotal: "Gasto Total Aprobado",
        approvedTotalDesc: "Suma de todos los gastos aprobados",
        pendingTotal: "Gastos Pendientes",
        pendingTotalDesc: "Suma de gastos esperando aprobación",
        receiptPercentage: "% de Gastos con Factura",
        receiptPercentageDesc: "{{receiptCount}} de {{totalCount}} gastos tienen factura",
        noReceipt: "Gastos sin Factura",
        noReceiptDesc: "Gastos que requieren una factura",
        categoryDistribution: "Gastos por Categoría (Distribución)",
        categoryTotal: "Gastos por Categoría (Total)",
        monthlyTrend: "Evolución Mensual de Gastos (Aprobados)",
        topExpenses: "Top 5 Gastos de Mayor Valor",
        noData: "No hay datos para mostrar.",
        noDataForChart: "No hay datos para mostrar en el gráfico.",
        noApprovedData: "No hay datos de gastos aprobados para mostrar."
    },
    projectionDashboard: {
        title: "Análisis y Proyección de Gastos",
        monthlyBudgetLabel: "Presupuesto Mensual",
        analysisTitle: "Análisis y Proyección",
        avgSpendLabel: "Gasto Mensual Promedio (Últimos 6M)",
        trendLabel: "Tendencia Mensual",
        projectedSpendLabel: "Gasto Total Proyectado (Próximos 3M)",
        increase: "Aumento",
        decrease: "Disminución",
        stable: "Estable",
        chartTitle: "Proyección de Gastos (vs. Histórico)",
        noData: "Datos insuficientes para la proyección.",
        tooltipHistorical: "Histórico",
        tooltipProjected: "Proyectado",
        tooltipBudget: "Presupuesto Mensual: {{amount}}"
    },
    modals: {
        delete: {
            title: "Confirmar Eliminación",
            message: "¿Está seguro de que desea eliminar este gasto? Esta acción no se puede deshacer."
        },
        bulkDelete: {
            title: "Confirmar Eliminación Múltiple",
            message: "¿Está seguro de que desea eliminar los {{count}} gastos seleccionados?"
        },
        cancel: "Cancelar",
        confirmDelete: "Eliminar"
    },
    notifications: {
        saveSuccess: "Informe guardado con éxito.",
        saveError: "Error al guardar el informe.",
        fileSizeError: "El archivo supera el tamaño máximo de 5MB.",
        fileTypeError: "Formato no permitido. Use JPG, PNG o PDF.",
        fileReadError: "Error al leer el archivo."
    },
    categories: {
        Viajes: "Viajes",
        Comidas: "Comidas",
        Suministros: "Suministros",
        Transporte: "Transporte",
        Alojamiento: "Alojamiento",
        Otros: "Otros"
    },
    statuses: {
        Pendiente: "Pendiente",
        Aprobado: "Aprobado",
        Rechazado: "Rechazado"
    },
    csv: {
        date: "Fecha",
        description: "Descripción",
        category: "Categoría",
        invoiceNumber: "Número de Factura",
        amount: "Monto",
        status: "Estado",
        receiptAttached: "Factura Adjunta",
        yes: "Sí",
        no: "No"
    },
    monthsShort: {
        0: "Ene", 1: "Feb", 2: "Mar", 3: "Abr", 4: "May", 5: "Jun", 
        6: "Jul", 7: "Ago", 8: "Sep", 9: "Oct", 10: "Nov", 11: "Dic"
    }
};

export default es;
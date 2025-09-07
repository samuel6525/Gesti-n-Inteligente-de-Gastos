
import React from 'react';
import { CloseIcon } from './icons';
import Modal from './Modal';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionsModal: React.FC<InstructionsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Cerrar"
        >
          <CloseIcon />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Guía de Usuario</h2>
        <div className="text-gray-600 dark:text-gray-300 space-y-4">
          <p>
            Bienvenido al Generador de Plantillas de Gastos. Siga estos pasos para crear su informe de manera eficaz:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong>Añadir un Gasto:</strong> Haga clic en el botón <span className="font-semibold text-kimi-green">"+ Añadir Gasto"</span> para agregar una nueva fila a la tabla.
            </li>
            <li>
              <strong>Rellenar Detalles:</strong> Complete los campos para cada gasto:
              <ul className="list-disc list-inside space-y-1 pl-6 mt-1">
                <li><span className="font-semibold">Fecha:</span> Seleccione la fecha en que se realizó el gasto.</li>
                <li><span className="font-semibold">Descripción:</span> Escriba una breve descripción del gasto.</li>
                <li><span className="font-semibold">Categoría:</span> Elija la categoría apropiada del menú desplegable.</li>
                <li><span className="font-semibold">Monto:</span> Ingrese el costo total del gasto.</li>
              </ul>
            </li>
            <li>
              <strong>Cálculos Automáticos:</strong> El <span className="font-semibold">"Gasto Total"</span> en la parte superior se actualizará automáticamente a medida que agregue o modifique gastos.
            </li>
            <li>
              <strong>Eliminar un Gasto:</strong> Haga clic en el icono de la papelera en el extremo derecho de una fila para eliminarla.
            </li>
            <li>
              <strong>Exportar a CSV:</strong> Cuando haya terminado, haga clic en el botón <span className="font-semibold text-kimi-green">"Exportar a CSV"</span> para descargar su informe de gastos como un archivo CSV, que puede abrir en Excel u Hojas de cálculo de Google.
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default InstructionsModal;
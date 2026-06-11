import { AlertTriangle } from 'lucide-react'
import Modal from './Modal'

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar exclusão" size="sm">
      <div className="flex flex-col items-center text-center gap-4 py-2">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
          <AlertTriangle size={26} className="text-red-500" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">{title}</p>
          <p className="text-sm text-gray-500 mt-1">{message || 'Esta ação não pode ser desfeita.'}</p>
        </div>
        <div className="flex gap-3 w-full mt-1">
          <button onClick={onClose} className="flex-1 btn-secondary justify-center">Cancelar</button>
          <button onClick={() => { onConfirm(); onClose() }} className="flex-1 btn-danger justify-center">Excluir</button>
        </div>
      </div>
    </Modal>
  )
}

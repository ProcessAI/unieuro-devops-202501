import { X } from "lucide-react";

interface StepInfo {
  label: string;
  timestamp: string; // Exemplo: "15/06/2025 10:30"
}

interface OrderStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  statusSteps: StepInfo[];
  currentStep: string;
}

export function OrderStatusModal({
  isOpen,
  onClose,
  statusSteps,
  currentStep,
}: OrderStatusModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A1514] p-6 rounded-lg w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Status do Pedido</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X />
          </button>
        </div>

        <ul className="space-y-3">
          {statusSteps.map((step, index) => (
            <li
              key={index}
              className={`px-4 py-2 rounded-md flex flex-col gap-1 ${
                step.label === currentStep
                  ? "bg-yellow-600 text-black font-semibold"
                  : "bg-gray-800 text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                {step.label === currentStep ? "✔️" : "•"} {step.label}
              </div>
              <span className="text-sm text-gray-300 ml-6">
                {step.timestamp || "—"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import React from 'react';

const ordersData = [
  {
    codigo: '00876',
    cliente: 'João Ferreira Silva',
    dataPedido: '10/05/2025',
    valorTotal: 'R$5.200,25',
    status: 'Entrega Pendente'
  },
  {
    codigo: '00876',
    cliente: 'João Ferreira Silva',
    dataPedido: '10/05/2025',
    valorTotal: 'R$5.200,25',
    status: 'Entrega Pendente'
  }
];

const OrdersTable: React.FC = () => {
  return (
    <div className="bg-[#1A1615] p-6 rounded-lg">
      <h2 className="text-white text-xl font-semibold mb-6">Pedidos Pendentes</h2>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-[#DF9829] text-sm font-medium text-center py-3">Código</th>
              <th className="text-[#DF9829] text-sm font-medium text-center py-3">Cliente</th>
              <th className="text-[#DF9829] text-sm font-medium text-center py-3">Data do Pedido</th>
              <th className="text-[#DF9829] text-sm font-medium text-center py-3">Valor Total</th>
              <th className="text-[#DF9829] text-sm font-medium text-center py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {ordersData.map((order, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="text-gray-300 text-sm py-4 text-center py-3">{order.codigo}</td>
                <td className="text-gray-300 text-sm py-4 text-center py-3">{order.cliente}</td>
                <td className="text-gray-300 text-sm py-4 text-center py-3">{order.dataPedido}</td>
                <td className="text-gray-300 text-sm py-4 text-center py-3">{order.valorTotal}</td>
                <td className="text-gray-300 text-sm py-4 text-center py-3">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;

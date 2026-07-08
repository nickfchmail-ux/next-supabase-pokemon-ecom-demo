'use client';

import { ChevronDown, ChevronUp, Eye, FileText, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from '../../../_componentAPI/badge';
import { Button } from '../../../_componentAPI/button';
import { Input } from '../../../_componentAPI/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../_componentAPI/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../_componentAPI/table';

// Pokémon type-mapped status colors
const STATUS_STYLES = {
  paid: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  cancelled: 'bg-red-100 text-red-700 border-red-300',
  shipped: 'bg-blue-100 text-blue-700 border-blue-300',
  refunded: 'bg-slate-100 text-slate-700 border-slate-300',
};

export default function OrderTable({ orders }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('created_at');
  const [sortDir, setSortDir] = useState('desc');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filter + sort
  const filtered = useMemo(() => {
    let result = [...(orders || [])];

    if (statusFilter !== 'all') {
      result = result.filter((o) => o.payment_status === statusFilter);
    }
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (o) =>
          String(o.order_id).toLowerCase().includes(s) ||
          String(o.user_id).toLowerCase().includes(s)
      );
    }

    result.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      if (sortDir === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });

    return result;
  }, [orders, search, statusFilter, sortField, sortDir]);

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search by Order ID or User ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-slate-400 flex items-center">
          {filtered.length} order{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => toggleSort('order_id')}
              >
                <span className="inline-flex items-center gap-1">
                  Order ID <SortIcon field="order_id" />
                </span>
              </TableHead>
              <TableHead>User ID</TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => toggleSort('total_amount')}
              >
                <span className="inline-flex items-center gap-1">
                  Amount <SortIcon field="total_amount" />
                </span>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => toggleSort('created_at')}
              >
                <span className="inline-flex items-center gap-1">
                  Date <SortIcon field="created_at" />
                </span>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                  <FileText size={32} className="mx-auto mb-2 opacity-50" />
                  No orders found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((order) => (
                <TableRow key={order.order_id} className="hover:bg-slate-50">
                  <TableCell className="font-mono text-xs">
                    {String(order.order_id).slice(0, 12)}…
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">#{order.user_id}</TableCell>
                  <TableCell className="font-medium">
                    ${Number(order.total_amount).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        STATUS_STYLES[order.payment_status] || 'bg-slate-100 text-slate-600'
                      }
                    >
                      {order.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-slate-500">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => setSelectedOrder(order)}>
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order Detail Panel */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Order #{selectedOrder?.order_id}
                </h3>
                <p className="text-sm text-slate-500">
                  Placed on{' '}
                  {new Date(selectedOrder.created_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-500">Amount</span>
                  <p className="font-semibold text-lg">
                    ${Number(selectedOrder.total_amount).toFixed(2)}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500">Status</span>
                  <Badge
                    variant="outline"
                    className={STATUS_STYLES[selectedOrder.payment_status] || ''}
                  >
                    {selectedOrder.payment_status}
                  </Badge>
                </div>
                <div>
                  <span className="text-slate-500">User ID</span>
                  <p>#{selectedOrder.user_id}</p>
                </div>
                <div>
                  <span className="text-slate-500">Shipping Address</span>
                  <p className="text-xs">
                    {typeof selectedOrder.shipping_address === 'object'
                      ? JSON.stringify(selectedOrder.shipping_address)
                      : selectedOrder.shipping_address || '—'}
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setSelectedOrder(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

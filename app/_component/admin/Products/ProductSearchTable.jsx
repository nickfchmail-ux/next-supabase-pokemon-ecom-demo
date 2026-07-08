'use client';

import { ExternalLink, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Badge } from '../../../_componentAPI/badge';
import { Button } from '../../../_componentAPI/button';
import { Input } from '../../../_componentAPI/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../_componentAPI/table';

export default function ProductSearchTable({ products }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter((p) => {
      const nameMatch = (p.name || '').toLowerCase().includes(q);
      const speciesMatch = (p.species || []).some((s) => String(s).toLowerCase().includes(q));
      const idMatch = String(p.id).includes(q);
      const priceMatch = p.pokemons_selling?.regular_price != null
        && String(p.pokemons_selling.regular_price).includes(q);
      return nameMatch || speciesMatch || idMatch || priceMatch;
    });
  }, [products, search]);

  return (
    <>
      {/* Search bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Search by name, species, ID, or price..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-8"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-white">
              <TableHead>ID</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Species</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
        <div className="max-h-[calc(100vh-22rem)] overflow-y-auto">
        <Table>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-slate-400">
                  {search ? 'No products match your search.' : 'No products found. Add your first Pokémon!'}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id} className="hover:bg-slate-50">
                  <TableCell className="font-mono text-xs text-slate-500">#{p.id}</TableCell>
                  <TableCell>
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-100" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {(p.species || []).map((s) => (
                        <Badge key={s} variant="outline" className="text-[10px] px-1.5 py-0">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {p.pokemons_selling?.regular_price != null
                      ? `$${Number(p.pokemons_selling.regular_price).toFixed(2)}`
                      : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/products/${p.id}`}>
                      <Button size="sm" variant="ghost">
                        <ExternalLink size={14} className="mr-1" />
                        Edit
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        </div>
      </div>
    </>
  );
}

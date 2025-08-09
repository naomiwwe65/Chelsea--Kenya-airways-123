"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/UI/table";
import { Activity, AlertTriangle, Settings, Plus } from "lucide-react";
import { fetchMROItems } from "@/lib/api";
import dynamic from "next/dynamic";
const MROJobForm = dynamic(() => import("@/components/mro/MROJobForm"), { ssr: false });
import type { Progress, Category, MROItem } from "@/types/mro";
import { CATEGORIES } from "@/types/mro";

type SortField = keyof Pick<MROItem,
  'customer' | 'part_number' | 'description' | 'serial_number' |
  'date_delivered' | 'work_requested' | 'progress' | 'location' |
  'expected_release_date' | 'remarks' | 'category'>;

interface SortConfig { field: SortField; direction: 'asc' | 'desc'; }

export default function MROTable() {
  const [items, setItems] = useState<MROItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortLoading, setSortLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [openForm, setOpenForm] = useState<null | { mode: 'create' | 'edit'; item?: MROItem }>(null);

  useEffect(() => { loadMROItems(); }, []);

  const loadMROItems = async () => {
    try {
      const data = await fetchMROItems();
      setItems(data);
    } catch (error) {
      console.error("Error fetching MRO items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = async (field: SortField) => {
    setSortLoading(true);
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig?.field === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ field, direction });
    await new Promise(resolve => setTimeout(resolve, 300));
    setSortLoading(false);
  };

  const sortItems = (items: MROItem[]) => {
    if (!sortConfig) return items;
    return [...items].sort((a, b) => {
      const field = sortConfig.field;
      const aVal = a[field] as unknown;
      const bVal = b[field] as unknown;

      if (field === 'date_delivered' || field === 'expected_release_date') {
        const aDate = new Date((aVal as string) || '');
        const bDate = new Date((bVal as string) || '');
        return sortConfig.direction === 'asc'
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }

      return sortConfig.direction === 'asc'
        ? String(aVal ?? '').localeCompare(String(bVal ?? ''))
        : String(bVal ?? '').localeCompare(String(aVal ?? ''));
    });
  };

  const handleClearSearch = () => setSearchQuery('');

  const filteredItems = items.filter(item => {
    if (selectedCategory && item.category !== selectedCategory) return false;
    if (selectedSubcategory && item.subcategory !== selectedSubcategory) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.customer?.toLowerCase() || '').includes(q) ||
      (item.part_number?.toLowerCase() || '').includes(q) ||
      (item.description?.toLowerCase() || '').includes(q) ||
      (item.serial_number?.toLowerCase() || '').includes(q) ||
      (item.progress?.toLowerCase() || '').includes(q) ||
      (item.category?.toLowerCase() || '').includes(q) ||
      (item.subcategory?.toLowerCase() || '').includes(q) ||
      (item.sheet_name?.toLowerCase() || '').includes(q) ||
      (item.work_requested?.toLowerCase() || '').includes(q) ||
      (item.remarks?.toLowerCase() || '').includes(q)
    );
  });

  const sortedItems = sortItems(filteredItems);

  const getProgressBadgeStyles = (progress: Progress) => {
    switch (progress) {
      case 'CLOSED': return 'bg-green-500 text-white';
      case 'WIP': return 'bg-yellow-500 text-white';
      case 'ON PROGRESS': return 'bg-blue-500 text-white';
      case 'PENDING': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Activity className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <div className="flex items-center gap-2 px-2 py-1.5 border border-white/15 rounded-lg bg-white/10">
            <Activity className="w-4 h-4 text-white/60" />
            <input
              type="text"
              placeholder="Search items... (Ctrl+F)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm text-white"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
                title="Clear search (Esc)"
              >
                <AlertTriangle className="w-3 h-3 text-white/60 rotate-45" />
              </button>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-3 py-1.5 border border-white/15 rounded-lg hover:bg-white/10 transition-colors text-white"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm font-medium">Filters</span>
        </button>

        <button
          onClick={() => setOpenForm({ mode: 'create' })}
          className="flex items-center gap-2 px-3 py-1.5 border border-white/15 rounded-lg bg-red-500/90 hover:bg-red-500 transition-colors text-white"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add MRO Job</span>
        </button>
      </div>

      {showFilters && (
        <div className="flex items-center gap-4 p-4 border border-white/15 rounded-lg bg-white/10">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-white/80">Category</label>
            <select
              value={selectedCategory || ""}
              onChange={(e) => setSelectedCategory((e.target.value as Category) || null)}
              className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-white/80">Subcategory</label>
            <select
              value={selectedSubcategory || ""}
              onChange={(e) => setSelectedSubcategory(e.target.value || null)}
              className="w-full p-2 bg-white/10 border border-white/20 rounded-md text-white"
            >
              <option value="">All Subcategories</option>
              <option value="MAIN">Main</option>
              <option value="SHOP">Shop</option>
              <option value="LAB">Lab</option>
            </select>
          </div>

          {(selectedCategory || selectedSubcategory) && (
            <button
              onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); }}
              className="self-end px-3 py-2 text-sm font-medium text-red-300 hover:bg-white/10 rounded-md transition-colors"
            >
              <AlertTriangle className="w-4 h-4 rotate-45" />
            </button>
          )}
        </div>
      )}

      {searchQuery && (
        <div className="text-sm text-white/60">
          Found {sortedItems.length} item{sortedItems.length !== 1 ? 's' : ''} {(
            <span>matching &quot;{searchQuery}&quot;</span>
          )}
        </div>
      )}

      <div className="card w-full overflow-auto">
        {sortedItems.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Part Number</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Serial Number</TableHead>
                <TableHead>
                  <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleSort('date_delivered')}>
                    Date Delivered
                    <Activity className={`w-4 h-4 transition-all ${sortLoading && sortConfig?.field === 'date_delivered' ? 'animate-spin' : sortConfig?.field === 'date_delivered' ? (sortConfig.direction === 'desc' ? 'rotate-180' : '') : ''}`} />
                  </div>
                </TableHead>
                <TableHead>Work Requested</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Expected Release</TableHead>
                <TableHead>Remarks</TableHead>
                <TableHead>Category</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.customer}</TableCell>
                  <TableCell className="font-mono">{item.part_number}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{item.description}</TableCell>
                  <TableCell className="font-mono">{item.serial_number}</TableCell>
                  <TableCell>{item.date_delivered}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{item.work_requested}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getProgressBadgeStyles(item.progress)}`}>
                      {item.progress}
                    </span>
                  </TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell>{item.expected_release_date}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{item.remarks}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{item.category}</span>
                      <button
                        onClick={() => setOpenForm({ mode: 'edit', item })}
                        className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/15 border border-white/20"
                      >
                        Edit
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <Activity className="w-8 h-8 mx-auto text-white/60 mb-3" />
            <p className="text-white font-medium">No items found {searchQuery ? (<span>matching &quot;{searchQuery}&quot;</span>) : ''}</p>
            {searchQuery && (
              <p className="text-white/70 text-sm mt-1">Try adjusting your search term</p>
            )}
          </div>
        )}
      </div>

      {openForm && (
        <div className="fixed inset-0 z-50 bg-black/60 p-4 overflow-y-auto flex items-center justify-center">
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">{openForm.mode === 'create' ? 'Create MRO Job' : 'Edit MRO Job'}</h2>
              <button className="px-2 py-1 rounded bg-white/10" onClick={()=>setOpenForm(null)}>Close</button>
            </div>
            <MROJobForm
              mode={openForm.mode}
              initial={openForm.item ? {
                id: openForm.item.id,
                title: openForm.item.description,
                aircraft_reg_no: openForm.item.part_number,
                assigned_engineer: openForm.item.customer,
                maintenance_date: openForm.item.date_delivered ?? undefined,
                status: 'In Progress'
              } : undefined}
              onClose={()=>setOpenForm(null)}
              onSaved={()=>{ setOpenForm(null); /* simple refresh */ location.reload(); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}



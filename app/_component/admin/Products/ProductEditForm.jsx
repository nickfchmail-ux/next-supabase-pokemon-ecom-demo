'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Image as ImageIcon, Save, Trash2, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Badge } from '../../../_componentAPI/badge';
import { Button } from '../../../_componentAPI/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../_componentAPI/card';
import { Input } from '../../../_componentAPI/input';
import { Label } from '../../../_componentAPI/label';
import { Slider } from '../../../_componentAPI/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../_componentAPI/tabs';
import { Textarea } from '../../../_componentAPI/textarea';

// ── Zod schema ──
const pokemonManageSchema = z.object({
  name: z.string().min(2, 'Name requires 2+ characters'),
  species: z.array(z.string()).min(1, 'Assign at least one elemental type'),
  price: z.number().positive('Base pricing must be greater than zero'),
  hp: z.number().int().min(1).max(255),
  attack: z.number().int().min(1).max(255),
  defense: z.number().int().min(1).max(255),
  special_attack: z.number().int().min(1).max(255),
  special_defense: z.number().int().min(1).max(255),
  speed: z.number().int().min(1).max(255),
  description: z.string().min(10, 'Please provide a robust product listing description'),
});

const ALL_SPECIES = [
  'Normal',
  'Fire',
  'Water',
  'Electric',
  'Grass',
  'Ice',
  'Fighting',
  'Poison',
  'Ground',
  'Flying',
  'Psychic',
  'Bug',
  'Rock',
  'Ghost',
  'Dragon',
  'Dark',
  'Steel',
  'Fairy',
];

export default function ProductEditForm({ product, isNew = false }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  // Normalize species from DB (ensure proper case) and deduplicate
  const rawSpecies = product?.species || [];
  const normalizedSpecies = Array.isArray(rawSpecies)
    ? [
        ...new Set(
          rawSpecies.map((s) => {
            const match = ALL_SPECIES.find((a) => a.toLowerCase() === String(s).toLowerCase());
            return match || s;
          })
        ),
      ]
    : [];
  const [selectedSpecies, setSelectedSpecies] = useState(normalizedSpecies);
  // descriptions is text[] in Supabase — manage as array of strings
  const initialDescriptions =
    Array.isArray(product?.descriptions) && product.descriptions.length > 0
      ? product.descriptions
      : product?.descriptions
        ? [product.descriptions]
        : [''];
  const [descriptionFields, setDescriptionFields] = useState(initialDescriptions);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(pokemonManageSchema),
    defaultValues: {
      name: product?.name || '',
      species: normalizedSpecies,
      price: product?.pokemons_selling?.regular_price || 0,
      hp: product?.hp || 50,
      attack: product?.attack || 50,
      defense: product?.defense || 50,
      special_attack: product?.special_attack || 50,
      special_defense: product?.special_defense || 50,
      speed: product?.speed || 50,
      description: initialDescriptions.join('\n\n'),
    },
  });

  const addDescriptionField = () => {
    setDescriptionFields((prev) => [...prev, '']);
  };

  const removeDescriptionField = (index) => {
    if (descriptionFields.length <= 1) return;
    setDescriptionFields((prev) => prev.filter((_, i) => i !== index));
  };

  const updateDescriptionField = (index, value) => {
    setDescriptionFields((prev) => {
      const next = [...prev];
      next[index] = value;
      setValue('description', next.join('\n\n'));
      return next;
    });
  };

  const hp = watch('hp');
  const attack = watch('attack');
  const defense = watch('defense');
  const spAtk = watch('special_attack');
  const spDef = watch('special_defense');
  const speed = watch('speed');

  const toggleSpecies = (type) => {
    const next = selectedSpecies.some((t) => t.toLowerCase() === type.toLowerCase())
      ? selectedSpecies.filter((t) => t.toLowerCase() !== type.toLowerCase())
      : [...selectedSpecies, type];
    setSelectedSpecies(next);
    setValue('species', next);
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      // Send descriptions as an array (one entry per paragraph)
      const payload = {
        ...data,
        descriptions: descriptionFields.filter((d) => d.trim() !== ''),
      };
      const res = await fetch('/api/admin/products', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isNew ? payload : { id: product.id, ...payload }),
      });
      if (!res.ok) throw new Error('Failed to save');
      // Stay disabled — no setSaving(false) — redirect keeps form frozen
      router.push('/admin/products');
      router.refresh();
    } catch (err) {
      console.error(err);
      setSaving(false); // Re-enable only on error
      alert('Error saving product: ' + err.message);
    }
  };

  // ── Simple SVG Radar Chart ──
  const radarStats = [hp, attack, defense, spAtk, spDef, speed];
  const radarLabels = ['HP', 'ATK', 'DEF', 'SpA', 'SpD', 'SPD'];
  const maxStat = 255;
  const radarPoints = radarStats
    .map((val, i) => {
      const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
      const r = (val / maxStat) * 100;
      return `${50 + r * Math.cos(angle)} ${50 + r * Math.sin(angle)}`;
    })
    .join(' ');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} disabled={saving}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {isNew ? 'Register New Pokémon' : `Edit: ${product?.name}`}
            </h2>
            <p className="text-slate-500 text-sm">Manage core details, stats, and assets</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isNew && (
            <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50">
              <Trash2 size={16} className="mr-1.5" />
              Delete
            </Button>
          )}
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Save size={16} className="mr-1.5" />
            {saving ? 'Saving...' : 'Save Pokémon'}
          </Button>
        </div>
      </div>

      {/* Multi-tab form */}
      <div className={saving ? 'pointer-events-none opacity-60 select-none' : ''}>
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="details">Core Details</TabsTrigger>
          <TabsTrigger value="stats">Combat Statistics</TabsTrigger>
          <TabsTrigger value="assets">Storage Assets</TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Core Details ── */}
        <TabsContent value="details" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="e.g. Pikachu"
                  className="mt-1"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label>Species (Types) *</Label>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {ALL_SPECIES.map((type) => {
                    const isActive = selectedSpecies.some(
                      (t) => String(t).toLowerCase() === type.toLowerCase()
                    );
                    return (
                      <Badge
                        key={type}
                        variant={isActive ? 'default' : 'outline'}
                        className={`cursor-pointer select-none ${isActive ? 'bg-purple-600' : ''}`}
                        onClick={() => toggleSpecies(type)}
                      >
                        {type}
                      </Badge>
                    );
                  })}
                </div>
                <input type="hidden" {...register('species')} />
                {errors.species && (
                  <p className="text-red-500 text-xs mt-1">{errors.species.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="price">Base Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register('price', { valueAsNumber: true })}
                  className="mt-1"
                />
                {errors.price && (
                  <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label>Descriptions *</Label>
                  <button
                    type="button"
                    onClick={addDescriptionField}
                    disabled={saving}
                    className="text-xs text-purple-600 hover:text-purple-800 font-medium disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    + Add paragraph
                  </button>
                </div>
                <div className="space-y-2">
                  {descriptionFields.map((desc, idx) => (
                    <div key={idx} className="flex gap-1">
                      <Textarea
                        rows={3}
                        value={desc}
                        onChange={(e) => updateDescriptionField(idx, e.target.value)}
                        placeholder={`Description paragraph ${idx + 1}...`}
                        className="mt-0 flex-1"
                      />
                      {descriptionFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDescriptionField(idx)}
                          className="text-red-400 hover:text-red-600 self-start mt-1"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <input type="hidden" {...register('description')} />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Tab 2: Combat Statistics ── */}
        <TabsContent value="stats" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Base Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  { name: 'hp', label: 'HP', max: 255 },
                  { name: 'attack', label: 'Attack', max: 255 },
                  { name: 'defense', label: 'Defense', max: 255 },
                  { name: 'special_attack', label: 'Special Attack', max: 255 },
                  { name: 'special_defense', label: 'Special Defense', max: 255 },
                  { name: 'speed', label: 'Speed', max: 255 },
                ].map((stat) => (
                  <div key={stat.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-600">{stat.label}</span>
                      <span className="font-mono text-slate-900">{watch(stat.name)}</span>
                    </div>
                    <Slider
                      min={1}
                      max={255}
                      step={1}
                      value={[watch(stat.name)]}
                      onValueChange={([v]) => setValue(stat.name, v)}
                      className="w-full"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* SVG Radar chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Stat Radar</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-64 h-64">
                  {/* Grid lines */}
                  {[25, 50, 75, 100].map((r) => (
                    <polygon
                      key={r}
                      points={radarLabels
                        .map((_, i) => {
                          const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                          return `${50 + r * Math.cos(angle)} ${50 + r * Math.sin(angle)}`;
                        })
                        .join(' ')}
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="0.3"
                    />
                  ))}
                  {/* Data polygon */}
                  <polygon
                    points={radarPoints}
                    fill="rgba(112, 56, 248, 0.2)"
                    stroke="#7038F8"
                    strokeWidth="1"
                  />
                  {/* Labels */}
                  {radarLabels.map((label, i) => {
                    const angle = (Math.PI * 2 * i) / 6 - Math.PI / 2;
                    const x = 50 + 115 * Math.cos(angle);
                    const y = 50 + 115 * Math.sin(angle);
                    return (
                      <text
                        key={label}
                        x={x}
                        y={y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize="3.5"
                        fill="#64748b"
                      >
                        {label}
                      </text>
                    );
                  })}
                </svg>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ── Tab 3: Storage Assets ── */}
        <TabsContent value="assets" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current image preview */}
              {product?.image && (
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 rounded-lg object-cover border border-slate-300"
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-700">Current Image</p>
                    <p className="text-xs text-slate-400 mt-0.5 break-all">{product.image}</p>
                  </div>
                </div>
              )}

              {/* Upload area */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors cursor-pointer">
                <Upload size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm text-slate-500">
                  Drag & drop a Pokémon image here, or click to browse
                </p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG, or WebP up to 5 MB</p>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <ImageIcon size={14} className="mr-1.5" />
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}

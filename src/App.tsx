/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Home, 
  Compass, 
  MessageCircle, 
  User,
  Star,
  Map,
  Hotel,
  Ticket,
  Clock,
  Navigation,
  Filter,
  ArrowRight,
  ChevronLeft,
  Minus,
  Plus,
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Sparkles,
  Tent,
  Waves
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type ProductType = 'ticket' | 'hotel' | 'package' | 'opendate';
type ViewState = 'home' | 'details' | 'checkout' | 'success';

interface ProductOption {
  id: string;
  name: string;
  priceDelta: number;
}

interface OptionGroup {
  id: string;
  title: string;
  options: ProductOption[];
}

interface TravelProduct {
  id: string;
  title: string;
  type: ProductType;
  price: number;
  rating: number;
  image: string;
  location: string;
  tags: string[];
  description: string;
  optionGroups?: OptionGroup[];
}

// --- Mock Data ---

const MOCK_PRODUCTS: TravelProduct[] = [
  {
    id: '1',
    title: '林间微光 · 杭州莫干山竹林民宿',
    type: 'hotel',
    price: 1280,
    rating: 4.9,
    image: 'https://picsum.photos/seed/forest/800/600',
    location: '浙江 · 德清',
    tags: ['避世隐居', '竹林氧吧'],
    description: '坐落于莫干山核心景区，被万亩翠竹环绕。清晨在鸟鸣中醒来，夜晚在繁星下入睡。这里不仅仅是一张床，更是一种回归自然的生活方式。'
  },
  {
    id: '2',
    title: '【期票】西湖摇橹船午后漫游券',
    type: 'opendate',
    price: 88,
    rating: 4.8,
    image: 'https://picsum.photos/seed/lake/800/600',
    location: '杭州 · 西湖',
    tags: ['不限日期', '慢生活'],
    description: '随时开启一段西湖慢时光。坐在古朴的摇橹船上，听着橹声欸乃，看湖水泛起涟漪，体验最地道的江南风情。三个月内任选一天可用。'
  },
  {
    id: '3',
    title: '【宿+玩】三亚海物语：奢享酒店+潜水探索',
    type: 'package',
    price: 3299,
    rating: 4.9,
    image: 'https://picsum.photos/seed/ocean/800/600',
    location: '海南 · 三亚',
    tags: ['官方组合', '深度探索'],
    description: '为您精心搭配的三亚海岛逃离计划。包含一线海景酒店住宿及多项水上运动可选。定制您的专属蓝色假期，在蔚蓝大海中找回自我。',
    optionGroups: [
      {
        id: 'room',
        title: '选择房型',
        options: [
          { id: 'garden', name: '高级园景双床房', priceDelta: 0 },
          { id: 'sea', name: '豪华海景大床房', priceDelta: 500 },
          { id: 'villa', name: '私人泳池别墅', priceDelta: 2000 },
        ]
      },
      {
        id: 'activity',
        title: '体验项目',
        options: [
          { id: 'basic', name: '仅含早餐', priceDelta: 0 },
          { id: 'diving', name: '双人浮潜体验', priceDelta: 450 },
          { id: 'surf', name: '冲浪私人课程', priceDelta: 780 },
        ]
      }
    ]
  },
  {
    id: '4',
    title: '乌镇乌村：田园生活体验日票',
    type: 'ticket',
    price: 380,
    rating: 4.7,
    image: 'https://picsum.photos/seed/village/800/600',
    location: '嘉兴 · 桐乡',
    tags: ['亲子推荐', '一站式'],
    description: '在快节奏的时代，找回童年的田园梦。门票包含乌村内所有体验项目：采摘、垂钓、手工坊等，更有地道的一小时午餐供应。'
  },
  {
    id: '5',
    title: '景德镇：御窑厂遗址公园讲解票',
    type: 'ticket',
    price: 55,
    rating: 4.8,
    image: 'https://picsum.photos/seed/clay/800/600',
    location: '江西 · 景德镇',
    tags: ['瓷都文化', '深度讲解'],
    description: '千年窑火，不灭传奇。跟随导游深入了解御窑厂的历史兴衰，近距离观摩古破瓷片的修复过程，感受泥土与火焰淬炼的艺术魅力。'
  }
];

const CATEGORIES = [
  { id: 'all', name: '全部', icon: <Sparkles className="w-5 h-5" /> },
  { id: 'hotel', name: '宿集', icon: <Tent className="w-5 h-5" /> },
  { id: 'ticket', name: '游历', icon: <Navigation className="w-5 h-5" /> },
  { id: 'package', name: '组合', icon: <Waves className="w-5 h-5" /> },
  { id: 'opendate', name: '期票', icon: <Clock className="w-5 h-5" /> },
];

// --- Sub-Components ---

const ProductCard = ({ product, onClick }: { product: TravelProduct, onClick: () => void }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 flex flex-col mb-6 cursor-pointer group"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <motion.img 
          src={product.image} 
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 flex gap-2">
           <div className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-bold text-gray-800 shadow-sm uppercase tracking-wider">
            {product.type === 'hotel' ? 'STAY' : product.type === 'ticket' ? 'PLAY' : product.type === 'package' ? 'COMBO' : 'FLEX'}
          </div>
        </div>
        <div className="absolute bottom-4 right-4 bg-white/70 backdrop-blur-md text-gray-800 rounded-full px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold border border-white/50">
          <Star className="w-3.5 h-3.5 fill-gray-800" />
          {product.rating}
        </div>
      </div>
      <div className="p-6 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-3">
          <h3 className="font-display font-medium text-lg text-gray-900 leading-tight flex-1">
            {product.title}
          </h3>
          <div className="flex items-baseline gap-0.5 text-brand-leaf">
            <span className="text-[10px] font-bold">¥</span>
            <span className="text-xl font-bold font-display">{product.price}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1">
          <MapPin className="w-3.5 h-3.5" />
          {product.location}
          <div className="w-1 h-1 bg-gray-200 rounded-full mx-1" />
          {product.tags[0]}
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<TravelProduct | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [orderDate, setOrderDate] = useState('2026-05-20');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const calculateTotalDelta = () => {
    if (!selectedProduct?.optionGroups) return 0;
    let delta = 0;
    selectedProduct.optionGroups.forEach(group => {
      const selectedId = selectedOptions[group.id];
      const option = group.options.find(o => o.id === selectedId);
      if (option) delta += option.priceDelta;
    });
    return delta;
  };

  const handleProductSelect = (p: TravelProduct) => {
    setSelectedProduct(p);
    setQuantity(1);
    const defaults: Record<string, string> = {};
    p.optionGroups?.forEach(group => {
      defaults[group.id] = group.options[0].id;
    });
    setSelectedOptions(defaults);
    setView('details');
    window.scrollTo(0, 0);
  };

  const handleOptionSelect = (groupId: string, optionId: string) => {
    setSelectedOptions(prev => ({ ...prev, [groupId]: optionId }));
  };

  const currentTotalPrice = selectedProduct ? (selectedProduct.price + calculateTotalDelta()) * quantity : 0;

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.type === activeCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-brand-offwhite text-gray-900 font-sans max-w-md mx-auto relative overflow-x-hidden shadow-2xl">
      
      <AnimatePresence mode="wait">
        {/* --- Home View --- */}
        {view === 'home' && (
          <motion.div 
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            className="pb-32"
          >
            {/* Header */}
            <header className="px-6 pt-16 pb-8">
              <div className="flex justify-between items-center mb-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-brand-sage uppercase tracking-[0.2em] mb-1">Explore Nature</span>
                  <h1 className="text-3xl font-display font-medium tracking-tight">你好，旅人</h1>
                </div>
                <div className="w-12 h-12 rounded-[1.2rem] bg-gray-100 overflow-hidden ring-4 ring-white shadow-sm">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Fresh" alt="User" />
                </div>
              </div>

              <div className="relative mb-10">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input 
                  type="text" 
                  placeholder="寻找下一个目的地..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 text-sm text-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 focus:outline-none focus:ring-1 focus:ring-brand-sage transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Categories */}
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-1">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className="flex flex-col items-center gap-3 shrink-0"
                  >
                    <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 ${
                      activeCategory === cat.id 
                      ? 'bg-brand-sage text-white shadow-lg shadow-brand-sage/20 scle-110' 
                      : 'bg-white text-gray-300 border border-gray-50 shadow-sm'
                    }`}>
                      {cat.icon}
                    </div>
                    <span className={`text-[10px] font-bold tracking-wider ${activeCategory === cat.id ? 'text-gray-900' : 'text-gray-300'}`}>
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </header>

            {/* List */}
            <main className="px-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-5 bg-brand-sage rounded-full" />
                <h2 className="font-display font-medium text-xl">今日推荐</h2>
              </div>

              <div className="flex flex-col">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onClick={() => handleProductSelect(product)} />
                ))}
              </div>
            </main>

            {/* Float Navigation */}
            <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.08)] z-50 p-2 flex items-center gap-2">
              {[
                { id: 'home', icon: <Home className="w-5 h-5" />, active: true },
                { id: 'explore', icon: <Compass className="w-5 h-5" /> },
                { id: 'chat', icon: <MessageCircle className="w-5 h-5" /> },
                { id: 'mine', icon: <User className="w-5 h-5" /> },
              ].map((item) => (
                <button 
                  key={item.id} 
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    item.active ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-300 hover:text-gray-500'
                  }`}
                >
                  {item.icon}
                </button>
              ))}
            </nav>
          </motion.div>
        )}

        {/* --- Details View --- */}
        {view === 'details' && selectedProduct && (
          <motion.div 
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="pb-32 bg-white min-h-screen"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img src={selectedProduct.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white" />
              
              <button 
                onClick={() => setView('home')} 
                className="absolute top-12 left-6 w-11 h-11 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-transform"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>

            <div className="px-8 -mt-24 relative z-10">
              <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-gray-50">
                <div className="flex justify-between items-start mb-6">
                  <h1 className="text-2xl font-display font-medium text-gray-900 leading-[1.2] flex-1 pr-4">{selectedProduct.title}</h1>
                  <div className="text-xl font-display font-bold text-brand-leaf">
                    <span className="text-xs mr-0.5">¥</span>{selectedProduct.price}
                  </div>
                </div>

                <div className="flex items-center gap-6 mb-10">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                    <MapPin className="w-3.5 h-3.5 text-brand-sage" /> {selectedProduct.location}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-brand-sage text-brand-sage" /> {selectedProduct.rating}
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  <h2 className="text-[10px] font-bold text-brand-sage uppercase tracking-[0.2em]">Story</h2>
                  <p className="text-sm text-gray-500 leading-loose antialiased">{selectedProduct.description}</p>
                </div>

                {/* Combination UI */}
                {selectedProduct.optionGroups && (
                  <div className="space-y-8 mb-10 pt-6 border-t border-gray-50">
                    {selectedProduct.optionGroups.map(group => (
                      <div key={group.id} className="space-y-4">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{group.title}</h3>
                        <div className="flex flex-col gap-2.5">
                          {group.options.map(opt => {
                            const isActive = selectedOptions[group.id] === opt.id;
                            return (
                              <button
                                key={opt.id}
                                onClick={() => handleOptionSelect(group.id, opt.id)}
                                className={`flex justify-between items-center p-5 rounded-[1.5rem] border-2 transition-all duration-300 ${
                                  isActive 
                                  ? 'bg-brand-soft border-brand-sage shadow-md shadow-brand-sage/5' 
                                  : 'bg-white border-gray-50 hover:border-gray-100'
                                }`}
                              >
                                <span className={`text-sm font-medium ${isActive ? 'text-brand-leaf' : 'text-gray-700'}`}>
                                  {opt.name}
                                </span>
                                {opt.priceDelta !== 0 && (
                                  <span className={`text-[10px] font-bold ${isActive ? 'text-brand-sage' : 'text-gray-300'}`}>
                                    {opt.priceDelta > 0 ? `+¥${opt.priceDelta}` : `-¥${Math.abs(opt.priceDelta)}`}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Secondary Selections */}
                <div className="space-y-6 pt-6 border-t border-gray-50">
                  {selectedProduct.type !== 'opendate' ? (
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Date</span>
                      <input 
                        type="date" 
                        value={orderDate}
                        onChange={(e) => setOrderDate(e.target.value)}
                        className="text-sm font-medium focus:outline-none bg-gray-50 px-4 py-2 rounded-xl" 
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border border-purple-100">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <div>
                          <p className="text-[10px] font-bold text-purple-800 uppercase tracking-wider leading-none">Open Date Ticket</p>
                          <p className="text-[10px] text-purple-600 font-medium">免预约 · 全年可用</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quantity</span>
                    <div className="flex items-center gap-5 bg-gray-50 rounded-2xl p-2 px-3">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 rounded-xl flex items-center justify-center bg-white text-gray-400 shadow-sm"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-bold w-4 text-center">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center bg-brand-leaf text-white shadow-md shadow-brand-leaf/20"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Bar */}
            <div className="fixed bottom-8 left-6 right-6 z-50">
              <div className="bg-gray-900/90 backdrop-blur-2xl rounded-[1.8rem] p-4 pl-8 flex items-center justify-between shadow-2xl ring-1 ring-white/10">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Total Price</span>
                  <div className="text-xl font-display font-medium text-white">
                    <span className="text-xs mr-1 opacity-60 italic">¥</span>{currentTotalPrice}
                  </div>
                </div>
                <button 
                  onClick={() => setView('checkout')}
                  className="bg-brand-sage text-white h-14 px-8 rounded-2xl font-bold flex items-center gap-2 active:scale-95 transition-transform"
                >
                  Book Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- Checkout View --- */}
        {view === 'checkout' && selectedProduct && (
          <motion.div 
            key="checkout"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-8 pb-32"
          >
            <div className="flex items-center gap-4 mb-12">
              <button onClick={() => setView('details')} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm">
                <ChevronLeft className="w-6 h-6 text-gray-400" />
              </button>
              <h1 className="text-2xl font-display font-medium">完善预订</h1>
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-50 mb-10">
              <div className="flex gap-5 mb-6">
                <img src={selectedProduct.image} className="w-20 h-20 rounded-2xl object-cover" referrerPolicy="no-referrer" />
                <div className="flex-1 space-y-1">
                   <span className="text-[10px] font-bold text-brand-sage uppercase tracking-wider">{selectedProduct.type}</span>
                  <h3 className="font-display font-medium text-sm leading-tight text-gray-900">{selectedProduct.title}</h3>
                  <p className="text-[10px] text-gray-400 font-bold mt-1">QTY: {quantity}</p>
                </div>
              </div>
              
              {selectedProduct.optionGroups && (
                <div className="pt-6 border-t border-gray-50 flex flex-col gap-2">
                  {selectedProduct.optionGroups.map(group => {
                    const selectedId = selectedOptions[group.id];
                    const option = group.options.find(o => o.id === selectedId);
                    return (
                      <div key={group.id} className="flex justify-between items-center text-[10px] tracking-wide">
                        <span className="text-gray-400 uppercase font-bold">{group.title}</span>
                        <span className="font-bold text-gray-700">{option?.name}</span>
                      </div>
                    );
                  })}
                  {selectedProduct.type !== 'opendate' && (
                    <div className="flex justify-between items-center text-[10px] tracking-wide mt-1">
                      <span className="text-gray-400 uppercase font-bold">Check-In</span>
                      <span className="font-extrabold text-brand-leaf">{orderDate}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.25em] pl-2">Passenger Information</h2>
                <div className="space-y-3">
                  <div className="group relative bg-white rounded-2xl p-1 border border-gray-50 shadow-sm focus-within:border-brand-sage transition-all">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-200">
                      <User className="w-full h-full" />
                    </div>
                    <input 
                      type="text" 
                      placeholder="姓名 (Name)" 
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full bg-transparent py-4 pl-14 pr-6 focus:outline-none text-sm font-medium" 
                    />
                  </div>
                  <div className="group relative bg-white rounded-2xl p-1 border border-gray-50 shadow-sm focus-within:border-brand-sage transition-all">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-200">
                      <MessageCircle className="w-full h-full" />
                    </div>
                    <input 
                      type="tel" 
                      placeholder="手机号 (Contact)" 
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      className="w-full bg-transparent py-4 pl-14 pr-6 focus:outline-none text-sm font-medium" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.25em] pl-2">Payment</h2>
                <div className="bg-brand-soft rounded-2xl p-5 border border-brand-sage/20 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-brand-leaf shadow-sm">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-800 tracking-tight">One-Click Pay</p>
                        <p className="text-[10px] text-gray-400 font-medium tracking-wide">Secure Digital Wallet</p>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-brand-leaf flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="fixed bottom-8 left-6 right-6">
              <button 
                onClick={() => setView('success')}
                className="w-full bg-gray-900 text-white rounded-[1.8rem] h-16 font-bold flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition-transform"
              >
                Pay <span className="opacity-50 italic mx-1 font-normal uppercase text-xs">for</span> ¥{currentTotalPrice}
              </button>
            </div>
          </motion.div>
        )}

        {/* --- Success View --- */}
        {view === 'success' && (
          <motion.div 
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-screen p-10 text-center"
          >
            <motion.div 
              initial={{ rotate: -15, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", damping: 12 }}
              className="w-32 h-32 bg-brand-soft text-brand-leaf rounded-[2.5rem] flex items-center justify-center mb-10 shadow-inner border-2 border-brand-sage/20"
            >
              <CheckCircle2 className="w-16 h-16" />
            </motion.div>
            
            <span className="text-[10px] font-bold text-brand-sage uppercase tracking-[0.3em] mb-4">Confirmed</span>
            <h1 className="text-3xl font-display font-medium text-gray-900 mb-4 tracking-tight">预订成功</h1>
            <p className="text-gray-400 text-sm mb-12 leading-loose max-w-[240px]">
              订单及其凭证已同步至您的个人中心。<br />
              愿这段旅程，能为您带来片刻宁静。
            </p>
            
            <button 
              onClick={() => setView('home')}
              className="px-12 py-4 bg-gray-900 text-white rounded-[1.5rem] font-bold shadow-xl active:scale-95 transition-transform"
            >
              继续探索
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

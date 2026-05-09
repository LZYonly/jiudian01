/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Home, 
  Compass, 
  MessageCircle, 
  User,
  Star,
  Clock,
  Navigation,
  ArrowRight,
  ChevronLeft,
  Minus,
  Plus,
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

interface Option {
  id: string;
  name: string;
  priceDelta: number;
}

interface OptionGroup {
  id: string;
  title: string;
  options: Option[];
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
    title: '林间微光：莫干山竹林深处隐世民宿',
    type: 'hotel',
    price: 1280,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&q=80&w=800',
    location: '浙江 · 莫干山',
    tags: ['禅意', '竹林'],
    description: '在竹影摇曳中苏醒，感受山间第一缕清晨的微光。这不仅是一次住宿，更是一场与自然的深度对话。',
    optionGroups: [
      {
        id: 'room',
        title: '房型选择',
        options: [
          { id: 'standard', name: '竹影大床房', priceDelta: 0 },
          { id: 'suite', name: '云端景观露台套房', priceDelta: 600 }
        ]
      }
    ]
  },
  {
    id: '2',
    title: '西湖慢行：私人摇橹船茶事体验',
    type: 'ticket',
    price: 458,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1599577310318-830336217dc3?auto=format&fit=crop&q=80&w=800',
    location: '浙江 · 杭州',
    tags: ['非遗', '茶席'],
    description: '避开断桥的人潮，划向湖心深处。在水波粼粼中煮一壶龙井，听船夫讲述旧时的故事。',
    optionGroups: [
      {
        id: 'tea',
        title: '茶品选择',
        options: [
          { id: 'longjing', name: '明前龙井', priceDelta: 0 },
          { id: 'tieguanyin', name: '陈年铁观音', priceDelta: 100 }
        ]
      }
    ]
  },
  {
    id: '3',
    title: '三亚海物语：隐世悬崖酒店 + 帆船体验',
    type: 'package',
    price: 3580,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1540206395-6880f9490e44?auto=format&fit=crop&q=80&w=800',
    location: '海南 · 三亚',
    tags: ['私人定制', '海趣'],
    description: '在半岛的尽头寻找那一抹纯粹的蓝。包含顶级设计感悬崖酒店及私属帆船出海，让海风吹散城市的喧嚣。',
    optionGroups: [
      {
        id: 'hotel_type',
        title: '房型方案',
        options: [
          { id: 'sea_view', name: '尊享海景房', priceDelta: 0 },
          { id: 'pool_villa', name: '私人泳池别墅', priceDelta: 1200 }
        ]
      },
      {
        id: 'activity',
        title: '配套活动',
        options: [
          { id: 'sailing', name: '日落帆船出海', priceDelta: 0 },
          { id: 'diving', name: '专业自由潜体验', priceDelta: 500 }
        ]
      }
    ]
  }
];

const CATEGORIES = [
  { id: 'all', name: '全部', icon: <Sparkles className="w-5 h-5" /> },
  { id: 'hotel', name: '宿集', icon: <Tent className="w-5 h-5" /> },
  { id: 'ticket', name: '游历', icon: <Navigation className="w-5 h-5" /> },
  { id: 'package', name: '组合', icon: <Waves className="w-5 h-5" /> },
  { id: 'opendate', name: '期票', icon: <Clock className="w-5 h-5" /> },
];

// --- Sub Components ---

const ProductCard = ({ product, onClick }: { product: TravelProduct, onClick: () => void, key?: string }) => (
  <motion.div 
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-50 shadow-[0_10px_30px_rgba(0,0,0,0.02)] mb-10 group cursor-pointer"
  >
    <div className="relative aspect-[4/3] overflow-hidden">
      <img 
        src={product.image} 
        alt={product.title} 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        referrerPolicy="no-referrer"
      />
      <div className="absolute top-4 left-4 bg-white/30 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-bold text-white tracking-widest uppercase">
        {product.location}
      </div>
    </div>
    <div className="p-8">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-display font-medium text-lg text-gray-900 leading-tight group-hover:text-brand-leaf transition-colors">{product.title}</h3>
      </div>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
          <Star className="w-3 h-3 fill-brand-sage text-brand-sage" /> {product.rating}
        </div>
        <div className="flex gap-2">
          {product.tags.map(tag => (
            <span key={tag} className="text-[9px] text-brand-sage bg-brand-soft px-2 py-0.5 rounded-full font-bold">#{tag}</span>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center pt-5 border-t border-gray-50/50">
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] text-gray-300 font-bold tracking-widest">FROM</span>
          <span className="text-xl font-display font-medium text-gray-900">¥{product.price}</span>
        </div>
        <div className="w-10 h-10 bg-brand-soft rounded-2xl flex items-center justify-center text-brand-leaf group-hover:bg-brand-sage group-hover:text-white transition-all">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<ViewState>('home');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<TravelProduct | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

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

  const currentTotalPrice = selectedProduct ? (selectedProduct.price + calculateTotalDelta()) * quantity : 0;

  const filteredProducts = MOCK_PRODUCTS.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.type === activeCategory;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-brand-paper text-gray-900 font-sans max-w-md mx-auto relative overflow-x-hidden shadow-[0_40px_100px_rgba(0,0,0,0.05)] border-x border-gray-50/50">
      
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
            <header className="px-8 pt-16 pb-8">
              <div className="flex justify-between items-center mb-10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-brand-sage uppercase tracking-[0.2em] mb-1">Morning, Traveler</span>
                  <h1 className="text-3xl font-display font-medium tracking-tight">你好，旅人</h1>
                </div>
                <div className="w-12 h-12 rounded-[1.2rem] bg-brand-stone overflow-hidden ring-4 ring-white shadow-sm">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Fresh" alt="User" />
                </div>
              </div>

              <div className="relative mb-10">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                <input 
                  type="text" 
                  placeholder="寻找下一个理想地..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-brand-stone rounded-[1.5rem] py-4 pl-14 pr-6 text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-brand-sage/20 transition-all placeholder:text-gray-300 border-none"
                />
              </div>

              {/* Categories */}
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className="flex flex-col items-center gap-3 shrink-0 group"
                  >
                    <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all duration-300 ${
                      activeCategory === cat.id 
                      ? 'bg-brand-sage text-white shadow-lg shadow-brand-sage/20 scale-105' 
                      : 'bg-white text-gray-300 border border-gray-50 shadow-sm group-hover:scale-105'
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
            <main className="px-8">
              <div className="flex items-center gap-2 mb-8">
                <div className="w-1 h-5 bg-brand-sage rounded-full" />
                <h2 className="font-display font-medium text-xl">今日微光</h2>
              </div>

              <div className="flex flex-col">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} onClick={() => handleProductSelect(product)} />
                ))}
              </div>
            </main>

            {/* Bottom Nav */}
            <nav className="fixed bottom-8 left-8 right-8 bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-50 p-2 flex items-center justify-around">
              {[
                { id: 'h', icon: <Home className="w-5 h-5" />, active: true },
                { id: 'e', icon: <Compass className="w-5 h-5" /> },
                { id: 'c', icon: <MessageCircle className="w-5 h-5" /> },
                { id: 'u', icon: <User className="w-5 h-5" /> },
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
            exit={{ opacity: 0, x: -20 }}
            className="pb-40 bg-white min-h-screen"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <img src={selectedProduct.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white" />
              
              <button 
                onClick={() => setView('home')} 
                className="absolute top-12 left-6 w-11 h-11 bg-white/40 backdrop-blur-xl border border-white/40 rounded-2xl flex items-center justify-center text-white active:scale-95 transition-transform shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>

            <div className="px-8 -mt-24 relative z-10">
              <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.06)] border border-gray-50/50">
                <div className="flex items-center gap-3 mb-6">
                   <div className="text-[10px] font-bold text-brand-sage uppercase bg-brand-soft px-3 py-1 rounded-full tracking-wider">{selectedProduct.location}</div>
                   <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
                    <Star className="w-3 h-3 fill-brand-sage text-brand-sage" /> {selectedProduct.rating}
                  </div>
                </div>

                <h1 className="text-2xl font-display font-medium text-gray-900 leading-[1.3] mb-6">{selectedProduct.title}</h1>

                <div className="space-y-4 mb-12">
                  <h2 className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.25em]">Journey Notes</h2>
                  <p className="text-sm text-gray-400 leading-[1.8]">{selectedProduct.description}</p>
                </div>

                {/* Option Groups (Combination Selection) */}
                {selectedProduct.optionGroups && (
                  <div className="space-y-12 mb-12 py-10 border-y border-gray-50/50">
                    {selectedProduct.optionGroups.map(group => (
                      <div key={group.id} className="space-y-5">
                        <h3 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{group.title}</h3>
                        <div className="flex flex-col gap-3">
                          {group.options.map(opt => {
                            const isActive = selectedOptions[group.id] === opt.id;
                            return (
                              <button
                                key={opt.id}
                                onClick={() => handleOptionSelect(group.id, opt.id)}
                                className={`flex justify-between items-center p-6 rounded-[1.8rem] border-2 transition-all duration-300 ${
                                  isActive 
                                  ? 'bg-brand-soft border-brand-sage shadow-md shadow-brand-sage/5' 
                                  : 'bg-brand-stone border-transparent hover:border-gray-100'
                                }`}
                              >
                                <span className={`text-sm font-medium ${isActive ? 'text-brand-leaf' : 'text-gray-600'}`}>
                                  {opt.name}
                                </span>
                                {opt.priceDelta !== 0 && (
                                  <span className={`text-[10px] font-bold ${isActive ? 'text-brand-sage' : 'text-gray-400'}`}>
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

                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Quantity</span>
                  <div className="flex items-center gap-6 bg-brand-stone rounded-2xl p-2 px-3">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-xl flex items-center justify-center bg-white text-gray-400 shadow-sm transition-transform active:scale-95 border border-gray-50"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center bg-gray-900 text-white shadow-lg active:scale-95 transition-transform"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Floating Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-10 pt-4 bg-white/80 backdrop-blur-3xl border-t border-gray-50/50 flex items-center justify-between z-50">
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-300 uppercase font-bold tracking-widest mb-1">Total Fee</span>
                <div className="text-2xl font-display font-medium text-gray-900">
                  <span className="text-sm mr-1 opacity-40">¥</span>{currentTotalPrice}
                </div>
              </div>
              <button 
                onClick={() => setView('checkout')}
                className="bg-gray-900 text-white h-16 px-12 rounded-[1.8rem] font-bold flex items-center gap-3 shadow-[0_15px_40px_rgba(0,0,0,0.15)] active:scale-95 transition-all text-sm"
              >
                开始预订 <ArrowRight className="w-4 h-4 text-brand-sage" />
              </button>
            </div>
          </motion.div>
        )}

        {/* --- Checkout View --- */}
        {view === 'checkout' && selectedProduct && (
          <motion.div 
            key="checkout"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="p-10 pb-40"
          >
            <div className="flex items-center gap-6 mb-12">
              <button 
                onClick={() => setView('details')} 
                className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-50 shadow-sm active:scale-95 transition-transform"
              >
                <ChevronLeft className="w-5 h-5 text-gray-300" />
              </button>
              <h1 className="text-xl font-display font-medium">确认席位</h1>
            </div>

            <div className="bg-white rounded-[2.8rem] p-8 shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-gray-50 mb-10">
              <div className="flex gap-6 mb-8">
                <img src={selectedProduct.image} className="w-20 h-20 rounded-2xl object-cover" referrerPolicy="no-referrer" alt="" />
                <div className="flex-1 flex flex-col justify-center gap-1.5">
                  <h3 className="font-display font-medium text-sm leading-tight text-gray-900 line-clamp-2">{selectedProduct.title}</h3>
                  <div className="text-[10px] font-bold text-brand-sage uppercase bg-brand-soft px-2 py-0.5 rounded w-fit">QTY: {quantity}</div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-gray-50/50 flex flex-col gap-4">
                {selectedProduct.optionGroups?.map(group => (
                  <div key={group.id} className="flex justify-between items-center text-[10px] tracking-wide">
                    <span className="text-gray-300 uppercase font-bold">{group.title}</span>
                    <span className="font-bold text-gray-500">{group.options.find(o => o.id === selectedOptions[group.id])?.name}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-[10px] tracking-wide pt-2 border-t border-gray-50/50">
                  <span className="text-gray-900 uppercase font-extrabold tracking-[0.2em]">Total</span>
                  <span className="text-sm font-display font-bold text-brand-leaf">¥{currentTotalPrice}</span>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-5">
                <h2 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest pl-4">Reservation Info</h2>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="联络姓名" 
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-white border border-gray-50 rounded-[1.5rem] py-5 px-8 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-sage/20 transition-all placeholder:text-gray-200" 
                  />
                  <input 
                    type="tel" 
                    placeholder="联系电话" 
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full bg-white border border-gray-50 rounded-[1.5rem] py-5 px-8 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-brand-sage/20 transition-all placeholder:text-gray-200" 
                  />
                </div>
              </div>

              <div className="space-y-5">
                <h2 className="text-[10px] font-bold text-gray-300 uppercase tracking-widest pl-4">Payment Method</h2>
                <div className="bg-brand-soft rounded-[2rem] p-6 border border-brand-sage/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-leaf shadow-sm border border-white">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-800 mb-0.5">WeChat Pay / Digital</p>
                        <p className="text-[9px] text-gray-400 font-medium tracking-wide uppercase">Secure Channel</p>
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-brand-leaf flex items-center justify-center ring-8 ring-brand-sage/5">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <div className="fixed bottom-10 left-10 right-10">
              <button 
                onClick={() => setView('success')}
                className="w-full bg-gray-900 text-white rounded-[1.8rem] h-18 font-bold flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-all"
              >
                立即预订 ¥{currentTotalPrice} <ArrowRight className="w-4 h-4" />
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
            className="flex flex-col items-center justify-center min-h-screen p-10 text-center bg-white"
          >
            <div className="w-32 h-32 bg-brand-soft text-brand-leaf rounded-[3rem] flex items-center justify-center mb-10 shadow-inner relative">
              <CheckCircle2 className="w-12 h-12" />
              <div className="absolute -top-3 -right-3 bg-white rounded-full p-3 shadow-md border border-gray-50">
                <Sparkles className="w-5 h-5 text-brand-sage" />
              </div>
            </div>
            
            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.4em] mb-4">Confirmed</span>
            <h1 className="text-3xl font-display font-medium text-gray-900 mb-5 tracking-tight">预订成功</h1>
            <p className="text-gray-400 text-sm mb-12 leading-[2] max-w-xs mx-auto">
              订单席位已为您锁定。专属服务管家将在 15 分钟内与您联系，静候旅程开启。
            </p>
            
            <button 
              onClick={() => setView('home')}
              className="px-16 py-5 bg-gray-900 text-white rounded-2xl font-bold shadow-2xl active:scale-95 transition-all text-sm"
            >
              返回探索
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative background blurs to keep it "minimal yet deep" */}
      <div className="fixed -bottom-20 -left-20 w-[40rem] h-[40rem] bg-brand-sage/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed -top-20 -right-20 w-[30rem] h-[30rem] bg-brand-leaf/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
    </div>
  );
}

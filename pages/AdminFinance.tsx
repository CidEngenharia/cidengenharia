
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface Transaction {
  id: string;
  description: string;
  value: number;
  type: 'income' | 'expense';
  category: 'Business' | 'Pessoal';
  date: string;
}

export const AdminFinance: React.FC = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [desc, setDesc] = useState('');
  const [val, setVal] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [cat, setCat] = useState<'Business' | 'Pessoal'>('Business');

  const ADMIN_EMAIL = 'sidney.sales@gmail.com';

  useEffect(() => {
    const checkSessionAndFetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) {
        navigate('/admin');
        return;
      }
      setIsAdmin(true);
      await fetchTransactions();
    };
    checkSessionAndFetch();
  }, [navigate]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      console.error('Erro ao buscar finanças:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desc || !val) return;

    try {
      const { error } = await supabase.from('transactions').insert([{
        description: desc,
        value: parseFloat(val),
        type,
        category: cat
      }]);

      if (error) throw error;
      
      setDesc('');
      setVal('');
      await fetchTransactions();
    } catch (err: any) {
      alert("Erro ao salvar: " + err.message);
    }
  };

  const deleteTransaction = async (id: string) => {
    if (!confirm("Excluir lançamento?")) return;
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
      await fetchTransactions();
    } catch (err: any) {
      alert("Erro ao excluir: " + err.message);
    }
  };

  if (!isAdmin) return null;

  const getSum = (tType: 'income' | 'expense', period: 'month' | 'all') => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    
    return transactions.filter(t => {
      if (t.type !== tType) return false;
      if (period === 'month') return new Date(t.date).getTime() >= startOfMonth;
      return true;
    }).reduce((acc, t) => acc + t.value, 0);
  };

  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const totalIncome = getSum('income', 'all');
  const totalExpense = getSum('expense', 'all');
  const balance = totalIncome - totalExpense;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] p-6 md:p-12 engineering-grid transition-colors duration-500">
      <header className="max-w-7xl mx-auto mb-10 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-emerald-500 transition-all shadow-lg">
            <span className="material-icons-outlined">arrow_back</span>
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase dark:text-white font-display tracking-tighter text-left">
              Controle <span className="text-emerald-500 italic">Financeiro 360</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-left">Nuvem Sincronizada via Supabase</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 relative z-10">
        <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
           <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest mb-4 block">Entradas Totais</span>
           <h3 className="text-3xl font-black text-emerald-500">{formatCurrency(totalIncome)}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
           <span className="text-[10px] font-black uppercase text-red-500 tracking-widest mb-4 block">Saídas Totais</span>
           <h3 className="text-3xl font-black text-red-500">{formatCurrency(totalExpense)}</h3>
        </div>
        <div className="bg-slate-900 dark:bg-white p-8 rounded-[2.5rem] shadow-2xl overflow-hidden relative group flex flex-col justify-center">
           <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest block mb-1">Balanço Líquido</span>
           <h3 className={`text-4xl font-black ${balance >= 0 ? 'text-emerald-400 dark:text-emerald-600' : 'text-red-400'}`}>
            {formatCurrency(balance)}
           </h3>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        <div className="lg:col-span-4 space-y-6">
          <form onSubmit={addTransaction} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest text-primary-500 text-center">Registrar Transação</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setType('income')} className={`py-3 rounded-xl font-black uppercase text-[10px] tracking-widest border transition-all ${type === 'income' ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}>Receita</button>
                <button type="button" onClick={() => setType('expense')} className={`py-3 rounded-xl font-black uppercase text-[10px] tracking-widest border transition-all ${type === 'expense' ? 'bg-red-500 border-red-500 text-white' : 'border-slate-100 dark:border-slate-800 text-slate-400'}`}>Despesa</button>
              </div>
              <input type="text" required value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descrição" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none dark:text-white" />
              <input type="number" step="0.01" required value={val} onChange={e => setVal(e.target.value)} placeholder="Valor R$" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none dark:text-white font-black" />
              <select value={cat} onChange={e => setCat(e.target.value as any)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none dark:text-white font-bold">
                <option value="Business">Business</option>
                <option value="Pessoal">Pessoal</option>
              </select>
            </div>
            <button type="submit" className="w-full py-5 bg-primary-500 hover:bg-primary-600 text-white font-black rounded-2xl shadow-xl transition-all">Salvar no Supabase</button>
          </form>
        </div>

        <div className="lg:col-span-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 shadow-2xl min-h-[500px]">
             {isLoading ? (
               <div className="flex items-center justify-center h-64"><span className="animate-spin material-icons-outlined text-4xl text-emerald-500">sync</span></div>
             ) : (
               <div className="space-y-3">
                 {transactions.length === 0 ? (
                   <p className="text-center py-20 text-slate-400 font-bold uppercase text-[10px] tracking-widest">Nenhum registro encontrado</p>
                 ) : (
                   transactions.map(t => (
                     <div key={t.id} className="bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 p-5 rounded-[2rem] flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.type === 'income' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                              <span className="material-icons-outlined text-sm">{t.type === 'income' ? 'add' : 'remove'}</span>
                           </div>
                           <div>
                              <h5 className="text-sm font-bold dark:text-white uppercase">{t.description}</h5>
                              <span className="text-[8px] font-black px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 uppercase">{t.category}</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                           <span className={`font-black ${t.type === 'income' ? 'text-emerald-500' : 'text-red-500'}`}>{formatCurrency(t.value)}</span>
                           <button onClick={() => deleteTransaction(t.id)} className="text-slate-400 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"><span className="material-icons-outlined">delete</span></button>
                        </div>
                     </div>
                   ))
                 )}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

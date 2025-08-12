import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaDollarSign, FaPlus, FaEdit, FaTrash, FaChartPie, FaCalendarAlt, FaArrowUp, FaArrowDown, FaArrowLeft } from 'react-icons/fa';

const BudgetManager = () => {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [budget, setBudget] = useState({ total: 0, categories: [] });
  const [expenses, setExpenses] = useState([]);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', category: '', date: '', notes: '' });

  const categories = [
    { name: 'Accommodation', color: '#3B82F6', icon: '🏨' },
    { name: 'Transportation', color: '#10B981', icon: '🚗' },
    { name: 'Food & Dining', color: '#F59E0B', icon: '🍽️' },
    { name: 'Activities', color: '#8B5CF6', icon: '🎯' },
    { name: 'Shopping', color: '#EF4444', icon: '🛍️' },
    { name: 'Miscellaneous', color: '#6B7280', icon: '📝' }
  ];

  useEffect(() => {
    // Load budget and expenses from localStorage
    const savedBudget = localStorage.getItem(`budget_${tripId}`);
    const savedExpenses = localStorage.getItem(`expenses_${tripId}`);
    
    if (savedBudget) {
      setBudget(JSON.parse(savedBudget));
    } else {
      // Initialize with sample budget
      const initialBudget = {
        total: 50000,
        categories: [
          { name: 'Accommodation', allocated: 20000, spent: 15000 },
          { name: 'Transportation', allocated: 10000, spent: 8500 },
          { name: 'Food & Dining', allocated: 8000, spent: 6200 },
          { name: 'Activities', allocated: 7000, spent: 4500 },
          { name: 'Shopping', allocated: 3000, spent: 1200 },
          { name: 'Miscellaneous', allocated: 2000, spent: 800 }
        ]
      };
      setBudget(initialBudget);
      localStorage.setItem(`budget_${tripId}`, JSON.stringify(initialBudget));
    }

    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    } else {
      // Initialize with sample expenses
      const initialExpenses = [
        { id: 1, name: 'Hotel Booking', amount: 15000, category: 'Accommodation', date: '2024-06-01', notes: 'Deluxe room for 3 nights' },
        { id: 2, name: 'Flight Tickets', amount: 8500, category: 'Transportation', date: '2024-05-15', notes: 'Round trip Delhi-Goa' },
        { id: 3, name: 'Restaurant Dinner', amount: 2500, category: 'Food & Dining', date: '2024-06-01', notes: 'Welcome dinner at beach resort' },
        { id: 4, name: 'Scuba Diving', amount: 4500, category: 'Activities', date: '2024-06-02', notes: 'Full day diving experience' },
        { id: 5, name: 'Local Souvenirs', amount: 1200, category: 'Shopping', date: '2024-06-03', notes: 'Handicrafts and spices' }
      ];
      setExpenses(initialExpenses);
      localStorage.setItem(`expenses_${tripId}`, JSON.stringify(initialExpenses));
    }

    // Sample trip data
    setTrip({
      id: tripId,
      name: 'Golden Triangle Tour',
      startDate: '2024-06-01',
      endDate: '2024-06-15',
      destination: 'Delhi, Agra, Jaipur'
    });
  }, [tripId]);

  const addExpense = () => {
    if (!newExpense.name || !newExpense.amount || !newExpense.category) return;
    
    const expense = {
      id: Date.now(),
      ...newExpense,
      amount: parseFloat(newExpense.amount)
    };
    
    const updatedExpenses = [...expenses, expense];
    setExpenses(updatedExpenses);
    localStorage.setItem(`expenses_${tripId}`, JSON.stringify(updatedExpenses));
    
    // Update budget spent amount
    const updatedBudget = {
      ...budget,
      categories: budget.categories.map(cat => 
        cat.name === expense.category 
          ? { ...cat, spent: cat.spent + expense.amount }
          : cat
      )
    };
    setBudget(updatedBudget);
    localStorage.setItem(`budget_${tripId}`, JSON.stringify(updatedBudget));
    
    setNewExpense({ name: '', amount: '', category: '', date: '', notes: '' });
    setShowAddExpense(false);
  };

  const deleteExpense = (expenseId) => {
    const expense = expenses.find(exp => exp.id === expenseId);
    const updatedExpenses = expenses.filter(exp => exp.id !== expenseId);
    setExpenses(updatedExpenses);
    localStorage.setItem(`expenses_${tripId}`, JSON.stringify(updatedExpenses));
    
    // Update budget spent amount
    const updatedBudget = {
      ...budget,
      categories: budget.categories.map(cat => 
        cat.name === expense.category 
          ? { ...cat, spent: Math.max(0, cat.spent - expense.amount) }
          : cat
      )
    };
    setBudget(updatedBudget);
    localStorage.setItem(`budget_${tripId}`, JSON.stringify(updatedBudget));
  };

  const getTotalSpent = () => {
    return budget.categories.reduce((total, cat) => total + cat.spent, 0);
  };

  const getTotalAllocated = () => {
    return budget.categories.reduce((total, cat) => total + cat.allocated, 0);
  };

  const getRemainingBudget = () => {
    return budget.total - getTotalSpent();
  };

  const getCategoryColor = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.color : '#6B7280';
  };

  const getCategoryIcon = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category ? category.icon : '📝';
  };

  if (!trip) return <div>Loading...</div>;

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1)), url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1920&h=1080&fit=crop&crop=center')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FaArrowLeft /> Back
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{trip.name} - Budget Manager</h1>
                <p className="text-gray-600 mt-1">{trip.destination}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to={`/itinerary/${tripId}`}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaCalendarAlt /> View Itinerary
              </Link>
              <div className="text-right">
                <p className="text-sm text-gray-600">Remaining Budget</p>
                <p className={`text-xl font-bold ${getRemainingBudget() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{getRemainingBudget().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FaDollarSign className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Total Budget</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">₹{budget.total.toLocaleString()}</p>
          </div>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <FaArrowUp className="text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Total Spent</h3>
            </div>
            <p className="text-2xl font-bold text-red-600">₹{getTotalSpent().toLocaleString()}</p>
          </div>
          
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <FaArrowDown className="text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Remaining</h3>
            </div>
            <p className={`text-2xl font-bold ${getRemainingBudget() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{getRemainingBudget().toLocaleString()}
            </p>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <FaChartPie /> Budget Breakdown by Category
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {budget.categories.map((category) => {
                const percentage = category.allocated > 0 ? (category.spent / category.allocated) * 100 : 0;
                const isOverBudget = category.spent > category.allocated;
                
                return (
                  <div key={category.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getCategoryIcon(category.name)}</span>
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{category.spent.toLocaleString()} / ₹{category.allocated.toLocaleString()}
                        </p>
                        <p className={`text-sm ${isOverBudget ? 'text-red-600' : 'text-gray-600'}`}>
                          {percentage.toFixed(1)}% used
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          isOverBudget ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ 
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: getCategoryColor(category.name)
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Expenses</h2>
              <button
                onClick={() => setShowAddExpense(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaPlus /> Add Expense
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {expenses.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FaDollarSign className="text-4xl mb-4 mx-auto" />
                <p>No expenses recorded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: getCategoryColor(expense.category) }}
                    >
                      {getCategoryIcon(expense.category)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{expense.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span>{expense.category}</span>
                        <span>{new Date(expense.date).toLocaleDateString()}</span>
                      </div>
                      {expense.notes && (
                        <p className="text-sm text-gray-500 mt-1">{expense.notes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">₹{expense.amount.toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => deleteExpense(expense.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Expense Form */}
            {showAddExpense && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h3 className="font-semibold text-gray-900 mb-4">Add New Expense</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Expense name"
                    value={newExpense.name}
                    onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Amount (₹)"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Notes (optional)"
                    value={newExpense.notes}
                    onChange={(e) => setNewExpense({...newExpense, notes: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 md:col-span-2"
                  />
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={addExpense}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Expense
                  </button>
                  <button
                    onClick={() => setShowAddExpense(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetManager;
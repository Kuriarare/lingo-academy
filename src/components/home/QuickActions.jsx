const QuickActions = () => {
  const actions = [
    { icon: "📊", title: "View Analytics", description: "Access detailed platform analytics and reports" },
    { icon: "👥", title: "Manage Users", description: "Add, edit or remove users and teachers" },
    { icon: "⚙️", title: "Platform Settings", description: "Configure platform settings and preferences" }
  ];

  return (
    <section className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-lg border border-purple-100 dark:border-gray-700">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((action, index) => (
          <button 
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition-shadow duration-300 text-left group"
          >
            <div className="text-3xl text-purple-600 dark:text-brand-purple mb-3">{action.icon}</div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">{action.title}</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{action.description}</p>
          </button>
        ))}
      </div>
    </section>
  );
};

export default QuickActions;
const CustomToolbar = ({ label, onNavigate, onView }) => {
    return (
      <div className="rbc-toolbar flex justify-evenly">
        {/* Left Side: Branding + Navigation */}
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold">Classes Schedule</span>
          <button onClick={() => onNavigate('TODAY')} className="today-btn">
            Today
          </button>
          <button onClick={() => onNavigate('PREV')} className="nav-btn">
            ←
          </button>
          <button onClick={() => onNavigate('NEXT')} className="nav-btn">
            →
          </button>
        </div>
  
        {/* Center: Current Date Range */}
        <span className="text-lg font-semibold">{label}</span>
  
        {/* Right Side: View Selector + Language Filter */}
        <div className="flex items-center gap-3">
        
          
          <div className="view-toggle">
            <button onClick={() => onView('week')}>Week</button>
            <button onClick={() => onView('day')}>Day</button>
            <button onClick={() => onView('agenda')}>Agenda</button>
          </div>
        </div>
      </div>
    )
  }

  export default CustomToolbar;
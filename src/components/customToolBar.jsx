const CustomToolbar = ({ label, onNavigate, onView }) => {
    return (
      <div className="rbc-toolbar flex flex-col sm:flex-row justify-between items-center p-4 gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <span className="text-xl text-center sm:text-left">Classes Schedule</span>
          <div className="flex gap-2">
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
        </div>
  
        <span className="text-lg text-center">{label}</span>
  
        <div className="view-toggle flex gap-2">
          <button onClick={() => onView('week')}>Week</button>
          <button onClick={() => onView('day')}>Day</button>
          <button onClick={() => onView('agenda')}>Agenda</button>
        </div>
      </div>
    )
  }

  export default CustomToolbar;
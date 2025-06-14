import React, { useState, useEffect, useRef } from 'react';

// Componente principal
function App() {
  // --- Estados del Temporizador Pomodoro ---
  const [pomodoroWorkTime, setPomodoroWorkTime] = useState(25); // Minutos de trabajo
  const [pomodoroBreakTime, setPomodoroBreakTime] = useState(5); // Minutos de descanso
  const [timerMinutes, setTimerMinutes] = useState(pomodoroWorkTime); // Minutos actuales
  const [timerSeconds, setTimerSeconds] = useState(0); // Segundos actuales
  const [isTimerRunning, setIsTimerRunning] = useState(false); // Temporizador activo
  const [isWorkPhase, setIsWorkPhase] = useState(true); // Fase actual (trabajo/descanso)
  const timerIntervalRef = useRef(null); // Referencia del intervalo

  // --- Estados del Control de Pantalla ---
  const [screenTimeLimit, setScreenTimeLimit] = useState(180); // Límite diario (min)
  const [currentScreenTime, setCurrentScreenTime] = useState(0); // Tiempo actual (min)
  const [elapsedScreenTimeSeconds, setElapsedScreenTimeSeconds] = useState(0); // Cronómetro (seg)
  const [isScreenTimeTrackingRunning, setIsScreenTimeTrackingRunning] = useState(false); // Seguimiento activo
  const screenTimeIntervalRef = useRef(null); // Referencia del intervalo
  const screenBreakRecommendationInterval = 60; // Intervalo de descanso (min)

  // --- Estados de Hidratación ---
  const [hydrationInterval, setHydrationInterval] = useState(60); // Intervalo de recordatorio (min)
  const [isHydrationReminderActive, setIsHydrationReminderActive] = useState(false); // Recordatorios activos
  const hydrationIntervalRef = useRef(null); // Referencia del intervalo
  const [nextReminderTime, setNextReminderTime] = useState(null); // Próximo recordatorio

  // --- Estados del Contador de Agua ---
  const [waterGlassesConsumed, setWaterGlassesConsumed] = useState(0); // Vasos consumidos
  const [waterTargetGlasses, setWaterTargetGlasses] = useState(8); // Meta diaria

  // --- Estado de mensajes en la UI ---
  const [message, setMessage] = useState('');

  // Mostrar mensajes temporales
  const showMessage = (msg, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), duration);
  };

  // --- Lógica del Temporizador Pomodoro ---
  useEffect(() => {
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        if (timerSeconds === 0) {
          if (timerMinutes === 0) {
            clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
            setIsWorkPhase(!isWorkPhase);
            setTimerMinutes(isWorkPhase ? pomodoroBreakTime : pomodoroWorkTime);
            setTimerSeconds(0);
            showMessage(isWorkPhase ? '¡Hora de un descanso! ☕' : '¡Hora de trabajar! 📚', 5000);
          } else {
            setTimerMinutes((prev) => prev - 1);
            setTimerSeconds(59);
          }
        } else {
          setTimerSeconds((prev) => prev - 1);
        }
      }, 1000);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isTimerRunning, timerMinutes, timerSeconds, isWorkPhase, pomodoroWorkTime, pomodoroBreakTime]);

  const togglePomodoro = () => setIsTimerRunning(!isTimerRunning);
  const resetPomodoro = () => {
    clearInterval(timerIntervalRef.current);
    setIsTimerRunning(false);
    setIsWorkPhase(true);
    setTimerMinutes(pomodoroWorkTime);
    setTimerSeconds(0);
    showMessage('Pomodoro reiniciado.');
  };

  // --- Lógica del Control de Pantalla ---
  useEffect(() => {
    if (isScreenTimeTrackingRunning) {
      screenTimeIntervalRef.current = setInterval(() => {
        setElapsedScreenTimeSeconds((prev) => {
          const newSeconds = prev + 1;
          const newMinutes = Math.floor(newSeconds / 60);
          setCurrentScreenTime(newMinutes);
          if (newMinutes > 0 && newMinutes % screenBreakRecommendationInterval === 0 && newSeconds % 60 === 0) {
            showMessage(`¡${newMinutes} minutos en pantalla! Descansa. 😌`, 7000);
          }
          return newSeconds;
        });
      }, 1000);
    } else {
      clearInterval(screenTimeIntervalRef.current);
    }
    return () => clearInterval(screenTimeIntervalRef.current);
  }, [isScreenTimeTrackingRunning, screenBreakRecommendationInterval]);

  const startScreenTimeTracking = () => {
    setIsScreenTimeTrackingRunning(true);
    showMessage('Seguimiento iniciado.');
  };

  const pauseScreenTimeTracking = () => {
    setIsScreenTimeTrackingRunning(false);
    showMessage('Seguimiento pausado.');
  };

  // --- Lógica de Hidratación ---
  useEffect(() => {
    if (hydrationIntervalRef.current) {
      clearInterval(hydrationIntervalRef.current);
      hydrationIntervalRef.current = null;
      setNextReminderTime(null);
    }
    if (isHydrationReminderActive && hydrationInterval > 0) {
      const firstReminder = new Date(Date.now() + hydrationInterval * 60 * 1000);
      setNextReminderTime(firstReminder);
      showMessage(`Recordatorios cada ${hydrationInterval} min.`, 5000);
      hydrationIntervalRef.current = setInterval(() => {
        showMessage('¡Bebe agua! 💧', 5000);
        setNextReminderTime(new Date(Date.now() + hydrationInterval * 60 * 1000));
      }, hydrationInterval * 60 * 1000);
    } else if (!isHydrationReminderActive) {
      showMessage('Recordatorios desactivados.', 3000);
    }
    return () => {
      if (hydrationIntervalRef.current) {
        clearInterval(hydrationIntervalRef.current);
      }
    };
  }, [isHydrationReminderActive, hydrationInterval]);

  const formatTime = (minutes, seconds) => `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const formatNextReminderTime = (date) => (date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A');
  const formatElapsedTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4 font-inter text-gray-100 flex flex-col items-center justify-center">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Mensaje de notificación */}
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-5 py-2 rounded-full shadow-lg animate-fade-in-down z-50 text-sm">
          {message}
        </div>
      )}

      <h1 className="text-4xl md:text-5xl font-light text-blue-300 mb-8 text-center tracking-wider">
        Bienestar Digital Estudiantil
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-6xl">

        {/* Tarjeta de Control de Horario de Pantalla */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col items-center transition-colors duration-200">
          <h2 className="text-2xl font-medium text-blue-300 mb-4">⏰ Horario de Pantalla</h2>
          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor="screenLimit" className="text-gray-300 text-base">Límite Diario (min):</label>
            <input
              id="screenLimit"
              type="number"
              min="0"
              value={screenTimeLimit}
              onChange={(e) => setScreenTimeLimit(Number(e.target.value))}
              className="w-24 p-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md text-center focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
          <p className="text-lg mb-3 text-gray-200">
            Uso Actual: <span className={`font-semibold ${currentScreenTime > screenTimeLimit ? 'text-red-400' : 'text-green-400'}`}>
              {currentScreenTime} min
            </span> / {screenTimeLimit} min
          </p>
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div
              className={`h-2 rounded-full ${currentScreenTime > screenTimeLimit ? 'bg-red-500' : 'bg-green-500'}`}
              style={{ width: `${Math.min(100, (currentScreenTime / screenTimeLimit) * 100)}%` }}
            ></div>
          </div>
          <div className="flex space-x-2 mt-2">
            <button
              onClick={startScreenTimeTracking}
              disabled={isScreenTimeTrackingRunning}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Iniciar
            </button>
            <button
              onClick={pauseScreenTimeTracking}
              disabled={!isScreenTimeTrackingRunning}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Pausar
            </button>
            <button
              onClick={() => {
                setCurrentScreenTime(0);
                setElapsedScreenTimeSeconds(0); // Reiniciar también el cronómetro
                setIsScreenTimeTrackingRunning(false);
                showMessage('Tiempo de pantalla reiniciado.');
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm"
            >
              Reiniciar
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            (El "Uso Actual" se actualiza cada minuto. El cronómetro muestra segundos exactos.)
          </p>
          {/* Cronómetro de Sesión */}
          <div className="mt-5 pt-4 border-t border-gray-700 w-full text-center">
            <h3 className="text-base font-medium text-blue-300 mb-2">Tiempo de Sesión</h3>
            <p className="text-3xl font-light text-blue-400 tracking-wide">{formatElapsedTime(elapsedScreenTimeSeconds)}</p>
          </div>
        </div>

        {/* Tarjeta de Temporizador Pomodoro */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col items-center transition-colors duration-200">
          <h2 className="text-2xl font-medium text-purple-300 mb-4">🍅 Temporizador Pomodoro</h2>
          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor="workTime" className="text-gray-300 text-base">Trabajo (min):</label>
            <input
              id="workTime"
              type="number"
              min="1"
              value={pomodoroWorkTime}
              onChange={(e) => {
                setPomodoroWorkTime(Number(e.target.value));
                if (isWorkPhase && !isTimerRunning) setTimerMinutes(Number(e.target.value));
              }}
              className="w-20 p-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md text-center focus:ring-purple-500 focus:border-purple-500 text-sm"
            />
            <label htmlFor="breakTime" className="text-gray-300 text-base">Pausa (min):</label>
            <input
              id="breakTime"
              type="number"
              min="1"
              value={pomodoroBreakTime}
              onChange={(e) => {
                setPomodoroBreakTime(Number(e.target.value));
                if (!isWorkPhase && !isTimerRunning) setTimerMinutes(Number(e.target.value));
              }}
              className="w-20 p-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md text-center focus:ring-purple-500 focus:border-purple-500 text-sm"
            />
          </div>
          <p className="text-5xl font-light text-purple-400 mb-4 tracking-wide">
            {formatTime(timerMinutes, timerSeconds)}
          </p>
          <p className="text-base mb-4 text-gray-200">
            Fase Actual: <span className="font-medium text-purple-300">{isWorkPhase ? 'Trabajo' : 'Descanso'}</span>
          </p>
          <div className="flex space-x-2">
            <button
              onClick={togglePomodoro}
              className={`px-5 py-2 rounded-md transition-colors duration-200 ${
                isTimerRunning ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
              } text-white text-sm`}
            >
              {isTimerRunning ? 'Pausar' : 'Iniciar'}
            </button>
            <button
              onClick={resetPomodoro}
              className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-md transition-colors duration-200 text-sm"
            >
              Reiniciar
            </button>
          </div>
        </div>

        {/* Tarjeta de Recordatorios de Hidratación y Contador de Agua */}
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col items-center transition-colors duration-200">
          <h2 className="text-2xl font-medium text-green-300 mb-4">💧 Hidratación y Agua</h2>
          
          {/* Recordatorios de Hidratación */}
          <div className="w-full text-center mb-6 pb-4 border-b border-gray-700">
            <h3 className="text-xl font-medium text-green-300 mb-3">Recordatorios de Hidratación</h3>
            <div className="flex items-center space-x-2 justify-center mb-4">
              <label htmlFor="hydrationInterval" className="text-gray-300 text-base">Intervalo (min):</label>
              <input
                id="hydrationInterval"
                type="number"
                min="1"
                value={hydrationInterval}
                onChange={(e) => setHydrationInterval(Number(e.target.value))}
                className="w-24 p-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md text-center focus:ring-green-500 focus:border-green-500 text-sm"
              />
            </div>
            <div className="flex items-center space-x-3 justify-center mb-4">
              <span className="text-gray-300 text-base">Activar Recordatorios:</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isHydrationReminderActive}
                  onChange={() => setIsHydrationReminderActive(!isHydrationReminderActive)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            <p className="text-base mb-2 text-gray-200">
              Próximo Recordatorio: <span className="font-medium text-green-400">{formatNextReminderTime(nextReminderTime)}</span>
            </p>
            <p className="text-xs text-gray-500 text-center">
              (Los recordatorios aparecerán como mensajes en la parte superior.)
            </p>
          </div>

          {/* Contador de Vasos de Agua */}
          <div className="w-full text-center pt-4">
            <h3 className="text-xl font-medium text-blue-300 mb-3">Vasos de Agua Consumidos</h3>
            <div className="flex items-center space-x-2 justify-center mb-4">
                <label htmlFor="waterTarget" className="text-gray-300 text-base">Meta Diaria:</label>
                <input
                    id="waterTarget"
                    type="number"
                    min="1"
                    value={waterTargetGlasses}
                    onChange={(e) => setWaterTargetGlasses(Number(e.target.value))}
                    className="w-20 p-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md text-center focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
            </div>
            <p className="text-4xl font-light text-blue-400 mb-4">
              {waterGlassesConsumed} / {waterTargetGlasses} vasos
            </p>
            <div className="flex space-x-2 justify-center">
              <button
                onClick={() => {
                  setWaterGlassesConsumed(prev => prev + 1);
                  showMessage('¡Un vaso de agua más! Hidratación es clave. 💧');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm"
              >
                Añadir Vaso
              </button>
              <button
                onClick={() => {
                  setWaterGlassesConsumed(0);
                  showMessage('Contador de vasos de agua reiniciado.');
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors duration-200 text-sm"
              >
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

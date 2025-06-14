import React, { useState, useEffect, useRef } from 'react';

// Componente principal de la aplicación
function App() {
  // --- Estados para el Temporizador Pomodoro ---
  const [pomodoroWorkTime, setPomodoroWorkTime] = useState(25); // Duración de la sesión de trabajo en minutos
  const [pomodoroBreakTime, setPomodoroBreakTime] = useState(5);  // Duración de la pausa en minutos
  const [timerMinutes, setTimerMinutes] = useState(pomodoroWorkTime); // Minutos actuales del temporizador
  const [timerSeconds, setTimerSeconds] = useState(0);             // Segundos actuales del temporizador
  const [isTimerRunning, setIsTimerRunning] = useState(false);     // Indica si el temporizador está corriendo
  const [isWorkPhase, setIsWorkPhase] = useState(true);            // Indica si es fase de trabajo o de descanso
  const timerIntervalRef = useRef(null);                           // Referencia para el intervalo del temporizador

  // --- Estados para el Control de Horario de Pantalla (Simulado) ---
  const [screenTimeLimit, setScreenTimeLimit] = useState(180); // Límite de tiempo de pantalla en minutos
  const [currentScreenTime, setCurrentScreenTime] = useState(0); // Tiempo de pantalla actual en minutos (simulado)
  const [elapsedScreenTimeSeconds, setElapsedScreenTimeSeconds] = useState(0); // Cronómetro de sesión en segundos
  const [isScreenTimeTrackingRunning, setIsScreenTimeTrackingRunning] = useState(false); // Indica si el seguimiento está activo
  const screenTimeIntervalRef = useRef(null); // Referencia para el intervalo de tiempo de pantalla
  const screenBreakRecommendationInterval = 60; // Recomendar descanso cada 60 minutos

  // --- Estados para Recordatorios de Hidratación ---
  const [hydrationInterval, setHydrationInterval] = useState(60); // Intervalo de recordatorio en minutos
  const [isHydrationReminderActive, setIsHydrationReminderActive] = useState(false); // Indica si los recordatorios están activos
  const hydrationIntervalRef = useRef(null); // Referencia para el intervalo de hidratación
  const [nextReminderTime, setNextReminderTime] = useState(null); // Hora del próximo recordatorio

  // --- Estados para el Contador de Vasos de Agua ---
  const [waterGlassesConsumed, setWaterGlassesConsumed] = useState(0); // Vasos de agua consumidos
  const [waterTargetGlasses, setWaterTargetGlasses] = useState(8);    // Meta de vasos de agua al día

  // --- Estado para mensajes de notificación en la UI ---
  const [message, setMessage] = useState('');

  // Función para mostrar mensajes temporales en la UI
  const showMessage = (msg, duration = 3000) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), duration);
  };

  // --- Lógica del Temporizador Pomodoro ---
  useEffect(() => {
    // Si el temporizador está corriendo
    if (isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        // Si los segundos llegan a 0
        if (timerSeconds === 0) {
          // Si los minutos llegan a 0, la fase actual ha terminado
          if (timerMinutes === 0) {
            clearInterval(timerIntervalRef.current); // Detener el temporizador
            setIsTimerRunning(false); // Marcar como no corriendo

            // Cambiar de fase (trabajo a descanso o viceversa)
            if (isWorkPhase) {
              showMessage('¡Hora de un descanso! ☕', 5000);
              setTimerMinutes(pomodoroBreakTime); // Establecer tiempo de descanso
            } else {
              showMessage('¡Hora de volver al trabajo! 📚', 5000);
              setTimerMinutes(pomodoroWorkTime); // Establecer tiempo de trabajo
            }
            setIsWorkPhase(!isWorkPhase); // Invertir la fase
            setTimerSeconds(0); // Reiniciar segundos
            // Opcional: Iniciar automáticamente la siguiente fase
            // setIsTimerRunning(true);
          } else {
            // Si los minutos no son 0, decrementar minutos y reiniciar segundos
            setTimerMinutes((prevMinutes) => prevMinutes - 1);
            setTimerSeconds(59);
          }
        } else {
          // Si los segundos no son 0, simplemente decrementar segundos
          setTimerSeconds((prevSeconds) => prevSeconds - 1);
        }
      }, 1000); // Cada segundo
    }

    // Función de limpieza para detener el intervalo cuando el componente se desmonta o el temporizador se detiene
    return () => clearInterval(timerIntervalRef.current);
  }, [isTimerRunning, timerMinutes, timerSeconds, isWorkPhase, pomodoroWorkTime, pomodoroBreakTime]);

  // Función para iniciar/pausar el temporizador Pomodoro
  const togglePomodoro = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  // Función para reiniciar el temporizador Pomodoro
  const resetPomodoro = () => {
    clearInterval(timerIntervalRef.current);
    setIsTimerRunning(false);
    setIsWorkPhase(true);
    setTimerMinutes(pomodoroWorkTime);
    setTimerSeconds(0);
    showMessage('Temporizador Pomodoro reiniciado.');
  };

  // --- Lógica del Control de Horario de Pantalla y Cronómetro ---
  useEffect(() => {
    if (isScreenTimeTrackingRunning) {
      screenTimeIntervalRef.current = setInterval(() => {
        setElapsedScreenTimeSeconds(prevSeconds => {
          const newSeconds = prevSeconds + 1;
          const newMinutes = Math.floor(newSeconds / 60); // Calcular minutos para el uso actual
          setCurrentScreenTime(newMinutes); // Actualizar el tiempo de pantalla en minutos

          // Avisar cada 'screenBreakRecommendationInterval' minutos para un descanso
          if (newMinutes > 0 && newMinutes % screenBreakRecommendationInterval === 0 && (newSeconds % 60 === 0)) {
            showMessage(`¡Has estado ${newMinutes} minutos en pantalla! Considera un descanso de 5-10 minutos. 😌`, 7000);
          }
          return newSeconds;
        });
      }, 1000); // Actualiza cada segundo
    } else {
      clearInterval(screenTimeIntervalRef.current);
    }

    return () => clearInterval(screenTimeIntervalRef.current);
  }, [isScreenTimeTrackingRunning, screenBreakRecommendationInterval]);

  // Funciones para iniciar/pausar el seguimiento de tiempo de pantalla
  const startScreenTimeTracking = () => {
    setIsScreenTimeTrackingRunning(true);
    showMessage('Seguimiento de tiempo de pantalla iniciado.');
  };

  const pauseScreenTimeTracking = () => {
    setIsScreenTimeTrackingRunning(false);
    showMessage('Seguimiento de tiempo de pantalla pausado.');
  };

  // --- Lógica de Recordatorios de Hidratación ---
  useEffect(() => {
    // Limpiar cualquier intervalo existente al cambiar el estado o el intervalo
    if (hydrationIntervalRef.current) {
      clearInterval(hydrationIntervalRef.current);
      hydrationIntervalRef.current = null;
      setNextReminderTime(null);
    }

    if (isHydrationReminderActive && hydrationInterval > 0) {
      // Establecer el primer recordatorio
      const firstReminder = new Date(Date.now() + hydrationInterval * 60 * 1000);
      setNextReminderTime(firstReminder);
      showMessage(`Recordatorios de hidratación activados cada ${hydrationInterval} minutos.`, 5000);

      // Iniciar el intervalo para recordatorios subsecuentes
      hydrationIntervalRef.current = setInterval(() => {
        showMessage('¡Es hora de beber agua! 💧', 5000);
        const next = new Date(Date.now() + hydrationInterval * 60 * 1000);
        setNextReminderTime(next);
      }, hydrationInterval * 60 * 1000);
    } else if (!isHydrationReminderActive) {
      showMessage('Recordatorios de hidratación desactivados.', 3000);
    }

    // Función de limpieza
    return () => {
      if (hydrationIntervalRef.current) {
        clearInterval(hydrationIntervalRef.current);
      }
    };
  }, [isHydrationReminderActive, hydrationInterval]);

  // Formatear el tiempo para mostrarlo (ej. 05:03)
  const formatTime = (minutes, seconds) => {
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  // Formatear la hora del próximo recordatorio
  const formatNextReminderTime = (date) => {
    if (!date) return 'N/A';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Formatear el tiempo transcurrido del cronómetro (HH:MM:SS)
  const formatElapsedTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
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

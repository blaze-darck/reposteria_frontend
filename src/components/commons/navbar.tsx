import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { HiOutlineUser } from "react-icons/hi";
import { FaBarsStaggered } from "react-icons/fa6";
import { MessageCircle, X, Sparkles, Zap } from "lucide-react";
import { navbarLinks } from "../../constants/links";
import { Logo } from "./Logo";

const QUICK_QUESTIONS = [
  { id: 1, emoji: "🌱", text: "¿Qué opciones vegetarianas tienen?" },
  { id: 2, emoji: "💰", text: "¿Cuál es el platillo más económico?" },
  { id: 3, emoji: "⭐", text: "¿Cuál es su especialidad de la casa?" },
  { id: 4, emoji: "🔥", text: "¿Qué platillos picantes recomiendan?" },
  { id: 5, emoji: "⏱️", text: "Necesito algo rápido, ¿qué me sugieren?" },
  { id: 6, emoji: "🍗", text: "¿Tienen platillos con pollo?" },
  { id: 7, emoji: "🥗", text: "Quiero algo ligero y saludable" },
  { id: 8, emoji: "👨‍👩‍👧", text: "¿Qué recomiendan para niños?" },
  { id: 9, emoji: "🍝", text: "¿Tienen pasta?" },
  { id: 10, emoji: "📋", text: "Mostrar todo el menú" },
];

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (location.pathname.startsWith("/administrator")) {
    return null;
  }

  const [usuario, setUsuario] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showAssistant, setShowAssistant] = useState(false);
  const [messages, setMessages] = useState<
    Array<{ role: string; content: string }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const usuarioActual = localStorage.getItem("usuarioActual");
    if (usuarioActual) {
      setUsuario(JSON.parse(usuarioActual));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY + 2 && currentScrollY > 2) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY - 2) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    localStorage.removeItem("usuarioActual");
    setUsuario(null);
    navigate("/login");
  };

  const processMessage = async (messageText: string) => {
    setMessages((prev) => [...prev, { role: "user", content: messageText }]);
    setIsLoading(true);
    setShowQuickQuestions(false);

    try {
      const response = await fetch(
        "http://localhost:3000/api/asistente/recomendar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pregunta: messageText }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener recomendaciones");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.respuesta },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Lo siento, hubo un error al procesar tu solicitud. Por favor intenta de nuevo\n\nVerifica que el servidor esté funcionando correctamente.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = async (question: string) => {
    await processMessage(question);
  };

  const openAssistant = () => {
    setShowAssistant(true);
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "¡Hola! Soy tu asistente personal de recomendaciones.\n\nSelecciona una de las opciones rápidas abajo para ver nuestras recomendaciones. ¿En qué puedo ayudarte hoy?",
        },
      ]);
      setShowQuickQuestions(true);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "¡Hola! Soy tu asistente personal de recomendaciones.\n\nSelecciona una de las opciones rápidas abajo para ver nuestras recomendaciones. ¿En qué puedo ayudarte hoy?",
      },
    ]);
    setShowQuickQuestions(true);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg_fondo text-black py-4 flex items-center justify-between px-5 border-b border-slate-200 lg:px-12 transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Logo />

        <nav className="space-x-5 hidden md:flex">
          {navbarLinks.map((link) => (
            <NavLink
              key={link.id}
              to={link.href}
              className={({ isActive }) =>
                `${
                  isActive ? "texto_letras underline" : ""
                } transition-all duration-300 font-medium hover:texto_letrasA hover:underline`
              }
            >
              {link.title}
            </NavLink>
          ))}
        </nav>

        <div className="flex gap-5 items-center">
          {/* <button
            onClick={openAssistant}
            className="relative bg-gradient-to-r from-[#9e4e2f] to-[#c86342] text-white p-2 rounded-full hover:scale-110 transition-transform shadow-lg"
            title="Asistente de Recomendaciones"
          >
            <Sparkles size={20} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg_primario rounded-full animate-pulse"></span>
          </button> */}

          {usuario ? (
            <div className="flex items-center gap-3">
              <div className="border-2 border-slate-700 w-9 h-9 rounded-full grid place-items-center text-lg font-bold bg-cyan-600 text-white">
                {usuario.nombre?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col text-sm">
                <span className="font-semibold">{usuario.nombre}</span>
                <span className="text-xs texto_letrasA">{usuario.rol}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-primario text-white px-3 py-1 rounded text-sm hover:bg-red-800 ml-2 cursor-pointer transition-colors"
              >
                Salir
              </button>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <NavLink
                to="/login"
                className="border-2 border-slate-700 w-9 h-9 rounded-full grid place-items-center text-lg font-bold"
              >
                <HiOutlineUser size={20} />
              </NavLink>
            </div>
          )}
        </div>

        <button className="md:hidden">
          <FaBarsStaggered size={25} />
        </button>
      </header>

      {/* Modal del Asistente */}
      {showAssistant && (
        <div className="fixed inset-0 bg_primario bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className=" bg_fondo rounded-2xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#9e4e2f] to-[#c86342] text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles size={24} />
                <div>
                  <h3 className="font-bold text-lg">
                    Asistente de Recomendaciones
                  </h3>
                  <p className="text-xs opacity-90">Sistema Inteligente</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!showQuickQuestions && (
                  <button
                    onClick={resetChat}
                    className="hover:bg-white hover:bg-opacity-20 px-3 py-1 rounded-full transition-colors text-sm"
                  >
                    Nueva consulta
                  </button>
                )}
                <button
                  onClick={() => setShowAssistant(false)}
                  className="hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-[#9e4e2f] text-white rounded-br-none"
                        : "bg-white text-gray-800 shadow-md rounded-bl-none"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2 mb-2 text-[#9e4e2f]">
                        <MessageCircle size={16} />
                        <span className="text-xs font-semibold">Asistente</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}

              {/* Preguntas Rápidas */}
              {showQuickQuestions && !isLoading && (
                <div className="flex flex-col gap-3 mt-4">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Zap size={16} className="text-[#9e4e2f]" />
                    <span className="font-semibold">
                      Selecciona una opción:
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_QUESTIONS.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => handleQuickQuestion(q.text)}
                        disabled={isLoading}
                        className="bg-white hover:bg-[#9e4e2f] hover:text-white text-gray-800 p-3 rounded-xl text-sm text-left transition-all shadow-sm hover:shadow-md border border-gray-200 hover:border-[#9e4e2f] flex items-start gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="text-lg flex-shrink-0">{q.emoji}</span>
                        <span className="text-xs leading-tight">{q.text}</span>
                      </button>
                    ))}
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-xs text-gray-500">
                      Selecciona cualquier opción para obtener recomendaciones
                      personalizadas
                    </p>
                  </div>
                </div>
              )}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl shadow-md">
                    <div className="flex gap-2 items-center">
                      <div className="w-2 h-2 bg-[#9e4e2f] rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-[#9e4e2f] rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-[#9e4e2f] rounded-full animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                      <span className="text-xs text-gray-500 ml-2">
                        Buscando las mejores opciones...
                      </span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer Info */}
            <div className="p-3 border-t bg-gray-50 text-center">
              <p className="text-xs text-gray-600">
                {showQuickQuestions
                  ? "Selecciona una opción para comenzar"
                  : "¿Necesitas otra recomendación? Presiona 'Nueva consulta'"}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

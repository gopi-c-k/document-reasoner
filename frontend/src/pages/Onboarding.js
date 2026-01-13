import { useState } from 'react';
import { FileText, Shield, Zap, ArrowRight, Sparkles, Lock, MessageSquare } from 'lucide-react';

function Onboarding() {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: FileText,
      title: "Upload Your Documents",
      description: "Securely upload PDFs, Word docs, and more. Your documents are encrypted and stored safely.",
      gradient: "from-violet-600 via-purple-600 to-indigo-600",
      features: ["PDF & Word Support", "Drag & Drop Upload", "Secure Encryption"]
    },
    {
      icon: Shield,
      title: "Privacy-First AI",
      description: "Advanced RAG technology analyzes your documents while keeping your data completely private.",
      gradient: "from-blue-600 via-indigo-600 to-purple-600",
      features: ["No Data Sharing", "Local Processing", "End-to-End Encrypted"]
    },
    {
      icon: Zap,
      title: "Instant Answers",
      description: "Ask questions and get accurate answers extracted from your documents in seconds.",
      gradient: "from-cyan-600 via-blue-600 to-indigo-600",
      features: ["Lightning Fast", "AI-Powered Search", "Context-Aware Responses"]
    }
  ];

  const currentStep = steps[step];
  const StepIcon = currentStep.icon;

  const handleGetStarted = () => {
    window.location.href = '/signup';
  };

  const handleSignIn = () => {
    window.location.href = '/signin';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header with Quick Action Buttons */}
      <div className="relative z-10 pt-6 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">DocuScope AI</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleSignIn}
              className="px-5 py-2 text-white/90 hover:text-white font-medium transition-all hover:bg-white/10 rounded-lg"
            >
              Sign In
            </button>
            <button
              onClick={handleGetStarted}
              className="px-6 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-100px)] p-4">
        <div className="max-w-5xl w-full">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Content */}
            <div className="text-white space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Sparkles className="w-4 h-4 text-purple-300" />
                <span className="text-sm font-medium">AI-Powered Document Intelligence</span>
              </div>

              <h2 className="text-5xl font-bold leading-tight">
                {currentStep.title}
              </h2>

              <p className="text-xl text-white/80 leading-relaxed">
                {currentStep.description}
              </p>

              {/* Features List */}
              <div className="space-y-3 pt-4">
                {currentStep.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                    </div>
                    <span className="text-white/90">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Progress Dots */}
              <div className="flex gap-2 pt-6">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setStep(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === step ? 'w-12 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-4">
                {step < steps.length - 1 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="px-8 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-lg hover:shadow-white/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    Next <ArrowRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    onClick={handleGetStarted}
                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    Start Now <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Side - Visual Card */}
            <div className="relative">
              <div className={`relative bg-gradient-to-br ${currentStep.gradient} rounded-3xl p-8 shadow-2xl transform transition-all duration-500 hover:scale-105`}>
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl"></div>
                
                <div className="relative z-10 space-y-6">
                  {/* Icon */}
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <StepIcon className="w-10 h-10 text-white" />
                  </div>

                  {/* Mock Interface */}
                  <div className="space-y-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-white/30 rounded-lg"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-2 bg-white/40 rounded w-3/4"></div>
                          <div className="h-2 bg-white/30 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                      <div className="flex items-center gap-3">
                        <MessageSquare className="w-5 h-5 text-white/80" />
                        <div className="flex-1 space-y-2">
                          <div className="h-2 bg-white/40 rounded w-2/3"></div>
                          <div className="h-2 bg-white/30 rounded w-1/3"></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-white/80" />
                        <div className="flex-1 space-y-2">
                          <div className="h-2 bg-white/40 rounded w-full"></div>
                          <div className="h-2 bg-white/30 rounded w-4/5"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="flex gap-2">
                    <div className="flex-1 h-1 bg-white/30 rounded"></div>
                    <div className="flex-1 h-1 bg-white/20 rounded"></div>
                    <div className="flex-1 h-1 bg-white/10 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default Onboarding;
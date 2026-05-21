import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import { GradientButton } from '@/components/shared/GradientButton';
import { MagneticButton } from '@/components/shared/MagneticButton';
import { fadeInUp } from '@/lib/animations';

export const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
      {/* Background Animated Gradients */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/5 rounded-full blur-[150px]"
        />
      </div>

      {/* Floating Elements */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.1, 0.3, 0.1],
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
          className="absolute hidden md:block"
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 20}%`,
            width: `${20 + i * 10}px`,
            height: `${20 + i * 10}px`,
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: i % 2 === 0 ? '50%' : '20%',
          }}
        />
      ))}

      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="relative z-10 max-w-4xl"
      >
        <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
          Motos Premium & <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Estética de Alto Padrão
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Showroom de motos seminovas selecionadas, estética automotiva de alto padrão e personalização exclusiva em Joinville/SC
        </p>

        <div className="flex justify-center">
          <MagneticButton>
            <GradientButton 
              className="flex items-center gap-2 px-8 py-4 text-lg"
              onClick={() => window.open('https://wa.me/5547999999999', '_blank')}
            >
              <MessageSquare size={20} />
              Falar no WhatsApp
            </GradientButton>
          </MagneticButton>
        </div>
      </motion.div>
    </section>
  );
};

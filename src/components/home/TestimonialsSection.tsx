import React from 'react';
import { Quote } from 'lucide-react';
import { GlassCard } from '@/components/shared/GlassCard';
import { ScrollReveal } from '@/components/shared/ScrollReveal';

const testimonials = [
  {
    name: 'Lucas Mendes',
    role: 'Empresário',
    text: 'Atendimento impecável, moto entregue melhor que nova! A transparência durante todo o processo me passou muita confiança.',
    initials: 'LM'
  },
  {
    name: 'Camila Santos',
    role: 'Arquiteta',
    text: 'A vitrificação ficou perfeita, proteção e brilho incomparáveis. Minha moto está muito mais fácil de limpar e sempre parece recém-saída da loja.',
    initials: 'CS'
  },
  {
    name: 'Rafael Oliveira',
    role: 'Engenheiro',
    text: 'Comprei minha CB 500F aqui, processo transparente e rápido. O showroom é de altíssimo nível, recomendo para qualquer motociclista exigente.',
    initials: 'RO'
  }
];

export const TestimonialsSection = () => {
  return (
    <section className="px-6 py-24 bg-gradient-to-b from-transparent to-blue-900/10 rounded-[3rem]">
      <ScrollReveal>
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">O que nossos clientes dizem</h2>
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-500 text-xl">★</span>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <ScrollReveal key={index} delay={index * 150}>
            <GlassCard className="p-8 relative" hover glow="cyan">
              <Quote className="absolute top-6 right-8 text-blue-500/20" size={48} />
              
              <p className="text-slate-300 mb-8 italic relative z-10 leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white">
                  {testimonial.initials}
                </div>
                <div>
                  <h4 className="font-bold text-white">{testimonial.name}</h4>
                  <p className="text-slate-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

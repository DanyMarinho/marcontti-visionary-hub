import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Controller } from 'react-hook-form';
import { Input, Textarea } from '@/components/ui';

/**
 * Fields for o briefing médico.
 * Cada campo corresponde ao item do briefing descrito pelo usuário.
 * O componente recebe o controle do react‑hook‑form para registrar os valores.
 */
export default function AccordionMedicalBrief({ control }: { control: any }) {
  return (
    <Accordion type="multiple" collapsible className="w-full space-y-2 animate-fade-in">
      {/* 1 – Informações Gerais do Médico */}
      <AccordionItem value="general" className="border border-border rounded-lg bg-card/50 backdrop-blur-sm accordion-item-enhanced">
        <AccordionTrigger>Informações Gerais do Médico</AccordionTrigger>
        <AccordionContent className="space-y-4 px-4">
          <Controller
            name="doctorName"
            control={control}
            render={({ field }) => <Input {...field} aria-label="Nome completo do médico" placeholder="Nome completo do médico" />}
          />
          <Controller
            name="crmRqe"
            control={control}
            render={({ field }) => <Input {...field} aria-label="CRM / RQE" placeholder="CRM / RQE (se houver)" />}
          />
          <Controller
            name="specialties"
            control={control}
            render={({ field }) => (
              <Textarea {...field} aria-label="Especialidades" placeholder="Especialidade(s) – separar por vírgula" rows={2} />
            )}
          />
          <Controller
            name="subSpecialties"
            control={control}
            render={({ field }) => (
              <Textarea {...field} aria-label="Subespecialidades" placeholder="Subespecialidades (se houver)" rows={2} />
            )}
          />
          <Controller
            name="experience"
            control={control}
            render={({ field }) => <Input {...field} aria-label="Tempo de experiência" placeholder="Tempo de experiência na área" />}
          />
        </AccordionContent>
      </AccordionItem>

      {/* 2 – Diferenciais do Atendimento */}
      <AccordionItem value="differentials" className="border border-border rounded-lg bg-card/50 backdrop-blur-sm accordion-item-enhanced">
        <AccordionTrigger>Diferenciais do Atendimento</AccordionTrigger>
        <AccordionContent className="px-4">
          <Controller
            name="differentials"
            control={control}
            render={({ field }) => (
              <Textarea {...field} aria-label="Diferenciais" placeholder="Principais diferenciais do atendimento" rows={3} />
            )}
          />
        </AccordionContent>
      </AccordionItem>

      {/* 3 – Localização */}
      <AccordionItem value="location" className="border border-border rounded-lg bg-card/50 backdrop-blur-sm accordion-item-enhanced">
        <AccordionTrigger>Localização da Clínica/Consultório</AccordionTrigger>
        <AccordionContent className="space-y-4 px-4">
          <Controller
            name="address"
            control={control}
            render={({ field }) => <Input {...field} aria-label="Endereço" placeholder="Endereço completo" />}
          />
          <Controller
            name="cityState"
            control={control}
            render={({ field }) => <Input {...field} aria-label="Cidade e Estado" placeholder="Cidade / Estado" />}
          />
          <Controller
            name="onlineAvailable"
            control={control}
            render={({ field }) => (
              <select {...field} aria-label="Atendimento online" className="input w-full border rounded-md p-2">
                <option value="">Atendimento online?</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
            )}
          />
        </AccordionContent>
      </AccordionItem>

      {/* 4 – Horário de Funcionamento */}
      <AccordionItem value="schedule" className="border border-border rounded-lg bg-card/50 backdrop-blur-sm accordion-item-enhanced">
        <AccordionTrigger>Horário de Funcionamento</AccordionTrigger>
        <AccordionContent className="space-y-2 px-4">
          <Controller
            name="workingHours"
            control={control}
            render={({ field }) => (
              <Textarea {...field} aria-label="Horário de trabalho" placeholder="Dias da semana e horários (ex: Seg‑Sex 09:00‑18:00)" rows={2} />
            )}
          />
          <Controller
            name="presentialHours"
            control={control}
            render={({ field }) => (
              <Textarea {...field} aria-label="Horários presenciais" placeholder="Horários para atendimentos presenciais" rows={2} />
            )}
          />
          <Controller
            name="onlineHours"
            control={control}
            render={({ field }) => (
              <Textarea {...field} aria-label="Horários online" placeholder="Horários para atendimentos online" rows={2} />
            )}
          />
        </AccordionContent>
      </AccordionItem>

      {/* 5 – Equipe de Suporte */}
      <AccordionItem value="supportTeam" className="border border-border rounded-lg bg-card/50 backdrop-blur-sm accordion-item-enhanced">
        <AccordionTrigger>Equipe de Suporte</AccordionTrigger>
        <AccordionContent className="space-y-4 px-4">
          <Controller
            name="supportAvailable"
            control={control}
            render={({ field }) => (
              <select {...field} className="input w-full">
                <option value="">Equipe de suporte disponível?</option>
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
              </select>
            )}
          />
          <Controller
            name="supportCount"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="Quantidade de profissionais no suporte" type="number" min="0" />
            )}
          />
          <Controller
            name="supportMembers"
            control={control}
            render={({ field }) => (
              <Textarea {...field} placeholder="Nome e função de cada membro (ex: Maria – secretária)" rows={3} />
            )}
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

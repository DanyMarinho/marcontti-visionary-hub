// @ts-nocheck
import React from 'react';
import { Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function AccordionMedicalBrief({ control }: { control: any }) {
  return (
    <div className="space-y-4">
      <Controller
        name="medicalBrief"
        control={control}
        render={({ field }) => (
          <Textarea {...field} placeholder="Briefing médico (texto livre)" rows={8} />
        )}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import SlugInput from '@/components/SlugInput';
import AccordionMedicalBrief from '@/components/AccordionMedicalBrief';

const schema = z.object({
  companyName: z.string().min(2, 'Nome da empresa é obrigatório'),
  cnpjCpf: z.string().min(5, 'CNPJ/CPF obrigatório'),
  address: z.string().min(5, 'Endereço obrigatório'),
  slug: z.string().min(2, 'Slug obrigatório'),
  // users
  adminName: z.string().min(2),
  adminPhone: z.string().min(8),
  storeName: z.string().min(2),
  storePhone: z.string().min(8),
  vendorName: z.string().min(2),
  vendorPhone: z.string().min(8),
  // whatsapp
  whatsappNumber: z.string().min(8),
  whatsappApiKey: z.string().optional(),
  // agent prompt
  agentPrompt: z.string().min(10),
  // medical brief – free text for now
  medicalBrief: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewTenantWizard() {
  const { control, handleSubmit, watch, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: '',
      cnpjCpf: '',
      address: '',
      slug: '',
      adminName: '',
      adminPhone: '',
      storeName: '',
      storePhone: '',
      vendorName: '',
      vendorPhone: '',
      whatsappNumber: '',
      whatsappApiKey: '',
      agentPrompt: '',
      medicalBrief: '',
    },
  });
  const navigate = useNavigate();
  const toast = useToast();
  const [step, setStep] = useState(1);

  const onSubmit = async (data: FormData) => {
    try {
      // call RPC create_full_tenant (assumes it exists)
      const { error, data: resp } = await supabase.rpc('create_full_tenant', {
        p_company_name: data.companyName,
        p_cnpj_cpf: data.cnpjCpf,
        p_address: data.address,
        p_slug: data.slug,
        p_admin_name: data.adminName,
        p_admin_phone: data.adminPhone,
        p_store_name: data.storeName,
        p_store_phone: data.storePhone,
        p_vendor_name: data.vendorName,
        p_vendor_phone: data.vendorPhone,
        p_whatsapp_number: data.whatsappNumber,
        p_whatsapp_api_key: data.whatsappApiKey ?? 'TODO_PROVIDE_KEY',
        p_agent_prompt: data.agentPrompt,
        p_medical_brief: data.medicalBrief,
      });
      if (error) throw error;
      // Automatic sign‑in admin (email generated on server)
      const adminEmail = `admin@${data.slug}.com`;
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: resp.temp_password, // server returns temp password
      });
      if (signInErr) throw signInErr;
      toast.success('Tenant criado com sucesso!');
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
      toast.error('Falha ao criar tenant');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Dados da empresa</h2>
            <Controller
              name="companyName"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Nome da empresa" />}
            />
            <Controller
              name="cnpjCpf"
              control={control}
              render={({ field }) => <Input {...field} placeholder="CNPJ ou CPF" className="mt-2" />}
            />
            <Controller
              name="address"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Endereço completo" className="mt-2" />}
            />
            <SlugInput control={control} watch={watch} setValue={setValue} />
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Usuários</h2>
            <Controller
              name="adminName"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Nome do admin" />}
            />
            <Controller
              name="adminPhone"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Telefone admin" className="mt-2" />}
            />
            <Controller
              name="storeName"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Nome da loja" className="mt-2" />}
            />
            <Controller
              name="storePhone"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Telefone da loja" className="mt-2" />}
            />
            <Controller
              name="vendorName"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Nome do vendedor" className="mt-2" />}
            />
            <Controller
              name="vendorPhone"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Telefone do vendedor" className="mt-2" />}
            />
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">WhatsApp</h2>
            <Controller
              name="whatsappNumber"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Número da conta WhatsApp" />}
            />
            <Controller
              name="whatsappApiKey"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Chave API (opcional)" className="mt-2" />
              )}
            />
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Diretrizes do Agente IA</h2>
            <Controller
              name="agentPrompt"
              control={control}
              render={({ field }) => (
                <Textarea {...field} placeholder="Cole aqui o template de instruções do agente" rows={12} />
              )}
            />
          </>
        );
      case 5:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Briefing IA Médico</h2>
            <AccordionMedicalBrief control={control} />
          </>
        );
      case 6:
        const values = watch();
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Revisão</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">{JSON.stringify(values, null, 2)}</pre>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <ToastProvider>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          {renderStep()}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                Voltar
              </Button>
            )}
            {step < 6 && (
              <Button type="button" onClick={() => setStep(step + 1)}>
                Próximo
              </Button>
            )}
            {step === 6 && (
              <Button type="submit" className="ml-auto">
                Confirmar
              </Button>
            )}
          </div>
        </form>
      </div>
    </ToastProvider>
  );
}

import { useState, useEffect } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import axiosApi from '@/constants/axiosApi.ts';
import { useAppContext } from '@/contexts/AppContext.tsx';

const formSchema = z.object({
  idInstance: z.string().min(2, { message: 'ID must be at least 2 characters.' }).max(50, { message: 'Max range 50' }),
  apiTokenInstance: z.string().min(6, { message: 'API Token must be at least 6 characters.' }).max(50, { message: 'Max range 50' }),
});

export type FormValues = z.infer<typeof formSchema>;

interface UseLoginReturn {
  form: UseFormReturn<FormValues>;
  idInstance: string | null;
  apiTokenInstance: string | null;
  loading: boolean;
  onSubmit: (data: FormValues) => Promise<void>;
  errorMessage: string | null;
}

export const useLogin = (): UseLoginReturn => {
  const { idInstance, apiTokenInstance, setInstance } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idInstance: '',
      apiTokenInstance: '',
    },
  });

  const onSubmit = async ({ idInstance, apiTokenInstance }: FormValues) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await axiosApi.get(`/waInstance${idInstance}/getWaSettings/${apiTokenInstance}`);
      if (response.data.stateInstance === 'authorized') {
        setInstance(idInstance, apiTokenInstance);
        navigate('/');
      } else {
        setErrorMessage('Unauthorized');
      }
    } catch (error: any) {
      if (error.status === 401 || error.status === 403) {
        setErrorMessage('Forbidden');
      } else {
        setErrorMessage('Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const subscription = form.watch(() => {
      if (errorMessage) {
        setErrorMessage(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, errorMessage]);

  return {
    idInstance,
    apiTokenInstance,
    form,
    loading,
    errorMessage,
    onSubmit,
  } as const;
};

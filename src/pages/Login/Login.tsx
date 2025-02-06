import { FormProvider, useForm } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppContext } from '@/contexts/AppContext.tsx';
import { Navigate, useNavigate } from 'react-router-dom';
import axiosApi from '@/constants/axiosApi.ts';
import { useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Loader } from 'lucide-react';

const formSchema = z.object({
  idInstance: z.string().min(2, {
    message: 'ID must be at least 2 characters.',
  }).max(50, {message: 'Max range 50'}),
  apiTokenInstance: z.string().min(6, {
    message: 'API Token must be at least 6 characters.',
  }).max(50, {message: 'Max range 50'}),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const {idInstance, apiTokenInstance, setInstance} = useAppContext();
  if (idInstance && apiTokenInstance) {
    return <Navigate to="/"/>
  }

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idInstance: '',
      apiTokenInstance: '',
    },
  });

  const onSubmit = ({idInstance, apiTokenInstance}: FormValues) => {
    setLoading(true);
    setErrorMessage(null);
    axiosApi.get(`/waInstance${idInstance}/getWaSettings/${apiTokenInstance}`).then(
      (response) => {
        if (response.data.stateInstance === 'authorized') {
          setInstance(idInstance, apiTokenInstance);
          navigate('/');
        }
      }
    ).catch((error) => {
      if (error.status === 401 || error.status === 403) {
        setErrorMessage('Forbidden');
      }
      setLoading(false);
    }).finally(() => {
      setLoading(false);
    })

  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 shadow-md rounded-md">
          <FormField
            control={form.control}
            name="idInstance"
            render={({field}) => (
              <FormItem>
                <FormLabel>ID Instance</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your ID" {...field} />
                </FormControl>
                <FormDescription>Enter your ID.</FormDescription>
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apiTokenInstance"
            render={({field}) => (
              <FormItem>
                <FormLabel>API Token Instance</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter API Token" {...field} />
                </FormControl>
                <FormDescription>Enter your token.</FormDescription>
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormDescription className="text-[0.8rem] font-medium text-destructive">{errorMessage}</FormDescription>

          <Button type="submit" className="bg-blue-500 text-white rounded-md w-full flex items-center justify-center">
            Login <div className="w-5 mr-[-15px]">{loading && <Loader className="animate-spin w-5 h-5"/>}</div>
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}

export default Login;

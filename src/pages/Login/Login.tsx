import { useForm, FormProvider } from 'react-hook-form';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInstance } from '@/components/context/InstanceContext.tsx';
import { Navigate, useNavigate } from 'react-router-dom';

const formSchema = z.object({
  idInstance: z.string().min(2, {
    message: "ID must be at least 2 characters.",
  }).max(50, {message: "Max range 50"}),
  apiTokenInstance: z.string().min(6, {
    message: "API Token must be at least 6 characters.",
  }).max(50, {message: "Max range 50"}),
});

type FormValues = z.infer<typeof formSchema>;

const Login = () => {
  const {idInstance, apiTokenInstance,setInstance} = useInstance();
  const navigate = useNavigate();

  if (idInstance && apiTokenInstance) {
    return <Navigate to="/"/>
  }

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      idInstance: '',
      apiTokenInstance: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    setInstance(data.idInstance, data.apiTokenInstance);
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 shadow-md rounded-md">
          <FormField
            control={form.control}
            name="idInstance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Instance</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your ID" {...field} />
                </FormControl>
                <FormDescription>This is your unique instance ID.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="apiTokenInstance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Token Instance</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter API Token" {...field} />
                </FormControl>
                <FormDescription>Your API authentication token.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md w-full">
            Login
          </button>
        </form>
      </FormProvider>
    </div>
  );
}

export default Login;

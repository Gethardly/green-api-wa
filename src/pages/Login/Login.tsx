import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { Loader } from 'lucide-react';
import { FormValues, useLogin } from '@/hooks/useLogin.ts';
import { Control, FieldValues } from 'react-hook-form';

const Login = () => {
  const {form, idInstance,
    apiTokenInstance, loading, onSubmit, errorMessage} = useLogin();

  if (idInstance && apiTokenInstance) {
    return <Navigate to="/"/>
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 shadow-md rounded-md">
          <FormField
            control={form.control as unknown as Control<FieldValues>}
            name="idInstance"
            render={({field}) => (
              <FormItem>
                <FormLabel>ID Instance</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your ID" value={field.value}
                         onChange={field.onChange}
                         onBlur={field.onBlur}
                         name={field.name} />
                </FormControl>
                <FormDescription>Enter your ID.</FormDescription>
                <FormMessage/>
              </FormItem>
            )}
          />

          <FormField<FormValues>
            control={form.control}
            name="apiTokenInstance"
            render={({field}) => (
              <FormItem>
                <FormLabel>API Token Instance</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter API Token" value={field.value}
                         onChange={field.onChange}
                         onBlur={field.onBlur}
                         name={field.name} />
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
      </Form>
    </div>
  );
}

export default Login;

import { Button } from '../components/ui/button';
import { Input } from "@/components/ui/input";
import OllamaSvg from '@/assets/ollama.svg';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useAuth from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const Signin = () => {
  const { login, isAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      navigate("/chat/c");
    }
  }, []);

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // TODO: Handle form submission @zakaria or @ahmed
    await login({ email: values.email, password: values.password });
  };



  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div className="flex items-center justify-center">
              <a
                href="/"
                className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
              >
                <img
                  className="w-8 h-8 mr-2"
                  src={OllamaSvg}
                  alt="ollama"
                />
                ChatOllama <span className="font-circle">●</span>
              </a>
            </div>
            <Form  {...form}>

              <form className="space-y-4 md:space-y-6" onSubmit={form.handleSubmit(onSubmit)}>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="********" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                >
                  Sign in
                </Button>
                <p className="text-sm font-light text-gray-900">
                  Don't have an account yet?{" "}
                  <a
                    href="/signup"
                    className="font-medium text-primary-600 hover:underline"
                  >
                    Sign up
                  </a>
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>

  );
};

export default Signin;

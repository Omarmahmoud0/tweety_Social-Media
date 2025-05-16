import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import Loader from "@/components/shared/Loader";
import { z } from "zod";
import { SignInValidation } from "@/lib/validation";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";

const SignInForm = () => {
  const { toast } = useToast();
  const { isLoading: isUserLoading, token } = useUserContext();

  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync: signInAccount, isPending } = useSignInAccount();

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignInValidation>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({ title: "Sign in failed. Please try again." });
    }

    if (token) {
      form.reset();
    } else {
      return toast({ title: "Welcome back!" });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <p className="text-4xl text-center w-full text-white m-0 p-0">Tweety</p>
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Sign in to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back! please enter details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
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
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isUserLoading || isPending ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?
            <Link
              to="/sign-up"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Sign up
            </Link>
          </p>
          <p className="text-small-regular text-light-2 text-center">
            <Link
              to="/password-recovery"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Forgot password?
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignInForm;

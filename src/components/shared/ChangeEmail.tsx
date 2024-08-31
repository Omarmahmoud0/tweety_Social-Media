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
import { useUpdateEmail } from "@/lib/react-query/queriesAndMutations";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const ChangeEmail = () => {
  const navigate = useNavigate()
  const { mutateAsync: UpdateEmail, isPending: isLoading } = useUpdateEmail();

  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignInValidation>) {
    const session = await UpdateEmail({
      email: values.email,
      password: values.password,
    });

    if (!session) {
      return toast({ title: "Please try again." });
    } else {
      return navigate('/sign-in')
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-4/5 flex-center flex-col">
        <h1 className="h3-bold md:h2-bold pb-3">
          Change your email
        </h1>

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
                  <Input type="email" className="shad-input" {...field} placeholder="example@gmail.com"/>
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
                  <Input type="password" className="shad-input" {...field} placeholder="Password"/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex flex-col gap-2">
          <span className="text-orange-700 small-medium md:base-regular mt-2">
            Important note: If you change your email, you will be logged out of
            the site
          </span>
          <Button type="submit" className="shad-button_primary w-full">
            {isLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Submit"
            )}
          </Button>
          </div>
        </form>
      </div>
    </Form>
  );
};

export default ChangeEmail;

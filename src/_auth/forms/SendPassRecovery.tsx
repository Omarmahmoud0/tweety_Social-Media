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
// import Loader from "@/components/shared/Loader";
import { z } from "zod";
import { PassRecovery } from "@/lib/validation";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { recoveryPassword } from "@/firebase/api";

const SendPassRecovery = () => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof PassRecovery>>({
    resolver: zodResolver(PassRecovery),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PassRecovery>) {
    const passRecover = await recoveryPassword(values.email);
    if (!passRecover) {
      return toast({ title: "Please try again." });
    }

    if (passRecover) {
      form.reset();
      return toast({
        title: "A message will be sent to your email, please check it",
      });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Password Recovery</h2>
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
                  <Input
                    type="email"
                    className="shad-input"
                    placeholder="Enter your email here"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary">
            Submit
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2">
            Back to sign in?
            <Link
              to="/sign-in"
              className="text-primary-500 text-small-semibold ml-1"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SendPassRecovery;

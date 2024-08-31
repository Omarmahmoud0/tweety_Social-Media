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
import { ResetPass } from "@/lib/validation";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { ResetPasswordApi } from "@/appwrite/api";

const ResetPassword = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams()
  const userId = searchParams.get("userId")
  const Secret = searchParams.get("secret")
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof ResetPass>>({
    resolver: zodResolver(ResetPass),
    defaultValues: {
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ResetPass>) {
    const resetPassword = await ResetPasswordApi({userId:userId!,token:Secret!,password:values.password})

    if (!resetPassword) {
        return toast({ title: "Please try again."});
    }
    
    if (resetPassword) {
        form.reset();
        return navigate('/sign-in')
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Reset Password</h2>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" placeholder="Please enter new password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary">
            Reset
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

export default ResetPassword;

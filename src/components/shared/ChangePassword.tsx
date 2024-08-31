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
import { ChangePasswordValidation } from "@/lib/validation";
import { useUpdatePassword } from "@/lib/react-query/queriesAndMutations";
import { toast } from "@/components/ui/use-toast";

const ChangePassword = () => {
  const { mutateAsync: UpdatePassword, isPending: isLoading } = useUpdatePassword();

  const form = useForm<z.infer<typeof ChangePasswordValidation>>({
    resolver: zodResolver(ChangePasswordValidation),
    defaultValues: {
      newPassword: "",
      oldPassword: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ChangePasswordValidation>) {
    const session = await UpdatePassword({
      newPassword: values.newPassword,
      oldPassword: values.oldPassword,
    });

    if (session) {
      form.reset()
      return toast({ title: "Updating has seccssfuly" });
    } else {
      return toast({ title: "Please try again." });
    }
  }

  return (
    <Form {...form}>
      <div className="sm:w-4/5 flex-center flex-col">
        <h1 className="h3-bold md:h2-bold pb-3">Change your password</h1>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="shad-input"
                    {...field}
                    placeholder="new password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="oldPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    className="shad-input"
                    {...field}
                    placeholder="old password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
            <Button type="submit" className="shad-button_primary w-full">
              {isLoading ? (
                <div className="flex-center gap-2">
                  <Loader /> Loading...
                </div>
              ) : (
                "Submit"
              )}
            </Button>
        </form>
      </div>
    </Form>
  );
};

export default ChangePassword;

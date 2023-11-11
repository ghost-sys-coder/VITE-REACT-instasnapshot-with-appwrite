import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";

import { signUpValidation } from "@/lib";
import Loader from "@/components/shared/Loader";
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations";
import { AuthContext } from "@/context/AuthContext";


const SignupForm = () => {
    const navigate = useNavigate();

    const { checkAuthUser } = useContext(AuthContext);

    const { toast } = useToast();

    const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccount();

    const { mutateAsync: signInAccount } = useSignInAccount();
    
    // 1. Define your form.
  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),
      defaultValues: {
          name: "",
          username: "",
          email: "",
          password: ""
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signUpValidation>) {
    /** create new user with appwrite */
      const newUser = await createUserAccount(values);
      
      if (!newUser) {
          return toast({
              title: "Signup failed. Please try again!"
          })
      }

      const session = await signInAccount({
          email: values.email,
          password: values.password
      })

      if (!session) {
          return toast({title: "Signin Failed, please try again!!"})
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
          form.reset();
          navigate('/')
      } else {
          return toast({title: "Sign up failed. Please try again!"})
      }
  }
    return (
        <Form {...form}>
            <div className="sm:w-420 flex-center flex-col">
                <img src="/assets/images/logo.svg" alt="logo" />
                <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
                <p className="text-light-3 small-medium md:base-regular mt-2">To use instasnapshot, please enter account details</p>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username:</FormLabel>
                    <FormControl>
                        <Input type="text" className="shad-input" placeholder="Enter username...." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                    />
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name:</FormLabel>
                                <FormControl>
                                    <Input type="text" className="shad-input" placeholder="Your fullname..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email:</FormLabel>
                                <FormControl>
                                    <Input type="email" className="shad-input" placeholder="Your email..." {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password:</FormLabel>
                                <FormControl>
                                    <Input type="password" className="shad-input" placeholder="Your password" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="shad-button_primary">
                        {isCreatingUser ? (
                            <div className="flex-center gap-2">
                                <Loader />
                                Loading...
                            </div>
                        ) : (
                                "Sign up"
                        )}
                    </Button>
                    <p className="text-small-regular text-light-2 text-center mt-2">
                        Already have an account?
                        <Link className="text-primary-500 text-small-semibold ml-1" to={'/login'}>Log in</Link>
                    </p>
            </form>
        </div>
        </Form>
    )
}

export default SignupForm;